import AccountForm from './account-form'
import { createClient } from '../../../utils/supabase/server'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('userdata')
    .select('*')
    .eq('email', user.email)
    .single()
  
  


  return (<>
  <AccountForm user={data} />

 
  </>)
}