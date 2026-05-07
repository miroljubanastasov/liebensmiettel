import { useState } from 'react'
import { Box, Button, TextField, Typography, Stack, Alert } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import { supabase } from '../../lib/supabase'

export default function Auth() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSendMagicLink = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + import.meta.env.BASE_URL,
            },
        })

        if (error) {
            setError(error.message)
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    return (
        <Box sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                Welcome to Lebensmittel
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {sent
                    ? `We sent a magic sign-in link to ${email}. Open it on this device to finish signing in.`
                    : 'Enter your email to receive a magic sign-in link.'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {sent && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Magic link sent. Check your inbox (and spam folder).
                </Alert>
            )}

            {!sent ? (
                <Stack component="form" onSubmit={handleSendMagicLink} spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        autoFocus
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<EmailIcon />}
                        loading={loading}
                        fullWidth
                    >
                        Send magic link
                    </Button>
                </Stack>
            ) : (
                <Button
                    variant="text"
                    size="small"
                    onClick={() => { setSent(false); setError(null) }}
                >
                    Use a different email
                </Button>
            )}

            {import.meta.env.DEV && (
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true)
                        setError(null)
                        const { error } = await supabase.auth.signInWithPassword({
                            email: 'test@liebensmittel.app',
                            password: 'Test1234!',
                        })
                        if (error) setError(error.message)
                        setLoading(false)
                    }}
                >
                    Dev Login (test@liebensmittel.app)
                </Button>
            )}
        </Box>
    )
}
