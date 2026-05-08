import { useEffect, useMemo, useState } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, TextField, InputAdornment, IconButton,
    Button, ButtonBase, Stack,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import StorefrontIcon from '@mui/icons-material/Storefront'
import BlockIcon from '@mui/icons-material/Block'
import EditIcon from '@mui/icons-material/Edit'

/**
 * Build the unified item list shown in the picker grid.
 * Combines store rows and chain rows, dedupes by chain or by store name,
 * ranks "most used" first, then alphabetic.
 *
 * Item shape:
 *   {
 *     key,            unique React key
 *     kind,           'store' | 'chain'
 *     id,             store_id (kind='store') or chain_id (kind='chain')
 *     name,           display name
 *     logo_url,       url or null
 *     color,          brand color or null
 *     chain_id,       resolved chain id (may equal id when kind='chain')
 *     chain_data,     {id,name,logo_url,color} or null
 *     store,          original store row (kind='store') or null
 *     usageRank,      0-based rank from recentStoreIds, or Infinity
 *   }
 */
function buildItems({ stores, storeChains, recentStoreIds }) {
    const rankByStoreId = new Map(recentStoreIds.map((id, i) => [id, i]))
    const items = []
    const seenChainIds = new Set()
    const seenStoreNames = new Set()

    // 1. Store rows that resolve to a chain → represent as the chain
    //    (logos / branding live on the chain). Multiple store rows for the
    //    same chain collapse into one tile; we keep the best usage rank.
    const chainAggregates = new Map() // chain_id → { rank, sampleStore }
    const looseStores = [] // stores with no chain
    for (const s of stores) {
        const chainId = s.chain_id ?? s.chain_data?.id ?? null
        if (chainId) {
            const prev = chainAggregates.get(chainId)
            const rank = rankByStoreId.has(s.id) ? rankByStoreId.get(s.id) : Infinity
            if (!prev || rank < prev.rank) {
                chainAggregates.set(chainId, { rank, sampleStore: s })
            } else {
                chainAggregates.set(chainId, prev)
            }
        } else {
            looseStores.push(s)
        }
    }

    // Add chain tiles (from storeChains catalogue). Prefer chain_data on
    // a store row when available — it carries the logo cached server-side.
    for (const c of storeChains) {
        if (!c?.id) continue
        seenChainIds.add(c.id)
        const agg = chainAggregates.get(c.id)
        items.push({
            key: `chain:${c.id}`,
            kind: 'chain',
            id: c.id,
            name: c.name,
            logo_url: c.logo_url ?? agg?.sampleStore?.chain_data?.logo_url ?? null,
            color: c.color ?? null,
            chain_id: c.id,
            chain_data: c,
            store: agg?.sampleStore ?? null,
            usageRank: agg?.rank ?? Infinity,
        })
    }

    // Stores whose chain isn't in storeChains (e.g. db has a chain row we
    // don't have in JS) — surface them as chain tiles via chain_data.
    for (const [chainId, agg] of chainAggregates) {
        if (seenChainIds.has(chainId)) continue
        const cd = agg.sampleStore.chain_data
        if (!cd) continue
        seenChainIds.add(chainId)
        items.push({
            key: `chain:${chainId}`,
            kind: 'chain',
            id: chainId,
            name: cd.name,
            logo_url: cd.logo_url ?? null,
            color: cd.color ?? null,
            chain_id: chainId,
            chain_data: cd,
            store: agg.sampleStore,
            usageRank: agg.rank,
        })
    }

    // Loose stores (no chain) — one tile per unique name.
    for (const s of looseStores) {
        const nameKey = (s.name ?? '').trim().toLowerCase()
        if (!nameKey || seenStoreNames.has(nameKey)) continue
        seenStoreNames.add(nameKey)
        items.push({
            key: `store:${s.id}`,
            kind: 'store',
            id: s.id,
            name: s.name,
            logo_url: null,
            color: null,
            chain_id: null,
            chain_data: null,
            store: s,
            usageRank: rankByStoreId.has(s.id) ? rankByStoreId.get(s.id) : Infinity,
        })
    }

    // Sort: used items by rank (asc), then unused alphabetically.
    items.sort((a, b) => {
        if (a.usageRank !== b.usageRank) return a.usageRank - b.usageRank
        return (a.name || '').localeCompare(b.name || '')
    })
    return items
}

