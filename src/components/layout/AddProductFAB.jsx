import { useState } from 'react'
import { Fab, Box, Zoom, Tooltip, Badge } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import EditIcon from '@mui/icons-material/Edit'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'

// Full action list. Entries commented out below are paused but kept in
// source so they can be re-enabled in one line when the feature returns.
const ACTIONS = [
    { key: 'item', icon: <EditIcon />, label: 'Add item' },
    { key: 'consume', icon: <RemoveShoppingCartIcon />, label: 'Scan to consume' },
    { key: 'dispose', icon: <DeleteSweepIcon />, label: 'Scan to dispose' },
    // { key: 'receipt', icon: <ReceiptLongIcon />, label: 'Add receipt' },
    // { key: 'shopping', icon: <ShoppingBagIcon />, label: 'Back from shopping' },
]
// Silence unused-import warnings for the paused icons (kept for re-enable).
void ReceiptLongIcon; void ShoppingBagIcon;

export default function AddProductFAB({ onAction, actions, extraActions = [], badgeCount = 0 }) {
    const [open, setOpen] = useState(false)

    const baseActions = actions ?? ACTIONS
    const allActions = [...baseActions, ...extraActions]

    const handleAction = (key) => {
        setOpen(false)
        onAction?.(key)
    }

    return (
        <Box sx={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1100 }}>
            {/* Expanded action buttons */}
            {allActions.map((action, i) => (
                <Zoom
                    key={action.key}
                    in={open}
                    style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
                >
                    <Tooltip title={action.label} placement="left">
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 60 + i * 52,
                                right: 4,
                            }}
                        >
                            <Badge
                                badgeContent={action.badge ?? 0}
                                color="primary"
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                invisible={!action.badge}
                                sx={{ '& .MuiBadge-badge': { zIndex: 2000 } }}
                            >
                                <Fab
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleAction(action.key)}
                                    sx={{
                                        boxShadow: 3,
                                        '&:hover': { bgcolor: 'secondary.main' },
                                        '&:active': { bgcolor: 'secondary.main' },
                                    }}
                                >
                                    {action.icon}
                                </Fab>
                            </Badge>
                        </Box>
                    </Tooltip>
                </Zoom>
            ))}

            {/* Main FAB */}
            <Badge
                badgeContent={badgeCount}
                color="primary"
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                invisible={!badgeCount || open}
                sx={{ '& .MuiBadge-badge': { zIndex: 2000 } }}
            >
                <Fab
                    color="primary"
                    onClick={() => setOpen((v) => !v)}
                    sx={{
                        boxShadow: 4,
                        transform: open ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.2s',
                        '&:hover': { bgcolor: 'primary.main' },
                        '&:active': { bgcolor: 'primary.main' },
                    }}
                >
                    <AddIcon />
                </Fab>
            </Badge>
        </Box>
    )
}
