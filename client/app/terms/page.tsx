import ArrowBack from '@/components/ArrowBack'
import { Icons } from '@/components/icons'
import React from 'react'

const CguPage = () => {
    return (
        <div className="container mx-auto p-12">
            <ArrowBack />

            <div className='w-xl md:w-[70%] mx-auto my-24'>
                <h1 className="text-2xl font-semibold mb-4">
                    Conditions générales d'utilisation du réseau social Hobbies
                </h1>

                <section className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
                    <p>
                        Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les règles d'utilisation du réseau social Hobbies.
                    </p>
                    <p>
                        Le réseau social Hobbies est un service en ligne exploité par Hobbies, une société enregistrée en ... sous le numéro ..., dont le siège social est situé à ... En utilisant le réseau social Hobbies, vous acceptez d'être lié par ces CGU.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">2. Acceptation des CGU</h2>
                    <p>
                        L'utilisation du réseau social Hobbies implique l'acceptation pleine et entière des présentes CGU.
                    </p>
                    <p>
                        En utilisant le réseau social, vous déclarez avoir pris connaissance des présentes CGU et les accepter expressément avant d'utiliser les services offerts par Hobbies.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">3. Conditions d'accès</h2>
                    <p>
                        L'accès au réseau social Hobbies est réservé aux personnes physiques majeures et capables juridiquement.
                    </p>
                    <p>
                        Les mineurs de moins de 16 ans ne sont pas autorisés à créer un compte sur le réseau social Hobbies.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">4. Contenu du réseau social</h2>
                    <p>
                        Les utilisateurs du réseau social Hobbies sont responsables du contenu qu'ils publient. Le contenu publié doit respecter les lois et règlements en vigueur en ..., ainsi que les droits de tiers.
                    </p>
                    <p>
                        Il est interdit de publier du contenu injurieux, diffamatoire, raciste, xénophobe, sexiste, homophobe, ou portant atteinte à la dignité humaine. De plus, tout contenu incitant à la haine, à la violence, ou faisant l'apologie de crimes contre l'humanité est strictement prohibé.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">5. Données personnelles</h2>
                    <p>
                        En utilisant le réseau social Hobbies, vous consentez à la collecte et au traitement de vos données personnelles. Ces données sont nécessaires au bon fonctionnement du réseau social et à la fourniture des services proposés.
                    </p>
                    <p>
                        Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données personnelles. Pour exercer ces droits, veuillez nous contacter à l'adresse e-mail suivante : ....
                    </p>
                </section>

            </div>
        </div>
    )
}

export default CguPage
