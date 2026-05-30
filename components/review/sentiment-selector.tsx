'use client';

import { motion } from 'framer-motion';
import type { SentimentEmoji } from '@/types';
import { cn } from '@/lib/utils';

const sentiments: { emoji: SentimentEmoji; label: string; rating: number }[] = [
  { emoji: '😞', label: 'Bad', rating: 1 },
  { emoji: '😕', label: 'Meh', rating: 2 },
  { emoji: '😐', label: 'Okay', rating: 3 },
  { emoji: '😊', label: 'Good', rating: 4 },
  { emoji: '😍', label: 'Amazing', rating: 5 },
];

interface SentimentSelectorProps {
  selected?: SentimentEmoji;
  onSelect: (emoji: SentimentEmoji, rating: number) => void;
}

export function SentimentSelector({ selected, onSelect }: SentimentSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {sentiments.map(({ emoji, label, rating }) => (
        <motion.button
          key={emoji}
          type="button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(emoji, rating)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-xl border px-3 py-2 transition-all',
            selected === emoji
              ? 'border-neutral-900 bg-neutral-100 shadow-sm'
              : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50',
          )}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-xs text-neutral-500">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
