"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/utils/requests/_users_requests";
import { useState } from "react";
import { Icons } from "@/components/icons";

const accountFormSchema = z.object({
  currentPassword: z.string().min(8, 'Le mot de passe actuel doit comporter au moins 8 caractères.'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit comporter au moins 8 caractères.'),
  confirmPassword: z.string(),
});

accountFormSchema.refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas.',
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export const AccountForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof accountFormSchema>) => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input type="password" {...field}
                  className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field}
                  className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field}
                  className="dark:bg-background_dark dark:text-text_dark dark:border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-[40%]" disabled={isLoading}>
          {isLoading ? <Icons.spinner className="w-4 h-4 animate-spin" /> : 'Update password'}
        </Button>
      </form>
    </Form>
  );
}
