import SetupProfileForm from '@/components/auth/SetupProfileForm'
import React from 'react'
import { cookies } from 'next/headers'


const SetupPage = async () => {
  const cookieStore = cookies()
  const userCookie = cookieStore.get('setup_info')
  let user
  
  if (userCookie) {
    user = JSON.parse(userCookie?.value as any)
  }

  return <SetupProfileForm initialUser={user} />
}

export default SetupPage
