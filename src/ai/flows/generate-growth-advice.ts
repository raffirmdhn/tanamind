// src/ai/flows/generate-growth-advice.ts
'use server';
/**
 * @fileOverview An AI agent that generates personalized advice for plant growth based on uploaded images and user questions.
 *
 * - generateGrowthAdvice - A function that handles the generation of growth advice.
 * - GenerateGrowthAdviceInput - The input type for the generateGrowthAdvice function.
 * - GenerateGrowthAdviceOutput - The return type for the generateGrowthAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGrowthAdviceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The user question about the plant growth.'),
  includeSpecificInfo: z.boolean().describe('Whether to include specific details in the advice.'),
});
export type GenerateGrowthAdviceInput = z.infer<typeof GenerateGrowthAdviceInputSchema>;

const GenerateGrowthAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized advice for optimizing plant growth.'),
});
export type GenerateGrowthAdviceOutput = z.infer<typeof GenerateGrowthAdviceOutputSchema>;

export async function generateGrowthAdvice(input: GenerateGrowthAdviceInput): Promise<GenerateGrowthAdviceOutput> {
  return generateGrowthAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGrowthAdvicePrompt',
  input: {schema: GenerateGrowthAdviceInputSchema},
  output: {schema: GenerateGrowthAdviceOutputSchema},
  prompt: `You are an expert plant growth advisor. A user has provided a photo of their plant and asked a question about its growth. Based on the photo and the question, provide personalized advice to help them optimize plant growth.

Photo: {{media url=photoDataUri}}
Question: {{{question}}}

Include specific details: {{{includeSpecificInfo}}}

Consider these factors when generating advice:
- Light exposure
- Watering schedule
- Soil quality
- Potential pests or diseases

Your advice should be clear, concise, and actionable.
`,
});

const generateGrowthAdviceFlow = ai.defineFlow(
  {
    name: 'generateGrowthAdviceFlow',
    inputSchema: GenerateGrowthAdviceInputSchema,
    outputSchema: GenerateGrowthAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
