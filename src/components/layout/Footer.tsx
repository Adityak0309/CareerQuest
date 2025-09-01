import Link from 'next/link';
import { Github, Twitter, Linkedin, Rocket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Rocket className="h-6 w-6 text-primary hidden sm:block" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} CareerQuest. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" target="_blank" rel="noreferrer" aria-label="Twitter">
            <Twitter className="h-5 w-5 hover:text-primary transition-colors" />
          </Link>
          <Link href="#" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5 hover:text-primary transition-colors" />
          </Link>
          <Link href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
