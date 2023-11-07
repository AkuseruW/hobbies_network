import NewPasswordForm from '@/components/auth/NewPasswordForm'
import Link from 'next/link'
import React from 'react'

const page = ({ params }: { params: { token: string } }) => {
  const { token } = params

  return (
    <div className="container relative items-center justify-center md:grid lg:max-w-none lg:grid lg:px-0 h-screen">
      <Link
        href="/connexion"
        className="absolute left-4 top-4 md:left-8 md:top-8 bg-[#535f54]
        dark:bg-background_light dark:text-text_light text-white
        px-4 py-2 rounded-md width-6"
      >
        Connexion
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto w-full justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Mot de passe oublie ?
            </h1>
            <p className="text-sm text-muted-foreground">
              Entrez votre adresse e-mail ci-dessous pour reinitialiser votre mot de passe
            </p>
          </div>
          <NewPasswordForm token={token} />
        </div>
      </div>
    </div>
  )
}

export default page
