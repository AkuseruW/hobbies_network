'use client';
import Modal from "@/components/Modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
// import ReportModalForm from "@/components/reports/ReportForm";
import { deletePost, reportPost } from "@/utils/requests/_posts_requests";
import { Session } from "@/types/sessions_types";
import { currentUserClient } from "@/utils/_auth_client_info";
import ReportModalForm from "./ReportModalForm";


const DropDownBtn = ({ postId, user_id }: { postId: string, user_id: number }) => {
    const currentUser = currentUserClient();
    const modalRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [details, setDetails] = useState("");
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast()

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleDelete = async (postId: string) => {
        if (deleting) {
            return;
        }
        try {
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

    return (
        <>
            {showModal && (
                <Modal>
                    <div ref={modalRef} className="bg-white p-4 rounded-lg shadow-md">
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
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <svg
                        className="w-5 h-5 text-gray-500"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleReport}>Signaler</DropdownMenuItem>
                    {currentUser && (currentUser?.id === user_id || currentUser?.role === "ROLE_ADMIN") && (
                        <DropdownMenuItem onClick={() => handleDelete(postId)}>Supprimer</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default DropDownBtn;
