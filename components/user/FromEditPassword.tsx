'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { updatePassword } from '@/utils/requests/_users_requests';

const formSchema = z.object({
    currentPassword: z.string().min(8, 'Le mot de passe actuel doit comporter au moins 8 caractères.'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit comporter au moins 8 caractères.'),
    confirmPassword: z.string(),
});

formSchema.refine(data => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
});

const FormEditUserPassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            await updatePassword({
                current_password: values.currentPassword,
                new_password: values.newPassword
            });

            toast({
                description: "Mot de passe mis à jour avec succès.",
            })
        } catch (error) {
            toast({
                description: "Erreur lors de la mise à jour du mot de passe.",
            })
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="w-full px-2">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem className="px-4 py-2">
                                    <Input
                                        type="password"
                                        className="px-4 py-2"
                                        placeholder="Mot de passe actuel ..."
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full px-2">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="px-4 py-2">
                                    <Input
                                        type="password"
                                        className="px-4 py-2"
                                        placeholder="Nouveau mot de passe ..."
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full px-2">
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="px-4 py-2">
                                    <Input
                                        type="password"
                                        className="px-4 py-2"
                                        placeholder="Confirmez le mot de passe ..."
                                        {...field}
                                    />
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
                </form>
            </Form>
        </div>
    )
}

export default FormEditUserPassword;