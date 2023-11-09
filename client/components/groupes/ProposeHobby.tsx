'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { proposeHobby } from '@/utils/requests/_hobbies_requests'
import { Textarea } from '../ui/textarea'
import { Icons } from '../icons'

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    description: z.string(),

})


const ProposeHobby = () => {
    const [isLoading, setLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        // Call the proposeHobby function with the form values
        const res = await proposeHobby({ values });
        if (res) {
            // Delay execution for 2 seconds to simulate a loading state
            setTimeout(() => {
                setLoading(false)// Set loading state to false after submission
                toast({
                    description: res.message, // Display a toast message with the response message
                })
            }, 2000);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Nom du hobby" autoComplete='off' {...field}
                                    className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea placeholder="Description du hobby (facultatif)" autoComplete="off" {...field}
                                    className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Icons.spinner className="w-4 h-4 animate-spin" /> : "Proposer un hobby"}
                </Button>
            </form>
        </Form>
    )
}

export default ProposeHobby
