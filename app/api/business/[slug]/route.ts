import { NextResponse } from 'next/server';
import { getBusinessBySlug } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  return NextResponse.json(business);
}
