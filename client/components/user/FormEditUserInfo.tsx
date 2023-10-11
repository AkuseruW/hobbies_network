'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user_types';
import { updateAuthCookies } from '@/utils/_auth_cookies';
import { updateProfile } from '@/utils/requests/_users_requests';

const formSchema = z.object({
    firstname: z.string().nonempty("Le prénom ne peut pas être vide."),
    lastname: z.string().nonempty("Le nom de famille ne peut pas être vide."),
    bio: z.string().optional(),
});

const FormEditUserInfo = ({ currentUser }: { currentUser: User }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast()
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: currentUser.firstname,
            lastname: currentUser.lastname,
            bio: currentUser.bio || '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const res = await updateProfile({
                firstname: values.firstname,
                lastname: values.lastname,
                bio: values.bio,
            });
            if(res.success === true) {
                const {firstname, lastname, profile_picture, id, role} = res.user_info
                updateAuthCookies(firstname, lastname, profile_picture, id, role);
                router.refresh();
                toast({
                    description: "Profil mis à jour avec succès.",
                })
            }else{
                toast({
                    description: res.detail,
                    variant:"destructive"
                })
            }
        } catch (error) {
            toast({
                description: "Erreur lors de la mise à jour du profil.",
            })
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="flex justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex justify-center mt-5">
                    <div className="flex flex-wrap">
                        {['firstname', 'lastname'].map((fieldName) => (
                            <div key={fieldName} className="w-full px-2">
                                <FormField
                                    control={form.control}
                                    // @ts-ignore
                                    name={`${fieldName}`}
                                    render={({ field }) => (
                                        <FormItem className="px-4 py-2">
                                            <Input
                                                className="px-4 py-2"
                                                placeholder={fieldName === 'bio' ? 'Entrer une bio ...' : `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} ...`}
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
                                        <Textarea className='' placeholder="Entrer une bio ..." {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default FormEditUserInfo;