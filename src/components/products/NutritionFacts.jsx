import { Box, Typography } from '@mui/material'

const ROWS = [
    { key: 'energy_kcal', label: 'Energy', unit: 'kcal', bold: true },
    { key: 'fat_g', label: 'Fat', unit: 'g', bold: true },
    { key: 'saturated_fat_g', label: '  Saturated', unit: 'g' },
    { key: 'carbs_g', label: 'Carbs', unit: 'g', bold: true },
    { key: 'sugars_g', label: '  Sugars', unit: 'g' },
    { key: 'fiber_g', label: 'Fiber', unit: 'g' },
    { key: 'protein_g', label: 'Protein', unit: 'g', bold: true },
    { key: 'salt_g', label: 'Salt', unit: 'g' },
]

/**
 * Compact nutrition facts table (per 100 g).
 *
 * @param {{ nutrition: object }} props
 *   nutrition — object with keys: energy_kcal, fat_g, saturated_fat_g, carbs_g,
 *               sugars_g, fiber_g, protein_g, salt_g
 */
export default function NutritionFacts({ nutrition }) {
    if (!nutrition) return null
    const hasAny = ROWS.some((r) => nutrition[r.key] != null)
    if (!hasAny) return null

    return (
        <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 10, mb: 0.25, display: 'block' }}>
                per 100 g
            </Typography>
            {ROWS.map(({ key, label, unit, bold }) => {
                const val = nutrition[key]
                if (val == null) return null
                return (
                    <Box
                        key={key}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            py: 0.15,
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{ fontSize: 11, fontWeight: bold ? 600 : 400, color: 'text.secondary' }}
                        >
                            {label}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ fontSize: 11, fontWeight: bold ? 600 : 400, color: 'text.primary' }}
                        >
                            {Number(val).toFixed(key === 'energy_kcal' ? 0 : 1)} {unit}
                        </Typography>
                    </Box>
                )
            })}
        </Box>
    )
}
