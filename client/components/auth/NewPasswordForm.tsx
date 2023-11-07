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
import { passwordUpdate } from "@/utils/requests/_auth_requests";

const formSchema = z.object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
})

const NewPasswordForm = ({ token }: { token: string }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        if (values.password !== values.confirmPassword) {
            toast({
                description: 'Les mots de passe ne correspondent pas',
                variant: "destructive"
            })
            return;
        }

        try {
            const res = await passwordUpdate({ password: values.password, token });
            toast({
                description: res.detail
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Input type="password" placeholder="Password"
                                className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                                {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <Input type="password" placeholder="Confirm Password"
                                className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                                {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type='submit'
                    disabled={isLoading}
                    className={`bg-[#535f54] text-white inline-flex items-center
                     justify-center rounded-md text-sm font-medium transition-colors
                      focus-visible:outline-none focus-visible:ring-1
                      dark:bg-background_light dark:text-text_light 
                      dark:focus-visible:ring-white
                       focus-visible:ring-ring w-full ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                        } h-9 px-4 py-2`}
                >
                    {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Reset du mot de passe
                </Button>
            </form>
        </Form>
    )
};

export default NewPasswordForm
