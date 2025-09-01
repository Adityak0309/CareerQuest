'use client';
import { useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { gameSequence } from '@/lib/gameData';
import { Suspense } from 'react';

function GameProgress() {
  const searchParams = useSearchParams();
  const completedSkills = Array.from(searchParams.keys());
  
  const totalGames = gameSequence.length;
  // This counts how many of the game skills are present in the URL params
  const completedCount = gameSequence.filter(slug => completedSkills.includes(slug)).length;
  const progress = (completedCount / totalGames) * 100;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-headline font-semibold mb-2">Your Quest Progress</h2>
      <Progress value={progress} className="w-full h-3 bg-primary/20" />
      <p className="text-sm text-muted-foreground mt-2">{completedCount} of {totalGames} challenges completed.</p>
    </div>
  );
}

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-8">
      <Suspense fallback={<div>Loading progress...</div>}>
        <GameProgress />
      </Suspense>
      {children}
    </div>
  );
}
