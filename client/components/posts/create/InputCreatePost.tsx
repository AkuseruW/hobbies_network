'use client'
import React, { useState, useEffect, useRef } from 'react';
import { PhotoIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/Modal';
import FormNewPost from './FormNewPost';
import { Session } from '@/types/sessions_types';
import { Hobby } from '@/types/hobby_types';


const InputNewPost = ({ session, hobbies }: { session: Session, hobbies: Hobby[] }) => {
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleInputClick = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        // Define a function to handle clicks outside the modal
        const handleOutsideClick = (event: MouseEvent) => {
            // Check if the modalRef exists and if the click target is outside the modal
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                // Close the modal by setting its open state to false
                setIsModalOpen(false);
            }
        };
        // Add a mousedown event listener to the document to detect outside clicks
        document.addEventListener('mousedown', handleOutsideClick);
        // Cleanup: Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


    return (
        <div className="w-full relative">
            <input
                className="flex-1 dark:bg-secondary_dark border-none py-2 text-lg pl-2 pr-10 outline-none placeholder-gray-500 dark:placeholder-gray-300 focus:placeholder-gray-400 w-full"
                type="text"
                placeholder="Quoi de nouveau ?"
                onClick={handleInputClick}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />

            <div className="absolute inset-y-0 right-2 flex items-center">
                <label
                    htmlFor="filePicker"
                    className="flex items-center cursor-pointer"
                >
                    <PhotoIcon className="w-6 h-6 text text-accent-color dark:text-accent-color-alt" />
                </label>

                <div className="hidden sm:flex items-center cursor-pointer ml-2">
                    <FaceSmileIcon className="w-6 h-6 text text-accent-color dark:text-accent-color-alt" />
                </div>
            </div>

            {isModalOpen && (
                <Modal size="w-full md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]" title='Nouveau post'>
                    <div className='p-4' ref={modalRef}>
                        <FormNewPost session={session} postContent={inputValue} setPostContent={setInputValue} hobbies={hobbies} close={() => setIsModalOpen(false)} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default InputNewPost;
