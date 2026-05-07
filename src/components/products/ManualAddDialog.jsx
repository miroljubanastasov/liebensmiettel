import { useState, useCallback, useEffect, useMemo } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, MenuItem, InputAdornment, Autocomplete,
    ToggleButton, ToggleButtonGroup, Typography, Chip, Divider, Stack,
    CircularProgress, Tooltip, IconButton, Alert,
} from '@mui/material'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import KitchenIcon from '@mui/icons-material/Kitchen'
import InventoryIcon from '@mui/icons-material/Inventory'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import { lookupEAN, upsertProduct } from '../../lib/openFoodFacts'
import { listStores, listStoreChains, upsertStore, findChainByName } from '../../lib/stores'
import {
    ocrExpiryDate, ocrNutriScore, ocrNutritionFacts, ocrLabels,
} from '../../lib/photoOcr'
import { listTopBrands, getPrivateLabelsFor } from '../../lib/brands'
import { suggestExpiryDate, getShelfLifeDays } from '../../data/shelfLife'
import { useRecentEntries, pickRecentBrands, pickRecentStoreIds } from '../../hooks/useRecentEntries'
import BarcodeScannerDialog from './BarcodeScannerDialog'
import PhotoCaptureButton from './PhotoCaptureButton'
import { StoreStrip } from './StorePicker'
import ProductPicker from './ProductPicker'

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
    store_id: null, store_name: '', store_chain_id: null,
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
    initial = null,
}) {
    const isEdit = !!entry
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [fieldError, setFieldError] = useState('')
    const [scannerOpen, setScannerOpen] = useState(false)
    const [eanLoading, setEanLoading] = useState(false)
    const [stores, setStores] = useState([])
    const [storeChains, setStoreChains] = useState([])

    // ── Recent entries for cross-field suggestions ────────────────────────
    const { entries: recentEntries } = useRecentEntries({ enabled: open })

    // Most-used store ids, used to rank tiles in the picker.
    const recentStoreIds = useMemo(
        () => pickRecentStoreIds(recentEntries),
        [recentEntries],
    )

    // Currently selected store object, kept locally so we can render the
    // picker trigger with chain logo and pass `chain_data` through to the
    // picker for highlighting the active tile.
    const selectedStore = useMemo(
        () => (form.store_id ? stores.find((s) => s.id === form.store_id) ?? null : null),
        [form.store_id, stores],
    )

    // ── Detected retailer chain for the currently selected store ──────────
    const currentChainId = useMemo(() => {
        if (form.store_chain_id) return form.store_chain_id
        const storeObj = form.store_id ? stores.find((s) => s.id === form.store_id) : null
        const rawName = storeObj?.chain_data?.name || storeObj?.name || form.store_name || ''
        return findChainByName(rawName)?.id ?? null
    }, [form.store_id, form.store_name, form.store_chain_id, stores])

    // ── Product-name options: generics + recent (user history) + catalogue ───
    // (Browsing now happens inside ProductPicker; nothing to compute here.)

    // ── Brand options: private labels for current chain + top brands + recent
    const brandOptions = useMemo(() => {
        const out = []
        const seen = new Set()
        const push = (name, group) => {
            if (!name) return
            const key = name.toLowerCase()
            if (seen.has(key)) return
            seen.add(key)
            out.push({ label: name, group })
        }
        if (currentChainId) {
            for (const b of getPrivateLabelsFor(currentChainId)) push(b.name, 'Eigenmarken')
        }
        for (const b of pickRecentBrands(recentEntries)) push(b, 'Zuletzt verwendet')
        for (const b of listTopBrands(400)) push(b.name, 'Marken')
        return out
    }, [currentChainId, recentEntries])

    // ── Subcategory ────────────────────────────────────────────────────────────
    // (Selection happens inside ProductPicker; no separate options memo.)

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
    const reset = () => { setForm(EMPTY); setFieldError('') }
    const handleClose = () => { reset(); onClose() }

    useEffect(() => {
        if (!open) return
        listStores().then((rows) => setStores(rows ?? []))
        listStoreChains().then((rows) => setStoreChains(rows ?? []))
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
            store_name: entry.store_name ?? entry.store?.name ?? '',
            store_chain_id: entry.store?.chain_id ?? entry.store?.chain_data?.id ?? null,
            price: entry.price != null ? String(entry.price) : '',
            nutriscore: entry.nutriscore ?? '',
            labels: entry.labels ?? [],
            nutrition: entry.nutrition ?? null,
            notes: entry.notes ?? '',
        })
    }, [open, entry])

    // Prefill from `initial` when adding (not editing). Used when the FAB
    // opens the product picker first and lands here with a product picked.
    useEffect(() => {
        if (!open || entry || !initial) return
        setForm((f) => ({
            ...f,
            name: initial.name ?? f.name,
            category: initial.category ?? f.category,
            subcategory: initial.subcategory ?? f.subcategory,
            unit: initial.unit ?? f.unit,
            quantity: initial.defaultQty != null ? String(initial.defaultQty) : f.quantity,
            ean: initial.ean ?? f.ean,
            store_id: initial.store_id ?? f.store_id,
            store_name: initial.store_name ?? f.store_name,
            store_chain_id: initial.store_chain_id ?? f.store_chain_id,
        }))
    }, [open, entry, initial])

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

    // Suggest expiry_date from typical shelf-life for current category/subcategory/location.
    const suggestedShelfLifeDays = useMemo(
        () => getShelfLifeDays({
            category: form.category,
            subcategory: form.subcategory,
            location: form.location,
        }),
        [form.category, form.subcategory, form.location],
    )
    const handleSuggestExpiry = useCallback(() => {
        const iso = suggestExpiryDate({
            category: form.category,
            subcategory: form.subcategory,
            location: form.location,
        })
        if (iso) set('expiry_date', iso)
    }, [form.category, form.subcategory, form.location])

    const handleSave = async () => {
        if (!form.name.trim()) { setFieldError('Name is required'); return }
        setSaving(true)

        let storeId = form.store_id
        if (!storeId && form.store_name.trim()) {
            const created = await upsertStore({
                name: form.store_name.trim(),
                chain_id: form.store_chain_id ?? null,
            })
            storeId = created?.id ?? null
            if (!storeId) {
                setSaving(false)
                setFieldError(`Could not save store "${form.store_name.trim()}". Check console for details.`)
                return
            }
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

                        {fieldError && (
                            <Alert severity="error" onClose={() => setFieldError('')}>
                                {fieldError}
                            </Alert>
                        )}

                        {mode === 'pantry' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<QrCodeScannerIcon />}
                                    onClick={() => setScannerOpen(true)}
                                    fullWidth
                                    disabled={eanLoading}
                                >
                                    {form.ean ? `Scan again (${form.ean})` : 'Scan barcode to add product'}
                                </Button>
                                <TextField
                                    label="EAN / Barcode"
                                    value={form.ean}
                                    onChange={(e) => set('ean', e.target.value)}
                                    onBlur={() => form.ean && handleEan(form.ean)}
                                    size="small" fullWidth
                                    placeholder="…or enter manually"
                                    InputProps={{
                                        endAdornment: eanLoading ? (
                                            <InputAdornment position="end">
                                                <CircularProgress size={18} />
                                            </InputAdornment>
                                        ) : null,
                                    }}
                                />
                            </Box>
                        )}

                        <ProductPicker
                            label="Produkt *"
                            placeholder="Tap to choose product…"
                            value={{
                                name: form.name,
                                category: form.category || null,
                                subcategory: form.subcategory || null,
                            }}
                            onChange={(v) => {
                                setForm((f) => ({
                                    ...f,
                                    name: v.name || f.name,
                                    category: v.category ?? f.category,
                                    subcategory: v.subcategory ?? f.subcategory ?? '',
                                    unit: v.unit || f.unit,
                                    quantity: v.defaultQty != null && (!f.quantity || f.quantity === '1')
                                        ? String(v.defaultQty)
                                        : f.quantity,
                                }))
                                setFieldError('')
                            }}
                            recentEntries={recentEntries}
                            error={!!fieldError}
                            helperText={fieldError}
                        />

                        <Autocomplete
                            freeSolo
                            size="small"
                            fullWidth
                            autoHighlight
                            options={brandOptions}
                            groupBy={(o) => o.group || ''}
                            getOptionLabel={(o) => typeof o === 'string' ? o : (o?.label ?? '')}
                            filterOptions={(opts, state) => {
                                const q = state.inputValue.trim().toLowerCase()
                                if (!q) return opts.slice(0, 50)
                                return opts.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 50)
                            }}
                            value={form.brand}
                            onChange={(_, v) => {
                                if (typeof v === 'string') set('brand', v)
                                else if (v) set('brand', v.label)
                                else set('brand', '')
                            }}
                            onInputChange={(_, v, reason) => {
                                if (reason === 'input' || reason === 'clear') set('brand', v)
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Brand" />
                            )}
                            // Grocery list mode keeps the form lean: product +
                            // quantity + store only. Brand is pantry-only.
                            sx={{ display: mode === 'pantry' ? undefined : 'none' }}
                        />

                        {/* Category / Subcategory are managed inside ProductPicker.
                            They remain editable by reopening the picker. */}

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

                        {/* Store is selected via the rolling strip pinned at
                            the bottom of the dialog — see below DialogContent. */}

                        {mode === 'pantry' && (
                            <TextField
                                label="Price" value={form.price}
                                onChange={(e) => set('price', e.target.value)}
                                type="number" size="small"
                                inputProps={{ min: 0, step: 0.01 }}
                                InputProps={{ endAdornment: <InputAdornment position="end">â‚¬</InputAdornment> }}
                                fullWidth
                            />
                        )}

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
                                    helperText={suggestedShelfLifeDays != null && !form.expiry_date
                                        ? `typisch ~${suggestedShelfLifeDays} Tage`
                                        : ' '}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {suggestedShelfLifeDays != null && (
                                                    <Tooltip title={`Vorschlag: heute + ${suggestedShelfLifeDays} Tage`}>
                                                        <IconButton size="small" onClick={handleSuggestExpiry}>
                                                            <EventAvailableIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
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

                        {mode === 'pantry' && (
                            <>
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
                            </>
                        )}
                    </Box>
                </DialogContent>
                {/* Always-visible store selector pinned at the bottom of the
                    dialog — single rolling strip with circular logos, recents
                    first, plus a default "Custom…" tile. */}
                <Box
                    sx={{
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        px: 1.5, pt: 1, pb: 0.5,
                        bgcolor: 'background.paper',
                    }}
                >
                    <StoreStrip
                        label="Store"
                        value={{
                            store_id: form.store_id,
                            store_name: form.store_name,
                            chain_id: form.store_chain_id,
                            chain_data: selectedStore?.chain_data ?? null,
                        }}
                        onChange={(v) => setForm((f) => ({
                            ...f,
                            store_id: v.store_id ?? null,
                            store_name: v.store_name ?? '',
                            store_chain_id: v.chain_id ?? null,
                        }))}
                        stores={stores}
                        storeChains={storeChains}
                        recentStoreIds={recentStoreIds}
                    />
                </Box>
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
