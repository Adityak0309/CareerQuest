
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">CareerQuest</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild variant="ghost">
             <Link href="/games">Games</Link>
          </Button>
          {isMounted && (
            <Button asChild className="shadow-md shadow-primary/20 hover:shadow-primary/40 transition-shadow">
              <Link href="/login">Start Your Quest</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
