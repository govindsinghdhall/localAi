import type { ReviewTone } from '@/types';

export const REVIEW_TONES: { value: ReviewTone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Polished and business-appropriate' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and conversational' },
  { value: 'emotional', label: 'Emotional', description: 'Personal and heartfelt' },
  { value: 'short', label: 'Short', description: 'Brief and to the point' },
  { value: 'detailed', label: 'Detailed', description: 'Thorough with specifics' },
];

export const MAX_REVIEW_LENGTH = 4096;

export const SENTIMENT_MAP = {
  '😍': 5,
  '😊': 4,
  '😐': 3,
  '😕': 2,
  '😞': 1,
} as const;
