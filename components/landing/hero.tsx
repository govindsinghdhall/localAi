'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-4 py-1.5 text-sm text-neutral-600"
        >
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          AI-powered Google Review collection
        </motion.div>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
          Collect More{' '}
          <span className="text-neutral-600">Google Reviews</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-500 sm:text-xl">
          Local AI helps your customers write authentic, high-quality reviews in
          seconds — then guides them to post on Google.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/business/roopya">
              Start Free Demo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">View Analytics</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="relative mx-auto mt-16 max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-sm">
          <div className="rounded-lg bg-neutral-50 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-900 font-bold text-white">
                R
              </div>
              <div className="text-left">
                <p className="font-semibold text-neutral-900">Roopya</p>
                <p className="text-sm text-neutral-500">★★★★★ AI suggestion ready</p>
              </div>
            </div>
            <p className="rounded-lg border border-neutral-200 bg-white p-4 text-left text-sm leading-relaxed text-neutral-600">
              &ldquo;Excellent service and very professional experience. The team at Roopya
              went above and beyond — highly recommend!&rdquo;
            </p>
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
