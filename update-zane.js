import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateRider() {
  const oldEmail = 'rider@clearwell.com'
  const newEmail = 'zane@clearwell.com'
  const newName = 'Rider Zane'

  // 1. Get the user from auth
  const { data: users, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error("Error fetching users:", listError)
    return
  }

  const user = users.users.find(u => u.email === oldEmail)
  
  if (!user) {
    console.log("Could not find user with email", oldEmail)
    return
  }

  // 2. Update auth user email
  const { error: authUpdateError } = await supabase.auth.admin.updateUserById(user.id, {
    email: newEmail,
    email_confirm: true,
    user_metadata: { full_name: newName }
  })

  if (authUpdateError) {
    console.error("Failed to update auth email:", authUpdateError)
    return
  }

  // 3. Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      full_name: newName,
      email: newEmail
    })
    .eq('id', user.id)

  if (profileError) {
    console.error("Failed to update profile:", profileError)
    return
  }

  console.log(`Successfully updated rider ${oldEmail} to ${newName} (${newEmail})`)
}

updateRider()
