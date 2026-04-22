import { Box, Typography } from '@mui/material'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import TopBar from '../../components/layout/TopBar'

export default function Nutrition() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: '158px' }}>
            <TopBar />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 8, gap: 2, opacity: 0.4 }}>
                <MonitorHeartIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">Nutrition</Typography>
                <Typography variant="body2" color="text.disabled">Coming soon</Typography>
            </Box>
        </Box>
    )
}
