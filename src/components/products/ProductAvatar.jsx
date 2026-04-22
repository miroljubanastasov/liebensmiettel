import { useMemo } from 'react'
import { Avatar, Box } from '@mui/material'
import { bestMatch } from '../../utils/productMatcher'
import { getGenericByName, findGenericByAlias } from '../../data/productCatalogue'
import { getProductIcon } from '../../data/productIcons'
import { getSubcategoryIcon, getCategoryIcon } from '../../data/subcategories'
import { openMojiBlackUrl } from '../../utils/emojiCodepoint'

/**
 * Resolve an OpenMoji hex code for a product with a 4-tier fallback chain:
 *
 *   1. Exact generic product match (name or alias) → product icon
 *   2. Fuzzy catalogue match (bestMatch ≥ 0.5)     → matched generic's icon
 *   3. Subcategory icon                            (if subcategory prop set)
 *   4. Category icon                               (if category prop set)
 *   5. 🛒 (1F6D2)
 */
function resolveIconHex(name, subcategory, category) {
    if (name) {
        const exact = getGenericByName(name) || findGenericByAlias(name)
        if (exact) return getProductIcon(exact.name, exact.category)

        const m = bestMatch(name, 0.5)
        if (m) return getProductIcon(m.name, m.category)
    }

    if (subcategory) return getSubcategoryIcon(subcategory, category)
    if (category) return getCategoryIcon(category)
    return '1F6D2'
}

/**
 * Product avatar — true monochrome icon themed via currentColor.
 *
 * The emoji we resolve is mapped to an OpenMoji "black" outline SVG, which
 * is rendered as a CSS mask on a coloured box. That means the SVG's shape
 * is preserved but its fill becomes whatever `color` we set (defaults to
 * `primary.contrastText` on a `primary.main` background). No grayscale /
 * brightness filters, no OS-font dependency, no color bleed.
 *
 * @param {object} props
 * @param {string} props.name          — product name (free-text, can be branded)
 * @param {string} [props.subcategory] — fallback when name lookup fails
 * @param {string} [props.category]    — fallback when subcategory lookup fails
 * @param {number} [props.size=36]     — avatar diameter in px
 * @param {string} [props.bgcolor]     — MUI palette key for background
 * @param {string} [props.color]       — MUI palette key for the icon fill
 * @param {object} [props.sx]          — additional MUI sx overrides
 */
export default function ProductAvatar({
    name,
    subcategory,
    category,
    size = 36,
    bgcolor = 'primary.main',
    color = 'primary.contrastText',
    sx,
}) {
    const iconHex = useMemo(
        () => resolveIconHex(name || '', subcategory, category),
        [name, subcategory, category],
    )

    const iconUrl = useMemo(() => openMojiBlackUrl(iconHex), [iconHex])
    const iconSize = Math.round(size * 0.65)

    return (
        <Avatar
            sx={{
                width: size,
                height: size,
                bgcolor,
                color,
                ...sx,
            }}
        >
            <Box
                aria-hidden
                sx={{
                    width: iconSize,
                    height: iconSize,
                    bgcolor: 'currentColor',
                    WebkitMaskImage: `url(${iconUrl})`,
                    maskImage: `url(${iconUrl})`,
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                }}
            />
        </Avatar>
    )
}
