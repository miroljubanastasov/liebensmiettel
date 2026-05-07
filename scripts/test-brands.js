#!/usr/bin/env node
/**
 * Smoke tests for the brands catalogue + findBrand().
 * Run with:  node scripts/test-brands.js
 */
import {
    findBrand,
    getPrivateLabelsFor,
    listTopBrands,
    BRANDS,
} from '../src/lib/brands.js'

let pass = 0
let fail = 0

function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected)
    if (ok) { console.log(`  ✓ ${label}`); pass++ }
    else { console.log(`  ✗ ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); fail++ }
}

console.log(`BRANDS catalogue: ${BRANDS.length} entries`)

console.log('\nfindBrand()')
check('ja!', findBrand('Ja!')?.id, 'ja')
check('gut & günstig', findBrand('Gut & Günstig')?.id, 'gut-gunstig')
check('gut u günstig', findBrand('gut u günstig')?.id, 'gut-gunstig')
check('k-classic', findBrand('K-Classic')?.id, 'k-classic')
check('dr oetker', findBrand('Dr Oetker')?.id, 'dr-oetker')
check('dr. oetker', findBrand('Dr. Oetker')?.id, 'dr-oetker')
check('nestle → nestlé', findBrand('Nestle')?.id, 'nestle')
check('garbage → null', findBrand('zzzqqq garbage xyz'), null)
check('empty → null', findBrand(''), null)

console.log('\ngetPrivateLabelsFor()')
const rewe = getPrivateLabelsFor('rewe').map((b) => b.id)
const lidl = getPrivateLabelsFor('lidl').map((b) => b.id)
check('rewe has ja', rewe.includes('ja'), true)
check('rewe has beste-wahl', rewe.includes('rewe-beste-wahl'), true)
check('lidl has milbona', lidl.includes('milbona'), true)
check('lidl has vemondo', lidl.includes('vemondo'), true)

console.log('\nlistTopBrands(5)')
const top = listTopBrands(5)
console.log(' ', top.map((b) => `${b.name}(${b.product_count_de})`).join(', ') || '(empty — run build-brands-off.js first)')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
