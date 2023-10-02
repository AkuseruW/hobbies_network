import { Button } from '../ui/button';
import { format } from "date-fns"
import ResponseReport from './ResponseRepport';
import { Report } from '@/types/reports_types';

const ReportDetails = ({ report }: { report: Report }) => {
    console.log(report)
    return (
        <div>
            <div className="mb-4">
                <strong className="block text-gray-700 dark:text-white">Report Type:</strong>
                <span className="text-indigo-600 dark:text-slate-200">{report.reported_type}</span>
            </div>
            <div className="mb-4">
                <strong className="block text-gray-700 dark:text-white">Report ID:</strong>
                <span className="text-indigo-600 dark:text-slate-200">{report.reported_id}</span>
            </div>
            <div className="mb-4">
                <strong className="block text-gray-700 dark:text-white">Created At:</strong>
                <span className="text-indigo-600 dark:text-slate-200">{format(new Date(report.created_at), "dd MMM yyyy")}</span>
            </div>
            <div className="mb-4">
                <strong className="block text-gray-700 dark:text-white">User ID:</strong>
                <span className="text-indigo-600 dark:text-slate-200">{report.user_id}</span>
            </div>
            <div className="mb-4">
                <strong className="block text-gray-700 dark:text-white">Reason:</strong>
                <p className="text-indigo-600 dark:text-slate-200">{report.reason}</p>
            </div>
            <div className="mb-4">
                <strong className="block text-gray-700 dark:text-white">Content:</strong>
                <p className="text-indigo-600 dark:text-slate-200">{report.content}</p>
            </div>
            <ResponseReport is_process={report.is_process} id={report.id} />
        </div>
    )

}

export default ReportDetails 
