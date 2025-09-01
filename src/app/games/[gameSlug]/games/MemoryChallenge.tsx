'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TriangleAlert, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { generateMemoryChallenge, type MemoryChallengeOutput } from '@/ai/flows/generate-memory-challenge-flow';

interface ReportItem {
  item: string;
  value: string;
}

const VIEW_TIME = 15;

export function MemoryChallenge({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [challenge, setChallenge] = useState<MemoryChallengeOutput | null>(null);
  const [gameState, setGameState] = useState<'viewing' | 'answering' | 'result'>('viewing');
  const [timeLeft, setTimeLeft] = useState(VIEW_TIME);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChallenge() {
      try {
        setIsLoading(true);
        const newChallenge = await generateMemoryChallenge();
        setChallenge(newChallenge);
      } catch (e) {
        setError('Failed to load a new memory challenge. Please try refreshing.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadChallenge();
  }, []);

  const { report, questionItem } = useMemo(() => {
    if (!challenge) return { report: [], questionItem: undefined };
    const report = challenge.report;
    const questionIndex = Math.floor(Math.random() * report.length);
    return { report, questionItem: report[questionIndex] };
  }, [challenge]);

  const progress = (timeLeft / VIEW_TIME) * 100;

  useEffect(() => {
    if (gameState !== 'viewing' || isLoading) return;

    if (timeLeft <= 0) {
      setGameState('answering');
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameState, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback || !questionItem) return;
    const isCorrect = answer.trim().toLowerCase() === questionItem.value.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => onGameComplete(100), 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => onGameComplete(20), 1500);
    }
  };

  if (isLoading) {
    return (
        <div className="space-y-6 text-center">
            <h3 className="text-xl font-headline font-semibold">Memory & Focus Challenge</h3>
            <Card className="shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <div className="flex justify-center items-center pt-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Fetching secure data...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  if (error || !challenge || !questionItem) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'An unexpected error occurred.'}</AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <h3 className="text-xl font-headline font-semibold animate-fade-in-up">Memory & Focus Challenge</h3>
      {gameState === 'viewing' && (
        <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Memorize the Report</CardTitle>
            <CardDescription>You have {VIEW_TIME} seconds to memorize these key metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="w-full space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">Time Left: {timeLeft}s</p>
            </div>
            <ul className="space-y-2 text-left">
              {report.map(({ item, value }) => (
                <li key={item} className="flex justify-between border-b pb-1">
                  <span className="font-medium text-muted-foreground">{item}:</span>
                  <span className="font-bold">{value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {gameState === 'answering' && (
        <Card className="shadow-lg animate-in fade-in-0 slide-in-from-bottom-4">
          <CardHeader>
             <CardTitle>Recall Test</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="answer" className="block text-lg font-medium">What was the value for <span className="text-primary font-bold">{questionItem.item}</span>?</label>
                <Input 
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter the value here"
                    disabled={!!feedback}
                    className="text-center"
                />
                <Button type="submit" disabled={!answer || !!feedback}>Submit Answer</Button>
            </form>
             {feedback === 'correct' && (
                <Alert className="text-left mt-4 border-green-500 bg-green-50 text-green-800">
                <Lightbulb className="h-4 w-4 text-green-500" />
                <AlertTitle>Correct!</AlertTitle>
                <AlertDescription>Excellent recall!</AlertDescription>
                </Alert>
            )}
            {feedback === 'incorrect' && (
                <Alert variant="destructive" className="text-left mt-4">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Incorrect!</AlertTitle>
                <AlertDescription>The correct answer was {questionItem.value}.</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
