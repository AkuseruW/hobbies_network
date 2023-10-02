'use client'
import React, { useState } from 'react';
import Modal from '../Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Checkbox } from '@/components/ui/checkbox';
import ResponseRapport from './ResponseRepport';
import { Button } from '../ui/button';

const ReportModal = ({
    approve,
    reject,
    setModalIsOpen,
    setDuration,
    setBanUser,
    banUser
}: {
    approve: () => void;
    reject: () => void;
    setModalIsOpen: () => void;
    setDuration: (duration: number) => void;
    setBanUser: (banUser: boolean) => void;
    banUser: boolean
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const today = new Date();

    // Calculate tomorrow's date (J+1)
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (!date) {
            return null;
        }
        const currentDate = new Date();
        const durationInMinutes = Math.floor(
            (date.getTime() - currentDate.getTime()) / (60 * 1000)
        );
        setDuration(durationInMinutes);
    };

    const handleSubmit = () => {
        approve();
        setModalIsOpen();
    };

    return (
        <Modal size="h-[30%] w-[40%]" title="Report" close={setModalIsOpen}>
            <div className="container h-full overflow-hidden pt-8">
                <p className="text-gray-700 dark:text-white text-lg">
                    Are you sure you want to approve this report?
                </p>
                <div className="flex items-center pt-8">
                    <Checkbox
                        checked={banUser}
                        onCheckedChange={() => setBanUser(!banUser)}
                        className="mr-2"
                    />
                    <p>Do you want to ban the user?</p>
                </div>

                {banUser && (
                    <div className="mb-4">
                        <label
                            htmlFor="datepicker"
                            className="w-full block text-gray-700 dark:text-white"
                        >
                            Date du bannissement
                        </label>
                        <DatePicker
                            autoComplete="off"
                            id="datepicker"
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            minDate={tomorrow}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                )}

                <div className="absolute bottom-3 right-3 space-x-2">
                    <Button type="button" variant="outline" onClick={handleSubmit}>
                        Yes
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setModalIsOpen()}
                        className="bg-red-500 hover:bg-red-600 hover:text-white text-white"
                    >
                        No
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ReportModal;
