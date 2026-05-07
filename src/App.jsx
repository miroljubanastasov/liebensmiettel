import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box, BottomNavigation, BottomNavigationAction, Paper, Skeleton } from '@mui/material'
import KitchenIcon from '@mui/icons-material/Kitchen'
import ListAltIcon from '@mui/icons-material/ListAlt'
import RamenDiningIcon from '@mui/icons-material/RamenDining'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import SavingsIcon from '@mui/icons-material/Savings'

import theme from './theme'
import { useAuthStore } from './store/authStore'

import Auth from './pages/Auth'
import Pantry from './pages/Pantry'
import GroceryList from './pages/GroceryList'
import Cooking from './pages/Cooking'
import Nutrition from './pages/Nutrition'
import Budget from './pages/Budget'
import Household from './pages/Household'
import InvitePage, { PENDING_TOKEN_KEY } from './pages/Invite'
import SkeletonList from './components/layout/SkeletonList'

const NAV_ROUTES = [
  { path: '/', label: 'Pantry', icon: <KitchenIcon /> },
  { path: '/list', label: 'List', icon: <ListAltIcon /> },
  { path: '/cooking', label: 'Cooking', icon: <RamenDiningIcon /> },
  { path: '/nutrition', label: 'Nutrition', icon: <MonitorHeartIcon /> },
  { path: '/budget', label: 'Budget', icon: <SavingsIcon /> },
]

function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentTab = NAV_ROUTES.findIndex((r) => r.path === location.pathname)

  // After login, if we stashed an invite token, jump to the invite page.
  useEffect(() => {
    const token = localStorage.getItem(PENDING_TOKEN_KEY)
    if (token) {
      localStorage.removeItem(PENDING_TOKEN_KEY)
      navigate(`/invite/${token}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hideNav = location.pathname.startsWith('/invite/')

  return (
    <Box sx={{ pb: hideNav ? 0 : 7 }}>
      <Routes>
        <Route path="/invite/:token" element={<InvitePage />} />
        <Route path="/" element={<Pantry />} />
        <Route path="/list" element={<GroceryList />} />
        <Route path="/cooking" element={<Cooking />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/household" element={<Household />} />
      </Routes>

      {!hideNav && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200, bgcolor: 'secondary.main' }} elevation={3}>
          <BottomNavigation
            value={currentTab === -1 ? 0 : currentTab}
            onChange={(_, v) => navigate(NAV_ROUTES[v].path)}
            showLabels
            sx={{ bgcolor: 'secondary.main' }}
          >
            {NAV_ROUTES.map(({ label, icon }) => (
              <BottomNavigationAction key={label} label={label} icon={icon} />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  )
}

export default function App() {
  const { user, loading, init } = useAuthStore()

  useEffect(() => { init() }, [init])

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 7 }}>
          {/* Top bar skeleton */}
          <Box
            sx={{
              position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000,
              height: 80, bgcolor: 'background.default',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 2, borderBottom: '1px solid', borderColor: 'divider',
            }}
          >
            <Skeleton variant="circular" width={56} height={56} animation="wave" />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Skeleton variant="text" width={120} height={18} animation="wave" />
              <Skeleton variant="text" width={80} height={10} animation="wave" />
            </Box>
            <Skeleton variant="circular" width={24} height={24} animation="wave" />
          </Box>
          {/* Category chips skeleton */}
          <Box sx={{ pt: '88px', px: 2, display: 'flex', gap: 0.75, overflow: 'hidden' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={64} height={28} animation="wave" />
            ))}
          </Box>
          {/* Content rows skeleton */}
          <Box sx={{ px: 2, pt: 2 }}>
            <SkeletonList rows={6} avatarSize={32} />
          </Box>
          {/* Bottom nav skeleton */}
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200, bgcolor: 'secondary.main', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }} elevation={3}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Skeleton variant="circular" width={22} height={22} animation="wave" />
                <Skeleton variant="text" width={32} height={10} animation="wave" />
              </Box>
            ))}
          </Paper>
        </Box>
      </ThemeProvider>
    )
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/invite/:token" element={<InvitePage />} />
            <Route path="*" element={<Auth />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
