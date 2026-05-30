import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-neutral-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          Local AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
          <Link href="/#features" className="hover:text-neutral-900 transition-colors">
            Features
          </Link>
          <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">
            Analytics
          </Link>
          <Link href="/business/durga-property" className="hover:text-neutral-900 transition-colors">
            Durga Property
          </Link>
        </nav>
        <Button asChild size="sm">
          <Link href="/business/durga-property">Leave a Review</Link>
        </Button>
      </div>
    </header>
  );
}
