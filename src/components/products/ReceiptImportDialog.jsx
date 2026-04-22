import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, Stepper, Step, StepLabel,
    LinearProgress, List, ListItem, ListItemText, IconButton, Stack,
    TextField, Divider, Chip, Alert, CircularProgress, MenuItem,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CameraswitchIcon from '@mui/icons-material/Cameraswitch'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ViewStreamIcon from '@mui/icons-material/ViewStream'
import { ocrImage, parseReceiptText, prewarmOcr } from '../../lib/receiptParser'
import {
    listCameras, pickBackCamera, requestCameraPermission,
} from '../../lib/barcode'
import { upsertStore } from '../../lib/stores'
import ReceiptScanDialog from './ReceiptScanDialog'

const STEPS = ['Photos', 'Process', 'Review']

/**
 * In-browser receipt capture.
 *
 * We use getUserMedia to show a live preview inside the dialog and snap
 * frames to a canvas. This avoids launching the system camera app (which on
 * Android causes the tab to be memory-evicted and then reload, losing all
 * in-progress state).
 *
 * Flow:
 *  1. Start back camera → user sees live preview → tap shutter for each shot.
 *  2. Stop the camera, then OCR all photos sequentially.
 *  3. Review parsed store / date / items, save to pantry.
 */
export default function ReceiptImportDialog({ open, onClose, onAddItems }) {
    const [step, setStep] = useState(0)

    // Camera
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const [cameraOn, setCameraOn] = useState(false)
    const [cameraError, setCameraError] = useState('')
    const [cameras, setCameras] = useState([])
    const [deviceId, setDeviceId] = useState('')

    // Captured photos (as blobs) + thumbnails
    const [blobs, setBlobs] = useState([])
    const [previews, setPreviews] = useState([])

    // Panorama-style guided scan dialog
    const [scanOpen, setScanOpen] = useState(false)

    // Processing
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [error, setError] = useState('')

    // Parsed result
    const [storeData, setStoreData] = useState({ name: '', address: '', city: '' })
    const [dateTime, setDateTime] = useState({ date: '', time: '' })
    const [totalAmount, setTotalAmount] = useState(null)
    const [items, setItems] = useState([])
    // Debug: raw OCR output (populated on each process run)
    const [rawText, setRawText] = useState('')
    const [showRaw, setShowRaw] = useState(false)

    // Prewarm Tesseract while the user is still taking photos
    useEffect(() => {
        if (open) prewarmOcr()
    }, [open])

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop())
            streamRef.current = null
        }
        if (videoRef.current) videoRef.current.srcObject = null
        setCameraOn(false)
    }, [])

    const startCamera = useCallback(async (id) => {
        setCameraError('')
        // Stop any existing stream first (needed when switching camera)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop())
            streamRef.current = null
        }
        try {
            const constraints = {
                video: id
                    ? { deviceId: { exact: id }, width: { ideal: 1920 }, height: { ideal: 1920 } }
                    : { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1920 } },
                audio: false,
            }
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.setAttribute('autoplay', '')
                videoRef.current.setAttribute('muted', '')
                videoRef.current.setAttribute('playsinline', '')
                try { await videoRef.current.play() } catch { /* ignore */ }
            }
            setCameraOn(true)

            // Populate camera list (labels become readable after permission)
            const cams = await listCameras()
            setCameras(cams)
            if (!deviceId) {
                const initial = id
                    ?? pickBackCamera(cams)?.deviceId
                    ?? cams[0]?.deviceId
                    ?? ''
                if (initial) setDeviceId(initial)
            }
        } catch (e) {
            setCameraError(e?.message || 'Camera unavailable')
            setCameraOn(false)
        }
    }, [deviceId])

    const handleCameraChange = async (newId) => {
        setDeviceId(newId)
        await startCamera(newId)
    }

    // Initial camera enumeration on dialog open (prompts permission so
    // device labels are populated before the user picks).
    useEffect(() => {
        if (!open) return
        let cancelled = false
            ; (async () => {
                await requestCameraPermission()
                if (cancelled) return
                const cams = await listCameras()
                if (cancelled) return
                setCameras(cams)
                const initial = pickBackCamera(cams)?.deviceId ?? cams[0]?.deviceId ?? ''
                if (initial) setDeviceId(initial)
            })()
        return () => { cancelled = true }
    }, [open])

    const snap = useCallback(async () => {
        const video = videoRef.current
        if (!video || !video.videoWidth) return
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)
        const blob = await new Promise((resolve) =>
            canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9)
        )
        canvas.width = 0; canvas.height = 0
        if (!blob) return
        setBlobs((prev) => [...prev, blob])
        setPreviews((prev) => [...prev, URL.createObjectURL(blob)])
    }, [])

    // Open the panorama-style scanner. We stop the main preview first so
    // the camera device is free for the scan dialog's own stream.
    const openScanner = useCallback(() => {
        stopCamera()
        setScanOpen(true)
    }, [stopCamera])

    const handleScanComplete = useCallback((blob) => {
        setScanOpen(false)
        if (!blob) return
        setBlobs((prev) => [...prev, blob])
        setPreviews((prev) => [...prev, URL.createObjectURL(blob)])
    }, [])

    const handleScanClose = useCallback(() => {
        setScanOpen(false)
    }, [])

    const removePhoto = (idx) => {
        setBlobs((prev) => prev.filter((_, i) => i !== idx))
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[idx])
            return prev.filter((_, i) => i !== idx)
        })
    }

    const reset = () => {
        setStep(0)
        setBlobs([])
        previews.forEach((u) => URL.revokeObjectURL(u))
        setPreviews([])
        setProcessing(false); setProgress(0); setCurrentIdx(0)
        setError(''); setCameraError('')
        setStoreData({ name: '', address: '', city: '' })
        setDateTime({ date: '', time: '' })
        setTotalAmount(null)
        setItems([])
        setRawText(''); setShowRaw(false)
    }

    const close = () => { stopCamera(); reset(); onClose() }

    // Cleanup on dialog close
    useEffect(() => {
        if (!open) stopCamera()
    }, [open, stopCamera])

    useEffect(() => () => {
        previews.forEach((u) => URL.revokeObjectURL(u))
    }, [previews])

    const handleProcess = async () => {
        if (!blobs.length) return
        stopCamera()
        setStep(1)
        setProcessing(true); setProgress(0); setError('')
        try {
            const parts = []
            for (let i = 0; i < blobs.length; i++) {
                setCurrentIdx(i)
                const text = await ocrImage(blobs[i], (p) => {
                    const overall = ((i + p) / blobs.length) * 100
                    setProgress(Math.round(overall))
                })
                parts.push(text)
            }
            setProgress(100)

            const joined = parts.join('\n')
            setRawText(joined)
            const parsed = parseReceiptText(joined)
            setStoreData({
                name: parsed.store_name ?? '',
                address: parsed.store_address ?? '',
                city: parsed.store_city ?? '',
            })
            setDateTime({
                date: parsed.purchase_date ?? '',
                time: parsed.purchase_time ?? '',
            })
            setTotalAmount(parsed.total_amount ?? null)
            setItems(parsed.items.map((it, idx) => ({ ...it, _id: idx })))
            setStep(2)
        } catch (e) {
            setError(e?.message || 'OCR failed')
            setStep(0)
        } finally {
            setProcessing(false)
        }
    }

    const removeItem = (_id) => setItems((prev) => prev.filter((it) => it._id !== _id))

    const handleSave = async () => {
        setError('')
        try {
            let storeId = null
            if (storeData.name.trim()) {
                const store = await upsertStore({
                    name: storeData.name.trim(),
                    address: storeData.address || null,
                    city: storeData.city || null,
                })
                storeId = store?.id ?? null
            }
            const purchasedAt = dateTime.date
                ? new Date(`${dateTime.date}T${dateTime.time || '00:00'}`).toISOString()
                : new Date().toISOString()

            await onAddItems(items.map((it) => ({
                name: it.name,
                quantity: it.quantity || 1,
                unit: it.unit || 'pc',
                price: it.total_price ?? null,
                unit_price: it.unit_price ?? null,
                store_id: storeId,
                purchased_at: purchasedAt,
                entry_source: 'receipt',
            })))
            close()
        } catch (e) {
            setError(e?.message || 'Failed to save')
        }
    }

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>Import receipt</DialogTitle>
            <DialogContent>
                <Stepper activeStep={step} alternativeLabel sx={{ mb: 2 }}>
                    {STEPS.map((label) => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {cameraError && <Alert severity="warning" sx={{ mb: 2 }}>{cameraError}</Alert>}

                {step === 0 && (
                    <Stack gap={2}>
                        <Typography variant="body2">
                            Take one or more photos — stays in this page,
                            no app switching.
                        </Typography>

                        {/* Live camera preview */}
                        <Box sx={{
                            position: 'relative', width: '100%', aspectRatio: '3 / 4',
                            bgcolor: 'black', borderRadius: 2, overflow: 'hidden',
                        }}>
                            <video
                                ref={videoRef}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                autoPlay muted playsInline
                            />
                            {!cameraOn && (
                                <Box sx={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexDirection: 'column', gap: 1, color: 'white',
                                }}>
                                    <Button
                                        variant="contained" size="large"
                                        startIcon={<CameraAltIcon />}
                                        onClick={() => startCamera(deviceId)}
                                    >
                                        Start camera
                                    </Button>
                                    <Button
                                        variant="outlined" size="small"
                                        startIcon={<ViewStreamIcon />}
                                        onClick={openScanner}
                                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.7)' }}
                                    >
                                        Scan along receipt
                                    </Button>
                                </Box>
                            )}
                            {cameraOn && (
                                <>
                                    <IconButton
                                        onClick={snap}
                                        sx={{
                                            position: 'absolute', bottom: 12, left: '50%',
                                            transform: 'translateX(-50%)',
                                            bgcolor: 'white', color: 'black',
                                            width: 64, height: 64,
                                            '&:hover': { bgcolor: 'white' },
                                            boxShadow: 3,
                                        }}
                                    >
                                        <PhotoCameraIcon fontSize="large" />
                                    </IconButton>
                                    <IconButton
                                        onClick={openScanner}
                                        title="Panorama-style scan"
                                        sx={{
                                            position: 'absolute', bottom: 20, right: 16,
                                            bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                                        }}
                                    >
                                        <ViewStreamIcon />
                                    </IconButton>
                                </>
                            )}
                        </Box>

                        {/* Camera picker */}
                        {cameras.length > 1 && (
                            <TextField
                                select size="small" fullWidth
                                label="Camera"
                                value={deviceId}
                                onChange={(e) => handleCameraChange(e.target.value)}
                                InputProps={{
                                    startAdornment: <CameraswitchIcon fontSize="small" sx={{ mr: 1 }} />,
                                }}
                            >
                                {cameras.map((c) => (
                                    <MenuItem key={c.deviceId} value={c.deviceId}>
                                        {c.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        {previews.length > 0 && (
                            <Stack direction="row" gap={1} flexWrap="wrap">
                                {previews.map((url, idx) => (
                                    <Box key={idx} sx={{ position: 'relative' }}>
                                        <Box
                                            component="img" src={url} alt=""
                                            sx={{
                                                width: 72, height: 96, objectFit: 'cover',
                                                borderRadius: 1, border: 1, borderColor: 'divider',
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => removePhoto(idx)}
                                            sx={{
                                                position: 'absolute', top: 2, right: 2,
                                                bgcolor: 'rgba(0,0,0,0.6)', color: '#fff',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                )}

                {step === 1 && (
                    <Stack gap={2} sx={{ py: 3 }} alignItems="center">
                        <CircularProgress />
                        <Typography variant="body2">
                            Processing photo {currentIdx + 1} of {blobs.length}…
                        </Typography>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="caption" display="block" textAlign="center">
                                {progress}%
                            </Typography>
                        </Box>
                    </Stack>
                )}

                {step === 2 && (
                    <Stack gap={2}>
                        <Typography variant="subtitle2">Store</Typography>
                        <Stack gap={1}>
                            <TextField
                                label="Store" size="small" value={storeData.name}
                                onChange={(e) => setStoreData((s) => ({ ...s, name: e.target.value }))}
                            />
                            <Stack direction="row" gap={1}>
                                <TextField
                                    label="Address" size="small" fullWidth value={storeData.address}
                                    onChange={(e) => setStoreData((s) => ({ ...s, address: e.target.value }))}
                                />
                                <TextField
                                    label="City" size="small" value={storeData.city}
                                    onChange={(e) => setStoreData((s) => ({ ...s, city: e.target.value }))}
                                />
                            </Stack>
                        </Stack>

                        <Divider />

                        <Typography variant="subtitle2">Purchased</Typography>
                        <Stack direction="row" gap={1} alignItems="center">
                            <TextField
                                label="Date" type="date" size="small"
                                InputLabelProps={{ shrink: true }} value={dateTime.date}
                                onChange={(e) => setDateTime((d) => ({ ...d, date: e.target.value }))}
                            />
                            <TextField
                                label="Time" type="time" size="small"
                                InputLabelProps={{ shrink: true }} value={dateTime.time}
                                onChange={(e) => setDateTime((d) => ({ ...d, time: e.target.value }))}
                            />
                            {totalAmount != null && (
                                <Chip label={`Total ${totalAmount} €`} />
                            )}
                        </Stack>

                        <Divider />

                        <Typography variant="subtitle2">
                            Items ({items.length})
                        </Typography>
                        {items.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No items detected — try adding clearer photos.
                            </Typography>
                        ) : (() => {
                            const itemsSum = items.reduce(
                                (s, it) => s + (Number(it.total_price) || 0), 0,
                            )
                            const fmt = (n) =>
                                (Number(n) || 0).toFixed(2).replace('.', ',')
                            const mismatch = totalAmount != null
                                && Math.abs(itemsSum - totalAmount) > 0.02
                            return (
                                <Box
                                    sx={{
                                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                        fontSize: 13,
                                        bgcolor: 'action.hover',
                                        borderRadius: 1,
                                        p: 1.5,
                                    }}
                                >
                                    {items.map((it) => {
                                        const qty = Number(it.quantity) || 1
                                        const unit = it.unit && it.unit !== 'pc' ? it.unit : ''
                                        const unitPrice = Number(it.unit_price) || 0
                                        const qtyLine = qty !== 1 || unit
                                            ? `  ${qty}${unit ? ' ' + unit : ' ×'} × ${fmt(unitPrice)} €`
                                            : null
                                        return (
                                            <Box
                                                key={it._id}
                                                sx={{
                                                    display: 'flex', alignItems: 'flex-start',
                                                    gap: 1, py: 0.25,
                                                    '&:hover .row-del': { opacity: 1 },
                                                }}
                                            >
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{
                                                        display: 'flex', justifyContent: 'space-between',
                                                        gap: 1,
                                                    }}>
                                                        <Box sx={{
                                                            flex: 1, minWidth: 0,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            {it.name}
                                                        </Box>
                                                        <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                                            {fmt(it.total_price)} €
                                                        </Box>
                                                    </Box>
                                                    {qtyLine && (
                                                        <Box sx={{
                                                            color: 'text.secondary', fontSize: 12,
                                                            fontVariantNumeric: 'tabular-nums',
                                                        }}>
                                                            {qtyLine}
                                                        </Box>
                                                    )}
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    className="row-del"
                                                    onClick={() => removeItem(it._id)}
                                                    sx={{ opacity: { xs: 1, md: 0.3 }, transition: 'opacity 0.15s' }}
                                                >
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Box>
                                        )
                                    })}
                                    <Box sx={{
                                        borderTop: '1px dashed',
                                        borderColor: 'divider',
                                        mt: 1, pt: 1,
                                        display: 'flex', justifyContent: 'space-between',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}>
                                        <Box>Items sum</Box>
                                        <Box>{fmt(itemsSum)} €</Box>
                                    </Box>
                                    {totalAmount != null && (
                                        <Box sx={{
                                            display: 'flex', justifyContent: 'space-between',
                                            fontWeight: 700, mt: 0.5,
                                            color: mismatch ? 'warning.main' : 'text.primary',
                                            fontVariantNumeric: 'tabular-nums',
                                        }}>
                                            <Box>TOTAL</Box>
                                            <Box>{fmt(totalAmount)} €</Box>
                                        </Box>
                                    )}
                                    {mismatch && (
                                        <Box sx={{
                                            mt: 0.5, fontSize: 11, color: 'warning.main',
                                        }}>
                                            ⚠ Items sum differs from total by {fmt(Math.abs(itemsSum - totalAmount))} €
                                        </Box>
                                    )}
                                </Box>
                            )
                        })()}

                        <Divider />

                        {/* Debug aids — inspect what reached the parser. */}
                        <Stack gap={1}>
                            <Stack direction="row" gap={1} flexWrap="wrap">
                                <Button
                                    size="small" variant="outlined"
                                    onClick={() => setShowRaw((v) => !v)}
                                >
                                    {showRaw ? 'Hide' : 'Show'} OCR text
                                </Button>
                                {rawText && (
                                    <Button
                                        size="small" variant="outlined"
                                        onClick={() => {
                                            const blob = new Blob([rawText], { type: 'text/plain' })
                                            const url = URL.createObjectURL(blob)
                                            const a = document.createElement('a')
                                            a.href = url
                                            a.download = `ocr-${Date.now()}.txt`
                                            a.click()
                                            setTimeout(() => URL.revokeObjectURL(url), 1000)
                                        }}
                                    >
                                        Download OCR text
                                    </Button>
                                )}
                                {previews.length > 0 && (
                                    <Button
                                        size="small" variant="outlined"
                                        onClick={() => {
                                            previews.forEach((url, idx) => {
                                                const a = document.createElement('a')
                                                a.href = url
                                                a.download = `receipt-${Date.now()}-${idx + 1}.jpg`
                                                a.click()
                                            })
                                        }}
                                    >
                                        Download image{previews.length > 1 ? 's' : ''}
                                    </Button>
                                )}
                            </Stack>
                            {showRaw && (
                                <TextField
                                    multiline minRows={6} maxRows={16}
                                    fullWidth
                                    value={rawText}
                                    InputProps={{
                                        readOnly: true,
                                        sx: { fontFamily: 'monospace', fontSize: 12 },
                                    }}
                                />
                            )}
                        </Stack>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={close} disabled={processing}>Cancel</Button>
                {step === 0 && (
                    <Button
                        variant="contained" onClick={handleProcess}
                        startIcon={<PlayArrowIcon />}
                        disabled={blobs.length === 0}
                    >
                        Process {blobs.length} photo{blobs.length === 1 ? '' : 's'}
                    </Button>
                )}
                {step === 2 && (
                    <Button
                        variant="contained" onClick={handleSave}
                        disabled={items.length === 0}
                    >
                        Save {items.length} items
                    </Button>
                )}
            </DialogActions>
            <ReceiptScanDialog
                open={scanOpen}
                onClose={handleScanClose}
                onComplete={handleScanComplete}
                initialDeviceId={deviceId}
            />
        </Dialog>
    )
}
