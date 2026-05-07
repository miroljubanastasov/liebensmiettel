#!/usr/bin/env node
/**
 * Regenerate the store_chains INSERT block in supabase/seed.sql from
 * src/data/storeChains.js. Replaces everything between the sentinels:
 *   -- >>> STORE_CHAINS_BEGIN
 *   -- <<< STORE_CHAINS_END
 *
 * Usage: node scripts/build-store-chains-seed.js
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { STORE_CHAINS } from '../src/data/storeChains.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SEED_PATH = join(__dirname, '..', 'supabase', 'seed.sql')
const BEGIN = '-- >>> STORE_CHAINS_BEGIN'
const END = '-- <<< STORE_CHAINS_END'

function sqlLiteral(v) {
    if (v === null || v === undefined) return 'null'
    return `'${String(v).replace(/'/g, "''")}'`
}

function buildBlock() {
    const lines = []
    lines.push('insert into public.store_chains (id, name, logo_url, country, color) values')
    const rows = STORE_CHAINS.map((c) => {
        return `    (${sqlLiteral(c.id)}, ${sqlLiteral(c.name)}, ${sqlLiteral(c.logo_url)}, ${sqlLiteral(c.country || 'DE')}, ${sqlLiteral(c.color)})`
    })
    lines.push(rows.join(',\n'))
    lines.push('on conflict (id) do update set')
    lines.push('    name = excluded.name,')
    lines.push('    logo_url = excluded.logo_url,')
    lines.push('    country = excluded.country,')
    lines.push('    color = excluded.color;')
    return lines.join('\n')
}

const src = readFileSync(SEED_PATH, 'utf-8')
const beginIdx = src.indexOf(BEGIN)
const endIdx = src.indexOf(END)
if (beginIdx < 0 || endIdx < 0 || endIdx < beginIdx) {
    console.error(`✗ sentinels ${BEGIN} / ${END} not found in ${SEED_PATH}`)
    process.exit(1)
}

const head = src.slice(0, beginIdx + BEGIN.length)
const tail = src.slice(endIdx)
const block = '\n' + buildBlock() + '\n'
const next = head + block + tail
writeFileSync(SEED_PATH, next)
console.log(`✓ wrote ${STORE_CHAINS.length} store chains to supabase/seed.sql`)
