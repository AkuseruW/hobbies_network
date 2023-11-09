'use client';
import Modal from "@/components/Modal";
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { deletePost, reportPost } from "@/utils/requests/_posts_requests";
import { currentUserClient } from "@/utils/_auth_client_info";
import ReportModalForm from "./ReportModalForm";
import { Button } from "@/components/ui/button";


const DropDownBtn = ({ postId, user_id }: { postId: string, user_id: number }) => {
    const currentUser = currentUserClient();
    const [showModal, setShowModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [details, setDetails] = useState("");
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast()
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle delete post
    const handleDelete = async (postId: string) => {
        if (deleting) {
            return;
        }
        try {
            // Call the deletePost API function
            setDeleting(true);
            await deletePost({ postId });
        } catch (error) {
            console.error("Une erreur s'est produite lors de la suppression :", error);
        } finally {
            setDeleting(false);
        }
    };

    const handleReport = () => {
        setShowModal(true);
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Call the reportPost API function
            const reportData = {
                reported_id: postId,
                reason: selectedReason,
                details: details,
                reported_type: 'POST',
            };
            const res = await reportPost({ reportData });
            toast({
                description: res.message,
            })
            setShowModal(false);
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la création du rapport :', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownIsOpen) {
                // Check if the click target is outside the dropdown
                if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                    // If the click is outside the dropdown, close it
                    setDropdownIsOpen(false);
                }
            }
        };
        // Add a click event listener to the document
        window.addEventListener('click', handleClickOutside);

        return () => {
            // Remove the click event listener when the component unmounts
            window.removeEventListener('click', handleClickOutside);
        };

    }, [dropdownIsOpen]);


    return (
        <>
            {showModal && (
                <Modal title="Signaler le contenu" size="w-[90%] h-[50%] max-sm:h-[55%] sm:w-[60%] md:w-[60%] md:h-[55%]
                 lg:w-[40%] lg:h-[50%]
                 " close={() => setShowModal(false)}>
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Signaler le contenu</h2>
                        <ReportModalForm
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            onSubmit={handleSubmitReport}
                            selectedReason={selectedReason}
                            setSelectedReason={setSelectedReason}
                            details={details}
                            setDetails={setDetails}
                        />
                    </div>
                </Modal>
            )}
            <div id="dropdown">

                <div ref={dropdownRef}>

                    <Button
                        variant="link"
                        size="icon"
                        onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
                    >
                        <svg
                            className="w-5 h-5 text-gray-500"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        </svg>
                    </Button>

                    {dropdownIsOpen && (
                        <div className=" absolute right-0 top-10 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                            <div>
                                {currentUser && (currentUser?.id != user_id) && (
                                    <span className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
                                        onClick={handleReport}>
                                        Signaler
                                    </span>
                                )}
                                {currentUser && (currentUser?.id === user_id || currentUser?.role === "ROLE_ADMIN") && (
                                    <span className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
                                        onClick={() => handleDelete(postId)}>
                                        Supprimer
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DropDownBtn;
