import { createTheme, lighten, darken } from '@mui/material/styles'

// ---- Procedural palette ---------------------------------------------------
// Set the two brand colors; everything else (light variants, background,
// text, divider) is derived from SECONDARY.
const PRIMARY_MAIN = '#ff6b6b'
const SECONDARY_MAIN = '#4ecdc4'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: PRIMARY_MAIN,
            light: lighten(PRIMARY_MAIN, 0.5),       // 50% lighter
            contrastText: '#ffffff',
        },
        secondary: {
            main: SECONDARY_MAIN,
            light: lighten(SECONDARY_MAIN, 0.5),     // 50% lighter
            contrastText: '#ffffff',
        },
        background: {
            default: lighten(SECONDARY_MAIN, 0.8),  // very light tint of secondary
            paper: '#ffffff',
        },
        text: {
            primary: darken(SECONDARY_MAIN, 0.5),    // darker shade of secondary
            secondary: darken(SECONDARY_MAIN, 0.3),  // slightly lighter than text.primary
            disabled: lighten(SECONDARY_MAIN, 0.6),
        },
        divider: lighten(SECONDARY_MAIN, 0.2),
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 32 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
            },
        },
        MuiBottomNavigation: {
            styleOverrides: {
                root: { borderTop: '1px solid rgba(0,0,0,0.08)' },
            },
        },
        MuiBottomNavigationAction: {
            styleOverrides: {
                root: {
                    color: '#f8ffff',
                    opacity: 0.6,
                    '&.Mui-selected': {
                        color: '#f8ffff',
                        opacity: 1,
                    },
                },
            },
        },
    },
})

export default theme
