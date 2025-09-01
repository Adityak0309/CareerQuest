import { Suspense } from 'react';
import { ResultsClient } from './ResultsClient';
import { Skeleton } from '@/components/ui/skeleton';

function ResultsFallback() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Generating Your Skill Profile...</h1>
        <p className="mt-4 text-lg text-muted-foreground">Our AI is analyzing your results to find your perfect career path!</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        <div>
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-headline font-semibold">Recommended Career Paths</h2>
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsFallback />}>
      <ResultsClient />
    </Suspense>
  );
}
