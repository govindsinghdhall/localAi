'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'md' | 'lg';
}

export function StarRating({ value, onChange, size = 'lg' }: StarRatingProps) {
  const iconSize = size === 'lg' ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-8 w-8';
  const gap = size === 'lg' ? 'gap-2 sm:gap-3' : 'gap-1.5';

  return (
    <div className={cn('flex items-center justify-center', gap)} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <motion.button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(star)}
            className="rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
          >
            <Star
              className={cn(
                iconSize,
                filled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                  : 'text-zinc-600 hover:text-zinc-400',
              )}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
