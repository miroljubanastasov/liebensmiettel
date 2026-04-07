import { Box, Typography } from '@mui/material'

export default function Inventory() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Home Inventory</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Scan receipts and track what's in your kitchen. Coming soon.
      </Typography>
    </Box>
  )
}
