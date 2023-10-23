import React from 'react'
import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';

const RegisterPage = () => {
    return (
        <div className="container relative flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 h-screen">
            <div className="relative hidden h-full p-10 lg:flex"
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
                    backgroundSize: "cover",
                }}>
            </div>

            <Link
                href="/connexion"
                className="absolute right-4 top-4 md:right-8 md:top-8
                    bg-[#09090b] dark:bg-background_light dark:text-text_light text-white
                  px-4 py-2 rounded-md width-6"
            >
                Connexion
            </Link>

            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Créer un compte
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entrez votre adresse e-mail ci-dessous pour créer votre compte
                        </p>
                    </div>
                    <SignUpForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        En cliquant sur Continuer, vous acceptez nos{" "}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Conditions d'utilisation
                        </Link>{" "}
                        et notre{" "}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Politique de confidentialité
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
