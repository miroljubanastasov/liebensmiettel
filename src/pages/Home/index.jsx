import { Box, Typography, Button, Stack, Card, CardContent } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ListAltIcon from '@mui/icons-material/ListAlt'
import KitchenIcon from '@mui/icons-material/Kitchen'
import { useNavigate } from 'react-router-dom'

const pillars = [
  { icon: <SearchIcon fontSize="large" />, title: 'Grocery Finder', desc: 'Find the best price near you', path: '/finder', color: '#E8F5E9' },
  { icon: <ListAltIcon fontSize="large" />, title: 'Shopping List', desc: 'Smart list with price splits', path: '/list', color: '#FFF8E1' },
  { icon: <KitchenIcon fontSize="large" />, title: 'Home Inventory', desc: 'Scan receipts, track stock', path: '/inventory', color: '#E3F2FD' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Lebensmittel
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your grocery companion — find, list, track.
      </Typography>
      <Stack spacing={2}>
        {pillars.map(({ icon, title, desc, path, color }) => (
          <Card key={path} sx={{ bgcolor: color, cursor: 'pointer' }} onClick={() => navigate(path)}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {icon}
              <Box>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="text.secondary">{desc}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
