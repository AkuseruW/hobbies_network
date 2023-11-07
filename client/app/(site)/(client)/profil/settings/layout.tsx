import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/user/sidebar-nav"
import { me } from "@/utils/requests/_auth_requests"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Advanced form example using react-hook-form and Zod.",
}


interface SettingsLayoutProps {
  children: React.ReactNode
}

const SettingsLayout = async ({ children }: SettingsLayoutProps) => {


  const sidebarNavItems = [
    {
      title: "Profile",
      href: "/profil/settings",
    },
    {
      title: "Password",
      href: "/profil/settings/password",
    },
    {
      title: "Abonnements",
      href: "/profil/settings/abonnements",
    },
    {
      title: "Suppression",
      href: "/profil/settings/suppression",
    },
    {
      title: "Theme",
      href: "/profil/settings/theme",
    },
  ]

  return (
    <div className="space-y-6 p-10 pb-16 md:block max-sm:space-y-4  max-sm:container">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre compte.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}

export default SettingsLayout