import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box, BottomNavigation, BottomNavigationAction, Paper, CircularProgress } from '@mui/material'
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

  return (
    <Box sx={{ pb: 7 }}>
      <Routes>
        <Route path="/" element={<Pantry />} />
        <Route path="/list" element={<GroceryList />} />
        <Route path="/cooking" element={<Cooking />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/household" element={<Household />} />
      </Routes>

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
