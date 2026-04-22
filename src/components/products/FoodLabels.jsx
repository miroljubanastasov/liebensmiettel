import { useMemo } from 'react'
import { Box, Tooltip } from '@mui/material'
import { resolveLabels } from '../../data/foodLabels'

/**
 * Renders applicable food-certification label icons as monochrome badges.
 *
 * @param {{ labels: string[], size?: number }} props
 *   labels — array of Open Food Facts tag strings (e.g. ["en:organic","en:vegan"])
 *   size   — icon diameter in px (default 20)
 */
export default function FoodLabels({ labels, size = 20, plain = false }) {
    const resolved = useMemo(() => resolveLabels(labels), [labels])

    if (resolved.length === 0) return null

    return (
        <Box sx={{ display: 'inline-flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
            {resolved.map((label) => (
                <Tooltip key={label.id} title={label.name} arrow>
                    {plain ? (
                        label.imageUrl ? (
                            <img
                                src={label.imageUrl}
                                alt={label.name}
                                width={size}
                                height={size}
                                style={{ objectFit: 'contain', flexShrink: 0 }}
                            />
                        ) : (
                            <svg
                                width={size}
                                height={size}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                style={{ color: 'var(--mui-palette-text-primary)', flexShrink: 0 }}
                            >
                                <path d={label.icon} />
                            </svg>
                        )
                    ) : (
                        label.imageUrl ? (
                            <img
                                src={label.imageUrl}
                                alt={label.name}
                                width={size}
                                height={size}
                                style={{ objectFit: 'contain', flexShrink: 0 }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: size,
                                    height: size,
                                    borderRadius: '50%',
                                    bgcolor: 'secondary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <svg
                                    width={size * 0.6}
                                    height={size * 0.6}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    style={{ color: 'var(--mui-palette-secondary-contrastText, #f8ffff)' }}
                                >
                                    <path d={label.icon} />
                                </svg>
                            </Box>
                        )
                    )}
                </Tooltip>
            ))}
        </Box>
    )
}
