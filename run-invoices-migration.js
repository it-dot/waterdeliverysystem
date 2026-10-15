import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  const sql = readFileSync(join(import.meta.dirname, 'supabase', 'create_invoices_table.sql'), 'utf-8')
  console.log("Running invoices migration...")
  const { error } = await supabase.rpc('exec_sql', { sql_string: sql }).maybeSingle()
  
  if (error) {
    // Try direct SQL via REST if rpc not available
    console.log("RPC not available, trying direct fetch...")
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ sql_string: sql }),
    })
    if (!res.ok) {
      console.log("Direct RPC failed. Please run the SQL in supabase/create_invoices_table.sql manually via the Supabase SQL Editor.")
      console.log("SQL file location: supabase/create_invoices_table.sql")
    } else {
      console.log("Migration completed successfully!")
    }
  } else {
    console.log("Migration completed successfully!")
  }
}

runMigration()
