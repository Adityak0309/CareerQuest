'use server';
/**
 * @fileOverview A Genkit flow for generating puzzles for the Pattern Recognition game.
 *
 * - generatePatternPuzzle - A function that returns a sequence puzzle.
 * - PatternPuzzleOutput - The return type for the function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PatternPuzzleOutputSchema = z.object({
  sequence: z.array(z.union([z.string(), z.number()])).length(5).describe('A sequence of 5 numbers or letters with a clear logical pattern.'),
  answer: z.union([z.string(), z.number()]).describe('The next element in the sequence.'),
  explanation: z.string().describe('A brief explanation of the pattern.'),
});

export type PatternPuzzleOutput = z.infer<typeof PatternPuzzleOutputSchema>;

export async function generatePatternPuzzle(): Promise<PatternPuzzleOutput> {
  return generatePatternPuzzleFlow();
}

const prompt = ai.definePrompt({
  name: 'generatePatternPuzzlePrompt',
  output: { schema: PatternPuzzleOutputSchema },
  prompt: `Generate a unique sequence puzzle for a pattern recognition game.
The puzzle can be numerical or alphabetical.
The pattern should be clever but solvable.
Provide the sequence (5 items), the correct next answer, and a clear explanation of the logic.
Avoid overly simple patterns like simple addition or multiplication. Think about alternating patterns, number series (like Fibonacci), or alphabetical jumps.
Example: Sequence [5, 11, 23, 47, 95], Answer: 191, Explanation: "The pattern is (x * 2) + 1 for each number."
`,
});

const generatePatternPuzzleFlow = ai.defineFlow(
  {
    name: 'generatePatternPuzzleFlow',
    outputSchema: PatternPuzzleOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
