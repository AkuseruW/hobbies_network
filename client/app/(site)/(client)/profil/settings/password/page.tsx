import { Separator } from "@/components/ui/separator";
import { AccountForm } from "@/components/user/settings/account-form";

const SettingsAccountPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Mettez à jour le mot de passe.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  )
}

export default SettingsAccountPage