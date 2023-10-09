'use client';
import * as z from "zod"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { Icons } from "../icons";
import { useToast } from "../ui/use-toast";
import { setAuthCookies } from "@/utils/_auth_cookies";
import { signin } from "@/utils/requests/_auth_requests";

const formSchema = z.object({
    email: z.string().email({ message: 'required' }),
    password: z.string().min(6),
})

const ConnectionForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const response = await signin(values);
            if (response.success) {
                const { token, lastname, firstname, profile_picture, id, role } = response.data;
                await setAuthCookies(token, lastname, firstname, profile_picture, id, role);
                router.push("/");
            } else {
                toast({
                    description: response.data.detail,
                    variant: "destructive"
                })
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitHubLogin = () => {
        setIsLoading(true);
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/github`);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/google`);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <Input placeholder="Email ..." {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Input type="password" placeholder="Password ..." {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    disabled={isLoading}
                    className={`bg-[#535f54] text-white inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                        } h-9 px-4 py-2`}
                >
                    {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Connexion
                </Button>


            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground ">
                        Or continue with
                    </span>
                </div>
            </div>
            <div className="flex flex-col">
                <Button variant="outline" type="button" disabled={isLoading}
                    onClick={() => {
                        handleGoogleLogin();
                    }}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                    )}{" "}
                    Google
                </Button>

                <Button variant="outline" className="mt-2" type="button" disabled={isLoading}
                    onClick={() => {
                        handleGitHubLogin();
                    }}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.gitHub className="mr-2 h-4 w-4" />
                    )}{" "}
                    Github
                </Button>
            </div>
        </Form>
    )
};

export default ConnectionForm
