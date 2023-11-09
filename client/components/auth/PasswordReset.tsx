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
import { passwordReset } from "@/utils/requests/_auth_requests";

const formSchema = z.object({
    email: z.string().email({ message: 'required' }),
})

const ResetPasswordForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            passwordReset(values);
            toast({
                description: 'Email envoyé'
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <Input placeholder="Email" {...field}
                                className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                            />
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

export default ResetPasswordForm
