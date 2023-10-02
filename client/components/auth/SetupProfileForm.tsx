'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { UserInformation } from '@/utils/_setupProfileCookies';

const formSchema = z.object({
    firstname: z.string().nonempty("Le prénom ne peut pas être vide."),
    lastname: z.string().nonempty("Le nom de famille ne peut pas être vide."),
    bio: z.string().optional(),
});

const SetupProfileForm = ({ initialUser }: { initialUser?: { firstname: string, lastname: string, bio: string | undefined } }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: initialUser?.firstname || '',
            lastname: initialUser?.lastname || '',
            bio: initialUser?.bio || '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        const user = {
            firstname: values.firstname,
            lastname: values.lastname,
            bio: values.bio || '',
        }
        UserInformation({ user });
        setIsLoading(false);
        router.refresh();
        router.push('/setup/hobbies');
    };

    return (
        <div className="flex justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col justify-center mt-5">
                    <div className="flex flex-wrap space-y-6 rounded-md border p-4 mt-4 bg-white dark:bg-gray-800">
                        {['firstname', 'lastname'].map((fieldName) => (
                            <div key={fieldName} className="w-full px-2">

                                <FormField
                                    control={form.control}
                                    // @ts-ignore
                                    name={fieldName}
                                    render={({ field }) => (
                                        <FormItem className="px-4 py-2">
                                            <Input
                                                className="px-4 py-2"
                                                placeholder={`${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} ...`}
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}

                        <div className="w-full px-2">
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem className="px-4 py-2">
                                        <Textarea className="h-32 resize-none" placeholder="Entrer une bio ..." {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <div className="w-full px-2 mx-4 py-2">
                        <Button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enregistrement en cours...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SetupProfileForm;
