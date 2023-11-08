import ArrowBack from "@/components/ArrowBack";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-4">
      <ArrowBack />
      <div className="w-xl md:w-[70%] mx-auto my-24">
        <h1 className="text-2xl font-semibold mb-4">
          Politique de confidentialité de Hobbies
        </h1>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p>
            Hobbies s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité décrit les informations que nous collectons, comment nous les utilisons et comment nous les protégeons.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Informations collectées</h2>
          <p>
            Nous collectons les informations suivantes sur nos utilisateurs :
          </p>
          <ul className="list-disc pl-4">
            <li>Informations personnelles : nous collectons les informations personnelles que vous nous fournissez lorsque vous créez un compte, utilisez nos services ou interagissez avec notre site Web. Ces informations peuvent inclure votre nom, votre adresse e-mail, votre adresse postale, votre numéro de téléphone, votre date de naissance, votre sexe et vos intérêts.</li>
            <li>Informations techniques : nous collectons également des informations techniques sur votre appareil et votre utilisation de notre site Web. Ces informations peuvent inclure votre adresse IP, votre type de navigateur, votre système d'exploitation, les pages que vous visitez sur notre site Web et la durée de votre visite.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Utilisation des informations</h2>
          <p>
            Nous utilisons les informations que nous collectons pour les fins suivantes :
          </p>
          <ul className="list-disc pl-4">
            <li>Pour fournir nos services : nous utilisons les informations que vous nous fournissez pour vous fournir nos services, notamment pour créer votre compte, vous fournir des produits ou services, répondre à vos questions et vous contacter.</li>
            <li>Pour améliorer nos services : nous utilisons les informations que nous collectons pour améliorer nos services, notamment pour comprendre comment les utilisateurs utilisent notre site Web et pour identifier les domaines dans lesquels nous pouvons améliorer l'expérience utilisateur.</li>
            <li>Pour vous envoyer des communications : nous pouvons utiliser les informations que vous nous fournissez pour vous envoyer des communications marketing, telles que des newsletters ou des offres spéciales.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Partage des informations</h2>
          <p>
            Nous ne partageons vos informations personnelles avec des tiers que dans les cas suivants :
          </p>
          <ul className="list-disc pl-4">
            <li>Avec votre consentement : nous ne partageons vos informations personnelles avec des tiers que si vous nous donnez votre consentement explicite.</li>
            <li>Pour fournir nos services : nous pouvons partager vos informations personnelles avec des tiers qui nous aident à fournir nos services, tels que des fournisseurs de services d'hébergement ou de traitement des paiements.</li>
            <li>Pour répondre à une demande légale : nous pouvons partager vos informations personnelles avec des tiers si nous sommes légalement tenus de le faire, par exemple en réponse à une ordonnance du tribunal ou à une demande de la police.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Sécurité des informations</h2>
          <p>
            Nous nous engageons à protéger la sécurité de vos informations personnelles. Nous utilisons des mesures de sécurité techniques et administratives pour protéger vos informations contre la perte, l'utilisation abusive et la divulgation non autorisée.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Vos droits</h2>
          <p>
            Vous disposez de certains droits concernant vos informations personnelles, notamment :
          </p>
          <ul className="list-disc pl-4">
            <li>Le droit d'accès : vous avez le droit d'accéder à vos informations personnelles et de demander des informations sur la manière dont elles sont utilisées.</li>
            <li>Le droit de rectification : vous avez le droit de rectifier vos informations personnelles si elles sont inexactes ou incomplètes.</li>
            <li>Le droit d'opposition : vous avez le droit de vous opposer à l'utilisation de vos informations personnelles à certaines fins, telles que le marketing direct.</li>
            <li>Le droit de suppression : vous avez le droit de demander la suppression de vos informations personnelles dans certaines circonstances, telles que si vous retirez votre consentement à leur utilisation.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Comment exercer vos droits</h2>
          <p>
            Pour exercer vos droits, vous pouvez nous contacter à l'adresse e-mail suivante : ...
          </p>
        </section>
      </div>

    </div>
  );
};

export default PrivacyPolicy;
