
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Feather } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    const { result, error } = await signIn(email, password);
    if (error) {
      setError((error as any).message);
      return false;
    }
    toast({
      title: 'Signed In',
      description: "Welcome back!",
    });
    router.push('/');
    return true;
  };

  const handleSignUp = async (email: string, password: string) => {
    const { result, error } = await signUp(email, password);
    if (error) {
      setError((error as any).message);
      return false;
    }
    toast({
      title: 'Account Created',
      description: "You've been successfully signed up!",
    });
    router.push('/');
    return true;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-lg bg-primary p-3 text-primary-foreground">
            <Feather className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold font-headline">Falconry Journal</h1>
          <p className="mt-2 text-muted-foreground">
            Your digital companion for modern falconry.
          </p>
        </div>
        <LoginForm onSignIn={handleSignIn} onSignUp={handleSignUp} error={error} />
      </div>
    </div>
  );
}
