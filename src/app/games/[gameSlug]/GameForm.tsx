'use client';

import type { GameSlug } from '@/lib/gameData';
import { gameSequence } from '@/lib/gameData';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Rocket } from 'lucide-react';

// We define a more specific type for the game prop that only includes serializable data.
interface SerializableGame {
  slug: GameSlug;
  title: string;
  description: string;
  skill: string;
}

export function GameForm({ game }: { game: SerializableGame }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState(50);

  const currentGameIndex = gameSequence.findIndex(slug => slug === game.slug);
  const isLastGame = currentGameIndex === gameSequence.length - 1;
  const nextGameSlug = isLastGame ? null : gameSequence[currentGameIndex + 1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(game.slug, score.toString());

    const nextUrl = isLastGame
      ? `/results?${newParams.toString()}`
      : `/games/${nextGameSlug}?${newParams.toString()}`;
    
    router.push(nextUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <Label htmlFor="skill-score" className="text-center text-lg font-semibold">
          Your Score: <span className="text-primary font-bold">{score}</span>
        </Label>
        <Slider
          id="skill-score"
          min={0}
          max={100}
          step={1}
          value={[score]}
          onValueChange={(value) => setScore(value[0])}
        />
      </div>
      <Button type="submit" className="w-full font-bold text-lg" size="lg">
        {isLastGame ? (
          <>
            See Your Results <Rocket className="ml-2 h-5 w-5" />
          </>
        ) : (
          'Next Challenge'
        )}
      </Button>
    </form>
  );
}
