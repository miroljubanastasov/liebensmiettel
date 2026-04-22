import { useState, useRef, useEffect } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, List, ListItem, ListItemText,
    IconButton, Stack, Divider, LinearProgress, Alert, Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { processReceipt } from '../../lib/receiptParser'
import { startScanning } from '../../lib/barcode'
import { lookupEAN, upsertProduct } from '../../lib/openFoodFacts'
import { upsertStore } from '../../lib/stores'

/**
 * Return-from-shopping flow.
 *
 * 1. User imports the receipt (multiple photos → OCR → items list).
 * 2. Live barcode scanner runs; each scan pairs an EAN with an OCR item.
 *    Pairing rule: pick the first unpaired receipt item whose name overlaps
 *    the OFF product name; fallback = first unpaired item.
 * 3. On save, create product_entries in_pantry with OCR price + OFF data.
 */
export default function ReturnFromShoppingDialog({ open, onClose, onAddItems }) {
    const [phase, setPhase] = useState('receipt') // 'receipt' | 'scan' | 'review'
    const [parsing, setParsing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState('')

    const [storeData, setStoreData] = useState({ name: '', address: '', city: '' })
    const [purchasedAt, setPurchasedAt] = useState('')
    const [items, setItems] = useState([])   // OCR receipt lines; {name, quantity, unit, price, ean?, product?, paired}

    const videoRef = useRef(null)
    const controlsRef = useRef(null)

    const close = () => {
        try { controlsRef.current?.stop() } catch { /* ignore */ }
        setPhase('receipt'); setParsing(false); setProgress(0); setError('')
        setStoreData({ name: '', address: '', city: '' }); setPurchasedAt('')
        setItems([])
        onClose()
    }

    // Start scanner when entering scan phase
    useEffect(() => {
        if (phase !== 'scan' || !open) return
        let cancelled = false
            ; (async () => {
                try {
                    const controls = await startScanning(videoRef.current, async (code) => {
                        if (cancelled) return
                        // Skip codes we've already matched
                        if (items.some(it => it.ean === code)) return
                        const off = await lookupEAN(code)
                        if (off) await upsertProduct(off)
                        pairScanWithItem(code, off)
                    })
                    controlsRef.current = controls
                } catch (e) {
                    if (!cancelled) setError(e?.message || 'Camera not available')
                }
            })()
        return () => {
            cancelled = true
            try { controlsRef.current?.stop() } catch { /* ignore */ }
        }
    }, [phase, open]) // eslint-disable-line react-hooks/exhaustive-deps

    const pairScanWithItem = (ean, off) => {
        setItems(prev => {
            const offName = (off?.name || '').toLowerCase()
            let idx = -1
            if (offName) {
                idx = prev.findIndex(it =>
                    !it.paired &&
                    (offName.includes(it.name.toLowerCase().split(' ')[0]) ||
                        it.name.toLowerCase().includes(offName.split(' ')[0]))
                )
            }
            if (idx < 0) idx = prev.findIndex(it => !it.paired)
            if (idx < 0) {
                // No OCR item to pair; add as new row
                return [...prev, {
                    name: off?.name || ean, quantity: 1, unit: 'pc',
                    price: null, ean, product: off, paired: true,
                }]
            }
            const next = [...prev]
            next[idx] = {
                ...next[idx],
                ean,
                product: off,
                name: off?.name || next[idx].name,
                paired: true,
            }
            return next
        })
    }

    const runReceiptOcr = async (files) => {
        setParsing(true); setProgress(0); setError('')
        try {
            for (const file of files) {
                const parsed = await processReceipt(file, (p) => setProgress(Math.round(p * 100)))
                if (parsed.store_name && !storeData.name) {
                    setStoreData({
                        name: parsed.store_name,
                        address: parsed.store_address || '',
                        city: parsed.store_city || '',
                    })
                }
                if (parsed.purchase_date && !purchasedAt) {
                    setPurchasedAt(
                        new Date(`${parsed.purchase_date}T${parsed.purchase_time || '00:00'}`).toISOString()
                    )
                }
                if (parsed.items?.length) {
                    setItems(prev => [
                        ...prev,
                        ...parsed.items.map(it => ({ ...it, paired: false })),
                    ])
                }
            }
        } catch (e) {
            setError(e?.message || 'OCR failed')
        } finally {
            setParsing(false)
        }
    }

    const handleReceiptFiles = async (e) => {
        const files = Array.from(e.target.files || []); e.target.value = ''
        if (files.length) await runReceiptOcr(files)
    }

    const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))

    const handleSave = async () => {
        setParsing(true); setError('')
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
            const purchasedISO = purchasedAt || new Date().toISOString()
            await onAddItems(items.map(it => ({
                name: it.name,
                ean: it.ean || null,
                brand: it.product?.brand || null,
                quantity: it.quantity || 1,
                unit: it.unit || 'pc',
                price: it.price ?? null,
                unit_price: it.unit_price ?? null,
                store_id: storeId,
                purchased_at: purchasedISO,
                nutriscore: it.product?.nutriscore || null,
                entry_source: it.ean ? 'barcode' : 'receipt',
            })))
            close()
        } catch (e) {
            setError(e?.message || 'Failed to save')
        } finally {
            setParsing(false)
        }
    }

    const pairedCount = items.filter(it => it.paired).length

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>Back from shopping</DialogTitle>
            <DialogContent>
                {parsing && (
                    <Box sx={{ mb: 2 }}>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="caption">Working… {progress}%</Typography>
                    </Box>
                )}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {phase === 'receipt' && (
                    <Stack gap={2}>
                        <Typography variant="body2">
                            Step 1 — Photograph the receipt (multiple shots for long ones).
                            Store, date, and items will be extracted automatically.
                        </Typography>
                        <Button
                            component="label" variant="contained"
                            startIcon={<CameraAltIcon />} disabled={parsing}
                        >
                            Photograph receipt
                            <input type="file" accept="image/*" capture="environment"
                                multiple hidden onChange={handleReceiptFiles} />
                        </Button>

                        {storeData.name && (
                            <Typography variant="caption">
                                <b>{storeData.name}</b>
                                {storeData.city && ` — ${storeData.city}`}
                                {purchasedAt && ` · ${new Date(purchasedAt).toLocaleString()}`}
                            </Typography>
                        )}

                        {items.length > 0 && (
                            <>
                                <Divider />
                                <Typography variant="subtitle2">Detected items ({items.length})</Typography>
                                <List dense>
                                    {items.map((it, idx) => (
                                        <ListItem key={idx} secondaryAction={
                                            <IconButton edge="end" size="small" onClick={() => removeItem(idx)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        }>
                                            <ListItemText
                                                primary={it.name}
                                                secondary={`${it.quantity ?? 1} × ${it.price ?? '?'} €`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </Stack>
                )}

                {phase === 'scan' && (
                    <Stack gap={2}>
                        <Typography variant="body2">
                            Step 2 — Scan each product's barcode. Each scan pairs with an OCR line.
                        </Typography>
                        <Box sx={{
                            position: 'relative', aspectRatio: '4 / 3',
                            bgcolor: 'black', borderRadius: 2, overflow: 'hidden',
                        }}>
                            <video ref={videoRef} muted playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            {pairedCount} / {items.length} paired
                        </Typography>
                        <Divider />
                        <List dense sx={{ maxHeight: 240, overflowY: 'auto' }}>
                            {items.map((it, idx) => (
                                <ListItem key={idx}
                                    secondaryAction={
                                        it.paired
                                            ? <CheckCircleIcon color="success" fontSize="small" />
                                            : <Chip size="small" label="unscanned" />
                                    }
                                >
                                    <ListItemText
                                        primary={it.name}
                                        secondary={it.ean ? `EAN: ${it.ean}` : (it.price != null ? `${it.price} €` : '')}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                )}

                {phase === 'review' && (
                    <Stack gap={1}>
                        <Typography variant="subtitle2">Store</Typography>
                        <Typography variant="body2">
                            {storeData.name || '(unknown)'}{storeData.city && ` — ${storeData.city}`}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2">Items ({items.length}) · paired {pairedCount}</Typography>
                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                            {items.map((it, i) => (
                                <Chip key={i} size="small"
                                    color={it.paired ? 'success' : 'default'}
                                    label={`${it.name}${it.price != null ? ` — ${it.price}€` : ''}`} />
                            ))}
                        </Stack>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={close} disabled={parsing}>Cancel</Button>
                {phase === 'receipt' && (
                    <Button variant="contained" onClick={() => setPhase('scan')}
                        disabled={parsing || items.length === 0}
                        startIcon={<QrCodeScannerIcon />}>
                        Scan barcodes
                    </Button>
                )}
                {phase === 'scan' && (
                    <>
                        <Button onClick={() => setPhase('receipt')}>Back</Button>
                        <Button variant="contained" onClick={() => setPhase('review')}>
                            Done scanning
                        </Button>
                    </>
                )}
                {phase === 'review' && (
                    <>
                        <Button onClick={() => setPhase('scan')}>Back</Button>
                        <Button variant="contained" onClick={handleSave}
                            disabled={parsing || items.length === 0}>
                            Save to pantry
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    )
}
