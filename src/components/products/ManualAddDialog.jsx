import { useState, useCallback, useEffect } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, MenuItem, InputAdornment, Autocomplete,
    ToggleButton, ToggleButtonGroup, Typography, Chip, Divider, Stack,
    CircularProgress,
} from '@mui/material'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import KitchenIcon from '@mui/icons-material/Kitchen'
import InventoryIcon from '@mui/icons-material/Inventory'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { CATEGORIES, classifyProductAsync, bestSubcategoryForCategory } from '../../utils/classify'
import { lookupEAN, upsertProduct } from '../../lib/openFoodFacts'
import { listStores, upsertStore } from '../../lib/stores'
import {
    ocrExpiryDate, ocrNutriScore, ocrNutritionFacts, ocrLabels,
} from '../../lib/photoOcr'
import BarcodeScannerDialog from './BarcodeScannerDialog'
import PhotoCaptureButton from './PhotoCaptureButton'

const UNITS = ['pc', 'g', 'kg', 'ml', 'L', 'pkg', 'bunch']
const LOCATIONS = [
    { value: 'fridge', label: 'Fridge', icon: <KitchenIcon fontSize="small" /> },
    { value: 'freezer', label: 'Freezer', icon: <AcUnitIcon fontSize="small" /> },
    { value: 'pantry', label: 'Pantry', icon: <InventoryIcon fontSize="small" /> },
]
const NUTRI_GRADES = ['a', 'b', 'c', 'd', 'e']

const EMPTY = {
    name: '', brand: '', ean: '',
    category: '', subcategory: '',
    quantity: '1', unit: 'pc',
    location: 'fridge',
    expiry_date: '',
    store_id: null, store_name: '',
    price: '',
    nutriscore: '',
    labels: [],
    nutrition: null,
    notes: '',
}

