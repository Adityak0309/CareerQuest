'use server';
/**
 * @fileOverview A Genkit flow for generating content for the Memory Challenge game.
 *
 * - generateMemoryChallenge - A function that returns a list of report items.
 * - MemoryChallengeOutput - The return type for the function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ReportItemSchema = z.object({
  item: z.string().describe('The name of the metric or data point (e.g., "Q2 Revenue").'),
  value: z.string().describe('The value for the metric (e.g., "$1.5M").'),
});

const MemoryChallengeOutputSchema = z.object({
  report: z.array(ReportItemSchema).length(5).describe('A list of 5 key-value pairs representing a business report.'),
});

export type MemoryChallengeOutput = z.infer<typeof MemoryChallengeOutputSchema>;

export async function generateMemoryChallenge(): Promise<MemoryChallengeOutput> {
  return generateMemoryChallengeFlow();
}

const prompt = ai.definePrompt({
  name: 'generateMemoryChallengePrompt',
  output: { schema: MemoryChallengeOutputSchema },
  prompt: `Generate a set of 5 unique and realistic key-value pairs for a business memory game.
The items should look like they came from a concise business report.
Include a mix of financial data, percentages, project names, and other business metrics.
Ensure the values are simple enough to be remembered after viewing for 15 seconds.
Example items: "Project Phoenix Budget: $750,000", "Customer Satisfaction: 92%", "Server Uptime: 99.98%".
`,
});

const generateMemoryChallengeFlow = ai.defineFlow(
  {
    name: 'generateMemoryChallengeFlow',
    outputSchema: MemoryChallengeOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
