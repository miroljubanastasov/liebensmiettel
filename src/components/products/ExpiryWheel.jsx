import { useMemo } from 'react'
import { Box, Typography, useTheme } from '@mui/material'

function getShelfLife(expiryDate, shelvedAt) {
    const now = new Date()
    const exp = new Date(expiryDate)
    const diffMs = exp - now
    const diffDays = Math.ceil(diffMs / 86400000)

    let label
    if (diffDays < 0) {
        const ago = Math.abs(diffDays)
        label = ago === 1 ? '1d ago' : ago < 30 ? `${ago}d ago` : `${Math.floor(ago / 30)}mo`
    } else if (diffDays === 0) {
        label = 'today'
    } else if (diffDays < 30) {
        label = `${diffDays}d`
    } else if (diffDays < 365) {
        label = `${Math.floor(diffDays / 30)}mo`
    } else {
        label = `${Math.floor(diffDays / 365)}y`
    }

    let pct = 50
    if (shelvedAt) {
        const shelved = new Date(shelvedAt)
        const totalMs = exp - shelved
        if (totalMs > 0) {
            pct = Math.min(100, Math.max(0, ((exp - now) / totalMs) * 100))
        }
    }
    if (diffDays < 0) pct = 0

    return { label, pct, diffDays }
}

/**
 * Circular expiry-date gauge — monochrome, theme-coloured.
 *
 * Shows remaining shelf-life as a donut arc with a compact centre label.
 *
 * @param {{ expiryDate: string, shelvedAt?: string, size?: number }} props
 */
export default function ExpiryWheel({ expiryDate, shelvedAt, size = 36 }) {
    const theme = useTheme()
    const { label, pct, diffDays } = useMemo(
        () => getShelfLife(expiryDate, shelvedAt),
        [expiryDate, shelvedAt],
    )

    const stroke = 3
    const r = (size - stroke) / 2
    const circumference = 2 * Math.PI * r
    const offset = circumference * (1 - pct / 100)

    // Monochrome: use text.primary for the arc, faded for the track
    const arcColor = theme.palette.text.primary
    const trackColor = theme.palette.text.disabled
    const textColor = diffDays < 0 ? theme.palette.primary.main : theme.palette.text.primary

    return (
        <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={stroke}
                    opacity={0.35}
                />
                {/* Arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={arcColor}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
            </svg>
            <Typography
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: size * 0.24,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: textColor,
                    whiteSpace: 'nowrap',
                }}
            >
                {label}
            </Typography>
        </Box>
    )
}
