import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',      // forest green — food / natural feel
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#FF8F00',      // warm amber — grocery / warmth
      light: '#ffc046',
      dark: '#c56000',
    },
    background: {
      default: '#F5F5F0',
      paper: '#FFFFFF',
    },
    error: { main: '#C62828' },
    success: { main: '#2E7D32' },
    warning: { main: '#FF8F00' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
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
  },
})

export default theme
