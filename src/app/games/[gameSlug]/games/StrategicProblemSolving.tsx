'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { DollarSign, Users, Target } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GameState {
  budget: number;
  employees: number;
  marketing: number; // budget allocation
  development: number; // budget allocation
  operations: number; // budget allocation
}

const INITIAL_STATE: GameState = {
  budget: 10000,
  employees: 3,
  marketing: 3333,
  development: 3334,
  operations: 3333,
};

export function StrategicProblemSolving({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  const handleSliderChange = (department: 'marketing' | 'development' | 'operations') => (value: number[]) => {
    const change = value[0] - state[department];
    const otherDepts = (['marketing', 'development', 'operations'] as const).filter(d => d !== department);
    
    // Distribute the change amongst the other two departments
    const newDept1Value = state[otherDepts[0]] - Math.ceil(change / 2);
    const newDept2Value = state[otherDepts[1]] - Math.floor(change / 2);

    if (newDept1Value >= 0 && newDept2Value >= 0) {
        setState(prev => ({
            ...prev,
            [department]: value[0],
            [otherDepts[0]]: newDept1Value,
            [otherDepts[1]]: newDept2Value,
        }));
    }
  };
  
  const calculateScore = () => {
    const { marketing, development, operations } = state;
    // Ideal ratio: 40% dev, 35% marketing, 25% ops
    const idealDev = 4000;
    const idealMark = 3500;
    const idealOps = 2500;

    const devDiff = Math.abs(development - idealDev);
    const markDiff = Math.abs(marketing - idealMark);
    const opsDiff = Math.abs(operations - idealOps);

    const totalDiff = devDiff + markDiff + opsDiff;
    
    // Max possible difference is around 8000. Score is inverse of difference.
    const score = Math.max(0, 100 - (totalDiff / 80));
    return Math.round(score);
  };
  
  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    setTimeout(() => onGameComplete(score), 2000);
  }

  const totalAllocated = state.marketing + state.development + state.operations;

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h3 className="text-xl font-headline font-semibold">Strategic Problem-Solving Test</h3>
            <p className="text-muted-foreground">Allocate your resources to maximize startup success.</p>
        </div>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Startup Scenario</CardTitle>
                <CardDescription>You have a ₹10,000 budget and 3 employees. Distribute the budget across departments to address 5 urgent client demands.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex justify-around text-center">
                    <div>
                        <DollarSign className="mx-auto h-8 w-8 text-primary"/>
                        <p className="font-bold text-lg">₹{state.budget.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                    </div>
                    <div>
                        <Users className="mx-auto h-8 w-8 text-primary"/>
                        <p className="font-bold text-lg">{state.employees}</p>
                        <p className="text-sm text-muted-foreground">Employees</p>
                    </div>
                     <div>
                        <Target className="mx-auto h-8 w-8 text-primary"/>
                        <p className="font-bold text-lg">5</p>
                        <p className="text-sm text-muted-foreground">Client Demands</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <Label>Marketing: ₹{state.marketing.toLocaleString()}</Label>
                        <Slider defaultValue={[3333]} max={10000} step={1} onValueChange={handleSliderChange('marketing')} value={[state.marketing]} disabled={submitted} />
                        <p className="text-xs text-muted-foreground mt-1">Acquiring new customers and retaining existing ones.</p>
                    </div>
                    <div>
                        <Label>Development: ₹{state.development.toLocaleString()}</Label>
                        <Slider defaultValue={[3334]} max={10000} step={1} onValueChange={handleSliderChange('development')} value={[state.development]} disabled={submitted} />
                        <p className="text-xs text-muted-foreground mt-1">Building new features and fixing bugs for clients.</p>
                    </div>
                    <div>
                        <Label>Operations: ₹{state.operations.toLocaleString()}</Label>
                        <Slider defaultValue={[3333]} max={10000} step={1} onValueChange={handleSliderChange('operations')} value={[state.operations]} disabled={submitted} />
                         <p className="text-xs text-muted-foreground mt-1">Ensuring server stability and providing customer support.</p>
                    </div>
                </div>

                {totalAllocated !== 10000 && <p className="text-destructive text-sm font-bold text-center">Total allocation must be exactly ₹10,000! Current: ₹{totalAllocated}</p>}

                {submitted && (
                     <Alert>
                        <AlertTitle>Analysis</AlertTitle>
                        <AlertDescription>
                            Your resource allocation prioritizes certain areas. The optimal strategy in this high-demand scenario involves a strong focus on Development (approx. 40%) to deliver features, followed by Marketing (approx. 35%) to manage client expectations and growth, with Operations (approx. 25%) maintaining stability. Your score reflects how close you were to this balance.
                        </AlertDescription>
                    </Alert>
                )}

                <Button onClick={handleSubmit} disabled={totalAllocated !== 10000 || submitted} className="w-full">
                    {submitted ? 'Analyzing...' : 'Lock in Budget'}
                </Button>

            </CardContent>
        </Card>
    </div>
  );
}
