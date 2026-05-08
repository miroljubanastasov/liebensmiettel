import { useEffect, useMemo, useState } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, TextField, InputAdornment, IconButton,
    Button, ButtonBase, Stack, Breadcrumbs, Link as MUILink,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import BarcodeScannerDialog from './BarcodeScannerDialog'
import { CATEGORIES } from '../../utils/classify'
import {
    getSubcategoriesForCategory,
    getCategoryIcon,
    getSubcategoryIcon,
} from '../../data/subcategories'
import {
    getGenericsForSubcategory,
    getGenericByName,
} from '../../data/productCatalogue'
import { getProductIcon } from '../../data/productIcons'
import { openMojiBlackUrl } from '../../utils/emojiCodepoint'
import { StoreStrip } from './StorePicker'

// Steps: 'category' → 'subcategory' → 'product' → 'custom'
const STEP_CATEGORY = 'category'
const STEP_SUBCATEGORY = 'subcategory'
const STEP_PRODUCT = 'product'
const STEP_CUSTOM = 'custom'

/**
 * Render an OpenMoji glyph as a monochrome mask, matching ProductAvatar.
 * Returns null if no hex was resolved.
 */
function GlyphMask({ hex, size = 36, color = 'text.primary' }) {
    if (!hex) return null
    const url = openMojiBlackUrl(hex)
    return (
        <Box
            aria-hidden
            sx={{
                width: size, height: size,
                bgcolor: color,
                WebkitMaskImage: `url(${url})`,
                maskImage: `url(${url})`,
                WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center', maskPosition: 'center',
                WebkitMaskSize: 'contain', maskSize: 'contain',
            }}
        />
    )
}

function GridTile({ icon, label, sublabel, selected, dashed, onClick }) {
    return (
        <ButtonBase
            onClick={onClick}
            focusRipple
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 0.25,
                p: 0.25,
                borderRadius: 1.5,
                width: '100%',
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: dashed ? '1px dashed' : '1px solid',
                    borderColor: selected ? 'primary.main' : 'divider',
                    backgroundColor: selected ? 'action.selected' : 'background.paper',
                    transition: 'border-color .15s, background-color .15s',
                    '.MuiButtonBase-root:hover &': {
                        borderColor: 'primary.light',
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                {icon}
            </Box>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: selected ? 700 : 500,
                    fontSize: 11,
                    lineHeight: 1.15,
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {label}
            </Typography>
            {sublabel && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        fontSize: 9,
                        lineHeight: 1.1,
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {sublabel}
                </Typography>
            )}
        </ButtonBase>
    )
}

/**
 * Compute a usage rank for ranking tiles. Items with lower rank surface first.
 * recentMap maps a key → 0-based first-seen index in user history.
 */
function rankBy(map, key) {
    return map.has(key) ? map.get(key) : Infinity
}

/**
 * Modal product picker: Category → Subcategory → Generic product (or Custom).
 *
 * onSelect receives:
 *   { name: string, category: string|null, subcategory: string|null,
 *     unit: string|null, defaultQty: number|null }
 *
 * Users can confirm the current intermediate selection (category/subcategory)
 * directly, without drilling down to a concrete generic product.
 */
