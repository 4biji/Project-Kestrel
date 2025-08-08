
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { signUp, signIn } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Feather } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    const { result, error } = await signUp(email, password);
    if (error) {
      setError(error.message);
      return false;
    }
    toast({
      title: "Account Created",
      description: "You have successfully signed up. Welcome!",
    });
    router.push("/");
    return true;
  };

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    const { result, error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      return false;
    }
    router.push("/");
    return true;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
            <Feather className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                Falconry Journal
            </h1>
            <p className="mt-2 text-muted-foreground">
                Sign in or create an account to continue
            </p>
        </div>
        <LoginForm
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          error={error}
        />
      </div>
    </div>
  );
}
