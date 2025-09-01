'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, TriangleAlert, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { generatePatternPuzzle, type PatternPuzzleOutput } from '@/ai/flows/generate-pattern-puzzle-flow';

const TIME_LIMIT = 60; // Increased to 60 seconds

export function PatternRecognition({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [puzzle, setPuzzle] = useState<PatternPuzzleOutput | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const progress = (timeLeft / TIME_LIMIT) * 100;

  useEffect(() => {
    async function loadPuzzle() {
      try {
        setIsLoading(true);
        const newPuzzle = await generatePatternPuzzle();
        setPuzzle(newPuzzle);
      } catch (e) {
        setError('Failed to load a new puzzle. Please try refreshing.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadPuzzle();
  }, []);

  useEffect(() => {
    if (isLoading || feedback) return;

    if (timeLeft <= 0) {
      setFeedback('incorrect');
      setTimeout(() => onGameComplete(0), 1500);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, feedback, isLoading, onGameComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback || !puzzle) return;
    
    const isCorrect = answer.trim().toLowerCase() === String(puzzle.answer).toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      const score = Math.max(20, Math.round((timeLeft / TIME_LIMIT) * 100));
      setTimeout(() => onGameComplete(score), 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => onGameComplete(10), 1500);
    }
  };

  if (isLoading) {
    return (
        <div className="space-y-6 text-center">
            <h3 className="text-xl font-headline font-semibold">Critical Thinking & Pattern Recognition</h3>
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-1/2 mx-auto" />
            <div className="flex justify-center items-center pt-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Generating a brain-bending puzzle...</p>
            </div>
        </div>
    );
  }

  if (error || !puzzle) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "An unexpected error occurred."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 text-center animate-fade-in-up">
      <h3 className="text-xl font-headline font-semibold">Critical Thinking & Pattern Recognition</h3>
      <div className="w-full space-y-2">
        <p className="text-sm font-medium">Time Remaining: {timeLeft}s</p>
        <Progress value={progress} />
      </div>
      <div>
        <h3 className="font-semibold">Identify the trend and find the next element in the sequence:</h3>
        <p className="text-2xl font-bold tracking-widest my-4 bg-secondary/50 p-4 rounded-lg">{puzzle.sequence.join(', ')}, ?</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="answer">Your Answer</Label>
          <Input 
            id="answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Next in sequence"
            disabled={!!feedback}
            className="text-center"
          />
        </div>
        <Button type="submit" disabled={!!feedback}>Submit</Button>
      </form>
      {feedback === 'correct' && (
        <Alert className="text-left border-green-500 bg-green-50 text-green-800 animate-in fade-in-0 zoom-in-95">
          <Lightbulb className="h-4 w-4 text-green-500" />
          <AlertTitle>Correct!</AlertTitle>
          <AlertDescription>{puzzle.explanation}</AlertDescription>
        </Alert>
      )}
      {feedback === 'incorrect' && (
        <Alert variant="destructive" className="text-left animate-in fade-in-0 zoom-in-95">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Incorrect</AlertTitle>
          <AlertDescription>The correct answer was {puzzle.answer}. {puzzle.explanation}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
