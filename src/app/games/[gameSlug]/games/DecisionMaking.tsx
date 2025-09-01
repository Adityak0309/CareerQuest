'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Clock, Loader2, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { generateDilemma, type DilemmaOutput } from '@/ai/flows/generate-dilemma-flow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const TIME_LIMIT = 60; // Increased to 60 seconds
const TOTAL_DILEMMAS = 3;

export function DecisionMaking({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [dilemmas, setDilemmas] = useState<DilemmaOutput[]>([]);
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    async function loadDilemmas() {
      try {
        setIsLoading(true);
        const newDilemmas = await Promise.all(
          Array(TOTAL_DILEMMAS).fill(0).map(() => generateDilemma())
        );
        setDilemmas(newDilemmas);
      } catch (e) {
        setError('Failed to load new dilemmas. Please try refreshing the page.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadDilemmas();
  }, []);

  const currentDilemma = dilemmas[currentDilemmaIndex];
  const progress = (timeLeft / TIME_LIMIT) * 100;

  useEffect(() => {
    if (isLoading || !currentDilemma || isAnswered) return;

    if (timeLeft <= 0) {
      handleOptionSelect(0);
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered, isLoading, currentDilemma]);

  const handleOptionSelect = (score: number) => {
    setIsAnswered(true);
    const finalScore = score + (timeLeft * 1.5); // Speed bonus
    const newTotalScore = totalScore + finalScore;
    setTotalScore(newTotalScore);
  };
  
  const handleOptionClick = (option: 'A' | 'B') => {
    if (!currentDilemma || isAnswered) return;
    setSelectedOption(option);
    const score = option === 'A' ? currentDilemma.optionA.score : currentDilemma.optionB.score;
    handleOptionSelect(score);
  };
  
  const handleNextClick = () => {
    if (currentDilemmaIndex < TOTAL_DILEMMAS - 1) {
      setCurrentDilemmaIndex(prev => prev + 1);
      setTimeLeft(TIME_LIMIT);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onGameComplete(Math.round(totalScore / TOTAL_DILEMMAS));
    }
  };

  if (isLoading) {
    return (
        <div className="space-y-6 text-center">
            <h3 className="text-xl font-headline font-semibold">Decision-Making Under Pressure</h3>
            <Card className="text-left shadow-lg">
                <CardHeader>
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="flex justify-center items-center pt-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Generating unique dilemmas...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="space-y-6 text-center">
        <h3 className="text-xl font-headline font-semibold animate-fade-in-up">Decision-Making Under Pressure</h3>
        <Card className="text-left shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
                <CardDescription>Dilemma {currentDilemmaIndex + 1} of {TOTAL_DILEMMAS}</CardDescription>
                <CardTitle>{currentDilemma.scenario}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="w-full space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2"><Clock size={14}/> Time Left: {timeLeft}s</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                        variant="outline"
                        className={cn("h-auto py-4 whitespace-normal text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1", selectedOption === 'A' && 'bg-primary text-primary-foreground ring-4 ring-primary/30')}
                        onClick={() => handleOptionClick('A')}
                        disabled={isAnswered}
                    >
                        {currentDilemma.optionA.text}
                    </Button>
                    <Button 
                        variant="outline"
                        className={cn("h-auto py-4 whitespace-normal text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1", selectedOption === 'B' && 'bg-primary text-primary-foreground ring-4 ring-primary/30')}
                        onClick={() => handleOptionClick('B')}
                        disabled={isAnswered}
                    >
                        {currentDilemma.optionB.text}
                    </Button>
                </div>
                {isAnswered && (
                    <div className="p-3 bg-secondary/50 rounded-md text-sm text-center animate-in fade-in-50 space-y-3">
                        <div>
                            <p className="font-semibold">Justification:</p>
                            <p className="text-muted-foreground">{currentDilemma.justification}</p>
                        </div>
                        <Button onClick={handleNextClick} className="w-full sm:w-auto">
                            {currentDilemmaIndex < TOTAL_DILEMMAS - 1 ? 'Next Dilemma' : 'Finish Test'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
