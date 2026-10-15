import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updatePasswords() {
  const { data: users, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error("Error fetching users:", error)
    return
  }

  console.log(`Found ${users.users.length} users.`)

  for (const user of users.users) {
    // Only update users who aren't the primary admin/rider
    if (user.email !== 'admin@clearwell.com' && user.email !== 'rider@clearwell.com') {
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: 'password123'
      })
      if (updateError) {
         console.error(`Failed to update password for ${user.email}:`, updateError)
      } else {
         console.log(`Updated password for customer: ${user.email} -> password123`)
      }
    }
  }
}

updatePasswords()
