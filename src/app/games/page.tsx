import Link from 'next/link';
import { games } from '@/lib/gameData';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function GamesPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Skill Assessment Games</h1>
        <p className="mt-4 text-lg text-muted-foreground">Complete these challenges to build your skill profile.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <Card key={game.slug} className="flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <game.Icon className="h-8 w-8" />
                </div>
                <CardTitle className="font-headline text-2xl">{game.title}</CardTitle>
              </div>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
               <Button asChild className="w-full font-bold">
                 <Link href={`/games/${game.slug}`}>
                   Play Challenge #{index + 1}
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
