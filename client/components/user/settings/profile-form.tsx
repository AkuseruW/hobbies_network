"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { updateProfile } from "@/utils/requests/_users_requests";
import { updateAuthCookies } from "@/utils/_auth_cookies";
import { useRouter } from "next/navigation";

// Validation schema definition
const profileFormSchema = z.object({
  firstname: z.string().nonempty("Le prénom ne peut pas être vide."),
  lastname: z.string().nonempty("Le nom de famille ne peut pas être vide."),
  bio: z.string().optional(),
});

// Type definition for form values
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const ProfileForm = ({ currentUser }: { currentUser: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast()
  const router = useRouter();

  // Initialize the form using useForm
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstname: currentUser?.firstname,
      lastname: currentUser?.lastname,
      bio: currentUser?.bio,
    },
    mode: "onChange",
  });

  // Submission handler
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const { firstname, lastname, bio } = data;
      const res = await updateProfile({
        firstname: firstname,
        lastname: lastname,
        bio: bio,
      });
      if (res.success === true) {
        const { firstname, lastname, profile_picture, id, role } = res.user_info
        updateAuthCookies(firstname, lastname, profile_picture, id, role);
        toast({
          description: "Profil mis à jour avec succès.",
        })
      } else {
        toast({
          description: res.detail,
          variant: "destructive"
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex">
          {/* First name field */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <div className="w-1/2 pr-2">
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          {/* Last name field */}
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <div className="w-1/2 pl-2">
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
        </div>

        {/* Email field */}
        <FormField
          control={form.control}
          // @ts-ignore
          name="email"
          defaultValue={currentUser?.email}
          disabled={true}
          render={({ field }) => (
            <div className="">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        {/* Bio field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a bio..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button with loading indicator */}
        <Button type="submit" className="w-[40%]" disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="w-4 h-4 animate-spin"/>
          ) : (
            'Update Profile'
          )}
        </Button>
      </form>
    </Form>
  );
};
