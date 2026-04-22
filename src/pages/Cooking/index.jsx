import { useState, useEffect, useCallback } from 'react'
import {
    Box, Typography, TextField, InputAdornment, IconButton,
    Card, CardMedia, CardContent, CircularProgress, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Tabs, Tab, Avatar,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CasinoIcon from '@mui/icons-material/Casino'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import KitchenIcon from '@mui/icons-material/Kitchen'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import TopBar from '../../components/layout/TopBar'
import {
    findByIngredients, searchRecipes, getRandomRecipe,
    getRecipeInfo, recipeImageUrl, ingredientImageUrl,
} from '../../lib/mealdb'
import { useProductEntries } from '../../hooks/useProductEntries'
import { translatePantryNames } from '../../utils/ingredientMap'

export default function Cooking() {
    const [tab, setTab] = useState(0)
    const [query, setQuery] = useState('')
    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)

    // Pantry tab
    const { entries: pantryEntries, loading: pantryLoading } = useProductEntries('in_pantry')
    const [pantryMeals, setPantryMeals] = useState([])
    const [pantrySearched, setPantrySearched] = useState(false)

    // Search handler
    const handleSearch = useCallback(async () => {
        if (!query.trim()) return
        setLoading(true)
        const results = await searchRecipes(query.trim(), 20)
        setMeals(results)
        setLoading(false)
    }, [query])

    // Random meal
    const handleRandom = useCallback(async () => {
        setLoading(true)
        setQuery('')
        const recipe = await getRandomRecipe()
        if (recipe) {
            setSelectedMeal(recipe)
        }
        setLoading(false)
    }, [])

    // Open detail dialog
    const handleOpenDetail = useCallback(async (meal) => {
        setDetailLoading(true)
        setSelectedMeal(null)
        const full = await getRecipeInfo(meal.id)
        setSelectedMeal(full)
        setDetailLoading(false)
    }, [])

    // Pantry-based search
    const handlePantrySearch = useCallback(async () => {
        if (pantryEntries.length === 0) return
        setLoading(true)
        setPantrySearched(true)
        const germanNames = [...new Set(pantryEntries.map((e) => e.name))]
        const englishIngredients = translatePantryNames(germanNames)
        if (englishIngredients.length === 0) {
            setPantryMeals([])
            setLoading(false)
            return
        }
        const results = await findByIngredients(englishIngredients, 20)
        setPantryMeals(results)
        setLoading(false)
    }, [pantryEntries])

    useEffect(() => {
        if (tab === 1 && !pantrySearched && pantryEntries.length > 0 && !pantryLoading) {
            handlePantrySearch()
        }
    }, [tab, pantryEntries, pantryLoading, pantrySearched, handlePantrySearch])

    const displayMeals = tab === 0 ? meals : pantryMeals

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 12, pt: '130px' }}>
            <TopBar />

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={{
                    position: 'fixed', top: 80, left: 0, right: 0, zIndex: 1100,
                    bgcolor: 'background.default',
                    '& .MuiTab-root': { color: 'text.secondary', minHeight: 42 },
                    '& .Mui-selected': { color: 'text.primary' },
                    '& .MuiTabs-indicator': { bgcolor: 'text.primary' },
                }}
            >
                <Tab icon={<RestaurantIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Discover" />
                <Tab icon={<KitchenIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="My Pantry" />
            </Tabs>

            <Box sx={{ px: 2, pt: 1 }}>
                {/* Discover tab */}
                {tab === 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search recipes…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={handleSearch}>
                                                <SearchIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' } }}
                        />
                        <IconButton onClick={handleRandom} sx={{ color: 'text.primary' }}>
                            <CasinoIcon />
                        </IconButton>
                    </Box>
                )}

                {/* Pantry tab header */}
                {tab === 1 && (
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Recipes based on {pantryEntries.length} item{pantryEntries.length !== 1 ? 's' : ''} in your pantry
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={handlePantrySearch}
                            disabled={loading || pantryEntries.length === 0}
                            sx={{ borderColor: 'divider', color: 'text.primary' }}
                        >
                            Refresh
                        </Button>
                    </Box>
                )}

                {/* Loading */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Recipe list */}
                {!loading && displayMeals.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {displayMeals.map((meal) => {
                            const usedCount = meal.usedIngredientCount ?? 0
                            const missedCount = meal.missedIngredientCount ?? 0
                            const missed = meal.missedIngredients ?? []
                            const imgUrl = meal.image || recipeImageUrl(meal.id)

                            return (
                                <Card
                                    key={meal.id}
                                    onClick={() => handleOpenDetail(meal)}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: 'none',
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={imgUrl}
                                        alt={meal.title}
                                        sx={{ width: 110, height: 110, objectFit: 'cover', flexShrink: 0 }}
                                    />
                                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3, mb: 0.5 }}>
                                            {meal.title}
                                        </Typography>

                                        {/* Used / Missing counts */}
                                        {(usedCount > 0 || missedCount > 0) && (
                                            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                {usedCount > 0 && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                                        <CheckCircleIcon sx={{ fontSize: 13, color: 'secondary.main' }} />
                                                        <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary' }}>
                                                            {usedCount} have
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {missedCount > 0 && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                                        <ShoppingCartIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                                                        <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary' }}>
                                                            {missedCount} need
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}

                                        {/* Missing ingredient chips */}
                                        {missed.length > 0 && (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                                                {missed.slice(0, 4).map((ing) => (
                                                    <Chip
                                                        key={ing.id}
                                                        label={ing.name}
                                                        size="small"
                                                        sx={{ fontSize: 9, height: 18, bgcolor: 'rgba(255,107,107,0.12)', color: 'primary.main', border: '1px solid', borderColor: 'primary.main' }}
                                                    />
                                                ))}
                                                {missed.length > 4 && (
                                                    <Chip label={`+${missed.length - 4}`} size="small" sx={{ fontSize: 9, height: 18, bgcolor: 'background.default' }} />
                                                )}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Box>
                )}

                {/* Empty state */}
                {!loading && displayMeals.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
                        <RestaurantIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {tab === 0 ? 'Search for a recipe or tap the dice' : 'No recipes found for your pantry items'}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Detail dialog */}
            <Dialog
                open={!!selectedMeal || detailLoading}
                onClose={() => setSelectedMeal(null)}
                fullWidth
                maxWidth="sm"
                sx={{
                    zIndex: 2200,
                    '& .MuiDialog-container': { alignItems: 'flex-end' },
                }}
                PaperProps={{ sx: { borderRadius: '8px', bgcolor: 'background.paper', mb: 0, mx: 1, maxHeight: 'calc(100vh - 90px)' } }}
            >
                {detailLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : selectedMeal && (
                    <>
                        <CardMedia
                            component="img"
                            height={200}
                            image={selectedMeal.image || recipeImageUrl(selectedMeal.id)}
                            alt={selectedMeal.title}
                            sx={{ objectFit: 'cover' }}
                        />
                        <DialogTitle sx={{ pb: 0.5 }}>
                            {selectedMeal.title}
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {[
                                    selectedMeal.readyInMinutes && `${selectedMeal.readyInMinutes} min`,
                                    selectedMeal.servings && `${selectedMeal.servings} servings`,
                                    ...(selectedMeal.cuisines ?? []),
                                ].filter(Boolean).join(' · ')}
                            </Typography>
                        </DialogTitle>
                        <DialogContent sx={{ pt: 1 }}>
                            {/* Ingredients */}
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Ingredients</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                                {(selectedMeal.extendedIngredients ?? []).map((ing, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar
                                            src={ingredientImageUrl(ing.image)}
                                            alt={ing.name}
                                            sx={{ width: 28, height: 28, bgcolor: 'background.default' }}
                                        />
                                        <Typography variant="caption" sx={{ fontSize: 12 }}>
                                            {ing.original}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            {/* Instructions */}
                            {selectedMeal.instructions && (
                                <>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Instructions</Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontSize: 13, '& ol, & ul': { pl: 2 }, '& li': { mb: 0.5 } }}
                                        dangerouslySetInnerHTML={{ __html: selectedMeal.instructions }}
                                    />
                                </>
                            )}

                            {/* Nutrition summary */}
                            {selectedMeal.nutrition?.nutrients && (
                                <>
                                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Nutrition (per serving)</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selectedMeal.nutrition.nutrients
                                            .filter((n) => ['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name))
                                            .map((n) => (
                                                <Chip
                                                    key={n.name}
                                                    size="small"
                                                    label={`${n.name}: ${Math.round(n.amount)}${n.unit}`}
                                                    sx={{ fontSize: 10, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}
                                                />
                                            ))
                                        }
                                    </Box>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            {selectedMeal.sourceUrl && (
                                <Button
                                    size="small"
                                    startIcon={<OpenInNewIcon />}
                                    href={selectedMeal.sourceUrl}
                                    target="_blank"
                                    rel="noopener"
                                    sx={{ color: 'text.primary' }}
                                >
                                    Source
                                </Button>
                            )}
                            <Button size="small" onClick={() => setSelectedMeal(null)} sx={{ color: 'text.primary' }}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    )
}
