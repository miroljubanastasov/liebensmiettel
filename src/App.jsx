import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ListAltIcon from '@mui/icons-material/ListAlt'
import KitchenIcon from '@mui/icons-material/Kitchen'
import HomeIcon from '@mui/icons-material/Home'

import theme from './theme'
import { useAuthStore } from './store/authStore'

import Home from './pages/Home'
import GroceryFinder from './pages/GroceryFinder'
import GroceryList from './pages/GroceryList'
import Inventory from './pages/Inventory'
import Auth from './pages/Auth'

const NAV_ROUTES = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/finder', label: 'Finder', icon: <SearchIcon /> },
  { path: '/list', label: 'List', icon: <ListAltIcon /> },
  { path: '/inventory', label: 'Pantry', icon: <KitchenIcon /> },
]

function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, init } = useAuthStore()

  useEffect(() => { init() }, [init])

  if (loading) return null
  if (!user) return <Auth />

  const currentTab = NAV_ROUTES.findIndex((r) => r.path === location.pathname)

  return (
    <Box sx={{ pb: 8 }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/finder" element={<GroceryFinder />} />
        <Route path="/list" element={<GroceryList />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          value={currentTab === -1 ? 0 : currentTab}
          onChange={(_, newValue) => navigate(NAV_ROUTES[newValue].path)}
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
