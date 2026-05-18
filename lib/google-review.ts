import type { Business } from '@/types';

/**
 * Builds the direct Google "Write a review" URL.
 * @see https://developers.google.com/maps/documentation/places/web-service/place-id
 */
export function getGoogleReviewWriteUrl(business: Business): string {
  if (business.googleWriteReviewUrl?.trim()) {
    return business.googleWriteReviewUrl.trim();
  }

  if (business.placeId?.trim()) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(business.placeId.trim())}`;
  }

  const url = business.googleReviewUrl.trim();

  if (url.includes('writereview') || url.includes('placeid=')) {
    return url;
  }

  if (url.includes('g.page') && !url.endsWith('/review')) {
    return url.replace(/\/?$/, '/review');
  }

  return url;
}

export function isDirectGoogleReviewUrl(url: string): boolean {
  return (
    url.includes('writereview') ||
    url.includes('placeid=') ||
    url.includes('g.page') && url.includes('/review')
  );
}
