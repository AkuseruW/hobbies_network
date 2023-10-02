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
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Explications</label>
                <textarea onChange={(e) => setDetails(e.target.value)} id="reason" name="reason" rows={4} className="mt-1 p-2 block w-full border rounded-md" required></textarea>
            </div>
            <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Raison du signalement</label>
                <select
                    id="reason"
                    name="reason"
                    className="mt-1 p-2 block w-full border rounded-md"
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
            <div className="flex justify-end">
                <button type="button" className="mr-2 px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none" onClick={() => onClose()}>Annuler</button>
                <button type="submit" className="px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none">Envoyer</button>
            </div>
        </form>
    )
}

export default ReportModalForm
