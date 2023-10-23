import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/user/settings/profile-form"
import { currentUser } from "@/utils/_auth_informations"
import { me } from "@/utils/requests/_auth_requests"

const SettingsProfilePage = async () => {
  const {data: getCurrentUser} = await me()

  return (
    <div className="space-y-6 ">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Mettez à jour votre profil
        </p>
      </div>
      <Separator />
      <ProfileForm currentUser={getCurrentUser} />
    </div>
  )
}

export default SettingsProfilePage