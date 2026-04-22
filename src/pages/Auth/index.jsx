import { useState } from 'react'
import { Box, Button, TextField, Typography, Stack, Alert } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LoginIcon from '@mui/icons-material/Login'
import { supabase } from '../../lib/supabase'

export default function Auth() {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState('email') // 'email' | 'otp'
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Check your email for the login code.')
            setStep('otp')
        }
        setLoading(false)
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email',
        })

        if (error) {
            setError(error.message)
        }
        // On success, onAuthStateChange in authStore picks up the session automatically
        setLoading(false)
    }

    return (
        <Box sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                Welcome to Lebensmittel
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {step === 'email'
                    ? 'Enter your email to receive a one-time login code.'
                    : `We sent a 6-digit code to ${email}`}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && step === 'otp' && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            {step === 'email' ? (
                <Stack component="form" onSubmit={handleSendOtp} spacing={2}>
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
                        Send login code
                    </Button>
                </Stack>
            ) : (
                <Stack component="form" onSubmit={handleVerifyOtp} spacing={2}>
                    <TextField
                        label="6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        fullWidth
                        autoFocus
                        inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<LoginIcon />}
                        loading={loading}
                        disabled={otp.length < 6}
                        fullWidth
                    >
                        Verify & sign in
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => { setStep('email'); setOtp(''); setError(null); setMessage(null) }}
                    >
                        Use a different email
                    </Button>
                </Stack>
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
