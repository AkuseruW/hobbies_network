import React from 'react';
import Link from 'next/link';
import PinReport from './PinReport';
import { Icons } from '../icons';
import { Report } from '@/types/reports_types';

const PinnedReportCard = ({ report }: { report: Report }) => {
    return (
        <div className="flex items-center p-4 border rounded-lg shadow-md space-y-4">
            <div className="flex justify-between items-center w-full">
                <Link href={`dashboard/reports/${report.id}`} className="flex items-center space-x-12 w-full">
                    <Icons.alert className="text-yellow-500" />
                    <div className="flex flex-col space-y-1">
                        <span className="max-w-[500px] truncate font-medium">{report.reported_type}</span>
                        <span className="max-w-[500px] truncate font-medium">{report.reason}</span>
                    </div>
                </Link>
                <PinReport is_pinned={report.is_pinned} id={report.id} />
            </div>
        </div>
    );
}

export default PinnedReportCard