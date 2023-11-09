import { Separator } from '@/components/ui/separator'
import React from 'react'
import SubscriptionButton from './SubscriptionButton'
import { me } from '@/utils/requests/_auth_requests'
import PortalButton from './PortalButton'

const SubscriptionPage = async () => {
    const { data: getCurrentUser } = await me()
    const hasSubscription = getCurrentUser.has_subscription || false;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Abonnement</h3>
                <p className="text-sm text-muted-foreground">
                    Abonnez-vous afin de profiter d&apos;un compte certifié
                </p>
            </div>
            <Separator />

            {hasSubscription ? (
                <div className='space-y-5'>
                    <p>Vous êtes abonné. Profitez de votre compte certifié.</p>
                    <PortalButton />
                </div>
            ) : (
                <div className="p-4 rounded-lg space-y-5">
                    <p className="font-semibold">
                        Tarifs : 9.99€/mois
                    </p>
                    <p>Abonnez-vous afin de profiter d&apos;un compte certifiant.</p>
                    <SubscriptionButton />
                </div>
            )}
        </div>
    )
}

export default SubscriptionPage