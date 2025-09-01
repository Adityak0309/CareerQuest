'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, RefreshCw, TriangleAlert, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { generateInnovationChallenge, type InnovationChallengeOutput } from '@/ai/flows/generate-innovation-challenge-flow';

export function InnovationSimulation({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [challenge, setChallenge] = useState<InnovationChallengeOutput | null>(null);
  const [phase, setPhase] = useState<'solution' | 'twist' | 'adaptation'>('solution');
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [selectedAdaptation, setSelectedAdaptation] = useState<string | null>(null);
  const [solutionScore, setSolutionScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChallenge() {
      try {
        setIsLoading(true);
        const newChallenge = await generateInnovationChallenge();
        setChallenge(newChallenge);
      } catch (e) {
        setError('Failed to load a new challenge. Please try refreshing.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadChallenge();
  }, []);

  const handleSolutionSubmit = () => {
    if (!selectedSolution || !challenge) return;
    const solution = challenge.solutions.find(s => s.id === selectedSolution);
    setSolutionScore(solution?.score || 0);
    setPhase('twist');
  };
  
  const handleAdaptationSubmit = () => {
    if (!selectedAdaptation || !challenge) return;
    const adaptation = challenge.adaptations.find(a => a.id === selectedAdaptation);
    const adaptationScore = adaptation?.score || 0;
    const finalScore = Math.round(solutionScore * 0.4 + adaptationScore * 0.6);
    onGameComplete(finalScore);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-headline font-semibold">Creativity & Innovation Simulation</h3>
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-center items-center pt-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Crafting a unique innovation challenge...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !challenge) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'An unexpected error occurred.'}</AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="space-y-6">
        <h3 className="text-xl font-headline font-semibold text-center animate-fade-in-up">Creativity & Innovation Simulation</h3>

        {phase === 'solution' && (
            <Card className="shadow-lg animate-in fade-in-0 slide-in-from-bottom-4">
                <CardHeader>
                    <CardDescription>The Problem</CardDescription>
                    <CardTitle className="flex items-start gap-2"><Lightbulb className="text-primary mt-1"/> {challenge.problem}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="font-semibold">Choose the most innovative and impactful initial solution:</p>
                    <RadioGroup value={selectedSolution || ''} onValuechange={setSelectedSolution}>
                        {challenge.solutions.map(solution => (
                            <div key={solution.id} className="flex items-center space-x-2 p-3 rounded-md hover:bg-secondary/50 transition-colors">
                                <RadioGroupItem value={solution.id} id={solution.id} />
                                <Label htmlFor={solution.id} className="flex-1 cursor-pointer">{solution.text}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <Button onClick={handleSolutionSubmit} disabled={!selectedSolution} className="w-full">
                        Submit Solution
                    </Button>
                </CardContent>
            </Card>
        )}
        
        {phase === 'twist' && (
             <Alert variant="destructive" className="animate-in fade-in-0 zoom-in-95">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle className="font-bold">A Wild Twist Appears!</AlertTitle>
                <AlertDescription>
                    {challenge.twist}
                </AlertDescription>
                <Button onClick={() => setPhase('adaptation')} className="mt-4">
                    Adapt Your Strategy <RefreshCw className="ml-2 h-4 w-4"/>
                </Button>
            </Alert>
        )}

        {phase === 'adaptation' && (
            <Card className="shadow-lg animate-in fade-in-0 slide-in-from-bottom-4">
                <CardHeader>
                    <CardDescription>Adaptation Phase</CardDescription>
                    <CardTitle className="flex items-start gap-2"><RefreshCw className="text-primary mt-1"/>How do you pivot your strategy?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="font-semibold">Based on the twist, select the best adaptation:</p>
                    <RadioGroup value={selectedAdaptation || ''} onValuechange={setSelectedAdaptation}>
                        {challenge.adaptations.map(adaptation => (
                            <div key={adaptation.id} className="flex items-center space-x-2 p-3 rounded-md hover:bg-secondary/50 transition-colors">
                                <RadioGroupItem value={adaptation.id} id={adaptation.id} />
                                <Label htmlFor={adaptation.id} className="flex-1 cursor-pointer">{adaptation.text}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <Button onClick={handleAdaptationSubmit} disabled={!selectedAdaptation} className="w-full">
                        Finalize Plan
                    </Button>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
