'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, RefreshCw, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const PROBLEM = "Reduce food wastage in urban areas.";

const SOLUTIONS = [
  { id: 's1', text: 'AI-powered app connecting restaurants with unsold food to consumers at a discount.', score: 90 },
  { id: 's2', text: 'Community composting centers in every neighborhood.', score: 60 },
  { id: 's3', text: 'Educational campaigns on social media about meal planning.', score: 40 },
  { id: 's4', text: 'Smart bins that track and categorize waste for households.', score: 75 },
];

const TWIST = "A sudden city-wide internet outage lasting for weeks makes all app-based solutions unusable. How do you adapt?";

const ADAPTATIONS = [
  { id: 'a1', text: 'Pivot to a low-tech SMS-based system for food alerts.', score: 85 },
  { id: 'a2', text: 'Establish physical "food surplus" drop-off points at community centers.', score: 95 },
  { id: 'a3', text: 'Pause the initiative and wait for the internet to be restored.', score: 10 },
  { id: 'a4', text: 'Focus solely on the educational campaign, printing flyers instead of social media.', score: 50 },
];


export function InnovationSimulation({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [phase, setPhase] = useState<'solution' | 'twist' | 'adaptation'>('solution');
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [selectedAdaptation, setSelectedAdaptation] = useState<string | null>(null);
  const [solutionScore, setSolutionScore] = useState(0);

  const handleSolutionSubmit = () => {
    if (!selectedSolution) return;
    const solution = SOLUTIONS.find(s => s.id === selectedSolution);
    setSolutionScore(solution?.score || 0);
    setPhase('twist');
  };
  
  const handleAdaptationSubmit = () => {
    if (!selectedAdaptation) return;
    const adaptation = ADAPTATIONS.find(a => a.id === selectedAdaptation);
    const adaptationScore = adaptation?.score || 0;
    // Final score is a weighted average of both choices
    const finalScore = Math.round(solutionScore * 0.4 + adaptationScore * 0.6);
    onGameComplete(finalScore);
  };

  return (
    <div className="space-y-6">
        <h3 className="text-xl font-headline font-semibold text-center">Creativity & Innovation Simulation</h3>

        {phase === 'solution' && (
            <Card className="shadow-lg animate-in fade-in-0">
                <CardHeader>
                    <CardDescription>The Problem</CardDescription>
                    <CardTitle className="flex items-start gap-2"><Lightbulb className="text-primary mt-1"/> {PROBLEM}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="font-semibold">Choose the most innovative and impactful initial solution:</p>
                    <RadioGroup value={selectedSolution || ''} onValueChange={setSelectedSolution}>
                        {SOLUTIONS.map(solution => (
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
             <Alert variant="destructive" className="animate-in fade-in-0">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle className="font-bold">A Wild Twist Appears!</AlertTitle>
                <AlertDescription>
                    {TWIST}
                </AlertDescription>
                <Button onClick={() => setPhase('adaptation')} className="mt-4">
                    Adapt Your Strategy <RefreshCw className="ml-2 h-4 w-4"/>
                </Button>
            </Alert>
        )}

        {phase === 'adaptation' && (
            <Card className="shadow-lg animate-in fade-in-0">
                <CardHeader>
                    <CardDescription>Adaptation Phase</CardDescription>
                    <CardTitle className="flex items-start gap-2"><RefreshCw className="text-primary mt-1"/>How do you pivot your strategy?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="font-semibold">Based on the twist, select the best adaptation:</p>
                    <RadioGroup value={selectedAdaptation || ''} onValueChange={setSelectedAdaptation}>
                        {ADAPTATIONS.map(adaptation => (
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
