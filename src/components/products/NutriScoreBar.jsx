import { Box, Typography } from '@mui/material'

const GRADES = [
    { letter: 'A', color: '#038141' },
    { letter: 'B', color: '#85bb2f' },
    { letter: 'C', color: '#fecb02' },
    { letter: 'D', color: '#ee8100' },
    { letter: 'E', color: '#e63e11' },
]

/**
 * Standardised Nutri-Score bar showing all five grades A–E.
 * The active grade is enlarged; inactive grades are faded.
 *
 * @param {{ score: string, size?: 'small'|'normal' }} props
 */
export default function NutriScoreBar({ score, size = 'normal' }) {
    if (!score) return null
    const active = score.toUpperCase()
    const sm = size === 'small'

    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'flex-end', gap: '1px' }}>
            {GRADES.map(({ letter, color }, i) => {
                const hit = letter === active
                const h = sm ? (hit ? 20 : 12) : (hit ? 26 : 16)
                const w = sm ? (hit ? 20 : 12) : (hit ? 26 : 16)
                const radius =
                    i === 0 ? (sm ? '3px 0 0 3px' : '4px 0 0 4px') :
                        i === 4 ? (sm ? '0 3px 3px 0' : '0 4px 4px 0') : '0'

                return (
                    <Box
                        key={letter}
                        sx={{
                            width: w,
                            height: h,
                            bgcolor: color,
                            opacity: hit ? 1 : 0.3,
                            borderRadius: radius,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: hit ? (sm ? 12 : 15) : (sm ? 7 : 9),
                                lineHeight: 1,
                            }}
                        >
                            {letter}
                        </Typography>
                    </Box>
                )
            })}
        </Box>
    )
}
