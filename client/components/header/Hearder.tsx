import React from "react";
import Link from "next/link";
import { UserGroupIcon, HomeIcon, RectangleGroupIcon, } from "@heroicons/react/24/outline";
import HeaderLinksIcons from "./HeaderLinksIcons";
import ToggleTheme from './ToggleTheme'
import Notifications from "./Notifications";
import Image from "next/image";
import { Session } from "@/types/sessions_types";
import BtnProfile from "./DropDownComponent";


const Header = async ({ currentUser }: { currentUser: Session }) => {
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
    <div className="bg-white dark:bg-secondary_dark items-center py-4 px-4 shadow-md lg:sticky top-0 z-20  rounded ">
      <div className="hidden lg:flex justify-between">
        <Link href="/" className="">
          <strong className="text-2xl text-accent-color hidden md:flex md:lg lg:flex">Hobbies</strong>
          <Image className="flex md:hidden lg:hidden" src="/octagon.svg" width={30} height={30} alt="Logo" />
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-4 justify-center ">
          {headerLinks.map((link, index) => (
            <HeaderLinksIcons key={index} link={link} />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex lg:flex space-x-2 ">
            <ToggleTheme />
            <Notifications client={true} />
          </div>
          <BtnProfile currentUser={currentUser}/>
        </div>
      </div>
      <div className="flex items-center justify-center lg:hidden text-center">
        <strong className="text-2xl text-accent-color md:flex md:lg lg:flex">Hobbies</strong>
      </div>
    </div>
  );
};

export default Header;
