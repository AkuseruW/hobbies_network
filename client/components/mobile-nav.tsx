import BtnProfile, { BtnMobileProfil } from "./header/DropDownComponent"
import { UserGroupIcon, HomeIcon, RectangleGroupIcon, } from "@heroicons/react/24/outline";
import HeaderLinksIcons, { MobileLinksIcons } from "./header/HeaderLinksIcons";
import ToggleTheme, { ToggleThemeMobile } from "./header/ToggleTheme";
import Notifications, { NotificationMobile } from "./header/Notifications";
import { getNotifications } from "@/utils/requests/_notifications_requests";
import { Icons } from "./icons";

export const MobileNav = async ({ currentUser }: { currentUser: any }) => {

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
    },
    {
      icon: <Icons.message_circle className="w-6 h-6 text-accent-color" />,
      text: "Messages",
      url: "/conversations",
    }
  ];

  return (
    <div className="flex items-center rounded-full w-[95%] bg-primary_dark dark:bg-primary_dark m-0 p-1 md:p-2 fixed bottom-2 md:max-w-[60%] mt-5">
      <div className="flex flex-1 border-r border-zinc-600 w-[77%]">
        <div className="relative flex justify-between text-white w-full mx-4 md:mx-9">
          {headerLinks.map((link, index) => (
            <MobileLinksIcons key={index} link={link} />
          ))}
        </div>
      </div>

      <div className="text-white justify-between mx-2 md:mx-4 flex items-center w-[22%]">
        <NotificationMobile client={true} />
        <BtnMobileProfil currentUser={currentUser} />
      </div>
    </div>
  )
}