export function ProductPickerDialog({
    open,
    onClose,
    onSelect,
    recentEntries = [],
    initialCategory = null,
    initialSubcategory = null,
    initialName = '',
    // Store selection rendered as a sticky bottom strip. Optional — when
    // these props are not provided, the strip is hidden.
    stores = [],
    storeChains = [],
    recentStoreIds = [],
    initialStore = null, // { store_id, store_name, chain_id, chain_data }
    onScan = null, // (code) => void — when provided, shows a Scan button at the top
}) {
    const [step, setStep] = useState(STEP_CATEGORY)
    const [category, setCategory] = useState(null)
    const [subcategory, setSubcategory] = useState(null)
    const [query, setQuery] = useState('')
    const [customName, setCustomName] = useState('')
    const [store, setStore] = useState(initialStore)
    const [scannerOpen, setScannerOpen] = useState(false)

    // Reset when opened. If a category/subcategory is already set on the
    // entry being edited, jump straight to the relevant step so users don't
    // have to redo the wizard for tweaks.
    useEffect(() => {
        if (!open) return
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot reset on dialog open
        setQuery('')
        setCustomName(initialName ?? '')
        setStore(initialStore)
        if (initialSubcategory && initialCategory) {
            setCategory(initialCategory)
            setSubcategory(initialSubcategory)
            setStep(STEP_PRODUCT)
        } else if (initialCategory) {
            setCategory(initialCategory)
            setSubcategory(null)
            setStep(STEP_SUBCATEGORY)
        } else {
            setCategory(null)
            setSubcategory(null)
            setStep(STEP_CATEGORY)
        }
    }, [open, initialCategory, initialSubcategory, initialName])

    // Usage frequency maps from recent entries.
    const { catRank, subRank, productRank } = useMemo(() => {
        const c = new Map()
        const s = new Map()
        const p = new Map()
        recentEntries.forEach((row, idx) => {
            const cat = row?.category
            const sub = row?.subcategory
            const nm = (row?.name || '').toLowerCase()
            if (cat && !c.has(cat)) c.set(cat, idx)
            if (sub && !s.has(sub)) s.set(sub, idx)
            if (nm && !p.has(nm)) p.set(nm, idx)
        })
        return { catRank: c, subRank: s, productRank: p }
    }, [recentEntries])

    // ── Step content ─────────────────────────────────────────────────────
    const categoryItems = useMemo(() => {
        const items = CATEGORIES.map((name) => ({
            key: name,
            name,
            iconHex: getCategoryIcon(name),
            rank: rankBy(catRank, name),
        }))
        items.sort((a, b) => {
            if (a.rank !== b.rank) return a.rank - b.rank
            return a.name.localeCompare(b.name)
        })
        return items
    }, [catRank])

    const subcategoryItems = useMemo(() => {
        if (!category) return []
        const subs = getSubcategoriesForCategory(category)
        const items = subs.map((s) => ({
            key: s.id,
            name: s.name,
            iconHex: getSubcategoryIcon(s.name, category),
            rank: rankBy(subRank, s.name),
        }))
        items.sort((a, b) => {
            if (a.rank !== b.rank) return a.rank - b.rank
            return a.name.localeCompare(b.name)
        })
        return items
    }, [category, subRank])

    const productItems = useMemo(() => {
        if (!subcategory || !category) return []
        const items = getGenericsForSubcategory(subcategory).map((g) => ({
            key: g.id,
            name: g.name,
            iconHex: getProductIcon(g.name, g.category),
            unit: g.defaultUnit ?? null,
            defaultQty: g.defaultQty ?? null,
            rank: rankBy(productRank, g.name.toLowerCase()),
        }))
        items.sort((a, b) => {
            if (a.rank !== b.rank) return a.rank - b.rank
            return a.name.localeCompare(b.name)
        })
        return items
    }, [subcategory, category, productRank])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        const source =
            step === STEP_CATEGORY ? categoryItems
                : step === STEP_SUBCATEGORY ? subcategoryItems
                    : step === STEP_PRODUCT ? productItems
                        : []
        if (!q) return source
        return source.filter((it) => it.name.toLowerCase().includes(q))
    }, [step, query, categoryItems, subcategoryItems, productItems])

    // ── Handlers ─────────────────────────────────────────────────────────
    const emit = (result) => {
        // Always include the current store selection so callers can prefill
        // the manual add dialog with both product and store in one shot.
        onSelect({ ...result, store })
        onClose()
    }

    const pickCategory = (it) => {
        setCategory(it.name)
        setSubcategory(null)
        setQuery('')
        setStep(STEP_SUBCATEGORY)
    }

    const pickSubcategory = (it) => {
        setSubcategory(it.name)
        setQuery('')
        setStep(STEP_PRODUCT)
    }

    const pickProduct = (it) => {
        emit({
            name: it.name,
            category,
            subcategory,
            unit: it.unit,
            defaultQty: it.defaultQty,
        })
    }

    const goBack = () => {
        if (step === STEP_CUSTOM) {
            setStep(subcategory ? STEP_PRODUCT : (category ? STEP_SUBCATEGORY : STEP_CATEGORY))
            setQuery('')
        } else if (step === STEP_PRODUCT) {
            setSubcategory(null)
            setQuery('')
            setStep(STEP_SUBCATEGORY)
        } else if (step === STEP_SUBCATEGORY) {
            setCategory(null)
            setQuery('')
            setStep(STEP_CATEGORY)
        }
    }

    const openCustom = () => {
        setStep(STEP_CUSTOM)
    }

    const confirmCustom = () => {
        const name = customName.trim()
        if (!name) return
        // If the typed name matches a known generic, prefer its canonical
        // category/subcategory and unit/qty over whatever crumb path the
        // user happened to be browsing.
        const generic = getGenericByName(name)
        emit({
            name,
            category: generic?.category ?? category,
            subcategory: generic?.subcategory ?? subcategory,
            unit: generic?.defaultUnit ?? null,
            defaultQty: generic?.defaultQty ?? null,
        })
    }

    // Submit the current `query` as a product name directly, bypassing the
    // remaining steps. Used when the user types in the top input and presses
    // Enter — they shouldn't have to drill into category/subcategory tiles
    // just to type a name.
    const submitTypedName = () => {
        const name = query.trim()
        if (!name) return
        const generic = getGenericByName(name)
        emit({
            name,
            category: generic?.category ?? category,
            subcategory: generic?.subcategory ?? subcategory,
            unit: generic?.defaultUnit ?? null,
            defaultQty: generic?.defaultQty ?? null,
        })
    }

    const currentSelectionName = (() => {
        if (step === STEP_SUBCATEGORY) return category
        if (step === STEP_PRODUCT) return subcategory
        return null
    })()

    const confirmCurrentSelection = () => {
        if (!currentSelectionName) return
        emit({
            name: currentSelectionName,
            category,
            subcategory: step === STEP_PRODUCT ? subcategory : null,
            unit: null,
            defaultQty: null,
        })
    }

    // ── Render helpers ────────────────────────────────────────────────────
    const renderTile = (it) => {
        const selected =
            (step === STEP_CATEGORY && it.name === initialCategory)
            || (step === STEP_SUBCATEGORY && it.name === initialSubcategory)
            || (step === STEP_PRODUCT && it.name.toLowerCase() === (initialName || '').toLowerCase())
        const onClick =
            step === STEP_CATEGORY ? () => pickCategory(it)
                : step === STEP_SUBCATEGORY ? () => pickSubcategory(it)
                    : () => pickProduct(it)
        const sublabel =
            step === STEP_PRODUCT && (it.unit || it.defaultQty != null)
                ? [it.defaultQty != null && it.unit ? `${it.defaultQty} ${it.unit}` : it.unit].filter(Boolean).join(' · ')
                : null
        return (
            <GridTile
                key={it.key}
                label={it.name}
                sublabel={sublabel}
                selected={selected}
                onClick={onClick}
                icon={<GlyphMask hex={it.iconHex} size={28} />}
            />
        )
    }

    const title =
        step === STEP_CATEGORY ? 'Select category'
            : step === STEP_SUBCATEGORY ? 'Select subcategory'
                : step === STEP_PRODUCT ? 'Select product'
                    : 'Custom product name'

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {step !== STEP_CATEGORY && (
                        <IconButton size="small" onClick={goBack} edge="start">
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
                            {title}
                        </Typography>
                        {(category || subcategory) && (
                            <Breadcrumbs separator="›" sx={{ mt: 0.25 }}>
                                {category && (
                                    <MUILink
                                        component="button"
                                        type="button"
                                        underline="hover"
                                        color={step === STEP_CATEGORY ? 'text.primary' : 'inherit'}
                                        onClick={() => {
                                            setSubcategory(null)
                                            setStep(STEP_SUBCATEGORY)
                                            setQuery('')
                                        }}
                                        sx={{ fontSize: 12 }}
                                    >
                                        {category}
                                    </MUILink>
                                )}
                                {subcategory && (
                                    <Typography variant="caption" color="text.primary">
                                        {subcategory}
                                    </Typography>
                                )}
                            </Breadcrumbs>
                        )}
                    </Box>
                </DialogTitle>
                <DialogContent dividers sx={{ pt: 1.5 }}>
                    {step !== STEP_CUSTOM && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1.5 }}>
                            <TextField
                                size="small"
                                fullWidth
                                label="Product name"
                                placeholder={
                                    step === STEP_CATEGORY ? 'Type name or filter categories…'
                                        : step === STEP_SUBCATEGORY ? 'Type name or filter subcategories…'
                                            : 'Type name or filter products…'
                                }
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        submitTypedName()
                                    }
                                }}
                                helperText={query ? 'Press Enter to use this name directly' : ' '}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: query ? (
                                        <InputAdornment position="end">
                                            <Button size="small" onClick={submitTypedName} sx={{ minWidth: 0, mr: 0.5 }}>Use</Button>
                                            <IconButton size="small" onClick={() => setQuery('')}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                }}
                            />
                            {onScan && (
                                <IconButton
                                    onClick={() => setScannerOpen(true)}
                                    sx={{
                                        mt: 0.25,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        color: 'primary.main',
                                    }}
                                    title="Scan barcode"
                                >
                                    <QrCodeScannerIcon />
                                </IconButton>
                            )}
                        </Box>
                    )}

                    {step === STEP_CUSTOM ? (
                        <Stack gap={1.5}>
                            <Typography variant="body2" color="text.secondary">
                                Type any product name. Category{' '}
                                <b>{category ?? '—'}</b>
                                {subcategory ? <> / <b>{subcategory}</b></> : null} will be applied.
                            </Typography>
                            <TextField
                                size="small"
                                fullWidth
                                label="Product name"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        confirmCustom()
                                    }
                                }}
                            />
                            <Stack direction="row" gap={1} justifyContent="flex-end">
                                <Button onClick={goBack}>Back</Button>
                                <Button
                                    variant="contained"
                                    disabled={!customName.trim()}
                                    onClick={confirmCustom}
                                >Use</Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
                                    gap: 0.5,
                                }}
                            >
                                {/* Custom-name tile is always available, surfaced first on the
                                product step (where typing a name is most natural) and last
                                on category/subcategory steps. */}
                                {step === STEP_PRODUCT && (
                                    <GridTile
                                        label="Custom…"
                                        dashed
                                        onClick={openCustom}
                                        icon={<EditIcon sx={{ color: 'text.secondary', fontSize: 22 }} />}
                                    />
                                )}

                                {filtered.map(renderTile)}

                                {step !== STEP_PRODUCT && (
                                    <GridTile
                                        label="Custom…"
                                        dashed
                                        onClick={openCustom}
                                        icon={<EditIcon sx={{ color: 'text.secondary', fontSize: 22 }} />}
                                    />
                                )}
                            </Box>

                            {filtered.length === 0 && query && (
                                <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                                    <Typography variant="body2">
                                        No matches. Use <b>Custom…</b> to enter a name.
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>
                {/* Always-visible store selector pinned at the bottom of the
                wizard. Persists across category/subcategory/product steps so
                users can pick "where" before or after "what". */}
                {(stores.length > 0 || storeChains.length > 0) && (
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
                            value={store ?? undefined}
                            onChange={setStore}
                            stores={stores}
                            storeChains={storeChains}
                            recentStoreIds={recentStoreIds}
                        />
                    </Box>
                )}
                <DialogActions>
                    {currentSelectionName && (
                        <Button
                            variant="contained"
                            onClick={confirmCurrentSelection}
                            aria-label={`Use ${currentSelectionName} as item name`}
                        >
                            Use “{currentSelectionName}”
                        </Button>
                    )}
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            {onScan && (
                <BarcodeScannerDialog
                    open={scannerOpen}
                    onClose={() => setScannerOpen(false)}
                    onDetected={(code) => {
                        setScannerOpen(false)
                        if (code) {
                            onScan(code)
                            onClose()
                        }
                    }}
                />
            )}
        </>
    )
}

