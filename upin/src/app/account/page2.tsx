'use client'
import React from 'react'
import { useCallback, useEffect } from 'react'
import { type User } from '@supabase/supabase-js'
import { createClient } from '../../../utils/supabase/client'
import { get } from 'http'

const Account = ({ user }: { user: User | null }) => {
  const supabase = createClient()
  const getProfile = useCallback(async () => {
    try {

      const { data, error, status } = await supabase
        .from('userdata')
        .select(`firstName, lastName, birthDate, interests, email`)
        .eq('id', user?.id)
        .single()
        console.log("yes this data right here"+user.id);
        

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

    } catch (error) {

      console.log(error);
      
    } 
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

    
  return (
    <div>{}</div>
  )
}

export default Account