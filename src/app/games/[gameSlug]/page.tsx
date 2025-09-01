import { notFound } from 'next/navigation';
import { gameData } from '@/lib/gameData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameForm } from './GameForm';
import { Suspense } from 'react';

export default function GamePage({ params }: { params: { gameSlug: string } }) {
  const { gameSlug } = params;
  const game = gameData[gameSlug as keyof typeof gameData];

  if (!game) {
    notFound();
  }

  // We can't pass the whole `game` object to GameForm because it contains the Icon component,
  // which is not a plain object. Instead, we pass only the data GameForm needs.
  const { slug, title, description, skill } = game;
  const gameForForm = { slug, title, description, skill };


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
          <p className="text-center text-muted-foreground mb-6">
            For this prototype, please rate your performance on a scale of 0 to 100.
          </p>
          <Suspense fallback={<div>Loading form...</div>}>
            <GameForm game={gameForForm} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
