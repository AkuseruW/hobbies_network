import EmptyState from '@/components/messages/EmptyState'
import React from 'react'

const page = () => {
  return (
    <div className='h-full'>
      <div className="hidden lg:block  h-full">
        <EmptyState />
      </div>
    </div>
  )
}

export default page