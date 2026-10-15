import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log("Testing connection to Supabase...")
  const { data, error } = await supabase.from('products').select('*').limit(1)
  
  if (error) {
    console.error("Connection failed! Error:", error.message)
  } else {
    console.log("Connection successful! Supabase returned data:", data)
  }
}

testConnection()
