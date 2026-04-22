import { Badge, Box, IconButton, Typography } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/classify'

const ALL_CATEGORY = 'All'

export const CATEGORY_ITEMS = [ALL_CATEGORY, ...CATEGORIES.filter((c) => c !== 'Other'), 'Other']

export default function CategoryNav({ activeIndex, transitioning, onSwiper, onCatSlideStart, onCatSlideChange, counts = {}, static: isStatic = false }) {
    const positionSx = isStatic
        ? { position: 'static' }
        : { position: 'fixed', top: 70, left: 0, right: 0, zIndex: 1100 }
    return (
        <Box sx={{ bgcolor: 'background.default', py: 1, overflow: 'visible', ...positionSx }}>
            <Swiper
                onSwiper={onSwiper}
                onSlideChangeTransitionStart={onCatSlideStart}
                onSlideChangeTransitionEnd={onCatSlideChange}
                loop
                centeredSlides
                slidesPerView={5}
                spaceBetween={4}
                slideToClickedSlide
                speed={250}
                style={{ paddingTop: 1, paddingBottom: 1, overflow: 'visible' }}
            >
                {CATEGORY_ITEMS.map((cat, idx) => {
                    const isActive = !transitioning && idx === activeIndex
                    const Icon = cat === ALL_CATEGORY ? null : CATEGORY_ICONS[cat]
                    const count = counts[cat] ?? 0

                    return (
                        <SwiperSlide key={cat}>
                            <Box
                                sx={{
                                    py: 0.5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    gap: 0.5,
                                    transition: 'transform 0.25s ease, opacity 0.25s ease',
                                    transform: isActive ? 'scale(1.15)' : 'scale(0.9)',
                                    opacity: isActive ? 1 : 0.55,
                                }}
                            >
                                <Badge
                                    badgeContent={isActive ? count : 0}
                                    color="primary"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: 9,
                                            minWidth: 16,
                                            height: 16,
                                            padding: '0 3px',
                                        },
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        disableRipple
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: isActive ? 'background.paper' : 'transparent',
                                            border: isActive ? '2px solid' : '2px solid transparent',
                                            borderColor: isActive ? 'text.primary' : 'transparent',
                                            color: isActive ? 'text.primary' : 'text.secondary',
                                            transition: 'all 0.25s ease',
                                        }}
                                    >
                                        {Icon ? <Icon fontSize="small" /> : (
                                            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11 }}>ALL</Typography>
                                        )}
                                    </IconButton>
                                </Badge>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: 10,
                                        fontWeight: isActive ? 700 : 400,
                                        color: isActive ? 'text.primary' : 'text.secondary',
                                        textAlign: 'center',
                                        lineHeight: 1.2,
                                        maxWidth: 64,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {cat}
                                </Typography>
                            </Box>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </Box>
    )
}
