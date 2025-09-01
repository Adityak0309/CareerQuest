'use server';
/**
 * @fileOverview A Genkit flow for generating challenges for the Innovation Simulation game.
 *
 * - generateInnovationChallenge - A function that returns a problem, solutions, a twist, and adaptations.
 * - InnovationChallengeOutput - The return type for the function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SolutionSchema = z.object({
  id: z.string(),
  text: z.string().describe('A potential solution to the problem.'),
  score: z.number().describe('A score from 0-100 indicating the quality/innovativeness of the solution.'),
});

const AdaptationSchema = z.object({
  id: z.string(),
  text: z.string().describe('An adaptation to the original plan in response to the twist.'),
  score: z.number().describe('A score from 0-100 for the quality of the adaptation.'),
});

const InnovationChallengeOutputSchema = z.object({
  problem: z.string().describe('A broad, real-world problem to solve (e.g., "Reduce plastic waste in cities").'),
  solutions: z.array(SolutionSchema).length(4).describe('An array of 4 potential solutions to the problem.'),
  twist: z.string().describe('A sudden, unexpected event that disrupts the initial plan (e.g., "A new regulation bans the use of a key technology").'),
  adaptations: z.array(AdaptationSchema).length(4).describe('An array of 4 possible adaptations to the twist.'),
});

export type InnovationChallengeOutput = z.infer<typeof InnovationChallengeOutputSchema>;

export async function generateInnovationChallenge(): Promise<InnovationChallengeOutput> {
  return generateInnovationChallengeFlow();
}

const prompt = ai.definePrompt({
  name: 'generateInnovationChallengePrompt',
  output: { schema: InnovationChallengeOutputSchema },
  prompt: `You are a game designer creating a challenge for an innovation and creativity assessment.

Generate a complete innovation scenario containing:
1.  A modern, relevant problem (e.g., related to sustainability, urban living, technology, etc.).
2.  Four distinct potential solutions. One should be highly innovative (high score), two moderately good (medium scores), and one that is conventional or weak (low score). Assign IDs s1, s2, s3, s4.
3.  A surprising twist that invalidates or complicates the initial solutions, especially the most obvious ones.
4.  Four distinct adaptations to the twist. One should be a brilliant pivot (high score), two should be reasonable (medium scores), and one a poor reaction (low score). Assign IDs a1, a2, a3, a4.

Ensure the content is unique and thought-provoking.
`,
});

const generateInnovationChallengeFlow = ai.defineFlow(
  {
    name: 'generateInnovationChallengeFlow',
    outputSchema: InnovationChallengeOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
