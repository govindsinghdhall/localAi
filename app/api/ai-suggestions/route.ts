import { NextResponse } from 'next/server';
import { getBusinessBySlug } from '@/lib/db';
import {
  generateAISuggestions,
  rewriteReview,
} from '@/services/ai';
import type { AISuggestionRequest } from '@/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AISuggestionRequest;
    const {
      businessSlug,
      rating = 5,
      tone = 'friendly',
      keywords,
      count = 3,
      action = 'suggest',
      existingText,
    } = body;

    if (!businessSlug) {
      return NextResponse.json({ error: 'businessSlug is required' }, { status: 400 });
    }

    const business = getBusinessBySlug(businessSlug);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const stars = Math.min(5, Math.max(1, Math.round(Number(rating))));

    if (action === 'rewrite') {
      if (!existingText?.trim()) {
        return NextResponse.json(
          { error: 'existingText is required for rewrite' },
          { status: 400 },
        );
      }
      const result = await rewriteReview(business, stars, tone, existingText.trim());
      return NextResponse.json({
        suggestion: result.suggestion,
        source: result.source,
      });
    }

    const num = Math.min(5, Math.max(1, Number(count) || 3));
    const result = await generateAISuggestions(
      business,
      stars,
      tone,
      num,
      keywords,
    );

    return NextResponse.json({
      suggestions: result.suggestions,
      source: result.source,
    });
  } catch (err) {
    console.error('POST /api/ai-suggestions error:', err);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 },
    );
  }
}
