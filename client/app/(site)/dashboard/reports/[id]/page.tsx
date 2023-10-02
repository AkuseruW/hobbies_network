import { Icons } from '@/components/icons'
import PinReport from '@/components/reports/PinReport'
import ReportDetails from '@/components/reports/ReportDetails '
import { getReport } from '@/utils/requests/_reports_requests'
import Link from 'next/link'
import React from 'react'

const page = async ({ params }: { params: { id: number } }) => {
  const report = await getReport({ report_id: params.id })

  return (
    <>
      <div className="bg-white p-6 mt-11 rounded-lg shadow-md dark:bg-gray-800">
        <div className='flex justify-between'>
          <h1 className="text-2xl font-semibold mb-4">Détails du repport</h1>
          <div className='space-x-2 flex items-center'>

            <PinReport is_pinned={report.is_pinned} id={report.id} />
            {
              report.reported_type === "POST" ? (
                <Link
                  href={`/post/${report.reported_id}`}
                  className='h-10 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  type="button"
                  target="_blank"
                >
                  <Icons.page className='text-primary' />
                </Link>
              ) : report.reported_type === "USER" && (
                <Link
                  href={`/user/${report.reported_id}`}
                  className='h-10 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  type="button"
                  target="_blank"
                >
                  <Icons.user className='text-primary' />
                </Link>
              )
            }
          </div>
        </div>
        <ReportDetails report={report} />

      </div>
    </>
  )
}

export default page
