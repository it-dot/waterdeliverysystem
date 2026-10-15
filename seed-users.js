import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedUsers() {
  console.log("Seeding admin user...")
  const { data: adminAuth, error: adminErr } = await supabase.auth.admin.createUser({
    email: 'admin@clearwell.com',
    password: 'password123',
    email_confirm: true
  })

  if (adminErr && !adminErr.message.includes('already registered')) {
    console.error("Error creating admin auth:", adminErr)
  } else if (adminAuth?.user) {
    console.log("Admin created in auth. Upserting profile...")
    await supabase.from('profiles').upsert({
      id: adminAuth.user.id,
      email: 'admin@clearwell.com',
      full_name: 'System Admin',
      role: 'admin'
    })
  }

  console.log("Seeding rider user...")
  const { data: riderAuth, error: riderErr } = await supabase.auth.admin.createUser({
    email: 'rider@clearwell.com',
    password: 'password123',
    email_confirm: true
  })

  if (riderErr && !riderErr.message.includes('already registered')) {
    console.error("Error creating rider auth:", riderErr)
  } else if (riderAuth?.user) {
    console.log("Rider created in auth. Upserting profile...")
    await supabase.from('profiles').upsert({
      id: riderAuth.user.id,
      email: 'rider@clearwell.com',
      full_name: 'Delivery Rider 1',
      role: 'rider'
    })
  }

  console.log("Done.")
}

seedUsers()
