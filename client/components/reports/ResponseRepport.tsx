'use client'
import React, { useState } from 'react';
import { Button } from '../ui/button';
import ReportModal from './ReportModal';
import { approve_report } from '@/utils/requests/_reports_requests';

const ResponseReport = ({ is_process, id }: { is_process: boolean, id: number }) => {
  const [isProcess, setIsProcess] = useState(is_process);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [durationInMinutes, setDurationInMinutes] = useState<number>(0);
  const [banUser, setBanUser] = useState(false);

  const onClickApprove = async () => {
    console.log(banUser)
    if (banUser) {
      await approve_report({ report_id: id, duration: durationInMinutes });
    } else {
      await approve_report({ report_id: id, duration: 0 });
    }
    setIsProcess(true);
  };

  const onClickReject = async () => {
    // Ajoutez ici la logique pour le rejet
  };

  const onCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="flex justify-end space-x-2">
      {modalIsOpen && (
        <ReportModal
          approve={onClickApprove}
          reject={onClickReject}
          setModalIsOpen={onCloseModal}
          setDuration={setDurationInMinutes}
          banUser={banUser}
          setBanUser={setBanUser}
        />
      )}
      <Button
        disabled={isProcess}
        type="button"
        variant="outline"
        onClick={() => setModalIsOpen(true)}
      >
        Approve
      </Button>
      <Button
        disabled={isProcess}
        variant="outline"
        onClick={onClickReject}
      >
        Reject
      </Button>
    </div>
  );
};

export default ResponseReport;