export default function ManualAddDialog({
    open,
    onClose,
    onAdd,
    mode = 'pantry',
    initialEan = '',
    entry = null,
}) {
    const isEdit = !!entry
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [fieldError, setFieldError] = useState('')
    const [scannerOpen, setScannerOpen] = useState(false)
    const [eanLoading, setEanLoading] = useState(false)
    const [stores, setStores] = useState([])

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
    const reset = () => { setForm(EMPTY); setFieldError('') }
    const handleClose = () => { reset(); onClose() }

    useEffect(() => {
        if (!open) return
        listStores().then(setStores)
    }, [open])

    // Prefill from entry (edit mode)
    useEffect(() => {
        if (!open || !entry) return
        setForm({
            name: entry.name ?? '',
            brand: entry.brand ?? '',
            ean: entry.ean ?? '',
            category: entry.category ?? '',
            subcategory: entry.subcategory ?? '',
            quantity: String(entry.quantity ?? '1'),
            unit: entry.unit ?? 'pc',
            location: entry.location ?? 'fridge',
            expiry_date: entry.expiry_date ?? '',
            store_id: entry.store_id ?? null,
            store_name: entry.store_name ?? '',
            price: entry.price != null ? String(entry.price) : '',
            nutriscore: entry.nutriscore ?? '',
            labels: entry.labels ?? [],
            nutrition: entry.nutrition ?? null,
            notes: entry.notes ?? '',
        })
    }, [open, entry])

    // EAN â†’ OFF autofill
    const handleEan = useCallback(async (code) => {
        setForm(f => ({ ...f, ean: code }))
        setEanLoading(true)
        try {
            const off = await lookupEAN(code)
            if (off) {
                await upsertProduct(off)
                setForm(f => ({
                    ...f,
                    name: f.name || off.name || '',
                    brand: f.brand || off.brand || '',
                    nutriscore: f.nutriscore || off.nutriscore || '',
                    labels: f.labels.length ? f.labels : (off.labels || []),
                    nutrition: f.nutrition || {
                        energy_kcal: off.energy_kcal,
                        fat_g: off.fat_g,
                        saturated_fat_g: off.saturated_fat_g,
                        carbs_g: off.carbs_g,
                        sugars_g: off.sugars_g,
                        fiber_g: off.fiber_g,
                        protein_g: off.protein_g,
                        salt_g: off.salt_g,
                    },
                }))
            }
        } finally {
            setEanLoading(false)
        }
    }, [])

    // Auto-fill from initialEan
    useEffect(() => {
        if (open && initialEan && !form.ean) handleEan(initialEan)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialEan])

    const handleNameBlur = useCallback(() => {
        if (form.name.trim() && !form.category) {
            classifyProductAsync({ name: form.name.trim() }).then(result => {
                if (result.category !== 'Other') {
                    setForm(f => ({
                        ...f,
                        category: f.category || result.category,
                        subcategory: f.subcategory || result.subcategory || '',
                    }))
                }
            })
        }
    }, [form.name, form.category])

    const handleCategoryChange = useCallback((newCat) => {
        const sub = form.name.trim()
            ? bestSubcategoryForCategory(form.name.trim(), newCat) || ''
            : ''
        setForm(f => ({ ...f, category: newCat, subcategory: sub }))
    }, [form.name])

    const handleSave = async () => {
        if (!form.name.trim()) { setFieldError('Name is required'); return }
        setSaving(true)

        let storeId = form.store_id
        if (!storeId && form.store_name.trim()) {
            const created = await upsertStore({ name: form.store_name.trim() })
            storeId = created?.id ?? null
        }

        const result = await onAdd({
            name: form.name.trim(),
            brand: form.brand.trim() || null,
            ean: form.ean || null,
            category: form.category || null,
            subcategory: form.subcategory || null,
            quantity: parseFloat(form.quantity) || 1,
            unit: form.unit,
            location: mode === 'pantry' ? form.location : null,
            expiry_date: mode === 'pantry' && form.expiry_date ? form.expiry_date : null,
            store_id: storeId,
            price: form.price ? parseFloat(form.price) : null,
            nutriscore: form.nutriscore || null,
            notes: form.notes.trim() || null,
            entry_source: form.ean ? 'barcode' : 'manual',
        })

        setSaving(false)
        if (result?.ok === false) {
            setFieldError(result.error || 'Failed to save')
        } else {
            reset()
            onClose()
        }
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{
                    isEdit ? 'Edit product'
                        : mode === 'pantry' ? 'Add to Pantry' : 'Add to Grocery List'
                }</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

                        <TextField
                            label="EAN / Barcode"
                            value={form.ean}
                            onChange={(e) => set('ean', e.target.value)}
                            onBlur={() => form.ean && handleEan(form.ean)}
                            size="small" fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {eanLoading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                                        <Button
                                            size="small"
                                            startIcon={<QrCodeScannerIcon />}
                                            onClick={() => setScannerOpen(true)}
                                        >Scan</Button>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Produktname *"
                            value={form.name}
                            onChange={(e) => { set('name', e.target.value); setFieldError('') }}
                            onBlur={handleNameBlur}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            error={!!fieldError}
                            helperText={fieldError}
                            size="small" fullWidth autoFocus
                        />

                        <TextField
                            label="Brand"
                            value={form.brand}
                            onChange={(e) => set('brand', e.target.value)}
                            size="small" fullWidth
                        />

                        <TextField
                            label="Category"
                            value={form.category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            select size="small" fullWidth
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {CATEGORIES.map((c) => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </TextField>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                label="Qty" value={form.quantity}
                                onChange={(e) => set('quantity', e.target.value)}
                                type="number" size="small"
                                inputProps={{ min: 0, step: 0.5 }}
                                sx={{ width: 90 }}
                            />
                            <TextField
                                label="Unit" value={form.unit}
                                onChange={(e) => set('unit', e.target.value)}
                                select size="small" sx={{ flex: 1 }}
                            >
                                {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                            </TextField>
                        </Box>

                        <Autocomplete
                            freeSolo size="small" options={stores}
                            getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.name)}
                            value={form.store_id ? stores.find(s => s.id === form.store_id) ?? null : form.store_name}
                            onChange={(_, v) => {
                                if (typeof v === 'string' || v === null) {
                                    setForm(f => ({ ...f, store_id: null, store_name: v || '' }))
                                } else {
                                    setForm(f => ({ ...f, store_id: v.id, store_name: v.name }))
                                }
                            }}
                            onInputChange={(_, v) => { if (!form.store_id) set('store_name', v) }}
                            renderInput={(params) => (
                                <TextField {...params} label="Store" placeholder="REWE, Lidl, â€¦" />
                            )}
                        />

                        <TextField
                            label="Price" value={form.price}
                            onChange={(e) => set('price', e.target.value)}
                            type="number" size="small"
                            inputProps={{ min: 0, step: 0.01 }}
                            InputProps={{ endAdornment: <InputAdornment position="end">â‚¬</InputAdornment> }}
                            fullWidth
                        />

                        {mode === 'pantry' && (
                            <>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                        Location
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={form.location} exclusive
                                        onChange={(_, v) => v && set('location', v)}
                                        size="small" fullWidth
                                    >
                                        {LOCATIONS.map(({ value, label, icon }) => (
                                            <ToggleButton key={value} value={value} sx={{ gap: 0.5, flex: 1 }}>
                                                {icon}
                                                <Typography variant="caption">{label}</Typography>
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Box>

                                <TextField
                                    label="Expiry date" value={form.expiry_date}
                                    onChange={(e) => set('expiry_date', e.target.value)}
                                    type="date" size="small" fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <PhotoCaptureButton
                                                    tooltip="Photograph expiry date"
                                                    onCapture={ocrExpiryDate}
                                                    onResult={(iso) => iso && set('expiry_date', iso)}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </>
                        )}

                        <Divider flexItem />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                label="Nutri-Score" value={form.nutriscore}
                                onChange={(e) => set('nutriscore', e.target.value.toLowerCase())}
                                select size="small" sx={{ flex: 1 }}
                            >
                                <MenuItem value=""><em>Unknown</em></MenuItem>
                                {NUTRI_GRADES.map(g => (
                                    <MenuItem key={g} value={g}>{g.toUpperCase()}</MenuItem>
                                ))}
                            </TextField>
                            <PhotoCaptureButton
                                tooltip="Photograph Nutri-Score" size="medium"
                                onCapture={ocrNutriScore}
                                onResult={(grade) => grade && set('nutriscore', grade)}
                            />
                        </Box>

                        <Box>
                            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">Labels</Typography>
                                <PhotoCaptureButton
                                    tooltip="Photograph labels"
                                    onCapture={ocrLabels}
                                    onResult={(tags) => {
                                        if (Array.isArray(tags) && tags.length) {
                                            setForm(f => ({
                                                ...f,
                                                labels: [...new Set([...f.labels, ...tags])],
                                            }))
                                        }
                                    }}
                                />
                            </Stack>
                            <Stack direction="row" gap={0.5} flexWrap="wrap">
                                {form.labels.length === 0 && (
                                    <Typography variant="caption" color="text.disabled">
                                        none â€” add from OFF or photograph
                                    </Typography>
                                )}
                                {form.labels.map(tag => (
                                    <Chip
                                        key={tag} size="small" label={tag.replace(/^en:/, '')}
                                        onDelete={() => set('labels', form.labels.filter(l => l !== tag))}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        <Box>
                            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Nutrition (per 100 g)
                                </Typography>
                                <PhotoCaptureButton
                                    tooltip="Photograph nutrition facts"
                                    onCapture={ocrNutritionFacts}
                                    onResult={(facts) => facts && set('nutrition', facts)}
                                />
                            </Stack>
                            {form.nutrition ? (
                                <Stack direction="row" gap={0.5} flexWrap="wrap">
                                    {Object.entries(form.nutrition)
                                        .filter(([, v]) => v != null)
                                        .map(([k, v]) => (
                                            <Chip key={k} size="small"
                                                label={`${k.replace(/_/g, ' ')}: ${v}`} />
                                        ))}
                                </Stack>
                            ) : (
                                <Typography variant="caption" color="text.disabled">
                                    none â€” auto-fills from EAN or photograph
                                </Typography>
                            )}
                        </Box>

                        {mode === 'list' && (
                            <TextField
                                label="Notes" value={form.notes}
                                onChange={(e) => set('notes', e.target.value)}
                                size="small" fullWidth
                                placeholder="e.g. organic, 2% fat"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={saving}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving || !form.name.trim()}>
                        {saving ? 'Saving…' : (isEdit ? 'Save' : 'Add')}
                    </Button>
                </DialogActions>
            </Dialog>

            <BarcodeScannerDialog
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onDetected={(code) => { setScannerOpen(false); handleEan(code) }}
            />
        </>
    )
}
