import { Button } from '@/components/ui/button';
import React from 'react'

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    selectedReason: string;
    setSelectedReason: (reason: string) => void;
    details: string;
    setDetails: (details: string) => void;
}

const ReportModalForm: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, selectedReason, setSelectedReason, details, setDetails }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Explications</label>
                <textarea onChange={(e) => setDetails(e.target.value)} id="reason" name="reason" rows={4} 
                className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600 w-full border"
                    required></textarea>
            </div>
            <div className="mb-4">
                <label htmlFor="reason" 
                className=" block text-sm font-medium">Raison du signalement</label>
                <select
                    id="reason"
                    name="reason"
                    className="mt-1 p-2 block w-full border rounded-md dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    required
                >
                    <option value="" disabled>Sélectionnez une raison</option>
                    <option value="Contenu inapproprié">Contenu inapproprié</option>
                    <option value="Harcèlement">Harcèlement</option>
                    <option value="Spam">Spam</option>
                </select>
            </div>
            <div className="flex justify-end space-x-2">
                <Button onClick={() => onClose()} type="button"> Annuler </Button>
                <Button type="submit">
                    Envoyer
                </Button>
            </div>
        </form>
    )
}

export default ReportModalForm
