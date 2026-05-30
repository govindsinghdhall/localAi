import Link from 'next/link';
import { BarChart3, Star, TrendingUp, Users } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAnalytics, getAllBusinesses } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const analytics = await getAnalytics();
  const businesses = getAllBusinesses();
  const roopyaStats = await getAnalytics('roopya');

  const stats = [
    {
      label: 'Total Draft Reviews',
      value: analytics.totalReviews,
      icon: Users,
      change: `+${analytics.last7Days} this week`,
    },
    {
      label: 'Average Rating',
      value: analytics.averageRating || '—',
      icon: Star,
      change: 'Across all drafts',
    },
    {
      label: 'Roopya Reviews',
      value: roopyaStats.totalReviews,
      icon: TrendingUp,
      change: `${roopyaStats.averageRating || 0} avg rating`,
    },
    {
      label: '5-Star Rate',
      value:
        analytics.totalReviews > 0
          ? `${Math.round(((analytics.byRating.find((b) => b.star === 5)?.count ?? 0) / analytics.totalReviews) * 100)}%`
          : '0%',
      icon: BarChart3,
      change: 'Of saved drafts',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <Badge className="mb-3">Analytics</Badge>
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-neutral-500">
            Track review drafts saved before customers post on Google
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                  <stat.icon className="h-5 w-5 text-neutral-600" />
                </div>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
                <p className="mt-1 text-xs text-neutral-400">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rating distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.byRating.map(({ star, count }) => {
                const pct =
                  analytics.totalReviews > 0
                    ? (count / analytics.totalReviews) * 100
                    : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-8 text-sm text-neutral-500">{star}★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full bg-neutral-800 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-neutral-500">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Businesses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {businesses.map((b) => (
                <Link
                  key={b.slug}
                  href={`/business/${b.slug}`}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-neutral-300 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 font-bold text-white">
                      {b.logoInitials}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{b.name}</p>
                      <p className="text-xs text-neutral-400">/{b.slug}</p>
                    </div>
                  </div>
                  <span className="text-sm text-amber-500">★ {b.averageRating}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {analytics.recent.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent draft reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.recent.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-900">{r.businessSlug}</span>
                    <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-neutral-500">{r.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
}
