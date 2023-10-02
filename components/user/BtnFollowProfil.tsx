'use client'
import { follow_or_unfollow_user } from '@/utils/requests/_users_requests'
import React, { useState } from 'react'

const BtnFollowProfil = ({ user_id, is_following }: { user_id: number, is_following: boolean }) => {
    const [followed, setFollowed] = useState(is_following)

    const onClick = async () => {
        await follow_or_unfollow_user({ user_id })
        setFollowed(!followed)
    }

    return (
        <button className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md" onClick={onClick}>
            {followed ? 'Unfollow' : 'Follow'}
        </button>
    )
}

export default BtnFollowProfil
