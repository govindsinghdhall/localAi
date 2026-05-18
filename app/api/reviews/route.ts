import { NextResponse } from 'next/server';
import { getBusinessBySlug, saveReview } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { CreateReviewRequest } from '@/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateReviewRequest;
    const { businessSlug, rating, text, tone, sentiment } = body;

    if (!businessSlug || !rating || !text?.trim()) {
      return NextResponse.json(
        { error: 'businessSlug, rating, and text are required' },
        { status: 400 },
      );
    }

    const business = getBusinessBySlug(businessSlug);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const stars = Math.min(5, Math.max(1, Math.round(Number(rating))));

    const review = await saveReview({
      id: generateId(),
      businessSlug,
      rating: stars,
      text: text.trim(),
      tone: tone ?? 'friendly',
      sentiment,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err) {
    console.error('POST /api/reviews error:', err);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}
