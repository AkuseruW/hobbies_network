import React from "react";
import Link from "next/link";
import { UserGroupIcon, HomeIcon, RectangleGroupIcon, } from "@heroicons/react/24/outline";
import HeaderLinksIcons from "./HeaderLinksIcons";
import BtnProfile from "./BtnProfile";
import ToggleTheme from './ToggleTheme'
import Notifications from "./Notifications";
import Image from "next/image";
import { Session } from "@/types/sessions_types";
import { getNotifications } from "@/utils/requests/_notifications_requests";

const Header = async ({ currentUser }: { currentUser: Session }) => {
  const notifications = await getNotifications();
  const hearderLinks = [
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
    <div className="flex bg-white dark:bg-gray-800 items-center py-4 px-4 shadow-md sticky top-0 z-20 justify-between rounded">

      <Link href="/" className="hidden md:flex lg:flex  ">
        <strong className="text-2xl text-accent-color">Hobbies</strong>
      </Link>

      <div className="flex items-center space-x-4 justify-center w-full">
        {hearderLinks.map((link, index) => (
          <HeaderLinksIcons key={index} link={link} />
        ))}
      </div>

      <div className="hidden md:flex lg:flex  items-center space-x-2">
        {/* <Alert notifications={notifications}/> */}
        <ToggleTheme />
        <Notifications notifications={notifications} />
        <BtnProfile currentUser={currentUser} />
      </div>
    </div>

  );
};

export default Header;
