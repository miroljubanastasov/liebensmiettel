import { useState, useRef, useCallback, useMemo, useLayoutEffect, useEffect } from 'react'
import { flushSync } from 'react-dom'
import {
    Box, Typography, List, ListItem, ListItemText,
    ListItemAvatar, IconButton, Chip, Divider,
    ListItemButton, Collapse, Rating, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    InputAdornment, ToggleButtonGroup, ToggleButton, Snackbar, Alert,
    FormControlLabel, Checkbox, MenuItem, Fab,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import AddIcon from '@mui/icons-material/Add'
import TopBar from '../../components/layout/TopBar'
import CategoryNav, { CATEGORY_ITEMS } from '../../components/layout/CategoryNav'
import SkeletonList from '../../components/layout/SkeletonList'
import ManualAddDialog from '../../components/products/ManualAddDialog'
import { ProductPickerDialog } from '../../components/products/ProductPicker'
import { useRecentEntries, pickRecentStoreIds } from '../../hooks/useRecentEntries'
import { listStores, listStoreChains } from '../../lib/stores'
// Paused features — kept imported so re-enabling is one line in handleAdd.
// import ReceiptImportDialog from '../../components/products/ReceiptImportDialog'
// import ReturnFromShoppingDialog from '../../components/products/ReturnFromShoppingDialog'
import BarcodeScannerDialog from '../../components/products/BarcodeScannerDialog'
import ProductAvatar from '../../components/products/ProductAvatar'
import NutriScoreBar from '../../components/products/NutriScoreBar'
import FoodLabels from '../../components/products/FoodLabels'
import NutritionFacts from '../../components/products/NutritionFacts'
import ExpiryWheel from '../../components/products/ExpiryWheel'
import { useProductEntries } from '../../hooks/useProductEntries'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'



export default function Pantry() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [transitioning, setTransitioning] = useState(false)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pickedInitial, setPickedInitial] = useState(null)
    const [pickedEan, setPickedEan] = useState('')
    // const [receiptDialogOpen, setReceiptDialogOpen] = useState(false)
    // const [shoppingDialogOpen, setShoppingDialogOpen] = useState(false)
    const [expandedId, setExpandedId] = useState(null)
    // Scan-to-consume / scan-to-dispose flow (triggered from row actions)
    const [scanMode, setScanMode] = useState(null) // 'consume' | 'dispose' | null
    const [snack, setSnack] = useState(null) // { severity, message }
    // Filtering / sorting UI
    const [query, setQuery] = useState('')
    const [locationFilter, setLocationFilter] = useState([])
    const [sortBy, setSortBy] = useState('shelved') // 'shelved' | 'expiry'
    const catRef = useRef(null)
    const touchStart = useRef(null)
    const touchDragging = useRef(false)
    const listRef = useRef(null)
    const { entries, loading, addEntry, updateEntry, removeEntry, disposeEntry } = useProductEntries('in_pantry')
    const { entries: recentEntries } = useRecentEntries({ enabled: true })
    const [stores, setStores] = useState([])
    const [storeChains, setStoreChains] = useState([])
    useEffect(() => {
        listStores().then((rows) => setStores(rows ?? []))
        listStoreChains().then((rows) => setStoreChains(rows ?? []))
    }, [])
    const recentStoreIds = useMemo(() => pickRecentStoreIds(recentEntries), [recentEntries])

    // Edit dialog
    const [editEntry, setEditEntry] = useState(null)

    // Consume dialog
    const [consumeEntry, setConsumeEntry] = useState(null)
    const [consumeQty, setConsumeQty] = useState('')
    const [consumeAddToShopping, setConsumeAddToShopping] = useState(false)
    const consumeUser = useAuthStore((s) => s.user)
    const consumeHousehold = useAuthStore((s) => s.household)

    // Dispose confirmation dialog
    const [disposeEntry_, setDisposeEntry] = useState(null)

    // Rate dialog
    const [rateEntry, setRateEntry] = useState(null)
    const [rateValue, setRateValue] = useState(0)

    const handleEditSave = async (fields) => {
        if (!editEntry) return { ok: false, error: 'No entry' }
        const ok = await updateEntry(editEntry.id, fields)
        if (!ok) return { ok: false, error: 'Failed to save' }
        setEditEntry(null)
        return { ok: true }
    }

    const handleConsume = async () => {
        if (!consumeEntry) return
        const qty = parseFloat(consumeQty)
        const remaining = (consumeEntry.quantity ?? 0) - (isNaN(qty) ? consumeEntry.quantity ?? 0 : qty)
        if (remaining <= 0) {
            await removeEntry(consumeEntry.id)
        } else {
            await updateEntry(consumeEntry.id, { quantity: remaining })
        }
        if (consumeAddToShopping) {
            const now = new Date().toISOString()
            const { error: insertErr } = await supabase.from('product_entries').insert({
                name: consumeEntry.name,
                brand: consumeEntry.brand ?? null,
                ean: consumeEntry.ean ?? null,
                category: consumeEntry.category ?? null,
                subcategory: consumeEntry.subcategory ?? null,
                quantity: 1,
                unit: consumeEntry.unit ?? null,
                status: 'listed',
                user_id: consumeUser?.id ?? null,
                household_id: consumeEntry.household_id ?? consumeHousehold?.id ?? null,
                entry_source: 'manual',
                listed_at: now,
            })
            if (insertErr) {
                setSnack({ severity: 'error', message: `Could not add to shopping list: ${insertErr.message}` })
            } else {
                setSnack({ severity: 'success', message: `Added ${consumeEntry.name} to shopping list.` })
            }
        }
        setConsumeEntry(null)
        setConsumeAddToShopping(false)
    }

    const handleDispose = async () => {
        if (!disposeEntry_) return
        await disposeEntry(disposeEntry_.id)
        setDisposeEntry(null)
    }

    const handleRate = async () => {
        if (!rateEntry) return
        await updateEntry(rateEntry.id, { rating: rateValue })
        setRateEntry(null)
    }

    const toggleExpand = (id) => setExpandedId((prev) => prev === id ? null : id)

    // FAB → product picker wizard → manual add dialog (with the picked
    // product, category, subcategory and unit prefilled).
    const handleFabClick = () => {
        setPickedInitial(null)
        setPickerOpen(true)
    }

    const handlePickerSelect = (sel) => {
        // sel: { name, category, subcategory, unit, defaultQty, store }
        // Flatten the picker's store sub-object into the prefill payload
        // expected by ManualAddDialog's `initial` prop.
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
        setPickedEan('')
    }

    // Picker scanned an EAN — skip the wizard and open ManualAddDialog with
    // the code prefilled. ManualAddDialog will autofill name/brand/nutrition
    // from Open Food Facts via its `initialEan` effect.
    const handlePickerScan = (code) => {
        setPickedInitial(null)
        setPickedEan(code)
        setPickerOpen(false)
        setDialogOpen(true)
    }

    // Handle a scanned EAN from the barcode dialog.
    // If the code matches an entry in pantry: consume qty=1 (or fully remove
    // if the last unit) or dispose (record + remove). If no match: toast.
    const handleScanDetected = useCallback(async (code) => {
        const mode = scanMode
        setScanMode(null)
        if (!code) return
        const match = entries.find((e) => e.ean && String(e.ean) === String(code))
        if (!match) {
            setSnack({
                severity: 'warning',
                message: `No pantry item with EAN ${code}.`,
            })
            return
        }
        if (mode === 'consume') {
            const current = Number(match.quantity ?? 1)
            const remaining = current - 1
            if (remaining <= 0) {
                await removeEntry(match.id)
                setSnack({ severity: 'success', message: `Consumed last unit of ${match.name}.` })
            } else {
                await updateEntry(match.id, { quantity: remaining })
                setSnack({ severity: 'success', message: `Consumed 1 × ${match.name} (${remaining} left).` })
            }
        } else if (mode === 'dispose') {
            await disposeEntry(match.id)
            setSnack({ severity: 'info', message: `Disposed ${match.name}.` })
        }
    }, [scanMode, entries, removeEntry, updateEntry, disposeEntry])

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

    // Navbar = TopBar + CategoryNav + Search. It's `position: fixed`, so we
    // measure its height and render an in-flow spacer of the same height to
    // push the content below it. No magic offsets — height is real.
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
        if (locationFilter.length > 0) {
            const set = new Set(locationFilter.map((s) => s.toLowerCase()))
            const matchNone = set.has('__none__')
            list = list.filter((e) => {
                const location = (e.location ?? '').trim()
                if (!location) return matchNone
                return set.has(location.toLowerCase())
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
        // Sort a shallow copy. `null` dates sort to the end.
        const sortKey = sortBy === 'shelved' ? 'shelved_at' : 'expiry_date'
        // expiry: ascending (soonest first). shelved: descending (newest first).
        const dir = sortBy === 'shelved' ? -1 : 1
        return [...list].sort((a, b) => {
            const av = a[sortKey]
            const bv = b[sortKey]
            if (av === bv) return 0
            if (!av) return 1
            if (!bv) return -1
            return av < bv ? -dir : dir
        })
    }, [entries, activeCat, query, sortBy, locationFilter])

    const locationFilterOptions = useMemo(() => {
        const names = new Set()
        let hasNoLocation = false
        for (const e of entries) {
            const name = (e.location ?? '').trim()
            if (name) names.add(name)
            else hasNoLocation = true
        }
        return {
            names: [...names].sort((a, b) => a.localeCompare(b)),
            hasNoLocation,
        }
    }, [entries])

    const categoryCounts = useMemo(() => {
        const map = { All: entries.length }
        for (const entry of entries) {
            map[entry.category] = (map[entry.category] ?? 0) + 1
        }
        return map
    }, [entries])

    const renderList = (items) => {
        if (items.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>
                    No items here
                </Typography>
            )
        }
        return (
            <List >
                {items.map((entry) => {
                    const isOpen = expandedId === entry.id
                    return (
                        <Box key={entry.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper', mb: 1 }}>
                            <ListItemButton
                                onClick={() => toggleExpand(entry.id)}
                                sx={{ px: 1.5, py: 0.75 }}
                            >
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
                                            {entry.shelved_at && (
                                                <Typography variant="caption" color="text.disabled" component="div">
                                                    shelved {new Date(entry.shelved_at).toLocaleDateString()}
                                                </Typography>
                                            )}
                                            {entry.rating && (
                                                <Rating value={entry.rating} readOnly size="small" sx={{ fontSize: 13, mt: 0.25, '& .MuiRating-iconFilled': { color: 'primary.main' }, '& .MuiRating-iconEmpty': { color: 'primary.main' } }} />
                                            )}
                                        </Box>
                                    }
                                    primaryTypographyProps={{ component: 'div' }}
                                />
                                <Box sx={{ alignSelf: 'flex-start', mt: 0.5 }}>
                                    {entry.expiry_date && (
                                        <ExpiryWheel expiryDate={entry.expiry_date} shelvedAt={entry.shelved_at} size={36} />
                                    )}
                                </Box>
                                {isOpen ? <ExpandLessIcon sx={{ color: 'text.secondary', ml: 0.5 }} /> : <ExpandMoreIcon sx={{ color: 'text.secondary', ml: 0.5 }} />}
                            </ListItemButton>
                            <Collapse in={isOpen} unmountOnExit>
                                <Box sx={{ px: 2, pb: 1.5, pt: 0.5 }}>
                                    {/* ── Actions ── */}
                                    <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                                        <IconButton size="small" title="Edit" sx={{ color: 'text.primary' }} onClick={(e) => { e.stopPropagation(); setEditEntry(entry) }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" title="Consume" sx={{ color: 'text.primary' }} onClick={(e) => { e.stopPropagation(); setConsumeQty(String(entry.quantity ?? '')); setConsumeEntry(entry) }}>
                                            <CheckCircleOutlineIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" title="Dispose" sx={{ color: 'primary.main' }} onClick={(e) => { e.stopPropagation(); setDisposeEntry(entry) }}>
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" title="Rate" sx={{ color: 'text.primary' }} onClick={(e) => { e.stopPropagation(); setRateValue(entry.rating ?? 0); setRateEntry(entry) }}>
                                            <StarBorderIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Divider sx={{ mb: 0.75 }} />
                                    {/* ── Info ── */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            <b>Quantity:</b> {entry.quantity} {entry.unit}
                                        </Typography>
                                        {entry.category && (
                                            <Typography variant="caption" color="text.secondary">
                                                <b>Category:</b> {entry.category}
                                            </Typography>
                                        )}
                                        {entry.location && (
                                            <Typography variant="caption" color="text.secondary">
                                                <b>Location:</b> {entry.location}
                                            </Typography>
                                        )}
                                        {entry.ean && (
                                            <Typography variant="caption" color="text.secondary">
                                                <b>EAN:</b> {entry.ean}
                                            </Typography>
                                        )}
                                        {entry.entry_source && (
                                            <Typography variant="caption" color="text.secondary">
                                                <b>Source:</b> {entry.entry_source}
                                            </Typography>
                                        )}
                                        {entry.shelved_at && (
                                            <Typography variant="caption" color="text.secondary">
                                                <b>Shelved:</b> {new Date(entry.shelved_at).toLocaleDateString()}
                                            </Typography>
                                        )}
                                        {entry.opened_at && (
                                            <Typography variant="caption" color="text.secondary">
                                                <b>Opened:</b> {entry.opened_at}
                                            </Typography>
                                        )}
                                    </Box>
                                    {entry.expiry_date && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                            <ExpiryWheel expiryDate={entry.expiry_date} shelvedAt={entry.shelved_at} size={48} />
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                                                exp {entry.expiry_date}
                                            </Typography>
                                        </Box>
                                    )}
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

                                    {/* ── Economic ── */}
                                    {(entry.store || entry.price != null) && (
                                        <>
                                            <Divider sx={{ my: 0.75 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Price & Store
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, mt: 0.5 }}>
                                                {entry.store && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, gridColumn: '1 / -1' }}>
                                                        {entry.store.chain_data?.logo_url && (
                                                            <Box
                                                                component="img"
                                                                src={entry.store.chain_data.logo_url}
                                                                alt={entry.store.chain_data.name}
                                                                sx={{ height: 18, width: 'auto', maxWidth: 44, objectFit: 'contain' }}
                                                            />
                                                        )}
                                                        <Typography variant="caption" color="text.secondary">
                                                            <b>{entry.store.chain_data?.name ?? entry.store.chain ?? entry.store.name}</b>
                                                            {' · '}{entry.store.name}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {entry.price != null && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        <b>Price:</b> €{Number(entry.price).toFixed(2)}
                                                    </Typography>
                                                )}
                                                {entry.unit_price != null && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        <b>Unit price:</b> €{Number(entry.unit_price).toFixed(2)}/{entry.unit}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </>
                                    )}

                                    <Divider sx={{ my: 0.75 }} />
                                </Box>
                            </Collapse>
                        </Box>
                    )
                })}
            </List>
        )
    }

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
                        label="Location"
                        value={locationFilter}
                        onChange={(e) => {
                            const v = e.target.value
                            setLocationFilter(typeof v === 'string' ? v.split(',') : v)
                        }}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                            multiple: true,
                            displayEmpty: true,
                            renderValue: (selected) => {
                                if (!selected || selected.length === 0) return 'All'
                                if (selected.length === 1) {
                                    return selected[0] === '__none__' ? 'No location' : selected[0]
                                }
                                return `${selected.length} locations`
                            },
                            MenuProps: { PaperProps: { sx: { maxHeight: 320 } } },
                        }}
                        sx={{
                            minWidth: 120,
                            '& .MuiInputBase-root': { height: 32, fontSize: 12 },
                            '& .MuiInputLabel-root': { fontSize: 12 },
                        }}
                    >
                        {locationFilterOptions.names.map((n) => (
                            <MenuItem key={n} value={n} sx={{ py: 0.25 }}>
                                <Checkbox
                                    size="small"
                                    checked={locationFilter.indexOf(n) > -1}
                                    sx={{ p: 0.5, mr: 0.5 }}
                                />
                                <ListItemText primary={n} primaryTypographyProps={{ fontSize: 13 }} />
                            </MenuItem>
                        ))}
                        {locationFilterOptions.hasNoLocation && (
                            <MenuItem value="__none__" sx={{ py: 0.25 }}>
                                <Checkbox
                                    size="small"
                                    checked={locationFilter.indexOf('__none__') > -1}
                                    sx={{ p: 0.5, mr: 0.5 }}
                                />
                                <ListItemText primary={<em>No location</em>} primaryTypographyProps={{ fontSize: 13 }} />
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
                        <MenuItem value="shelved">Shelved</MenuItem>
                        <MenuItem value="expiry">Expires</MenuItem>
                    </TextField>
                </Box>
            </Box>

            {/* In-flow spacer that reserves the navbar's actual height. */}
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

            {/* Single + button → opens the category grid wizard, which then
                walks through subcategory → product and lands in the manual
                add dialog with the selection prefilled. */}
            <Fab
                color="primary"
                onClick={handleFabClick}
                sx={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1100, boxShadow: 4 }}
                aria-label="Add to pantry"
            >
                <AddIcon />
            </Fab>

            <ProductPickerDialog
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handlePickerSelect}
                onScan={handlePickerScan}
                recentEntries={recentEntries}
                stores={stores}
                storeChains={storeChains}
                recentStoreIds={recentStoreIds}
            />

            <ManualAddDialog
                open={dialogOpen}
                onClose={handleAddDialogClose}
                onAdd={addEntry}
                mode="pantry"
                initial={pickedInitial}
                initialEan={pickedEan}
            />

            {/* Paused: receipt import + return-from-shopping. Scaffolding kept
                so they can be re-enabled without code archaeology. */}
            {/*
            <ReceiptImportDialog
                open={receiptDialogOpen}
                onClose={() => setReceiptDialogOpen(false)}
                onAddItems={handleBulkAdd}
            />
            <ReturnFromShoppingDialog
                open={shoppingDialogOpen}
                onClose={() => setShoppingDialogOpen(false)}
                onAddItems={handleBulkAdd}
            />
            */}

            <BarcodeScannerDialog
                open={scanMode !== null}
                onClose={() => setScanMode(null)}
                onDetected={handleScanDetected}
            />

            <Snackbar
                open={!!snack}
                autoHideDuration={3500}
                onClose={() => setSnack(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                {snack ? (
                    <Alert
                        severity={snack.severity}
                        onClose={() => setSnack(null)}
                        sx={{ width: '100%' }}
                    >
                        {snack.message}
                    </Alert>
                ) : undefined}
            </Snackbar>

            {/* ── Edit dialog (same as add) ── */}
            <ManualAddDialog
                open={!!editEntry}
                entry={editEntry}
                onClose={() => setEditEntry(null)}
                onAdd={handleEditSave}
                mode="pantry"
            />

            {/* ── Consume dialog ── */}
            <Dialog
                open={!!consumeEntry}
                onClose={() => setConsumeEntry(null)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>How much did you use?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {consumeEntry?.name} — {consumeEntry?.quantity} {consumeEntry?.unit} in stock
                    </Typography>
                    <TextField
                        fullWidth
                        label={`Amount used (${consumeEntry?.unit ?? ''})`}
                        type="number"
                        value={consumeQty}
                        onChange={(e) => setConsumeQty(e.target.value)}
                        inputProps={{ min: 0, step: 0.5 }}
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={consumeAddToShopping}
                                onChange={(e) => setConsumeAddToShopping(e.target.checked)}
                                size="small"
                            />
                        }
                        label="Add to shopping list"
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: 14 } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setConsumeEntry(null); setConsumeAddToShopping(false) }} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleConsume} variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* ── Dispose confirmation ── */}
            <Dialog
                open={!!disposeEntry_}
                onClose={() => setDisposeEntry(null)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Dispose item?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Remove <strong>{disposeEntry_?.name}</strong> from your pantry? This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDisposeEntry(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleDispose} color="error" variant="contained">Dispose</Button>
                </DialogActions>
            </Dialog>

            {/* ── Rate dialog ── */}
            <Dialog
                open={!!rateEntry}
                onClose={() => setRateEntry(null)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Rate {rateEntry?.name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                        <Rating
                            value={rateValue}
                            onChange={(_, v) => setRateValue(v ?? 0)}
                            size="large"
                            sx={{ '& .MuiRating-iconFilled': { color: 'primary.main' }, '& .MuiRating-iconEmpty': { color: 'primary.main' } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRateEntry(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleRate} variant="contained" disabled={!rateValue}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