/**
 * Field-style trigger that opens the ProductPickerDialog. Drop-in replacement
 * for the previous Autocomplete-based product-name field.
 */
export default function ProductPicker({
    value,           // { name, category, subcategory }
    onChange,        // ({ name, category, subcategory, unit, defaultQty }) => void
    recentEntries = [],
    label = 'Produkt',
    placeholder = 'Tap to choose…',
    fullWidth = true,
    error = false,
    helperText = '',
    autoOpen = false,
}) {
    const [open, setOpen] = useState(autoOpen)

    const iconHex = useMemo(() => {
        if (value?.name) {
            const generic = getGenericByName(value.name)
            if (generic) return getProductIcon(generic.name, generic.category)
        }
        if (value?.subcategory) return getSubcategoryIcon(value.subcategory, value?.category)
        if (value?.category) return getCategoryIcon(value.category)
        return null
    }, [value])

    const display = value?.name?.trim() || ''
    const sub = [value?.category, value?.subcategory].filter(Boolean).join(' · ')

    return (
        <>
            <ButtonBase
                onClick={() => setOpen(true)}
                focusRipple
                sx={{
                    width: fullWidth ? '100%' : 'auto',
                    justifyContent: 'flex-start',
                    border: '1px solid',
                    borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
                    borderRadius: 1,
                    px: 1.25,
                    py: 1,
                    minHeight: 56,
                    textAlign: 'left',
                    backgroundColor: 'background.paper',
                    position: 'relative',
                    '&:hover': { borderColor: error ? 'error.main' : 'text.primary' },
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        top: -7,
                        left: 8,
                        px: 0.5,
                        backgroundColor: 'background.paper',
                        color: error ? 'error.main' : 'text.secondary',
                        fontSize: 12,
                    }}
                >
                    {label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
                    <Box sx={{
                        width: 32, height: 32, borderRadius: '50%',
                        bgcolor: 'primary.main', color: 'primary.contrastText',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {iconHex
                            ? <GlyphMask hex={iconHex} size={20} color="currentColor" />
                            : <EditIcon sx={{ fontSize: 16 }} />}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: display ? 'text.primary' : 'text.disabled',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                fontWeight: display ? 600 : 400,
                            }}
                        >
                            {display || placeholder}
                        </Typography>
                        {sub && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: 'block', lineHeight: 1.2,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}
                            >
                                {sub}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </ButtonBase>
            {helperText && (
                <Typography
                    variant="caption"
                    sx={{ color: error ? 'error.main' : 'text.secondary', mt: 0.5, ml: 1.5 }}
                >
                    {helperText}
                </Typography>
            )}
            <ProductPickerDialog
                open={open}
                onClose={() => setOpen(false)}
                onSelect={onChange}
                recentEntries={recentEntries}
                initialCategory={value?.category ?? null}
                initialSubcategory={value?.subcategory ?? null}
                initialName={value?.name ?? ''}
            />
        </>
    )
}
