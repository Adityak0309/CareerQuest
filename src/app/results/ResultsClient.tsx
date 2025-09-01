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
      analyticalThinking: Number(searchParams.get('logic') || 0),
      memory: Number(searchParams.get('memory') || 0),
      creativity: Number(searchParams.get('creativity') || 0),
      problemSolving: Number(searchParams.get('problem-solving') || 0),
      confidence: Number(searchParams.get('confidence') || 0),
    };
    return profile;
  }, [searchParams]);

  useEffect(() => {
    getCareerSuggestions(skillProfile)
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
    { skill: 'Logic', value: skillProfile.analyticalThinking },
    { skill: 'Memory', value: skillProfile.memory },
    { skill: 'Creativity', value: skillProfile.creativity },
    { skill: 'Problem Solving', value: skillProfile.problemSolving },
    { skill: 'Confidence', value: skillProfile.confidence },
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
