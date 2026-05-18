'use client';

import { motion } from 'framer-motion';
import { MessageSquare, QrCode, Sparkles, TrendingUp, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Review Suggestions',
    description:
      'Generate professional, friendly, or detailed reviews tailored to each star rating.',
  },
  {
    icon: Zap,
    title: 'One-Click Google Post',
    description:
      'Save locally and redirect customers to Google with their review ready to paste.',
  },
  {
    icon: MessageSquare,
    title: 'Multiple Tones',
    description:
      'Professional, friendly, emotional, short, or detailed — match your brand voice.',
  },
  {
    icon: QrCode,
    title: 'QR & Share Links',
    description: 'Print QR codes for in-store displays or share review links anywhere.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Track draft reviews, ratings distribution, and weekly activity.',
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Everything you need to boost reviews
        </h2>
        <p className="mt-4 text-zinc-400">
          Premium tools designed for modern businesses
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-shadow hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 transition-colors group-hover:bg-violet-500/25">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
