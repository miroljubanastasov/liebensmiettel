import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Dialog, DialogContent, DialogActions, Button, Box,
    Typography, LinearProgress, IconButton, Stack, Alert,
    TextField, MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CheckIcon from '@mui/icons-material/Check'
import CameraswitchIcon from '@mui/icons-material/Cameraswitch'
import { createStripStitcher, REJECT } from '../../lib/receiptScanner'
import {
    listCameras, pickBackCamera, requestCameraPermission,
} from '../../lib/barcode'

/**
 * Panorama-style guided receipt scanner.
 *
 * The user aligns the top of the receipt with a guide rectangle, taps
 * "Start", and slowly slides the phone down along the receipt. Frames
 * are captured every ~250 ms, correlated against the previous frame via
 * 1-D vertical projection, and the newly-revealed rows are appended to a
 * single tall image. On "Done" we emit the stitched JPEG blob.
 *
 * Props:
 *   open              bool
 *   onClose()         user cancelled or closed
 *   onComplete(blob)  stitched receipt image ready for OCR
 *   initialDeviceId   carry over the camera selection from the outer dialog
 */
export default function ReceiptScanDialog({ open, onClose, onComplete, initialDeviceId = '' }) {
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const stitcherRef = useRef(null)
    const loopRef = useRef(null)
    const workCanvasRef = useRef(null)

    const [cameraError, setCameraError] = useState('')
    const [cameras, setCameras] = useState([])
    const [deviceId, setDeviceId] = useState('')
    const [scanning, setScanning] = useState(false)
    const [framesAccepted, setFramesAccepted] = useState(0)
    const [stitchedHeight, setStitchedHeight] = useState(0)
    const [hint, setHint] = useState('') // transient UI hint
    const [status, setStatus] = useState('idle') // idle | scanning | error
    const [errorMsg, setErrorMsg] = useState('')

    // ─────────────────────────── camera ──────────────────────────────
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop())
            streamRef.current = null
        }
        if (videoRef.current) videoRef.current.srcObject = null
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
                    ? {
                        deviceId: { exact: id },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    }
                    : {
                        facingMode: { ideal: 'environment' },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                audio: false,
            }
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            streamRef.current = stream
            const v = videoRef.current
            if (v) {
                v.srcObject = stream
                v.setAttribute('playsinline', 'true')
                v.muted = true
                await v.play().catch(() => { })
            }
        } catch (e) {
            setCameraError(e?.message || 'Could not start camera.')
        }
    }, [])

    // Enumerate cameras + pick back camera on open. If the parent
    // dialog already chose one, honour that instead of re-picking.
    useEffect(() => {
        if (!open) return
        let cancelled = false
            ; (async () => {
                await requestCameraPermission()
                if (cancelled) return
                const cams = await listCameras()
                if (cancelled) return
                setCameras(cams)
                const parentPick = initialDeviceId &&
                    cams.some((c) => c.deviceId === initialDeviceId)
                    ? initialDeviceId
                    : null
                const initial = parentPick
                    ?? pickBackCamera(cams)?.deviceId
                    ?? cams[0]?.deviceId
                    ?? ''
                setDeviceId(initial)
                startCamera(initial)
            })()
        return () => {
            cancelled = true
            stopCamera()
            if (loopRef.current) {
                clearInterval(loopRef.current)
                loopRef.current = null
            }
        }
    }, [open, startCamera, stopCamera])

    // Switch camera: stop any in-progress scan and restart preview on the
    // newly selected device. Stitching state is discarded — resolution may
    // change, which invalidates pixel-based offsets.
    const handleCameraChange = useCallback((id) => {
        setDeviceId(id)
        if (loopRef.current) {
            clearInterval(loopRef.current)
            loopRef.current = null
        }
        setScanning(false)
        stitcherRef.current = null
        setFramesAccepted(0)
        setStitchedHeight(0)
        setStatus('idle')
        setHint('')
        startCamera(id)
    }, [startCamera])

    // ─────────────────────────── scan loop ───────────────────────────
    const stopScan = useCallback(() => {
        if (loopRef.current) {
            clearInterval(loopRef.current)
            loopRef.current = null
        }
        setScanning(false)
    }, [])

    const startScan = useCallback(() => {
        const v = videoRef.current
        if (!v || !v.videoWidth) {
            setErrorMsg('Camera not ready yet.')
            return
        }
        // Prepare a reusable work canvas matching the video resolution.
        const work = document.createElement('canvas')
        work.width = v.videoWidth
        work.height = v.videoHeight
        workCanvasRef.current = work

        stitcherRef.current = createStripStitcher({
            frameWidth: v.videoWidth,
            frameHeight: v.videoHeight,
            maxHeight: 16000,
        })

        setScanning(true)
        setStatus('scanning')
        setErrorMsg('')
        setFramesAccepted(0)
        setStitchedHeight(0)
        setHint('Move the phone slowly DOWN along the receipt.')

        let consecutiveLow = 0
        loopRef.current = setInterval(() => {
            const video = videoRef.current
            const canvas = workCanvasRef.current
            const stitcher = stitcherRef.current
            if (!video || !canvas || !stitcher) return

            const ctx = canvas.getContext('2d', { willReadFrequently: true })
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const res = stitcher.pushFrame(canvas)

            if (res.accepted) {
                consecutiveLow = 0
                setFramesAccepted(stitcher.framesAccepted)
                setStitchedHeight(stitcher.stitchedHeight)
                setHint('Keep moving down…')
            } else {
                if (res.reason === REJECT.NO_MOTION) {
                    setHint('Hold steady then move DOWN slowly.')
                } else if (res.reason === REJECT.TOO_FAST) {
                    setHint('Too fast — slow down.')
                } else if (res.reason === REJECT.LOW_CONFIDENCE) {
                    consecutiveLow++
                    if (consecutiveLow > 6) {
                        setHint('Lost track. Hold position, then continue.')
                    }
                } else if (res.reason === REJECT.FULL) {
                    setHint('Maximum length reached — tap Done.')
                }
            }
        }, 250)
    }, [])

    const handleDone = useCallback(async () => {
        stopScan()
        const stitcher = stitcherRef.current
        if (!stitcher || stitcher.framesAccepted < 2) {
            setStatus('error')
            setErrorMsg('Not enough of the receipt was captured. Please try again.')
            return
        }
        const blob = await stitcher.finalize()
        if (!blob) {
            setStatus('error')
            setErrorMsg('Failed to build stitched image. Please try again.')
            return
        }
        stopCamera()
        onComplete?.(blob)
    }, [stopScan, stopCamera, onComplete])

    const handleRestart = useCallback(() => {
        stopScan()
        stitcherRef.current = null
        setFramesAccepted(0)
        setStitchedHeight(0)
        setHint('')
        setStatus('idle')
        setErrorMsg('')
    }, [stopScan])

    const handleCancel = useCallback(() => {
        stopScan()
        stopCamera()
        onClose?.()
    }, [stopScan, stopCamera, onClose])

    const progressPct = Math.min(100, Math.round((stitchedHeight / 4000) * 100))

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            fullScreen
            PaperProps={{ sx: { bgcolor: '#000' } }}
        >
            <DialogContent
                sx={{
                    p: 0, position: 'relative', overflow: 'hidden',
                    bgcolor: '#000', display: 'flex', flexDirection: 'column',
                }}
            >
                {/* Video preview */}
                <Box
                    sx={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <Box
                        component="video"
                        ref={videoRef}
                        playsInline
                        muted
                        sx={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            bgcolor: '#000',
                        }}
                    />
                </Box>

                {/* Guide overlay */}
                <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {/* Vertical guide frame */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '10%', bottom: '10%',
                            left: '15%', right: '15%',
                            border: '2px dashed rgba(255,255,255,0.8)',
                            borderRadius: 2,
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
                        }}
                    />
                    {/* Direction arrow */}
                    {scanning && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%', top: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: 72, lineHeight: 1,
                                animation: 'scanArrow 1.2s ease-in-out infinite',
                                '@keyframes scanArrow': {
                                    '0%': { transform: 'translate(-50%, -80%)', opacity: 0.3 },
                                    '50%': { transform: 'translate(-50%, -50%)', opacity: 1 },
                                    '100%': { transform: 'translate(-50%, -20%)', opacity: 0.3 },
                                },
                            }}
                        >
                            ↓
                        </Box>
                    )}
                    {/* Progress bar on right edge */}
                    {scanning && (
                        <Box
                            sx={{
                                position: 'absolute',
                                right: 12, top: '10%', bottom: '10%',
                                width: 6,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                borderRadius: 3,
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute', left: 0, right: 0, bottom: 0,
                                    height: `${progressPct}%`,
                                    bgcolor: 'primary.main',
                                    transition: 'height 0.2s ease',
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Top bar */}
                <Box
                    sx={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        p: 1, display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', gap: 1,
                        background: 'linear-gradient(rgba(0,0,0,0.5), transparent)',
                    }}
                >
                    <IconButton onClick={handleCancel} sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ color: '#fff', fontWeight: 600, flex: 1, textAlign: 'center' }}>
                        {scanning
                            ? `Scanning… ${framesAccepted} frames`
                            : 'Scan receipt'}
                    </Typography>
                    {cameras.length > 0 ? (
                        <TextField
                            select
                            size="small"
                            value={deviceId}
                            onChange={(e) => handleCameraChange(e.target.value)}
                            sx={{
                                minWidth: 140, maxWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.8)' },
                                },
                                '& .MuiSvgIcon-root': { color: '#fff' },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <CameraswitchIcon fontSize="small" sx={{ mr: 0.5, color: '#fff' }} />
                                ),
                            }}
                        >
                            {cameras.map((c, idx) => (
                                <MenuItem key={c.deviceId} value={c.deviceId}>
                                    {c.label || `Camera ${idx + 1}`}
                                </MenuItem>
                            ))}
                        </TextField>
                    ) : (
                        <Box sx={{ width: 40 }} />
                    )}
                </Box>

                {/* Bottom instruction + controls */}
                <Box
                    sx={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        p: 2, pb: 3,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    }}
                >
                    {cameraError && (
                        <Alert severity="error" sx={{ mb: 1 }}>{cameraError}</Alert>
                    )}
                    {errorMsg && status === 'error' && (
                        <Alert severity="warning" sx={{ mb: 1 }}>{errorMsg}</Alert>
                    )}
                    <Typography
                        sx={{
                            color: '#fff', textAlign: 'center', mb: 2, minHeight: 24,
                            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {scanning
                            ? hint
                            : status === 'error'
                                ? 'Tap Restart to try again.'
                                : 'Align the top of the receipt with the frame, then tap Start.'}
                    </Typography>

                    {scanning && (
                        <LinearProgress
                            variant="determinate"
                            value={progressPct}
                            sx={{ mb: 2, height: 6, borderRadius: 3 }}
                        />
                    )}

                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<CloseIcon />}
                            onClick={handleCancel}
                            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
                        >
                            Cancel
                        </Button>
                        {!scanning && status !== 'error' && (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={startScan}
                                disabled={!!cameraError}
                            >
                                Start scan
                            </Button>
                        )}
                        {scanning && (
                            <>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<RestartAltIcon />}
                                    onClick={handleRestart}
                                    sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
                                >
                                    Restart
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<CheckIcon />}
                                    onClick={handleDone}
                                    disabled={framesAccepted < 2}
                                >
                                    Done
                                </Button>
                            </>
                        )}
                        {status === 'error' && (
                            <Button
                                variant="contained"
                                startIcon={<RestartAltIcon />}
                                onClick={handleRestart}
                            >
                                Restart
                            </Button>
                        )}
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ display: 'none' }} />
        </Dialog>
    )
}
