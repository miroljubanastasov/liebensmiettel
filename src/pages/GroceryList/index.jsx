import { Box, Typography } from '@mui/material'

export default function GroceryList() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Shopping List</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Smart list with price suggestions. Coming soon.
      </Typography>
    </Box>
  )
}
