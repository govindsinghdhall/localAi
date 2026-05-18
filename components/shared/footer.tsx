import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Local AI. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/business/roopya" className="hover:text-zinc-300">
            Roopya Demo
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-300">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
