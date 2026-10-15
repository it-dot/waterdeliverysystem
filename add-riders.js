import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const riders = [
  { name: 'Rider Dave', email: 'dave@clearwell.com', phone: '09171234567' },
  { name: 'Rider Chris', email: 'chris@clearwell.com', phone: '09181234567' },
  { name: 'Rider Mark', email: 'mark@clearwell.com', phone: '09191234567' },
  { name: 'Rider Alex', email: 'alex@clearwell.com', phone: '09201234567' }
]

async function addRiders() {
  for (const rider of riders) {
    // 1. Create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: rider.email,
      email_confirm: true,
      password: 'password123',
      user_metadata: { full_name: rider.name }
    })

    if (authError) {
      console.error(`Failed to create auth user for ${rider.name}:`, authError)
      continue
    }

    const userId = authData.user.id

    // 2. Insert into profiles with role = 'rider'
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: rider.name,
      email: rider.email,
      phone: rider.phone,
      role: 'rider',
    })

    if (profileError) {
      console.error(`Failed to create profile for ${rider.name}:`, profileError)
    } else {
      console.log(`Successfully added rider: ${rider.name} (${rider.email})`)
    }
  }
}

addRiders()
