"use client"


import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { setCookie } from "cookies-next";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "./icons";

export const CookieSettings = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const handleAccept = () => {
        setIsLoading(true)
        setCookie("_cookie_settings", "accepted_cookie", { maxAge: 60 * 60 * 24 * 365 })
        router.refresh()
    }

    return (
        <Card className="z-[200] float-left fixed  bottom-2 left-2 bg-gray-100 border-2 border-slate-950 dark:bg-gray-800">
            <CardHeader>
                <CardTitle>Cookie Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="necessary" className="flex flex-col space-y-1">
                        <span className="font-normal leading-snug text-muted-foreground">
                            Nous utilisons des cookies pour vous garantir la meilleure expérience possible sur notre site Web.
                        </span>
                        <Link href="#" className="font-normal leading-snug text-blue-500 hover:underline">Lire les politiques de cookies.</Link>
                    </Label>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleAccept}>
                    J&apos;accepte
                    {isLoading && (<Icons.spinner className="ml-2 animate-spin" />)}
                </Button>

            </CardFooter>
        </Card>
    )
}