import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Box, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Badge } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuthStore } from '../../store/authStore'
import LogoIcon from './LogoIcon'

export default function TopBar({ static: isStatic = false }) {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const signOut = useAuthStore((s) => s.signOut)
    const pendingInviteCount = useAuthStore((s) => s.pendingInvites.length)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleOpen = (e) => setAnchorEl(e.currentTarget)
    const handleClose = () => setAnchorEl(null)

    return (
        <AppBar
            position={isStatic ? 'static' : 'fixed'}
            color="background.default"
            elevation={0}
            sx={{ zIndex: 2000, bgcolor: 'background.default' }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: 80 }}>
                {/* Logo — left side */}
                <LogoIcon sx={{ height: 74, width: 'auto', color: 'primary.main' }} />

                {/* Centered title */}
                <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 0, color: 'primary.main', fontFamily: '"Mochiy Pop P One", sans-serif', fontWeight: 500, fontSize: 18, letterSpacing: 0, lineHeight: 0.4 }}>
                        Lieblingsmittel
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: '"Mochiy Pop P One", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: 0.05, opacity: 0.75, lineHeight: 0.5, mt: 0 }}>
                        Unsere Lieblingslebensmittel!
                    </Typography>
                </Box>

                {/* 3-dots menu — right side */}
                <IconButton size="small" onClick={handleOpen}>
                    <Badge
                        color="primary"
                        variant="dot"
                        invisible={pendingInviteCount === 0}
                        overlap="circular"
                    >
                        <MoreVertIcon sx={{ color: 'text.primary' }} />
                    </Badge>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ zIndex: 2100 }}
                >
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon sx={{ color: 'text.primary' }}>
                            <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="User" secondary={user?.email} primaryTypographyProps={{ color: 'text.primary' }} />
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); navigate('/household') }}>
                        <ListItemIcon sx={{ color: 'text.primary' }}>
                            <HomeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Household"
                            secondary={pendingInviteCount > 0
                                ? `${pendingInviteCount} pending invite${pendingInviteCount === 1 ? '' : 's'}`
                                : undefined}
                            primaryTypographyProps={{ color: 'text.primary' }}
                            secondaryTypographyProps={{ color: 'primary.main', fontSize: 11 }}
                        />
                        {pendingInviteCount > 0 && (
                            <Badge
                                badgeContent={pendingInviteCount}
                                color="primary"
                                sx={{ ml: 2, mr: 1 }}
                            />
                        )}
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); signOut() }}>
                        <ListItemIcon sx={{ color: 'text.primary' }}>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" primaryTypographyProps={{ color: 'text.primary' }} />
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}
