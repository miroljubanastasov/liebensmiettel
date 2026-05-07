import { Box, Skeleton } from '@mui/material'

/**
 * Wireframe-style placeholder rows that mirror the pantry / grocery list
 * layout (avatar + two-line text + trailing icon). Renders inline content
 * instead of a spinner so the page keeps its shape while data loads.
 */
export default function SkeletonList({
    rows = 6,
    showTrailing = true,
    avatarSize = 32,
    dense = false,
    sx,
}) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }}>
            {Array.from({ length: rows }).map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        px: 1.5,
                        py: dense ? 0.75 : 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                    }}
                >
                    <Skeleton
                        variant="circular"
                        width={avatarSize}
                        height={avatarSize}
                        animation="wave"
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton
                            variant="text"
                            width={`${55 + ((i * 13) % 30)}%`}
                            height={16}
                            animation="wave"
                        />
                        <Skeleton
                            variant="text"
                            width={`${30 + ((i * 7) % 25)}%`}
                            height={12}
                            animation="wave"
                        />
                    </Box>
                    {showTrailing && (
                        <Skeleton
                            variant="circular"
                            width={24}
                            height={24}
                            animation="wave"
                        />
                    )}
                </Box>
            ))}
        </Box>
    )
}

/**
 * Card-shaped skeleton (image + two text lines) for the Cooking recipe list.
 */
export function SkeletonCardList({ rows = 4, sx }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }}>
            {Array.from({ length: rows }).map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Skeleton
                        variant="rectangular"
                        width={110}
                        height={110}
                        animation="wave"
                        sx={{ flexShrink: 0 }}
                    />
                    <Box sx={{ p: 1.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
                        <Skeleton variant="text" width="85%" height={18} animation="wave" />
                        <Skeleton variant="text" width="60%" height={14} animation="wave" />
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.25 }}>
                            <Skeleton variant="rounded" width={48} height={16} animation="wave" />
                            <Skeleton variant="rounded" width={40} height={16} animation="wave" />
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    )
}
