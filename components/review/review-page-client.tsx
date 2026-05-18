'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  ExternalLink,
  Loader2,
  QrCode,
  RefreshCw,
  Share2,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Business, ReviewTone, SentimentEmoji } from '@/types';
import { StarRating } from '@/components/review/star-rating';
import { SentimentSelector } from '@/components/review/sentiment-selector';
import { QrCodeModal } from '@/components/review/qr-code-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REVIEW_TONES, MAX_REVIEW_LENGTH } from '@/utils/constants';
import {
  getGoogleReviewWriteUrl,
  isDirectGoogleReviewUrl,
} from '@/lib/google-review';

interface ReviewPageClientProps {
  business: Business;
}

export function ReviewPageClient({ business }: ReviewPageClientProps) {
  const [rating, setRating] = useState(5);
  const [tone, setTone] = useState<ReviewTone>('friendly');
  const [reviewText, setReviewText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<SentimentEmoji | undefined>();
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [aiSource, setAiSource] = useState<'openai' | 'local' | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(`${window.location.origin}/business/${business.slug}`);
  }, [business.slug]);

  const charCount = reviewText.length;
  const charPercent = Math.min(100, (charCount / MAX_REVIEW_LENGTH) * 100);

  const fetchSuggestions = useCallback(async () => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessSlug: business.slug,
          rating,
          tone,
          keywords: keywords || undefined,
          count: 3,
          action: 'suggest',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate suggestions');
      setSuggestions(data.suggestions);
      setAiSource(data.source);
      toast.success('AI suggestions ready');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoadingSuggestions(false);
    }
  }, [business.slug, rating, tone, keywords]);

  const rewriteReview = async () => {
    if (!reviewText.trim()) {
      toast.error('Write something first to rewrite');
      return;
    }
    setRewriting(true);
    try {
      const res = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessSlug: business.slug,
          rating,
          tone,
          action: 'rewrite',
          existingText: reviewText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Rewrite failed');
      setReviewText(data.suggestion);
      toast.success('Review rewritten with AI');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Rewrite failed');
    } finally {
      setRewriting(false);
    }
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const applySuggestion = (text: string) => {
    setReviewText(text);
    toast.success('Suggestion applied');
  };

  const handleSentiment = (emoji: SentimentEmoji, stars: number) => {
    setSentiment(emoji);
    setRating(stars);
  };

  const postOnGoogle = () => {
    if (!reviewText.trim()) {
      toast.error('Please write or select a review first');
      return;
    }

    const googleUrl = getGoogleReviewWriteUrl(business);

    if (!isDirectGoogleReviewUrl(googleUrl)) {
      toast.error(
        'Direct Google review link not configured. Add placeId or googleWriteReviewUrl in data/businesses.json',
        { duration: 8000 },
      );
      return;
    }

    setPosting(true);

    navigator.clipboard.writeText(reviewText).catch(() => {});

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessSlug: business.slug,
        rating,
        text: reviewText,
        tone,
        sentiment,
      }),
    }).catch(() => {});

    toast.success('Review copied! Opening Google review page…', { duration: 4000 });

    window.location.href = googleUrl;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl font-bold text-white shadow-xl shadow-violet-500/30">
          {business.logoInitials}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {business.name}
        </h1>
        <p className="mt-2 text-zinc-400">{business.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Badge variant="success">
            ★ {business.averageRating} avg · {business.totalReviews} reviews
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => setQrOpen(true)}>
            <QrCode className="h-4 w-4" /> QR Code
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyText(shareUrl)}
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </motion.div>

      <div className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>How was your experience?</CardTitle>
            <CardDescription>Tap a sentiment or select stars below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SentimentSelector selected={sentiment} onSelect={handleSentiment} />
            <StarRating value={rating} onChange={setRating} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              AI Review Assistant
            </CardTitle>
            <CardDescription>
              Generate suggestions, then edit and post on Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as ReviewTone)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REVIEW_TONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Keywords (optional)</Label>
                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. fast service, friendly staff"
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={fetchSuggestions}
              disabled={loadingSuggestions}
            >
              {loadingSuggestions ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate AI Suggestions
            </Button>

            {aiSource && (
              <p className="text-center text-xs text-zinc-500">
                Powered by {aiSource === 'openai' ? 'OpenAI' : 'smart templates'}
              </p>
            )}

            <AnimatePresence mode="popLayout">
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={`${i}-${s.slice(0, 20)}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="group rounded-xl border border-white/10 bg-black/20 p-4 hover:border-violet-500/30"
                    >
                      <p className="text-sm leading-relaxed text-zinc-200">{s}</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => applySuggestion(s)}>
                          Use this
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => copyText(s)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={fetchSuggestions}
                    disabled={loadingSuggestions}
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingSuggestions ? 'animate-spin' : ''}`} />
                    Generate more suggestions
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your review</CardTitle>
            <CardDescription>Edit before posting on Google</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value.slice(0, MAX_REVIEW_LENGTH))}
              placeholder="Write your review here or use an AI suggestion above..."
              className="min-h-[160px]"
            />
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>
                {charCount} / {MAX_REVIEW_LENGTH} characters
              </span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${
                    charPercent > 90 ? 'bg-amber-500' : 'bg-violet-500'
                  }`}
                  style={{ width: `${charPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={rewriteReview}
                disabled={rewriting || !reviewText.trim()}
              >
                {rewriting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                AI Rewrite
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => copyText(reviewText)}
                disabled={!reviewText.trim()}
              >
                <Copy className="h-4 w-4" /> Copy review
              </Button>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={postOnGoogle}
              disabled={posting || !reviewText.trim()}
            >
              {posting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Post Review on Google
            </Button>
            <p className="text-center text-xs text-zinc-500">
              Reviews cannot be posted automatically. You will paste your review on Google.
            </p>
          </CardContent>
        </Card>
      </div>

      <QrCodeModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        url={shareUrl}
        businessName={business.name}
      />
    </div>
  );
}