function StoreTile({ item, selected, onClick }) {
    const { name, logo_url, color } = item
    const initial = (name || '?').trim().charAt(0).toUpperCase()
    return (
        <ButtonBase
            onClick={onClick}
            focusRipple
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 0.75,
                p: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                backgroundColor: selected ? 'action.selected' : 'background.paper',
                width: '100%',
                minHeight: 96,
                textAlign: 'center',
                transition: 'border-color .15s, background-color .15s',
                '&:hover': { borderColor: 'primary.light', backgroundColor: 'action.hover' },
            }}
        >
            <Box
                sx={{
                    width: 56, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {logo_url ? (
                    <Box
                        component="img"
                        src={logo_url}
                        alt={name}
                        loading="lazy"
                        sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 36, height: 36, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: color || 'action.hover',
                            color: color ? '#fff' : 'text.primary',
                            fontWeight: 700, fontSize: 16,
                        }}
                    >
                        {initial}
                    </Box>
                )}
            </Box>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: selected ? 700 : 500,
                    lineHeight: 1.15,
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {name}
            </Typography>
        </ButtonBase>
    )
}

/**
 * Modal store picker with search + grid of logos.
 *
 * Selection result passed to onSelect():
 *   {
 *     store_id:    string|null,
 *     store_name:  string,           // '' for None
 *     chain_id:    string|null,
 *     chain_data:  object|null,
 *   }
 *
 * The caller is responsible for upserting into `stores` when the result
 * has a chain_id but no store_id (or for handling the custom-name case).
 */
