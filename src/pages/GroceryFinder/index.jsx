import { Box, Typography } from '@mui/material'

export default function GroceryFinder() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Grocery Finder</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Find the cheapest store for your basket. Coming soon.
      </Typography>
    </Box>
  )
}
