"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore } from "@/firebase/provider";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc, serverTimestamp } from "firebase/firestore";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(["tenant", "artisan", "landlord"], {
    required_error: "You need to select a role.",
  }),
});

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !firestore) {
       toast({
            variant: "destructive",
            title: "Service Error",
            description: "Firebase services are not available. Please try again later.",
        });
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userData = {
        userId: user.uid,
        email: user.email,
        rolePrimary: values.role,
        roles: [values.role],
        trustTier: 0,
        isVerified: false,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      setDocumentNonBlocking(userDocRef, userData, { merge: false });
      
      toast({
        title: "Account Created Successfully",
        description: "Please log in with your new credentials.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "An unknown error occurred.",
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Link href="/" className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary rounded-md">
            <Home className="text-primary-foreground h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold font-headline">Create an account</h1>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Join Prime Nest</CardTitle>
          <CardDescription>Join our platform by choosing a role below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Choose your primary role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2 pt-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:bg-secondary">
                          <FormControl>
                            <RadioGroupItem value="tenant" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tenant - Looking for a place to live.
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:bg-secondary">
                          <FormControl>
                            <RadioGroupItem value="landlord" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Landlord - Renting out property.
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:bg-secondary">
                          <FormControl>
                            <RadioGroupItem value="artisan" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Artisan - Offering professional services.
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-primary">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