export function StorePickerDialog({
    open,
    onClose,
    onSelect,
    stores = [],
    storeChains = [],
    recentStoreIds = [],
    value, // { store_id, store_name, chain_id }
}) {
    const [query, setQuery] = useState('')
    const [customMode, setCustomMode] = useState(false)
    const [customName, setCustomName] = useState('')

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot reset on dialog open
            setQuery('')
            setCustomMode(false)
            setCustomName(value?.store_id ? '' : (value?.store_name ?? ''))
        }
    }, [open, value])

    const items = useMemo(
        () => buildItems({ stores, storeChains, recentStoreIds }),
        [stores, storeChains, recentStoreIds],
    )

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return items
        return items.filter((it) => (it.name || '').toLowerCase().includes(q))
    }, [items, query])

    const selectedKey = useMemo(() => {
        if (!value) return null
        if (value.chain_id) {
            const m = items.find((it) => it.kind === 'chain' && it.id === value.chain_id)
            if (m) return m.key
        }
        if (value.store_id) {
            const m = items.find((it) => it.kind === 'store' && it.id === value.store_id)
            if (m) return m.key
        }
        return null
    }, [items, value])

    const isNoneSelected = !value?.store_id && !value?.chain_id && !(value?.store_name ?? '').trim()

    const emit = (result) => {
        onSelect(result)
        onClose()
    }

    const pickItem = (it) => {
        if (it.kind === 'chain') {
            emit({
                store_id: it.store?.id ?? null,
                store_name: it.store?.name ?? it.name,
                chain_id: it.id,
                chain_data: it.chain_data,
            })
        } else {
            emit({
                store_id: it.id,
                store_name: it.name,
                chain_id: null,
                chain_data: null,
            })
        }
    }

    const pickNone = () => emit({ store_id: null, store_name: '', chain_id: null, chain_data: null })

    const confirmCustom = () => {
        const name = customName.trim()
        if (!name) return
        emit({ store_id: null, store_name: name, chain_id: null, chain_data: null })
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1 }}>Select store</DialogTitle>
            <DialogContent dividers sx={{ pt: 1.5 }}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Search stores…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: query ? (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setQuery('')}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                    sx={{ mb: 2 }}
                />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                        gap: 1,
                    }}
                >
                    {/* Always-first: None */}
                    <ButtonBase
                        onClick={pickNone}
                        focusRipple
                        sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'flex-start', gap: 0.75, p: 1, borderRadius: 2,
                            border: '1px solid',
                            borderColor: isNoneSelected ? 'primary.main' : 'divider',
                            backgroundColor: isNoneSelected ? 'action.selected' : 'background.paper',
                            minHeight: 96,
                            '&:hover': { borderColor: 'primary.light', backgroundColor: 'action.hover' },
                        }}
                    >
                        <Box sx={{ width: 56, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BlockIcon sx={{ color: 'text.disabled', fontSize: 32 }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: isNoneSelected ? 700 : 500 }}>
                            None
                        </Typography>
                    </ButtonBase>

                    {/* Always-second: Custom */}
                    <ButtonBase
                        onClick={() => setCustomMode(true)}
                        focusRipple
                        sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'flex-start', gap: 0.75, p: 1, borderRadius: 2,
                            border: '1px dashed',
                            borderColor: customMode ? 'primary.main' : 'divider',
                            backgroundColor: customMode ? 'action.selected' : 'background.paper',
                            minHeight: 96,
                            '&:hover': { borderColor: 'primary.light', backgroundColor: 'action.hover' },
                        }}
                    >
                        <Box sx={{ width: 56, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <EditIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: customMode ? 700 : 500 }}>
                            Custom…
                        </Typography>
                    </ButtonBase>

                    {filtered.map((it) => (
                        <StoreTile
                            key={it.key}
                            item={it}
                            selected={selectedKey === it.key}
                            onClick={() => pickItem(it)}
                        />
                    ))}
                </Box>

                {filtered.length === 0 && query && (
                    <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                        <Typography variant="body2">
                            No matches. Use <b>Custom…</b> to enter a name.
                        </Typography>
                    </Box>
                )}

                {customMode && (
                    <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                        <TextField
                            size="small"
                            fullWidth
                            label="Custom store name"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    confirmCustom()
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            disabled={!customName.trim()}
                            onClick={confirmCustom}
                        >Use</Button>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

/**
 * Field-style trigger that opens the StorePickerDialog.
 * Drop-in replacement for the previous Autocomplete-based store input.
 *
 * value:   { store_id, store_name, chain_id, chain_data? }
 * onChange: same shape (chain_data may be set by the picker)
 */
export default function StorePicker({
    value,
    onChange,
    stores = [],
    storeChains = [],
    recentStoreIds = [],
    label = 'Store',
    fullWidth = true,
    disabled = false,
}) {
    const [open, setOpen] = useState(false)

    // Resolve a logo for the trigger from current selection.
    const trigger = useMemo(() => {
        const cd = value?.chain_data
            ?? (value?.chain_id
                ? storeChains.find((c) => c.id === value.chain_id)
                : null)
            ?? (value?.store_id
                ? stores.find((s) => s.id === value.store_id)?.chain_data ?? null
                : null)
        const logo = cd?.logo_url ?? null
        const color = cd?.color ?? null
        const display = (value?.store_name ?? '').trim()
            || cd?.name
            || ''
        return { logo, color, display }
    }, [value, stores, storeChains])

    return (
        <>
            <ButtonBase
                onClick={() => !disabled && setOpen(true)}
                focusRipple
                disabled={disabled}
                sx={{
                    width: fullWidth ? '100%' : 'auto',
                    justifyContent: 'flex-start',
                    border: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    borderRadius: 1,
                    px: 1.25,
                    py: 0.875,
                    minHeight: 40,
                    textAlign: 'left',
                    backgroundColor: 'background.paper',
                    position: 'relative',
                    '&:hover': { borderColor: 'text.primary' },
                    '&.Mui-disabled': { opacity: 0.6 },
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
                        color: 'text.secondary',
                        fontSize: 12,
                    }}
                >
                    {label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    {trigger.logo ? (
                        <Box
                            component="img"
                            src={trigger.logo}
                            alt=""
                            sx={{ height: 20, width: 'auto', maxWidth: 36, objectFit: 'contain', flexShrink: 0 }}
                        />
                    ) : trigger.display ? (
                        <Box
                            sx={{
                                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: trigger.color || 'action.hover',
                                color: trigger.color ? '#fff' : 'text.primary',
                                fontWeight: 700, fontSize: 11,
                            }}
                        >
                            {trigger.display.charAt(0).toUpperCase()}
                        </Box>
                    ) : (
                        <StorefrontIcon sx={{ color: 'text.disabled', fontSize: 20, flexShrink: 0 }} />
                    )}
                    <Typography
                        variant="body2"
                        sx={{
                            flex: 1, minWidth: 0,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            color: trigger.display ? 'text.primary' : 'text.disabled',
                        }}
                    >
                        {trigger.display || 'None'}
                    </Typography>
                </Box>
            </ButtonBase>
            <StorePickerDialog
                open={open}
                onClose={() => setOpen(false)}
                onSelect={onChange}
                stores={stores}
                storeChains={storeChains}
                recentStoreIds={recentStoreIds}
                value={value}
            />
        </>
    )
}

/**
 * Horizontal "rolling" store strip — single row of circular logo tiles,
 * recents first. Always-visible "Custom…" tile (default) opens an inline
 * dialog for typed names. Tapping any other tile selects it immediately.
 *
 * Props match StorePicker:
 *   value, onChange, stores, storeChains, recentStoreIds
 *
 * Optional `label` renders a small caption above the strip.
 */
export function StoreStrip({
    value,
    onChange,
    stores = [],
    storeChains = [],
    recentStoreIds = [],
    label = 'Store',
}) {
    const [customOpen, setCustomOpen] = useState(false)
    const [customName, setCustomName] = useState('')

    const items = useMemo(
        () => buildItems({ stores, storeChains, recentStoreIds }),
        [stores, storeChains, recentStoreIds],
    )

    // Selection key: prefer chain match, else store match.
    const selectedKey = useMemo(() => {
        if (!value) return null
        if (value.chain_id) {
            const m = items.find((it) => it.kind === 'chain' && it.id === value.chain_id)
            if (m) return m.key
        }
        if (value.store_id) {
            const m = items.find((it) => it.kind === 'store' && it.id === value.store_id)
            if (m) return m.key
        }
        return null
    }, [items, value])

    // Highlight the Custom tile when a free-form store name is set with no
    // chain/store id — that's a custom selection.
    const customSelected =
        !value?.store_id && !value?.chain_id && !!(value?.store_name ?? '').trim()

    const pickItem = (it) => {
        if (it.kind === 'chain') {
            onChange?.({
                store_id: it.store?.id ?? null,
                store_name: it.store?.name ?? it.name,
                chain_id: it.id,
                chain_data: it.chain_data,
            })
        } else {
            onChange?.({
                store_id: it.id,
                store_name: it.name,
                chain_id: null,
                chain_data: null,
            })
        }
    }

    const openCustom = () => {
        setCustomName(customSelected ? value.store_name : '')
        setCustomOpen(true)
    }

    const confirmCustom = () => {
        const name = customName.trim()
        if (!name) return
        onChange?.({ store_id: null, store_name: name, chain_id: null, chain_data: null })
        setCustomOpen(false)
    }

    return (
        <Box>
            {label && (
                <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mb: 0.5, ml: 0.5 }}
                >
                    {label}
                </Typography>
            )}
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    py: 0.5,
                    px: 0.25,
                    // Hide native scrollbar — strip is meant to feel like a swiper.
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <StripCircle
                    label="Custom"
                    selected={customSelected}
                    dashed
                    onClick={openCustom}
                    icon={<EditIcon sx={{ color: 'text.secondary', fontSize: 22 }} />}
                />
                {items.map((it) => (
                    <StripCircle
                        key={it.key}
                        label={it.name}
                        selected={selectedKey === it.key}
                        logoUrl={it.logo_url}
                        color={it.color}
                        onClick={() => pickItem(it)}
                    />
                ))}
            </Box>

            <Dialog
                open={customOpen}
                onClose={() => setCustomOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Custom store</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        size="small"
                        label="Store name"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                confirmCustom()
                            }
                        }}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCustomOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={confirmCustom}
                        disabled={!customName.trim()}
                    >Use</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

/**
 * Single circular tile in the StoreStrip. Logo image when available, else
 * a colored circle with the store's first initial. Selected state shows a
 * primary-color ring.
 */
function StripCircle({ label, selected, dashed, logoUrl, color, icon, onClick }) {
    const initial = (label || '?').trim().charAt(0).toUpperCase()
    return (
        <ButtonBase
            onClick={onClick}
            focusRipple
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.25,
                flexShrink: 0,
                width: 64,
                p: 0.25,
                borderRadius: 1,
            }}
        >
            <Box
                sx={{
                    width: 48, height: 48, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: dashed ? '1.5px dashed' : '2px solid',
                    borderColor: selected ? 'primary.main' : (dashed ? 'divider' : 'transparent'),
                    backgroundColor: 'background.paper',
                    boxShadow: selected ? 0 : 1,
                    overflow: 'hidden',
                    transition: 'border-color .15s, box-shadow .15s',
                }}
            >
                {icon ? icon : logoUrl ? (
                    <Box
                        component="img"
                        src={logoUrl}
                        alt={label}
                        loading="lazy"
                        sx={{ maxWidth: '78%', maxHeight: '78%', objectFit: 'contain' }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: color || 'action.hover',
                            color: color ? '#fff' : 'text.primary',
                            fontWeight: 700, fontSize: 18,
                        }}
                    >
                        {initial}
                    </Box>
                )}
            </Box>
            <Typography
                variant="caption"
                sx={{
                    fontSize: 10,
                    lineHeight: 1.1,
                    width: '100%',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: selected ? 'text.primary' : 'text.secondary',
                    fontWeight: selected ? 700 : 500,
                }}
            >
                {label}
            </Typography>
        </ButtonBase>
    )
}

