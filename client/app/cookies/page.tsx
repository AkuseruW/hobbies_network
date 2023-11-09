import ArrowBack from '@/components/ArrowBack'
import React from 'react'

const CookiesPage = () => {
    return (
        <div className="container mx-auto p-12">
            <ArrowBack />

            <div className='w-xl md:w-[70%] mx-auto my-24'>
                <h1 className="text-2xl font-semibold mb-4">
                    Politique de cookies
                </h1>

                <section className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">1. Qu'est-ce qu'un cookie ?</h2>
                    <p>
                        Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Il permet au site de mémoriser vos actions et préférences (telles que la connexion, la langue, la taille de la police et d'autres préférences d'affichage) sur une période donnée, vous évitant ainsi de les réindiquer à chaque fois que vous revenez sur le site ou naviguez de page en page.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">2. Comment utilisons-nous les cookies ?</h2>
                    <p>
                        Notre site web utilise des cookies pour améliorer votre expérience utilisateur, vous fournir des fonctionnalités avancées et suivre votre utilisation du site à des fins statistiques.
                    </p>
                    <p>
                        Nous utilisons à la fois des cookies de session (qui expirent lorsque vous fermez votre navigateur) et des cookies persistants (qui restent sur votre ordinateur jusqu'à ce que vous les supprimiez) pour stocker des informations telles que votre choix de langue et d'autres préférences.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">5. Contact</h2>
                    <p>
                        Si vous avez des questions ou des préoccupations concernant notre politique de cookies, veuillez nous contacter à l'adresse e-mail suivante : hobbies@admin.com.
                    </p>
                </section>
            </div>
        </div>
    )
}

export default CookiesPage
