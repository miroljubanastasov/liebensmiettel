import { useState, useRef, useCallback, useMemo, useLayoutEffect, useEffect } from 'react'
import { flushSync } from 'react-dom'
import {
    Box, Typography, ListItemText, Stack,
    ListItemAvatar, IconButton, Chip, Divider,
    ListItemButton, Collapse, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    InputAdornment, ToggleButtonGroup, ToggleButton, Snackbar, Alert,
    Checkbox, Autocomplete, MenuItem,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import KitchenIcon from '@mui/icons-material/Kitchen'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import EditIcon from '@mui/icons-material/Edit'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import TopBar from '../../components/layout/TopBar'
import CategoryNav, { CATEGORY_ITEMS } from '../../components/layout/CategoryNav'
import AddProductFAB from '../../components/layout/AddProductFAB'
import SkeletonList from '../../components/layout/SkeletonList'
import ManualAddDialog from '../../components/products/ManualAddDialog'
import { ProductPickerDialog } from '../../components/products/ProductPicker'
import ProductAvatar from '../../components/products/ProductAvatar'
import NutriScoreBar from '../../components/products/NutriScoreBar'
import FoodLabels from '../../components/products/FoodLabels'
import NutritionFacts from '../../components/products/NutritionFacts'
import ReceiptImportDialog from '../../components/products/ReceiptImportDialog'
import { useProductEntries } from '../../hooks/useProductEntries'
import { useRecentEntries, pickRecentNames, pickRecentBrands, pickRecentStoreIds } from '../../hooks/useRecentEntries'
import { listStores, listStoreChains, upsertStore, findChainByName } from '../../lib/stores'
import StorePicker from '../../components/products/StorePicker'
import { listTopBrands, getPrivateLabelsFor } from '../../lib/brands'
import PRODUCT_CATALOGUE, { GENERIC_BASICS } from '../../data/productCatalogue'

const UNIT_OPTIONS = ['pc', 'g', 'kg', 'ml', 'L', 'pkg', 'bunch', 'bottle', 'can', 'box']

export default function GroceryList() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [transitioning, setTransitioning] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [pickedInitial, setPickedInitial] = useState(null)
    const [expandedId, setExpandedId] = useState(null)
    const [snack, setSnack] = useState(null) // { severity, message }
    // Filtering / sorting UI
    const [query, setQuery] = useState('')
    const [sortBy, setSortBy] = useState('added') // 'added' | 'store'
    // Multi-select: empty array = no filter (All). '__none__' sentinel
    // represents entries without any store.
    const [storeFilter, setStoreFilter] = useState([])
    const catRef = useRef(null)
    const touchStart = useRef(null)
    const touchDragging = useRef(false)
    const listRef = useRef(null)
    const { entries, loading, addEntry, updateEntry, removeEntry, patchEntry, toggleChecked, moveEntry } = useProductEntries('listed')
    const [basketOpen, setBasketOpen] = useState(false)
    const [receiptOpen, setReceiptOpen] = useState(false)
    const [quantityDrafts, setQuantityDrafts] = useState({})
    const [unitDrafts, setUnitDrafts] = useState({})
    const [nameDrafts, setNameDrafts] = useState({})
    const [brandDrafts, setBrandDrafts] = useState({})
    const [stores, setStores] = useState([])
    const [storeChains, setStoreChains] = useState([])

    // Delete confirmation dialog
    const [deleteEntry_, setDeleteEntry] = useState(null)

    useEffect(() => {
        listStores().then((rows) => setStores(rows ?? []))
        listStoreChains().then((rows) => setStoreChains(rows ?? []))
    }, [])

    // ── Recent entries + cross-field suggestions (names / brands) ─────────
    const { entries: recentEntries } = useRecentEntries({ enabled: true })

    // Most-used store ids drive the StorePicker tile order.
    const recentStoreIds = useMemo(
        () => pickRecentStoreIds(recentEntries),
        [recentEntries],
    )

    // Base brand list (recent + top brands). Private labels are prepended
    // per-row because they depend on the row's store chain.
    const brandOptionsBase = useMemo(() => {
        const out = []
        const seen = new Set()
        const push = (name, group) => {
            if (!name) return
            const key = name.toLowerCase()
            if (seen.has(key)) return
            seen.add(key)
            out.push({ label: name, group })
        }
        for (const b of pickRecentBrands(recentEntries)) push(b, 'Zuletzt verwendet')
        for (const b of listTopBrands(400)) push(b.name, 'Marken')
        return out
    }, [recentEntries])

    const getNameOptions = useCallback((category) => {
        const basics = GENERIC_BASICS
            .filter((p) => !category || p.category === category)
            .map((p) => ({
                kind: 'basic',
                label: p.name,
                name: p.name,
                brand: '',
                category: p.category,
                subcategory: p.subcategory || '',
                unit: p.defaultUnit || null,
                defaultQty: p.defaultQty ?? null,
                group: 'Basis',
            }))
        const basicKeys = new Set(basics.map((b) => b.name.toLowerCase()))
        const recent = pickRecentNames(recentEntries, { category: category || null })
            .filter((r) => !basicKeys.has((r.name || '').toLowerCase()))
            .map((r) => ({
                kind: 'recent',
                label: r.name,
                name: r.name,
                brand: r.brand || '',
                category: r.category || category || '',
                subcategory: r.subcategory || '',
                unit: r.unit || null,
                defaultQty: null,
                group: 'Zuletzt verwendet',
            }))
        const seen = new Set([...basicKeys, ...recent.map((r) => r.name.toLowerCase())])
        const catalogue = PRODUCT_CATALOGUE
            .filter((p) => !category || p.category === category)
            .filter((p) => !seen.has(p.name.toLowerCase()))
            .map((p) => ({
                kind: 'catalogue',
                label: p.name,
                name: p.name,
                brand: '',
                category: p.category,
                subcategory: p.subcategory || '',
                unit: p.defaultUnit || null,
                defaultQty: p.defaultQty ?? null,
                group: 'Katalog',
            }))
        return [...basics, ...recent, ...catalogue]
    }, [recentEntries])

    const getBrandOptions = useCallback((chainId) => {
        if (!chainId) return brandOptionsBase
        const out = []
        const seen = new Set()
        for (const b of getPrivateLabelsFor(chainId)) {
            const key = b.name.toLowerCase()
            if (seen.has(key)) continue
            seen.add(key)
            out.push({ label: b.name, group: 'Eigenmarken' })
        }
        for (const o of brandOptionsBase) {
            const key = o.label.toLowerCase()
            if (seen.has(key)) continue
            seen.add(key)
            out.push(o)
        }
        return out
    }, [brandOptionsBase])

    const handleDelete = async () => {
        if (!deleteEntry_) return
        await removeEntry(deleteEntry_.id)
        setDeleteEntry(null)
    }

    const saveQuantity = async (entry) => {
        const raw = quantityDrafts[entry.id]
        if (raw == null) return
        const qty = Number.parseFloat(raw)
        if (Number.isNaN(qty) || qty <= 0) return
        if (qty === Number(entry.quantity ?? 0)) return
        await updateEntry(entry.id, { quantity: qty })
    }

    // Picker-driven store selection: applies a structured selection from
    // StorePicker (supports None, an existing store, a chain that needs
    // upsert, or a freeform custom name).
    const applyStoreSelection = async (entry, sel) => {
        const currentId = entry.store_id ?? entry.store?.id ?? null
        let storeId = sel.store_id ?? null
        let storeRow = null

        if (storeId) {
            storeRow = stores.find((s) => s.id === storeId)
                ?? (sel.chain_data
                    ? { id: storeId, name: sel.store_name, chain_id: sel.chain_id, chain_data: sel.chain_data }
                    : null)
        } else if (sel.store_name?.trim()) {
            const next = sel.store_name.trim()
            const found = stores.find((s) => (s.name ?? '').trim().toLowerCase() === next.toLowerCase())
            if (found?.id) {
                storeId = found.id
                storeRow = found
            } else {
                const chain = sel.chain_data
                    ?? storeChains.find((c) => (c.name ?? '').trim().toLowerCase() === next.toLowerCase())
                    ?? null
                const created = await upsertStore({ name: next, chain_id: chain?.id ?? sel.chain_id ?? null })
                storeId = created?.id ?? null
                if (created) {
                    storeRow = { ...created, chain_data: chain ?? null }
                    setStores((prev) => {
                        if (prev.some((s) => s.id === created.id)) return prev
                        return [...prev, storeRow]
                    })
                }
            }
        }

        if (storeId === currentId) return
        await updateEntry(entry.id, { store_id: storeId })
        patchEntry(entry.id, { store: storeRow })
    }

    const saveUnit = async (entry) => {
        const raw = unitDrafts[entry.id]
        if (raw == null) return
        const unit = raw.trim()
        const current = (entry.unit ?? '').trim()
        if (unit === current) return
        await updateEntry(entry.id, { unit: unit || null })
    }

    const saveName = async (entry) => {
        const raw = nameDrafts[entry.id]
        if (raw == null) return
        const name = raw.trim()
        const current = (entry.name ?? '').trim()
        if (!name || name === current) return
        await updateEntry(entry.id, { name })
    }

    const saveBrand = async (entry) => {
        const raw = brandDrafts[entry.id]
        if (raw == null) return
        const brand = raw.trim()
        const current = (entry.brand ?? '').trim()
        if (brand === current) return
        await updateEntry(entry.id, { brand: brand || null })
    }

    const toggleExpand = (id) => setExpandedId((prev) => prev === id ? null : id)

    const handleAdd = (method) => {
        if (method === 'item') {
            setPickedInitial(null)
            setPickerOpen(true)
        }
        else if (method === 'basket') setBasketOpen(true)
    }

    const handlePickerSelect = (sel) => {
        // sel: { name, category, subcategory, unit, defaultQty, store }
        const { store, ...rest } = sel
        setPickedInitial({
            ...rest,
            store_id: store?.store_id ?? null,
            store_name: store?.store_name ?? '',
            store_chain_id: store?.chain_id ?? null,
        })
        setPickerOpen(false)
        setDialogOpen(true)
    }

    const handleAddDialogClose = () => {
        setDialogOpen(false)
        setPickedInitial(null)
    }

    const handleCatSlideStart = useCallback(() => {
        setTransitioning(true)
    }, [])

    const handleCatSlideChange = useCallback((swiper) => {
        setActiveIndex(swiper.realIndex)
        setTransitioning(false)
    }, [])

    const touchAxis = useRef(null)

    const handleTouchStart = useCallback((e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        touchDragging.current = false
        touchAxis.current = null
    }, [])

    const handleTouchMove = useCallback((e) => {
        if (touchStart.current === null || !listRef.current) return
        if (touchAxis.current === 'y') return
        const dx = touchStart.current.x - e.touches[0].clientX
        const dy = touchStart.current.y - e.touches[0].clientY
        if (touchAxis.current === null) {
            const ax = Math.abs(dx)
            const ay = Math.abs(dy)
            if (ax < 8 && ay < 8) return
            touchAxis.current = ax > ay ? 'x' : 'y'
            if (touchAxis.current === 'y') return
        }
        touchDragging.current = true
        const clamped = Math.max(-120, Math.min(120, -dx))
        listRef.current.style.transform = `translateX(${clamped}px)`
    }, [])

    const handleTouchEnd = useCallback((e) => {
        if (touchStart.current === null || !listRef.current) return
        const wasHorizontal = touchAxis.current === 'x'
        const diff = touchStart.current.x - e.changedTouches[0].clientX
        touchStart.current = null
        touchAxis.current = null
        if (!wasHorizontal) {
            touchDragging.current = false
            return
        }
        const el = listRef.current
        if (Math.abs(diff) > 50) {
            const exitX = diff > 0 ? '-100%' : '100%'
            const enterX = diff > 0 ? '60px' : '-60px'
            const anim = el.animate(
                [{ transform: el.style.transform }, { transform: `translateX(${exitX})` }],
                { duration: 120, easing: 'ease-in' },
            )
            anim.onfinish = () => {
                if (diff > 0) catRef.current?.slideNext(250)
                else catRef.current?.slidePrev(250)
                flushSync(() => setActiveIndex(catRef.current?.realIndex ?? 0))
                el.style.transform = ''
                el.animate(
                    [{ transform: `translateX(${enterX})` }, { transform: 'translateX(0)' }],
                    { duration: 120, easing: 'ease-out' },
                )
            }
        } else {
            el.animate(
                [{ transform: el.style.transform }, { transform: 'translateX(0)' }],
                { duration: 120, easing: 'ease-out' },
            )
            el.style.transform = ''
        }
        touchDragging.current = false
    }, [])

    const activeCat = CATEGORY_ITEMS[activeIndex]

    // Navbar height measurement (same pattern as Pantry)
    const navbarRef = useRef(null)
    const [navbarHeight, setNavbarHeight] = useState(0)
    useLayoutEffect(() => {
        if (!navbarRef.current) return
        const el = navbarRef.current
        const ro = new ResizeObserver(() => setNavbarHeight(el.offsetHeight))
        ro.observe(el)
        setNavbarHeight(el.offsetHeight)
        return () => ro.disconnect()
    }, [loading])

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase()
        let list = entries
        if (activeCat !== 'All') {
            list = list.filter((e) => e.category === activeCat)
        }
        if (storeFilter.length > 0) {
            const set = new Set(storeFilter.map((s) => s.toLowerCase()))
            const matchNone = set.has('__none__')
            list = list.filter((e) => {
                const name = (e.store?.chain_data?.name ?? e.store?.chain ?? e.store?.name ?? '').trim()
                if (!name) return matchNone
                return set.has(name.toLowerCase())
            })
        }
        if (q) {
            list = list.filter((e) => {
                const hay = [
                    e.name, e.brand, e.subcategory, e.category,
                    e.location, e.ean, e.notes,
                ].filter(Boolean).join(' ').toLowerCase()
                return hay.includes(q)
            })
        }
        // Hide purchased (checked) items from the main list.
        list = list.filter((e) => !e.checked)
        return [...list].sort((a, b) => {
            if (sortBy === 'added') {
                // Newest first: listed_at, then created_at as fallback.
                const av = a.listed_at ?? a.created_at ?? ''
                const bv = b.listed_at ?? b.created_at ?? ''
                if (av === bv) return (a.name ?? '').localeCompare(b.name ?? '')
                return av < bv ? 1 : -1
            }
            // 'store': chain/store name ascending, unknown stores last.
            const aStore = (a.store?.chain_data?.name ?? a.store?.chain ?? a.store?.name ?? '').trim().toLowerCase()
            const bStore = (b.store?.chain_data?.name ?? b.store?.chain ?? b.store?.name ?? '').trim().toLowerCase()
            if (aStore && bStore && aStore !== bStore) {
                return aStore.localeCompare(bStore)
            }
            if (!aStore && bStore) return 1
            if (aStore && !bStore) return -1
            return (a.name ?? '').localeCompare(b.name ?? '')
        })
    }, [entries, activeCat, query, sortBy, storeFilter])

    // Distinct store/chain names present in the current listed entries,
    // used to populate the store filter dropdown.
    const storeFilterOptions = useMemo(() => {
        const names = new Set()
        let hasNoStore = false
        for (const e of entries) {
            if (e.checked) continue
            const name = (e.store?.chain_data?.name ?? e.store?.chain ?? e.store?.name ?? '').trim()
            if (name) names.add(name)
            else hasNoStore = true
        }
        return {
            names: [...names].sort((a, b) => a.localeCompare(b)),
            hasNoStore,
        }
    }, [entries])

    const purchasedItems = useMemo(
        () => entries.filter((e) => e.checked),
        [entries],
    )

    const moveToPantry = useCallback(async (entry) => {
        const ok = await moveEntry(entry.id, 'in_pantry', {
            shelved_at: new Date().toISOString(),
            checked: false,
        })
        if (ok) setSnack({ severity: 'success', message: `${entry.name} added to pantry` })
    }, [moveEntry])

    const moveAllToPantry = useCallback(async () => {
        const now = new Date().toISOString()
        for (const entry of purchasedItems) {
            await moveEntry(entry.id, 'in_pantry', { shelved_at: now, checked: false })
        }
        if (purchasedItems.length > 0) {
            setSnack({ severity: 'success', message: `${purchasedItems.length} item(s) added to pantry` })
        }
    }, [purchasedItems, moveEntry])

    const clearPurchased = useCallback(async () => {
        for (const entry of purchasedItems) {
            await removeEntry(entry.id)
        }
    }, [purchasedItems, removeEntry])

    // Apply a parsed receipt: update matched basket entries with
    // price/store/purchased_at, and add unmatched items as new checked
    // (purchased) basket entries so "All to pantry" picks them up.
    const applyReceipt = useCallback(async ({ matched, newItems, storeRow }) => {
        let updatedCount = 0
        for (const m of matched) {
            const ok = await updateEntry(m.entryId, m.fields)
            if (ok) {
                updatedCount++
                if (storeRow) patchEntry(m.entryId, { store: storeRow })
            }
        }
        let addedCount = 0
        for (const it of newItems) {
            const res = await addEntry({ ...it, checked: true, entry_source: 'receipt' })
            if (res?.ok) addedCount++
        }
        const parts = []
        if (updatedCount) parts.push(`${updatedCount} matched`)
        if (addedCount) parts.push(`${addedCount} added`)
        if (parts.length) {
            setSnack({ severity: 'success', message: `Receipt applied: ${parts.join(', ')}` })
        }
    }, [updateEntry, addEntry, patchEntry])

    const categoryCounts = useMemo(() => {
        const map = { All: entries.length }
        for (const entry of entries) {
            map[entry.category] = (map[entry.category] ?? 0) + 1
        }
        return map
    }, [entries])

    const renderItem = (entry, dim) => {
        const isOpen = expandedId === entry.id
        return (
            <Box key={entry.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper', mb: 1 }}>
                <ListItemButton
                    onClick={() => toggleExpand(entry.id)}
                    sx={{ px: 1, py: 0.75, opacity: dim ? 0.45 : 1 }}
                >
                    <Checkbox
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        checked={!!entry.checked}
                        onChange={() => toggleChecked(entry.id, !entry.checked)}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                        title={entry.checked ? 'Move back to list' : 'Mark as bought'}
                        sx={{ p: 0.5, mr: 0.5 }}
                    />
                    <ListItemAvatar sx={{ minWidth: 40, alignSelf: 'flex-start', mt: 0.5 }}>
                        <ProductAvatar name={entry.name} subcategory={entry.subcategory} category={entry.category} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Box component="span">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="body2" fontWeight={600} component="span">
                                        {entry.name}
                                    </Typography>
                                    {entry.quantity && (
                                        <Chip
                                            label={`${entry.quantity}${entry.unit ? ` ${entry.unit}` : ''}`}
                                            size="small"
                                            sx={{ fontSize: 10, height: 20, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}
                                        />
                                    )}
                                </Box>
                                {entry.brand && (
                                    <Typography variant="caption" fontWeight={300} color="text.secondary" component="div">
                                        {entry.brand}
                                    </Typography>
                                )}
                            </Box>
                        }
                        primaryTypographyProps={{ component: 'div' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 0.5 }}>
                        {entry.store?.chain_data?.logo_url && (
                            <Box
                                component="img"
                                src={entry.store.chain_data.logo_url}
                                alt={entry.store.chain_data.name ?? entry.store.name ?? 'Store'}
                                sx={{ height: 16, width: 'auto', maxWidth: 40, objectFit: 'contain' }}
                            />
                        )}
                        {isOpen ? <ExpandLessIcon sx={{ color: 'text.secondary' }} /> : <ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                    </Box>
                </ListItemButton>
                <Collapse in={isOpen} unmountOnExit>
                    <Box sx={{ px: 2, pb: 1.5, pt: 0.5 }}>
                        {/* ── Actions ── */}
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                            <IconButton size="small" title="Remove from list" sx={{ color: 'primary.main' }} onClick={(e) => { e.stopPropagation(); setDeleteEntry(entry) }}>
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Divider sx={{ mb: 0.75 }} />
                        {/* ── Info ── */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, mb: 0.5 }}>
                            <Autocomplete
                                freeSolo
                                size="small"
                                autoHighlight
                                options={getNameOptions(entry.category)}
                                groupBy={(o) => o.group || ''}
                                getOptionLabel={(o) => typeof o === 'string' ? o : (o?.label ?? '')}
                                filterOptions={(opts, state) => {
                                    const q = state.inputValue.trim().toLowerCase()
                                    if (!q) return opts.slice(0, 50)
                                    return opts.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 50)
                                }}
                                value={nameDrafts[entry.id] ?? (entry.name ?? '')}
                                onChange={(_, v) => {
                                    if (typeof v === 'string') {
                                        setNameDrafts((prev) => ({ ...prev, [entry.id]: v }))
                                    } else if (v) {
                                        const patch = { name: v.name }
                                        if (v.brand && !entry.brand) patch.brand = v.brand
                                        if (v.category && !entry.category) patch.category = v.category
                                        if (v.subcategory && !entry.subcategory) patch.subcategory = v.subcategory
                                        if (v.unit && !entry.unit) patch.unit = v.unit
                                        setNameDrafts((prev) => ({ ...prev, [entry.id]: v.name }))
                                        updateEntry(entry.id, patch)
                                    } else {
                                        setNameDrafts((prev) => ({ ...prev, [entry.id]: '' }))
                                    }
                                }}
                                onInputChange={(_, v, reason) => {
                                    if (reason === 'input' || reason === 'clear') {
                                        setNameDrafts((prev) => ({ ...prev, [entry.id]: v }))
                                    }
                                }}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} key={`${option.kind}-${option.label}`}>
                                        <Stack>
                                            <Typography variant="body2">{option.label}</Typography>
                                            {(option.subcategory || option.unit) && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {[option.subcategory, option.unit && option.defaultQty
                                                        ? `${option.defaultQty} ${option.unit}`
                                                        : option.unit].filter(Boolean).join(' · ')}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Name"
                                        onBlur={() => saveName(entry)}
                                    />
                                )}
                                sx={{ gridColumn: '1 / -1' }}
                            />
                            <Autocomplete
                                freeSolo
                                size="small"
                                autoHighlight
                                options={getBrandOptions(entry.store?.chain_id ?? findChainByName(entry.store?.name ?? '')?.id ?? null)}
                                groupBy={(o) => o.group || ''}
                                getOptionLabel={(o) => typeof o === 'string' ? o : (o?.label ?? '')}
                                filterOptions={(opts, state) => {
                                    const q = state.inputValue.trim().toLowerCase()
                                    if (!q) return opts.slice(0, 50)
                                    return opts.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 50)
                                }}
                                value={brandDrafts[entry.id] ?? (entry.brand ?? '')}
                                onChange={(_, v) => {
                                    const next = typeof v === 'string' ? v : (v?.label ?? '')
                                    setBrandDrafts((prev) => ({ ...prev, [entry.id]: next }))
                                }}
                                onInputChange={(_, v, reason) => {
                                    if (reason === 'input' || reason === 'clear') {
                                        setBrandDrafts((prev) => ({ ...prev, [entry.id]: v }))
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Brand"
                                        onBlur={() => saveBrand(entry)}
                                    />
                                )}
                                sx={{ gridColumn: '1 / -1' }}
                            />
                            <TextField
                                size="small"
                                label="Quantity"
                                type="number"
                                value={quantityDrafts[entry.id] ?? String(entry.quantity ?? '')}
                                onChange={(e) => setQuantityDrafts((prev) => ({ ...prev, [entry.id]: e.target.value }))}
                                onBlur={() => saveQuantity(entry)}
                                inputProps={{ min: 0, step: 0.5 }}
                            />
                            <Autocomplete
                                freeSolo
                                options={UNIT_OPTIONS}
                                value={unitDrafts[entry.id] ?? (entry.unit ?? '')}
                                onInputChange={(_, v) => setUnitDrafts((prev) => ({ ...prev, [entry.id]: v ?? '' }))}
                                onChange={(_, v) => setUnitDrafts((prev) => ({ ...prev, [entry.id]: v ?? '' }))}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        label="Unit"
                                        onBlur={() => saveUnit(entry)}
                                    />
                                )}
                            />
                            <Box sx={{ gridColumn: '1 / -1' }}>
                                <StorePicker
                                    label="Store"
                                    value={{
                                        store_id: entry.store_id ?? entry.store?.id ?? null,
                                        store_name: entry.store?.name ?? '',
                                        chain_id: entry.store?.chain_id ?? entry.store?.chain_data?.id ?? null,
                                        chain_data: entry.store?.chain_data ?? null,
                                    }}
                                    onChange={(sel) => applyStoreSelection(entry, sel)}
                                    stores={stores}
                                    storeChains={storeChains}
                                    recentStoreIds={recentStoreIds}
                                />
                            </Box>
                            {entry.ean && (
                                <Typography variant="caption" color="text.secondary">
                                    <b>EAN:</b> {entry.ean}
                                </Typography>
                            )}
                        </Box>
                        {entry.notes && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                <b>Notes:</b> {entry.notes}
                            </Typography>
                        )}

                        {/* ── Nutrition ── */}
                        {(entry.nutriscore || entry.ecoscore || (entry.labels && entry.labels.length > 0) || entry.nutrition) && (
                            <>
                                <Divider sx={{ my: 0.75 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Nutrition
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mt: 0.5, mb: 0.5, flexWrap: 'wrap' }}>
                                    {entry.nutriscore && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.25 }}>
                                            <NutriScoreBar score={entry.nutriscore} />
                                            <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>Nutri-Score</Typography>
                                        </Box>
                                    )}
                                    {entry.ecoscore && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.25 }}>
                                            <NutriScoreBar score={entry.ecoscore} />
                                            <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 600 }}>Eco-Score</Typography>
                                        </Box>
                                    )}
                                </Box>
                                {entry.labels && entry.labels.length > 0 && (
                                    <Box sx={{ mb: 0.5 }}>
                                        <FoodLabels labels={entry.labels} size={40} plain />
                                    </Box>
                                )}
                                <NutritionFacts nutrition={entry.nutrition} />
                            </>
                        )}

                        <Divider sx={{ my: 0.75 }} />
                    </Box>
                </Collapse>
            </Box>
        )
    }

    const renderList = (items) => {
        if (items.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>
                    No items here
                </Typography>
            )
        }
        return (
            <Box>
                {items.map((e) => renderItem(e, false))}
            </Box>
        )
    }

    const renderPurchasedRow = (entry) => (
        <Box
            key={entry.id}
            sx={{
                display: 'flex', alignItems: 'center', gap: 0.75,
                px: 1, py: 0.5,
                borderBottom: '1px solid', borderColor: 'divider',
                '&:last-of-type': { borderBottom: 'none' },
            }}
        >
            <Checkbox
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon />}
                checked
                onChange={() => toggleChecked(entry.id, false)}
                size="small"
                title="Move back to list"
                sx={{ p: 0.5 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="body2"
                    fontWeight={500}
                    noWrap
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                    {entry.name}
                </Typography>
                {(entry.quantity || entry.brand) && (
                    <Typography variant="caption" color="text.disabled" noWrap component="div">
                        {entry.quantity ? `${entry.quantity}${entry.unit ? ` ${entry.unit}` : ''}` : ''}
                        {entry.quantity && entry.brand ? ' · ' : ''}
                        {entry.brand ?? ''}
                    </Typography>
                )}
            </Box>
            {entry.store?.chain_data?.logo_url && (
                <Box
                    component="img"
                    src={entry.store.chain_data.logo_url}
                    alt={entry.store.chain_data.name ?? ''}
                    sx={{ height: 14, width: 'auto', maxWidth: 36, objectFit: 'contain', opacity: 0.7 }}
                />
            )}
            <IconButton
                size="small"
                title="Add to pantry"
                onClick={() => moveToPantry(entry)}
                sx={{ color: 'primary.main' }}
            >
                <KitchenIcon fontSize="small" />
            </IconButton>
            <IconButton
                size="small"
                title="Delete"
                onClick={() => removeEntry(entry.id)}
                sx={{ color: 'text.secondary' }}
            >
                <DeleteOutlineIcon fontSize="small" />
            </IconButton>
        </Box>
    )

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 12, overflowX: 'hidden' }}>
            {/* ── Fixed navbar: TopBar + CategoryNav + Search/Sort ── */}
            <Box
                ref={navbarRef}
                sx={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
                    bgcolor: 'background.default',
                }}
            >
                <TopBar static />
                <CategoryNav
                    static
                    activeIndex={activeIndex}
                    transitioning={transitioning}
                    onSwiper={(sw) => { catRef.current = sw }}
                    onCatSlideStart={handleCatSlideStart}
                    onCatSlideChange={handleCatSlideChange}
                    counts={categoryCounts}
                />
                <Box sx={{ px: 2, pb: 0.75, display: 'flex', gap: 0.75, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Search…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{
                            flex: 1, minWidth: 0,
                            '& .MuiInputBase-root': { height: 32, fontSize: 13 },
                            '& .MuiInputBase-input': { py: 0.25 },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                                    <SearchIcon sx={{ fontSize: 16 }} />
                                </InputAdornment>
                            ),
                            endAdornment: query ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setQuery('')} sx={{ p: 0.25 }}>
                                        <ClearIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                    />
                    <TextField
                        select
                        size="small"
                        label="Store"
                        value={storeFilter}
                        onChange={(e) => {
                            const v = e.target.value
                            setStoreFilter(typeof v === 'string' ? v.split(',') : v)
                        }}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                            multiple: true,
                            displayEmpty: true,
                            notched: true,
                            renderValue: (selected) => {
                                if (!selected || selected.length === 0) return 'All'
                                if (selected.length === 1) {
                                    return selected[0] === '__none__' ? 'No store' : selected[0]
                                }
                                return `${selected.length} stores`
                            },
                            MenuProps: { PaperProps: { sx: { maxHeight: 320 } } },
                        }}
                        sx={{
                            minWidth: 110,
                            '& .MuiInputBase-root': { height: 32, fontSize: 12 },
                            '& .MuiInputLabel-root': { fontSize: 12 },
                        }}
                    >
                        {storeFilterOptions.names.map((n) => (
                            <MenuItem key={n} value={n} sx={{ py: 0.25 }}>
                                <Checkbox
                                    size="small"
                                    checked={storeFilter.indexOf(n) > -1}
                                    sx={{ p: 0.5, mr: 0.5 }}
                                />
                                <ListItemText primary={n} primaryTypographyProps={{ fontSize: 13 }} />
                            </MenuItem>
                        ))}
                        {storeFilterOptions.hasNoStore && (
                            <MenuItem value="__none__" sx={{ py: 0.25 }}>
                                <Checkbox
                                    size="small"
                                    checked={storeFilter.indexOf('__none__') > -1}
                                    sx={{ p: 0.5, mr: 0.5 }}
                                />
                                <ListItemText primary={<em>No store</em>} primaryTypographyProps={{ fontSize: 13 }} />
                            </MenuItem>
                        )}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Sort by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        sx={{
                            minWidth: 130,
                            '& .MuiInputBase-root': { height: 32, fontSize: 12 },
                            '& .MuiInputLabel-root': { fontSize: 12 },
                        }}
                    >
                        <MenuItem value="added">Added on</MenuItem>
                        <MenuItem value="store">Store</MenuItem>
                    </TextField>
                </Box>
            </Box>

            {/* In-flow spacer */}
            <Box sx={{ height: navbarHeight }} aria-hidden />

            {loading ? (
                <Box sx={{ px: 2, pt: 1, minHeight: '60vh' }}>
                    <SkeletonList rows={7} avatarSize={32} />
                </Box>
            ) : (
                <Box
                    ref={listRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    sx={{ px: 2, pt: 1, minHeight: '60vh', willChange: 'transform' }}
                >
                    {renderList(filteredItems)}
                </Box>
            )}

            <AddProductFAB
                onAction={handleAdd}
                badgeCount={purchasedItems.length}
                actions={[
                    { key: 'item', icon: <EditIcon />, label: 'Add item' },
                ]}
                extraActions={[
                    {
                        key: 'basket',
                        icon: <ShoppingBasketIcon />,
                        label: 'Purchased basket',
                        badge: purchasedItems.length,
                    },
                ]}
            />

            {/* ── Purchased basket dialog ── */}
            <Dialog
                open={basketOpen}
                onClose={() => setBasketOpen(false)}
                fullWidth maxWidth="sm"
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                    <ShoppingBasketIcon fontSize="small" />
                    Purchased
                    <Chip
                        size="small"
                        label={purchasedItems.length}
                        sx={{ fontSize: 11, height: 20, ml: 0.5, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}
                    />
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 0 }}>
                    {purchasedItems.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            No purchased items
                        </Typography>
                    ) : (
                        <Box>{purchasedItems.map(renderPurchasedRow)}</Box>
                    )}
                </DialogContent>
                {purchasedItems.length > 0 && (
                    <>
                        <Divider />
                        <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                            <Button
                                size="small"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={clearPurchased}
                                sx={{ textTransform: 'none', color: 'text.secondary' }}
                            >
                                Clear all
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<KitchenIcon />}
                                onClick={async () => { await moveAllToPantry(); setBasketOpen(false) }}
                                sx={{ textTransform: 'none' }}
                            >
                                All to pantry
                            </Button>
                        </DialogActions>
                    </>
                )}
                <Divider />
                <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                    <Button
                        size="small"
                        startIcon={<ReceiptLongIcon />}
                        onClick={() => setReceiptOpen(true)}
                        sx={{ textTransform: 'none' }}
                    >
                        Scan receipt
                    </Button>
                    <Button onClick={() => setBasketOpen(false)} sx={{ color: 'text.secondary' }}>Close</Button>
                </DialogActions>
            </Dialog>

            <ReceiptImportDialog
                open={receiptOpen}
                onClose={() => setReceiptOpen(false)}
                matchTargets={purchasedItems}
                onApplyMatches={applyReceipt}
                title="Scan basket receipt"
                onAddItems={() => { }}
            />

            <ManualAddDialog
                open={dialogOpen}
                onClose={handleAddDialogClose}
                onAdd={addEntry}
                mode="list"
                initial={pickedInitial}
            />

            <ProductPickerDialog
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handlePickerSelect}
                recentEntries={recentEntries}
                stores={stores}
                storeChains={storeChains}
                recentStoreIds={recentStoreIds}
            />

            {/* ── Delete confirmation ── */}
            <Dialog
                open={!!deleteEntry_}
                onClose={() => setDeleteEntry(null)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Remove from list?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        <b>{deleteEntry_?.name}</b> will be removed from your shopping list.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteEntry(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">Remove</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!snack}
                autoHideDuration={3500}
                onClose={() => setSnack(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                {snack ? (
                    <Alert severity={snack.severity} onClose={() => setSnack(null)} sx={{ width: '100%' }}>
                        {snack.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </Box>
    )
}
