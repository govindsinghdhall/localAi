import { notFound } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { ReviewPageClient } from '@/components/review/review-page-client';
import { getBusinessBySlug } from '@/lib/db';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) return { title: 'Business Not Found' };
  return {
    title: `Review ${business.name} | Local AI`,
    description: `Leave a Google review for ${business.name} with AI-powered suggestions.`,
  };
}

export default async function BusinessReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <ReviewPageClient business={business} />
      </main>
      <Footer />
    </>
  );
}
