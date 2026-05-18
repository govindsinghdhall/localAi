export type ReviewTone =
  | 'professional'
  | 'friendly'
  | 'emotional'
  | 'short'
  | 'detailed';

export type SentimentEmoji = '😍' | '😊' | '😐' | '😕' | '😞';

export interface Business {
  slug: string;
  name: string;
  description: string;
  category: string;
  /** Fallback share/maps link */
  googleReviewUrl: string;
  /** Direct writereview URL — highest priority if set */
  googleWriteReviewUrl?: string;
  /** Google Place ID — used to build writereview URL */
  placeId?: string;
  logoInitials: string;
  averageRating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  businessSlug: string;
  rating: number;
  text: string;
  tone: ReviewTone;
  sentiment?: SentimentEmoji;
  createdAt: string;
}

export interface AISuggestionRequest {
  businessSlug: string;
  rating: number;
  tone: ReviewTone;
  keywords?: string;
  count?: number;
  action?: 'suggest' | 'rewrite';
  existingText?: string;
}

export interface AISuggestionResponse {
  suggestions: string[];
  source: 'openai' | 'local';
}

export interface CreateReviewRequest {
  businessSlug: string;
  rating: number;
  text: string;
  tone?: ReviewTone;
  sentiment?: SentimentEmoji;
}
