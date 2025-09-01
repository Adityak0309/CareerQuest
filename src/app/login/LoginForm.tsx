'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.191C34.786 8.623 29.743 6 24 6C12.955 6 4 14.955 4 26s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.843-5.843C34.786 8.623 29.743 6 24 6C16.712 6 10.32 10.079 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 46c5.743 0 10.786-2.623 14.804-6.191l-5.843-5.843C30.842 35.846 27.059 38 24 38c-5.223 0-9.649-3.417-11.303-8l-6.571 4.819C10.32 41.921 16.712 46 24 46z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.843 5.843C42.859 36.191 46 31.7 46 26c0-1.341-.138-2.65-.389-3.917z"/>
        </svg>
    )
}

export function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/games');
  };

  return (
    <div className="grid gap-6">
      <Button variant="outline" onClick={() => router.push('/games')}>
        <GoogleIcon />
        <span className="ml-2">Sign in with Google</span>
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">Sign In</Button>
      </form>
    </div>
  );
}
