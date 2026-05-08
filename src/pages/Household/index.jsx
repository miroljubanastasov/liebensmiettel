import { useState, useEffect, useCallback } from 'react'
import {
    Box, Typography, TextField, Button, IconButton,
    Card, CardContent, Avatar, Chip, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction,
    Divider, Alert,
} from '@mui/material'
import SkeletonList from '../../components/layout/SkeletonList'
import HomeIcon from '@mui/icons-material/Home'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonIcon from '@mui/icons-material/Person'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LinkIcon from '@mui/icons-material/Link'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

export default function Household() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const profile = useAuthStore((s) => s.profile)
    const household = useAuthStore((s) => s.household)
    const refreshProfile = useAuthStore((s) => s.refreshProfile)
    const pendingInvites = useAuthStore((s) => s.pendingInvites)
    const loadPendingInvites = useAuthStore((s) => s.loadPendingInvites)
    const acceptInviteAction = useAuthStore((s) => s.acceptInvite)
    const declineInviteAction = useAuthStore((s) => s.declineInvite)

    const [members, setMembers] = useState([])
    const [invites, setInvites] = useState([])
    const [loading, setLoading] = useState(true)

    // Create household dialog
    const [createOpen, setCreateOpen] = useState(false)
    const [householdName, setHouseholdName] = useState('')
    const [creating, setCreating] = useState(false)

    // Add/Edit member dialog
    const [memberOpen, setMemberOpen] = useState(false)
    const [editingMember, setEditingMember] = useState(null)
    const [memberName, setMemberName] = useState('')
    const [memberGender, setMemberGender] = useState('')
    const [memberBirthYear, setMemberBirthYear] = useState('')

    // Invite dialog
    const [inviteOpen, setInviteOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')

    // Rename dialog
    const [renameOpen, setRenameOpen] = useState(false)
    const [renameName, setRenameName] = useState('')

    // Switch-household confirmation
    const [switchInvite, setSwitchInvite] = useState(null)

    // Last created invite link (for copy)
    const [lastInviteLink, setLastInviteLink] = useState(null)
    const [linkCopied, setLinkCopied] = useState(false)
    const [inviteError, setInviteError] = useState(null)
    const [inviteWorking, setInviteWorking] = useState(false)

    const isCreator = household?.created_by === user?.id

    // Load household data
    const loadData = useCallback(async () => {
        if (!profile?.household_id) { setLoading(false); return }
        setLoading(true)
        const [membersRes, invitesRes] = await Promise.all([
            supabase.from('household_members')
                .select('*').eq('household_id', profile.household_id)
                .order('created_at'),
            supabase.from('household_invites')
                .select('*').eq('household_id', profile.household_id)
                .order('created_at', { ascending: false }),
        ])
        setMembers(membersRes.data ?? [])
        setInvites(invitesRes.data ?? [])
        setLoading(false)
    }, [profile?.household_id])

    // Load invites addressed to current user (to accept/decline)
    // (state lives in the auth store; just refresh on mount)
    useEffect(() => { loadData() }, [loadData])
    useEffect(() => { loadPendingInvites() }, [loadPendingInvites])

    // Create household
    const handleCreate = async () => {
        if (!householdName.trim()) return
        setCreating(true)
        const { data } = await supabase
            .from('households')
            .insert({ name: householdName.trim(), created_by: user.id })
            .select().single()
        if (data) {
            await supabase.from('profiles')
                .update({ household_id: data.id })
                .eq('id', user.id)
            refreshProfile()
        }
        setCreating(false)
        setCreateOpen(false)
        setHouseholdName('')
    }

    // Rename household
    const handleRename = async () => {
        if (!renameName.trim() || !household) return
        await supabase.from('households')
            .update({ name: renameName.trim() })
            .eq('id', household.id)
        refreshProfile()
        setRenameOpen(false)
    }

    // Open member dialog for add or edit
    const openMemberDialog = (member = null) => {
        setEditingMember(member)
        setMemberName(member?.name ?? '')
        setMemberGender(member?.gender ?? '')
        setMemberBirthYear(member?.birth_year?.toString() ?? '')
        setMemberOpen(true)
    }

    const closeMemberDialog = () => {
        setMemberOpen(false)
        setEditingMember(null)
        setMemberName('')
        setMemberGender('')
        setMemberBirthYear('')
    }

    // Add or update member
    const handleSaveMember = async () => {
        if (!memberName.trim() || !profile?.household_id) return
        const payload = {
            name: memberName.trim(),
            gender: memberGender || null,
            birth_year: memberBirthYear ? parseInt(memberBirthYear, 10) : null,
        }
        if (editingMember) {
            await supabase.from('household_members')
                .update(payload).eq('id', editingMember.id)
        } else {
            await supabase.from('household_members')
                .insert({ ...payload, household_id: profile.household_id })
        }
        closeMemberDialog()
        loadData()
    }

    // Remove member
    const handleRemoveMember = async (id) => {
        await supabase.from('household_members').delete().eq('id', id)
        loadData()
    }

    // RFC4122 v4 UUID — fallback for browsers without crypto.randomUUID
    const generateUuid = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            try { return crypto.randomUUID() } catch { /* fall through */ }
        }
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const bytes = new Uint8Array(16)
            crypto.getRandomValues(bytes)
            bytes[6] = (bytes[6] & 0x0f) | 0x40
            bytes[8] = (bytes[8] & 0x3f) | 0x80
            const h = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
            return `${h.slice(0, 4).join('')}-${h.slice(4, 6).join('')}-${h.slice(6, 8).join('')}-${h.slice(8, 10).join('')}-${h.slice(10, 16).join('')}`
        }
        // Last-resort (non-crypto)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    // Send invite — email is optional. Returns a shareable link via the
    // generated token.
    const handleInvite = async () => {
        if (!profile?.household_id) return
        setInviteError(null)
        setInviteWorking(true)
        try {
            const email = inviteEmail.trim().toLowerCase() || null
            const token = generateUuid()
            const { error } = await supabase
                .from('household_invites')
                .insert({
                    household_id: profile.household_id,
                    email,
                    invited_by: user.id,
                    token,
                })
            if (error) {
                console.error('Failed to create invite', error)
                setInviteError(error.message || 'Could not create invite.')
                return
            }
            const url = `${window.location.origin}${import.meta.env.BASE_URL}invite/${token}`
                .replace(/([^:])\/\//g, '$1/')
            setLastInviteLink(url)
            setLinkCopied(false)
            setInviteOpen(false)
            setInviteEmail('')
            loadData()
        } catch (e) {
            console.error(e)
            setInviteError(e?.message || 'Unexpected error.')
        } finally {
            setInviteWorking(false)
        }
    }

    // Build a share URL for an existing invite row
    const inviteUrlFor = (inv) =>
        `${window.location.origin}${import.meta.env.BASE_URL}invite/${inv.token}`
            .replace(/([^:])\/\//g, '$1/')

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            setLastInviteLink(text)
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch {
            // Fallback: show in dialog so user can copy manually
            setLastInviteLink(text)
        }
    }

    // Accept invite — if user is already in a household, confirm the switch
    const handleAcceptInvite = async (invite) => {
        if (profile?.household_id && profile.household_id !== invite.household_id) {
            setSwitchInvite(invite)
            return
        }
        await acceptInviteAction(invite)
        loadData()
    }

    // Confirmed switch from existing household to invited one
    const handleConfirmSwitch = async () => {
        if (!switchInvite) return
        await acceptInviteAction(switchInvite)
        setSwitchInvite(null)
        loadData()
    }

    // Decline invite
    const handleDeclineInvite = async (invite) => {
        await declineInviteAction(invite)
    }

    // Leave household
    const handleLeave = async () => {
        await supabase.from('profiles')
            .update({ household_id: null })
            .eq('id', user.id)
        refreshProfile()
    }

    const genderLabel = (g) => ({ male: '♂', female: '♀', other: '⚧' }[g] || '')

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 12, pt: '96px' }}>
            <TopBar />

            <Box sx={{ px: 2 }}>
                {/* Back button */}
                <IconButton onClick={() => navigate(-1)} sx={{ mb: 1, ml: -1 }}>
                    <ArrowBackIcon />
                </IconButton>

                {/* Pending invites for current user */}
                {pendingInvites.length > 0 && (
                    <Card sx={{ mb: 2, borderRadius: '8px', border: '1px solid', borderColor: 'primary.main', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Pending Invitations
                            </Typography>
                            {pendingInvites.map((inv) => (
                                <Box key={inv.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">
                                        Join <strong>{inv.households?.name || 'Household'}</strong>
                                    </Typography>
                                    <Box>
                                        <IconButton size="small" color="success" onClick={() => handleAcceptInvite(inv)}>
                                            <CheckIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeclineInvite(inv)}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* No household — create or wait for invite */}
                {!profile?.household_id && (
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <HomeIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.4 }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                            You're not part of a household yet
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setCreateOpen(true)}
                            sx={{ borderRadius: '8px', textTransform: 'none' }}
                        >
                            Create Household
                        </Button>
                    </Box>
                )}

                {/* Household exists */}
                {profile?.household_id && household && (
                    <>
                        {/* Household header */}
                        <Card sx={{ mb: 2, borderRadius: '8px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                                        <HomeIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {household.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Created {new Date(household.created_at).toLocaleDateString('de-DE')}
                                        </Typography>
                                    </Box>
                                </Box>
                                {isCreator && (
                                    <IconButton
                                        size="small"
                                        onClick={() => { setRenameName(household.name); setRenameOpen(true) }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </CardContent>
                        </Card>

                        {loading ? (
                            <SkeletonList rows={4} avatarSize={36} showTrailing={false} sx={{ mt: 2 }} />
                        ) : (
                            <>
                                {/* Members section */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle2">
                                        Members ({members.length})
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => openMemberDialog()}
                                        sx={{ textTransform: 'none', color: 'text.primary' }}
                                    >
                                        Add
                                    </Button>
                                </Box>

                                <Card sx={{ mb: 2, borderRadius: '8px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                                    <List disablePadding>
                                        {members.map((m, i) => (
                                            <Box key={m.id}>
                                                {i > 0 && <Divider variant="inset" component="li" />}
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: 'background.default', color: 'text.primary', width: 36, height: 36, fontSize: 14, border: '1px solid', borderColor: 'divider' }}>
                                                            {genderLabel(m.gender) || m.name[0]?.toUpperCase()}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={m.name}
                                                        secondary={m.birth_year ? `Born ${m.birth_year}` : null}
                                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                                        secondaryTypographyProps={{ variant: 'caption' }}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton size="small" onClick={() => openMemberDialog(m)}>
                                                            <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                        </IconButton>
                                                        <IconButton edge="end" size="small" onClick={() => handleRemoveMember(m.id)}>
                                                            <DeleteIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </Box>
                                        ))}

                                        {members.length === 0 && (
                                            <ListItem>
                                                <ListItemText
                                                    primary="No family members added yet"
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', sx: { textAlign: 'center', py: 1 } }}
                                                />
                                            </ListItem>
                                        )}
                                    </List>
                                </Card>

                                {/* Invites section */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle2">
                                        Invites
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<LinkIcon />}
                                        onClick={() => setInviteOpen(true)}
                                        sx={{ textTransform: 'none', color: 'text.primary' }}
                                    >
                                        Create Link
                                    </Button>
                                </Box>

                                <Card sx={{ mb: 3, borderRadius: '8px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                                    <List disablePadding>
                                        {invites.map((inv, i) => (
                                            <Box key={inv.id}>
                                                {i > 0 && <Divider component="li" />}
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: 'background.default', color: 'text.primary', width: 36, height: 36, border: '1px solid', borderColor: 'divider' }}>
                                                            {inv.email
                                                                ? <EmailIcon sx={{ fontSize: 18 }} />
                                                                : <LinkIcon sx={{ fontSize: 18 }} />}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={inv.email || 'Link invite'}
                                                        secondary={`${inv.status} · ${new Date(inv.created_at).toLocaleDateString('de-DE')}`}
                                                        primaryTypographyProps={{ variant: 'body2' }}
                                                        secondaryTypographyProps={{ variant: 'caption' }}
                                                    />
                                                    {inv.status === 'pending' && inv.token && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => copyToClipboard(inviteUrlFor(inv))}
                                                            title="Copy invite link"
                                                            sx={{ mr: 0.5 }}
                                                        >
                                                            <ContentCopyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                        </IconButton>
                                                    )}
                                                    <Chip
                                                        size="small"
                                                        label={inv.status}
                                                        sx={{
                                                            fontSize: 10, height: 20,
                                                            bgcolor: inv.status === 'accepted' ? 'rgba(78,205,196,0.15)' :
                                                                inv.status === 'declined' ? 'rgba(255,107,107,0.15)' : 'background.default',
                                                            color: inv.status === 'accepted' ? 'secondary.main' :
                                                                inv.status === 'declined' ? 'primary.main' : 'text.secondary',
                                                        }}
                                                    />
                                                </ListItem>
                                            </Box>
                                        ))}
                                        {invites.length === 0 && (
                                            <ListItem>
                                                <ListItemText
                                                    primary="No invites sent"
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', sx: { textAlign: 'center', py: 1 } }}
                                                />
                                            </ListItem>
                                        )}
                                    </List>
                                </Card>

                                {/* Leave household */}
                                {!isCreator && (
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        onClick={handleLeave}
                                        sx={{ borderRadius: '8px', textTransform: 'none', mb: 2 }}
                                    >
                                        Leave Household
                                    </Button>
                                )}
                            </>
                        )}
                    </>
                )}
            </Box>

            {/* ── Create Household Dialog ── */}
            <Dialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Create Household</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Household name"
                        value={householdName}
                        onChange={(e) => setHouseholdName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={creating || !householdName.trim()} variant="contained">
                        {creating ? <CircularProgress size={20} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Rename Household Dialog ── */}
            <Dialog
                open={renameOpen}
                onClose={() => setRenameOpen(false)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Rename Household</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="New name"
                        value={renameName}
                        onChange={(e) => setRenameName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRenameOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleRename} disabled={!renameName.trim()} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* ── Add/Edit Member Dialog ── */}
            <Dialog
                open={memberOpen}
                onClose={closeMemberDialog}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>{editingMember ? 'Edit Member' : 'Add Family Member'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        sx={{ mt: 1, mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {['male', 'female', 'other'].map((g) => (
                            <Chip
                                key={g}
                                label={g.charAt(0).toUpperCase() + g.slice(1)}
                                size="small"
                                onClick={() => setMemberGender(memberGender === g ? '' : g)}
                                sx={{
                                    bgcolor: memberGender === g ? 'text.primary' : 'background.default',
                                    color: memberGender === g ? 'background.default' : 'text.primary',
                                    border: '1px solid', borderColor: 'divider',
                                }}
                            />
                        ))}
                    </Box>
                    <TextField
                        fullWidth
                        label="Birth year (optional)"
                        type="number"
                        value={memberBirthYear}
                        onChange={(e) => setMemberBirthYear(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeMemberDialog} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleSaveMember} disabled={!memberName.trim()} variant="contained">
                        {editingMember ? 'Save' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Invite Dialog ── */}
            <Dialog
                open={inviteOpen}
                onClose={() => { if (!inviteWorking) { setInviteOpen(false); setInviteError(null) } }}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Create Invite</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Generate a shareable invite link. Optionally add the
                        invitee's email so they'll see the invite in-app once
                        they sign in with that address.
                    </Typography>
                    {inviteError && (
                        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>{inviteError}</Alert>
                    )}
                    <TextField
                        fullWidth
                        label="Email (optional)"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setInviteOpen(false); setInviteError(null) }} disabled={inviteWorking} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleInvite} disabled={inviteWorking} variant="contained">
                        {inviteWorking ? <CircularProgress size={20} /> : 'Create Link'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Invite Link Created Dialog ── */}
            <Dialog
                open={Boolean(lastInviteLink)}
                onClose={() => setLastInviteLink(null)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Invite Link</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Share this link with the person you want to invite. It
                        expires in 7 days.
                    </Typography>
                    <TextField
                        fullWidth
                        value={lastInviteLink || ''}
                        InputProps={{ readOnly: true }}
                        size="small"
                        onFocus={(e) => e.target.select()}
                    />
                    {linkCopied && (
                        <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                            Copied to clipboard
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLastInviteLink(null)} sx={{ color: 'text.secondary' }}>Close</Button>
                    <Button
                        onClick={() => copyToClipboard(lastInviteLink)}
                        variant="contained"
                        startIcon={<ContentCopyIcon fontSize="small" />}
                    >
                        Copy
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ── Switch Household Confirm Dialog ── */}
            <Dialog
                open={Boolean(switchInvite)}
                onClose={() => setSwitchInvite(null)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Switch Household?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        You are already a member of <strong>{household?.name}</strong>.
                        A user can belong to only one household. Accepting this
                        invite will move you to{' '}
                        <strong>{switchInvite?.households?.name || 'the new household'}</strong>
                        {' '}and decline any other pending invites.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSwitchInvite(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleConfirmSwitch} variant="contained">Switch</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
