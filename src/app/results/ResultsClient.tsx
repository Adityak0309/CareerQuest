'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import type { CareerSuggestionsOutput } from '@/ai/flows/personalized-career-suggestions';
import { getCareerSuggestions } from './actions';
import { RadarChart } from '@/components/RadarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { gameData } from '@/lib/gameData';

export function ResultsClient() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<CareerSuggestionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const skillProfile = useMemo(() => {
    const profile = {
      analyticalThinking: Number(searchParams.get('analytical-thinking') || 0),
      problemSolving: Number(searchParams.get('problem-solving') || 0),
      decisionMaking: Number(searchParams.get('decision-making') || 0),
      creativity: Number(searchParams.get('creativity') || 0),
      memory: Number(searchParams.get('memory') || 0),
      spatialAptitude: Number(searchParams.get('spatial-aptitude') || 0),
    };
    return profile;
  }, [searchParams]);

  useEffect(() => {
    // This is a temporary type assertion. In a real app, you would transform the data
    // to match the expected input shape of the AI flow if they differ.
    const flowInput = {
        analyticalThinking: skillProfile.analyticalThinking,
        problemSolving: skillProfile.problemSolving,
        creativity: skillProfile.creativity,
        // Mocking values for the AI flow that are not collected from new games.
        // In a real scenario, you'd update the flow or collect this data.
        memory: skillProfile.memory,
        confidence: skillProfile.decisionMaking, 
    };

    getCareerSuggestions(flowInput)
      .then(response => {
        if (response.success && response.data) {
          setResults(response.data);
        } else {
          setError(response.error || 'An unknown error occurred.');
        }
      })
      .catch(err => {
        setError('Failed to fetch career suggestions.');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [skillProfile]);

  const chartData = [
    { skill: 'Problem Solving', value: skillProfile.problemSolving },
    { skill: 'Analytical', value: skillProfile.analyticalThinking },
    { skill: 'Decision Making', value: skillProfile.decisionMaking },
    { skill: 'Creativity', value: skillProfile.creativity },
    { skill: 'Memory', value: skillProfile.memory },
    { skill: 'Spatial', value: skillProfile.spatialAptitude },
  ];

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Your Skill Profile</h1>
        <p className="mt-4 text-lg text-muted-foreground">Here's what we've discovered about your unique talents!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-center">Skills Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart data={chartData} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-3xl font-headline font-semibold">Recommended Career Paths</h2>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {results?.suggestions.map((suggestion, index) => (
            <Card key={index} className="bg-gradient-to-br from-card to-secondary/50 shadow-md">
              <CardHeader>
                <CardTitle className="font-headline">{suggestion.careerPath}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{suggestion.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
