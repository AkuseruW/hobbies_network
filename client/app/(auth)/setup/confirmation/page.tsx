import { cookies } from 'next/headers'
import React from 'react'
import ConfirmUserInfo from '@/components/auth/setupProfile/Confirm'
import { Hobby } from '@/types/hobby_types'

const page = () => {
  const cookieStore = cookies()
  const userCookie = cookieStore.get('setup_info')
  const hobbiesCookie = cookieStore.get('hobbies_info')
  let data

  if (userCookie) {
    data = JSON.parse(userCookie?.value as any)
  }

  if (hobbiesCookie) {
    data.hobbies = JSON.parse(hobbiesCookie?.value as any)
    const hobbyIds = data.hobbies.map((hobby: Hobby) => hobby.id);
    data.hobbyIds = hobbyIds;
  }

  return <ConfirmUserInfo data={data} />
}

export default page
