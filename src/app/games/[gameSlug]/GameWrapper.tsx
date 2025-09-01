'use client';

import type { GameSlug } from '@/lib/gameData';
import { gameSequence } from '@/lib/gameData';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

import { LogicPuzzle } from './games/LogicPuzzle';
import { MemoryGame } from './games/MemoryGame';
import { CreativityChallenge } from './games/CreativityChallenge';
import { ProblemSolving } from './games/ProblemSolving';
import { ConfidencePitch } from './games/ConfidencePitch';

const gameComponents: Record<GameSlug, React.ComponentType<{ onGameComplete: (score: number) => void }>> = {
  'logic': LogicPuzzle,
  'memory': MemoryGame,
  'creativity': CreativityChallenge,
  'problem-solving': ProblemSolving,
  'confidence': ConfidencePitch,
};

export function GameWrapper({ gameSlug }: { gameSlug: GameSlug }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState<number | null>(null);

  const currentGameIndex = gameSequence.findIndex(slug => slug === gameSlug);
  const isLastGame = currentGameIndex === gameSequence.length - 1;
  const nextGameSlug = isLastGame ? null : gameSequence[currentGameIndex + 1];

  const handleGameComplete = (finalScore: number) => {
    setScore(Math.round(finalScore));
  };

  const handleNext = () => {
    if (score === null) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(gameSlug, score.toString());

    const nextUrl = isLastGame
      ? `/results?${newParams.toString()}`
      : `/games/${nextGameSlug}?${newParams.toString()}`;
    
    router.push(nextUrl);
  };

  const ActiveGame = gameComponents[gameSlug];

  return (
    <div className="space-y-8">
      {score === null ? (
        <ActiveGame onGameComplete={handleGameComplete} />
      ) : (
        <div className="text-center space-y-4 p-4 border rounded-lg bg-secondary/50">
          <h3 className="text-2xl font-bold font-headline">Challenge Complete!</h3>
          <p className="text-lg">You scored <span className="text-primary font-bold">{score}</span> points!</p>
          <Button onClick={handleNext} className="w-full font-bold text-lg" size="lg">
            {isLastGame ? (
              <>
                See Your Results <Rocket className="ml-2 h-5 w-5" />
              </>
            ) : (
              'Next Challenge'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
