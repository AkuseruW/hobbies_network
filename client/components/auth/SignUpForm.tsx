'use client'
import { z } from 'zod';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Icons } from '../icons';
import { signup } from '@/utils/requests/_auth_requests';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
    email: z.string().email({ message: 'required' }),
    password: z.string().min(6),
})


const SignUpForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const res = await signup(values);
            if (res.status_code === 201) {
                router.push('/connexion');
                setIsLoading(false);
            } else {
                toast({
                    description: res.detail,
                    variant: "destructive"
                })
                setIsLoading(false) 
            }

        } catch (error) {
            setErrorMessage("Une erreur s'est produite");
        }
    };

    // Login with Google
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
                            <Input placeholder="Email ..." {...field}
                                className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Input type="password" placeholder="Password ..." {...field}
                                className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    disabled={isLoading}
                    className={`bg-background_dark text-white inline-flex items-center
                     justify-center rounded-md text-sm font-medium transition-colors
                      focus-visible:outline-none focus-visible:ring-1
                      dark:bg-background_light dark:text-text_light 
                      dark:focus-visible:ring-white
                       focus-visible:ring-ring w-full ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                        } h-9 px-4 py-2`}
                >
                    {isLoading && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />)}
                    Inscription
                </Button>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background dark:bg-background_dark px-2 text-muted-foreground ">
                        Or continue with
                    </span>
                </div>
            </div>
            <div className="flex flex-col">
                <Button variant="outline" type="button" disabled={isLoading}
                    className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
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
            </div>
        </Form>
    )
}

export default SignUpForm
