'use client'
import Modal from '@/components/Modal';
import React, { useEffect, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormEditUserInfo from './FormEditUserInfo';
import FormEditUserPassword from './FromEditPassword';


const BtnEditProfil = ({ currentUser }: { currentUser: any }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


    return (
        <>
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md" onClick={openModal} >
                Modifier le profil
            </button>
            {isModalOpen && (
                <Modal size="sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                    <div className='p-4' ref={modalRef}>
                        <Tabs defaultValue="account" className="">
                            <TabsList>
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="password">Password</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account">
                                <FormEditUserInfo currentUser={currentUser} />
                            </TabsContent>
                            <TabsContent value="password">
                                <FormEditUserPassword />
                            </TabsContent>
                        </Tabs>

                    </div>
                </Modal>
            )}
        </>
    )
}

export default BtnEditProfil