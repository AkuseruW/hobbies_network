import Aside from '@/components/dashboard/Aside';
import HeaderAdmin from '@/components/dashboard/HeaderAdmin';
import { Report } from '@/types/reports_types';
import { currentUser } from '@/utils/_auth_informations';
import { getDashboardDataCount } from '@/utils/requests/_dashboard_requests';
import { getNotificationsAdmin } from '@/utils/requests/_notifications_requests';
import { getReports } from '@/utils/requests/_reports_requests';


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = currentUser();
  const { adminNotifications, reports, proposedHobbies } = await getDashboardDataCount();

  const len_reports_unread = reports
  const len_notifications_unread = adminNotifications
  const len_proposed_hobbies = proposedHobbies

  return (
    <div className="flex max-h-screen overflow-hidden fixed w-full">
      <Aside 
      len_reports_unread={len_reports_unread} 
      len_notifications_unread={len_notifications_unread}
      len_proposed_hobbies={len_proposed_hobbies}
      />
      <div className="flex flex-col flex-1 overflow-y-auto max-h-screen">
        <HeaderAdmin currentUser={user} />
        <div className="flex-1">
          <div className=" mx-auto px-4 ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout
