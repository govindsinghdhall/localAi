import type { Business } from '@/types';

/**
 * Builds the direct Google "Write a review" URL.
 * @see https://developers.google.com/maps/documentation/places/web-service/place-id
 */
function normalizeUrl(url: string): string {
  return url.trim();
}

export function getGoogleReviewWriteUrl(business: Business): string {
  const writeUrl = normalizeUrl(business.googleWriteReviewUrl ?? '');
  if (writeUrl) return writeUrl;

  const placeId = normalizeUrl(business.placeId ?? '');
  if (placeId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
  }

  const url = normalizeUrl(business.googleReviewUrl ?? '');
  if (!url) return '';

  if (url.includes('writereview') || url.includes('placeid=')) {
    return url;
  }

  if (url.includes('g.page')) {
    return url.endsWith('/review') ? url : url.replace(/\/?$/, '/review');
  }

  return url;
}

export function isDirectGoogleReviewUrl(url: string): boolean {
  const u = normalizeUrl(url);
  if (!u) return false;

  return (
    u.includes('writereview') ||
    u.includes('placeid=') ||
    (u.includes('g.page') && u.includes('/review'))
  );
}
