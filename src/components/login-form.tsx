
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (email: string, password: string) => Promise<boolean>;
  error: string | null;
}

export function LoginForm({ onSignIn, onSignUp, error }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAction = async (action: 'signIn' | 'signUp') => {
    setIsLoading(true);
    const { email, password } = form.getValues();
    const success = action === 'signIn' 
      ? await onSignIn(email, password)
      : await onSignUp(email, password);
    if (!success) {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={() => handleAction('signIn')}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
        <Button
          onClick={() => handleAction('signUp')}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}
