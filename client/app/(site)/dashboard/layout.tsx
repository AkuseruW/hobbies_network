import Aside from '@/components/dashboard/Aside';
import HeaderAdmin from '@/components/dashboard/HeaderAdmin';
import { currentUser } from '@/utils/_auth_informations';
import { getNotificationsAdmin } from '@/utils/requests/_notifications_requests';


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = currentUser();
  const notifications = await getNotificationsAdmin({})

  return (
    <div className="flex h-screen overflow-hidden">
      <Aside />
      <div className="flex flex-col flex-1 ">
        <HeaderAdmin currentUser={user} notifications={notifications} />
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
