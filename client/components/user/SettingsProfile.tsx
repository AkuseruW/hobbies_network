import React, { useState } from 'react'
import { Button } from '../ui/button'
import { deleteAccount } from '@/utils/requests/_users_requests'
import Modal from '../Modal'

const SettingsProfile = () => {
    // const [isModalOpen, setIsModalOpen] = useState(false);


    // const SubmitDeleteAccount = async () => {
    //     await deleteAccount()
    // }
  return (
    <div>
        {/* {isModalOpen && (
            <Modal>
                <p>Are you sure you want to delete your account?</p>
                <Button variant="destructive" size="lg" className='mt-4' onClick={SubmitDeleteAccount} >Yes, delete my account</Button>
            </Modal>
        )} */}

      <Button  >Delete account</Button>
    </div>
  )
}

export default SettingsProfile
