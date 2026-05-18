import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-4 w-4" />
          </span>
          Local AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <Link href="/#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Analytics
          </Link>
          <Link href="/business/roopya" className="hover:text-white transition-colors">
            Demo
          </Link>
        </nav>
        <Button asChild size="sm">
          <Link href="/business/roopya">Try Demo</Link>
        </Button>
      </div>
    </header>
  );
}
