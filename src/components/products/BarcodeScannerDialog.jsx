import { useEffect, useRef, useState, useCallback } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, CircularProgress, TextField, Stack,
    MenuItem,
} from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CameraswitchIcon from '@mui/icons-material/Cameraswitch'
import {
    startScanning, listCameras, pickBackCamera, requestCameraPermission,
} from '../../lib/barcode'

export default function BarcodeScannerDialog({ open, onClose, onDetected }) {
    const videoRef = useRef(null)
    const controlsRef = useRef(null)
    const [error, setError] = useState('')
    const [starting, setStarting] = useState(false)
    const [manual, setManual] = useState('')
    const [cameras, setCameras] = useState([])
    const [deviceId, setDeviceId] = useState('')

    // Keep a ref so the start function sees the latest deviceId without
    // needing to re-run the whole effect when only the camera changes.
    const stopScanner = useCallback(() => {
        try { controlsRef.current?.stop() } catch { /* ignore */ }
        controlsRef.current = null
    }, [])

    const start = useCallback(async (id) => {
        stopScanner()
        setError('')
        setStarting(true)
        try {
            const controls = await startScanning(videoRef.current, (code) => {
                onDetected?.(code)
                stopScanner()
                onClose?.()
            }, id || undefined)
            controlsRef.current = controls
        } catch (e) {
            setError(e?.message || 'Camera not available')
        } finally {
            setStarting(false)
        }
    }, [onDetected, onClose, stopScanner])

    // On open: request permission, enumerate, pick back cam, start.
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
                setDeviceId(initial)
                await start(initial)
            })()
        return () => {
            cancelled = true
            stopScanner()
        }
    }, [open, start, stopScanner])

    const handleCameraChange = async (newId) => {
        setDeviceId(newId)
        await start(newId)
    }

    const handleManual = () => {
        const code = manual.trim()
        if (!code) return
        onDetected?.(code)
        setManual('')
        onClose?.()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CameraAltIcon /> Scan barcode
            </DialogTitle>
            <DialogContent>
                <Box sx={{
                    position: 'relative', width: '100%', aspectRatio: '4 / 3',
                    bgcolor: 'black', borderRadius: 2, overflow: 'hidden', mb: 2,
                }}>
                    <video
                        ref={videoRef}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        autoPlay muted playsInline
                    />
                    {starting && (
                        <Box sx={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <CircularProgress sx={{ color: 'white' }} />
                        </Box>
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
                        sx={{ mb: 2 }}
                    >
                        {cameras.map((c) => (
                            <MenuItem key={c.deviceId} value={c.deviceId}>
                                {c.label}
                            </MenuItem>
                        ))}
                    </TextField>
                )}

                {error && (
                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Or enter the code manually:
                </Typography>
                <Stack direction="row" gap={1}>
                    <TextField
                        size="small" value={manual}
                        onChange={(e) => setManual(e.target.value)}
                        placeholder="EAN / UPC" inputMode="numeric" fullWidth
                    />
                    <Button variant="outlined" onClick={handleManual} disabled={!manual.trim()}>
                        Use
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}
