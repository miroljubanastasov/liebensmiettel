import { useState, useEffect, useCallback } from 'react'
import {
    Box, Typography, TextField, Button, IconButton,
    Card, CardContent, Avatar, Chip, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction,
    Divider,
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

    const [members, setMembers] = useState([])
    const [invites, setInvites] = useState([])
    const [pendingInvites, setPendingInvites] = useState([])
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
    const loadPendingInvites = useCallback(async () => {
        if (!user?.email) return
        const { data } = await supabase
            .from('household_invites')
            .select('*, households(name)')
            .eq('email', user.email)
            .eq('status', 'pending')
        setPendingInvites(data ?? [])
    }, [user?.email])

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

    // Send invite
    const handleInvite = async () => {
        if (!inviteEmail.trim() || !profile?.household_id) return
        await supabase.from('household_invites').insert({
            household_id: profile.household_id,
            email: inviteEmail.trim().toLowerCase(),
            invited_by: user.id,
        })
        setInviteOpen(false)
        setInviteEmail('')
        loadData()
    }

    // Accept invite
    const handleAcceptInvite = async (invite) => {
        await supabase.from('household_invites')
            .update({ status: 'accepted' })
            .eq('id', invite.id)
        await supabase.from('profiles')
            .update({ household_id: invite.household_id })
            .eq('id', user.id)
        refreshProfile()
        loadPendingInvites()
    }

    // Decline invite
    const handleDeclineInvite = async (invite) => {
        await supabase.from('household_invites')
            .update({ status: 'declined' })
            .eq('id', invite.id)
        loadPendingInvites()
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
                                        startIcon={<EmailIcon />}
                                        onClick={() => setInviteOpen(true)}
                                        sx={{ textTransform: 'none', color: 'text.primary' }}
                                    >
                                        Invite
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
                                                            <EmailIcon sx={{ fontSize: 18 }} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={inv.email}
                                                        secondary={`${inv.status} · ${new Date(inv.created_at).toLocaleDateString('de-DE')}`}
                                                        primaryTypographyProps={{ variant: 'body2' }}
                                                        secondaryTypographyProps={{ variant: 'caption' }}
                                                    />
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
                        autoFocus fullWidth
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
                        autoFocus fullWidth
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
                        autoFocus fullWidth
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
                onClose={() => setInviteOpen(false)}
                fullWidth maxWidth="xs"
                sx={{ zIndex: 2200 }}
                PaperProps={{ sx: { borderRadius: '8px' } }}
            >
                <DialogTitle>Invite to Household</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        The invited person must have a Liebensmittel account with this email.
                    </Typography>
                    <TextField
                        autoFocus fullWidth
                        label="Email address"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInviteOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleInvite} disabled={!inviteEmail.trim()} variant="contained">Send Invite</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
