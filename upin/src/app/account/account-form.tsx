'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { type User } from '@supabase/supabase-js'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstname] = useState<string | null>(null)
  const [lastName, setLastName] = useState<string | null>(null)
  const [birthDate, setBirthDate] = useState<string | null>(null)
  const [interests, setInterests] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('userdata')
        .select(`firstName, lastName, birthDate, interests, email`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFirstname(data.firstName)
        setLastName(data.lastName)
        setBirthDate(data.birthDate)
        setInterests(data.interests)
        setEmail(data.email)

      }
    } catch (error) {

      console.log(error);
      
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    firstName,
    lastName,
    birthDate,
    interests
  }: {
    firstName: string | null
    lastName: string | null
    birthDate: string | null
    interests: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('userdata').upsert({
        id: user?.id as string,
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        interests:interests,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName || ''}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="LastName"
          type="text"
          value={lastName || ''}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="birthDate">Birthdate</label>
        <input
          id="birthDate"
          type="date"
          value={birthDate || ''}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ firstName, lastName, birthDate,interests })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}