import { promises as fs } from 'fs';
import path from 'path';
import businessesData from '@/data/businesses.json';
import type { Business, Review } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_PATH = path.join(DATA_DIR, 'reviews.json');

export function getBusinessBySlug(slug: string): Business | null {
  const record = businessesData as Record<string, Business>;
  return record[slug] ?? null;
}

export function getAllBusinesses(): Business[] {
  return Object.values(businessesData as Record<string, Business>);
}

export async function readReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(REVIEWS_PATH, 'utf-8');
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

export async function writeReviews(reviews: Review[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(REVIEWS_PATH, JSON.stringify(reviews, null, 2), 'utf-8');
}

export async function saveReview(review: Review): Promise<Review> {
  const reviews = await readReviews();
  reviews.push(review);
  await writeReviews(reviews);
  return review;
}

export async function getReviewsBySlug(slug: string): Promise<Review[]> {
  const reviews = await readReviews();
  return reviews.filter((r) => r.businessSlug === slug);
}

export async function getAnalytics(slug?: string) {
  const reviews = await readReviews();
  const filtered = slug
    ? reviews.filter((r) => r.businessSlug === slug)
    : reviews;

  const total = filtered.length;
  const avgRating =
    total > 0
      ? filtered.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

  const byRating = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: filtered.filter((r) => r.rating === star).length,
  }));

  const last7Days = filtered.filter((r) => {
    const diff = Date.now() - new Date(r.createdAt).getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  return {
    totalReviews: total,
    averageRating: Math.round(avgRating * 10) / 10,
    byRating,
    last7Days,
    recent: filtered.slice(-5).reverse(),
  };
}
