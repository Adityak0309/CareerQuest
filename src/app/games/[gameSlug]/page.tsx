import { notFound } from 'next/navigation';
import { gameData, GameSlug } from '@/lib/gameData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import { GameWrapper } from './GameWrapper';

export default function GamePage({ params }: { params: { gameSlug: string } }) {
  const { gameSlug } = params;
  const game = gameData[gameSlug as keyof typeof gameData];

  if (!game) {
    notFound();
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
             <div className="p-4 rounded-full bg-primary/10 text-primary">
                <game.Icon className="h-12 w-12" />
              </div>
          </div>
          <CardTitle className="text-3xl font-headline">{game.title}</CardTitle>
          <CardDescription className="text-lg">{game.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading game...</div>}>
            <GameWrapper gameSlug={game.slug as GameSlug} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
