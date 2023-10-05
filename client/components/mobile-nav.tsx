import BtnProfile, { BtnMobileProfil } from "./header/DropDownComponent"
import { UserGroupIcon, HomeIcon, RectangleGroupIcon, } from "@heroicons/react/24/outline";
import HeaderLinksIcons, { MobileLinksIcons } from "./header/HeaderLinksIcons";
import ToggleTheme, { ToggleThemeMobile } from "./header/ToggleTheme";
import Notifications, { NotificationMobile } from "./header/Notifications";
import { getNotifications } from "@/utils/requests/_notifications_requests";

export const MobileNav = async ({ currentUser }: { currentUser: any }) => {
  const notifications = await getNotifications();

  const headerLinks = [
    {
      icon: <HomeIcon className="w-6 h-6 text-accent-color" />,
      text: "Accueil",
      url: "/",
    },
    {
      icon: <RectangleGroupIcon className="w-6 h-6 text-accent-color" />,
      text: "Hobbies",
      url: "/hobbies",
    },
    {
      icon: <UserGroupIcon className="w-6 h-6 text-accent-color" />,
      text: "Utilisateurs",
      url: "/utilisateurs",
    }
  ];

  return (
    <div className="flex items-center rounded-full w-full bg-gray-800 m-0 p-2 max-w-max fixed bottom-2">
      <div className="flex flex-1 border-r border-zinc-600 pr-1 w-3/5">
        <div className="relative flex justify-between text-white space-x-1">
          {headerLinks.map((link, index) => (
            <MobileLinksIcons key={index} link={link} />
          ))}
        </div>
      </div>

      <div className="text-white space-x-3 mx-4 flex items-center justify-center w-2/5">
        <ToggleThemeMobile />
        <NotificationMobile notifications={notifications} />
        <BtnMobileProfil currentUser={currentUser} />
      </div>
    </div>
  )
}
