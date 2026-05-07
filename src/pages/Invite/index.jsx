import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Box, Card, CardContent, Typography, Button, Alert, CircularProgress, Stack,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

const PENDING_TOKEN_KEY = 'pendingInviteToken'

export default function InvitePage() {
    const { token } = useParams()
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const profile = useAuthStore((s) => s.profile)
    const household = useAuthStore((s) => s.household)
    const refreshProfile = useAuthStore((s) => s.refreshProfile)

    const [invite, setInvite] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [working, setWorking] = useState(false)
    const [done, setDone] = useState(false)
    const [confirmSwitch, setConfirmSwitch] = useState(false)

    // Look up invite by token (public, anon-allowed RPC)
    useEffect(() => {
        let cancelled = false
        async function fetchInvite() {
            setLoading(true)
            setError(null)
            const { data, error } = await supabase.rpc('get_invite_by_token', { t: token })
            if (cancelled) return
            if (error) {
                setError(error.message)
            } else if (!data || data.length === 0) {
                setError('This invite link is invalid.')
            } else {
                setInvite(data[0])
            }
            setLoading(false)
        }
        fetchInvite()
        return () => { cancelled = true }
    }, [token])

    // After login, auto-redirect back to this page if a token was stashed.
    // (We're already on this page, so just clear the stash.)
    useEffect(() => {
        if (user) localStorage.removeItem(PENDING_TOKEN_KEY)
    }, [user])

    const handleSignIn = () => {
        if (token) localStorage.setItem(PENDING_TOKEN_KEY, token)
        navigate('/')
    }

    const handleAccept = async () => {
        // Single-household rule: if user is already in a different household,
        // require explicit confirmation before switching.
        if (profile?.household_id && profile.household_id !== invite.household_id) {
            setConfirmSwitch(true)
            return
        }
        await doAccept()
    }

    const doAccept = async () => {
        setWorking(true)
        setError(null)
        const { error } = await supabase.rpc('accept_invite_by_token', { t: token })
        if (error) {
            setError(humanError(error.message))
            setWorking(false)
            return
        }
        await refreshProfile()
        setDone(true)
        setWorking(false)
    }

    const handleDecline = async () => {
        setWorking(true)
        setError(null)
        const { error } = await supabase.rpc('decline_invite_by_token', { t: token })
        if (error) {
            setError(humanError(error.message))
            setWorking(false)
            return
        }
        navigate('/')
    }

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', placeItems: 'center', p: 2 }}>
            <Card sx={{ maxWidth: 420, width: '100%', borderRadius: '12px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <HomeIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Household Invite</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {invite && !done && !confirmSwitch && (
                        <>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                You've been invited to join{' '}
                                <strong>{invite.household_name}</strong>.
                            </Typography>

                            {invite.status !== 'pending' && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    This invite has already been {invite.status}.
                                </Alert>
                            )}

                            {invite.status === 'pending' && new Date(invite.expires_at) < new Date() && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    This invite has expired.
                                </Alert>
                            )}

                            {invite.status === 'pending' && new Date(invite.expires_at) >= new Date() && (
                                <>
                                    {!user ? (
                                        <Stack spacing={1.5} sx={{ mt: 3 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Sign in or create an account to accept this invite.
                                            </Typography>
                                            <Button variant="contained" onClick={handleSignIn}>
                                                Sign in / Sign up
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={handleAccept}
                                                disabled={working}
                                                sx={{ flex: 1 }}
                                            >
                                                {working ? <CircularProgress size={20} /> : 'Accept'}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={handleDecline}
                                                disabled={working}
                                                sx={{ flex: 1 }}
                                            >
                                                Decline
                                            </Button>
                                        </Stack>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {confirmSwitch && (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                You are already a member of <strong>{household?.name}</strong>.
                                A user can belong to only one household. Accepting this invite
                                will move you to <strong>{invite.household_name}</strong> and
                                decline any other pending invites.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    onClick={doAccept}
                                    disabled={working}
                                    sx={{ flex: 1 }}
                                >
                                    {working ? <CircularProgress size={20} /> : 'Switch'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setConfirmSwitch(false)}
                                    disabled={working}
                                    sx={{ flex: 1 }}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </>
                    )}

                    {done && (
                        <>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Welcome to <strong>{invite.household_name}</strong>!
                            </Alert>
                            <Button fullWidth variant="contained" onClick={() => navigate('/')}>
                                Continue
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}

function humanError(msg) {
    if (!msg) return 'Something went wrong.'
    if (msg.includes('not_authenticated')) return 'Please sign in to accept this invite.'
    if (msg.includes('invite_not_found')) return 'This invite link is invalid.'
    if (msg.includes('invite_not_pending')) return 'This invite has already been used.'
    if (msg.includes('invite_expired')) return 'This invite has expired.'
    return msg
}

export { PENDING_TOKEN_KEY }
