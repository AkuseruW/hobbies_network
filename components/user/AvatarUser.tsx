'use client'
import React from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Session } from '@/types/sessions_types'

const AvatarUser = ({ data }: { data: Session }) => {

    return (
        <Avatar>
            <AvatarImage
                src={`${data.profile_picture}`}
            />
        </Avatar>
    )
}

export default AvatarUser
