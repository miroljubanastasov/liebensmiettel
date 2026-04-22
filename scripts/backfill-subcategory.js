#!/usr/bin/env node
/**
 * Backfill category + subcategory on product_entries that are missing them.
 * Uses the JS catalogue matcher (bestMatch) which is the same logic
 * that runs at entry time in the app.
 *
 * Usage: node scripts/backfill-subcategory.js
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars, or local defaults.
 */
import { createClient } from '@supabase/supabase-js'

// Use same catalogue matching the app uses
import { bestMatch } from '../src/utils/productMatcher.js'
import { classifyProduct } from '../src/utils/classify.js'

const url = process.env.SUPABASE_URL || 'http://127.0.0.1:54321'
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(url, key)

async function main() {
    // Fetch entries missing category or subcategory
    const { data: entries, error } = await supabase
        .from('product_entries')
        .select('id, name, brand, category, subcategory')
        .or('category.is.null,subcategory.is.null')

    if (error) {
        console.error('Failed to fetch entries:', error.message)
        process.exit(1)
    }

    console.log(`Found ${entries.length} entries to classify`)

    let updated = 0
    let skipped = 0

    for (const entry of entries) {
        if (!entry.name) {
            skipped++
            continue
        }

        const patch = {}

        // Try catalogue match first (gives both category + subcategory)
        const match = bestMatch(entry.name, 0.35)
        if (match) {
            if (!entry.category && match.category) patch.category = match.category
            if (!entry.subcategory && match.subcategory) patch.subcategory = match.subcategory
        }

        // If still missing category, try keyword classification
        if (!entry.category && !patch.category) {
            const classified = classifyProduct({
                name: entry.name,
                brand: entry.brand || '',
                categories: [],
            })
            if (classified.category && classified.category !== 'Other') {
                patch.category = classified.category
            }
            if (!entry.subcategory && !patch.subcategory && classified.subcategory) {
                patch.subcategory = classified.subcategory
            }
        }

        if (Object.keys(patch).length === 0) {
            skipped++
            console.log(`  ⊘ "${entry.name}" — no match`)
            continue
        }

        const { error: updateErr } = await supabase
            .from('product_entries')
            .update(patch)
            .eq('id', entry.id)

        if (updateErr) {
            console.error(`  ✗ "${entry.name}" — ${updateErr.message}`)
            skipped++
        } else {
            updated++
            console.log(`  ✓ "${entry.name}" → ${patch.category || entry.category} / ${patch.subcategory || entry.subcategory || '—'}`)
        }
    }

    console.log(`\nDone: ${updated} updated, ${skipped} skipped out of ${entries.length}`)
}

main()
