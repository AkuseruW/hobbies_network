import ConnectionForm from '@/components/auth/ConnectionForm'
import Link from 'next/link'
import React from 'react'

const ConnectionPage = () => {
  return (
    <div className="container relative flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 h-screen">
      <Link
        href="/inscription"
        className={"absolute left-4 top-4 md:left-8 md:top-8 bg-[#535f54] text-white px-4 py-2 rounded-md width-6"}
      >
        Inscription
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Connexion
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to connect to your account
            </p>
          </div>
          <ConnectionForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-r from-[#e4e7e4] to-[#849486]"></div>
        <div className="relative z-20 mt-auto">

        </div>
      </div>
    </div>
  )
}

export default ConnectionPage
