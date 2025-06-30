'use server';
/**
 * @fileOverview AI flow to provide suggestions for improving a specific section of a resume.
 *
 * - enhanceResumeSection - A function that enhances a given text from a resume section.
 * - EnhanceResumeSectionInput - The input type for the enhanceResumeSection function.
 * - EnhanceResumeSectionOutput - The return type for the enhanceResumeSection function.
 */

import {ai} from '@/ai/genkit';
import {
  EnhanceResumeSectionInputSchema,
  EnhanceResumeSectionOutputSchema,
  type EnhanceResumeSectionInput,
  type EnhanceResumeSectionOutput,
} from '@/ai/schemas';

export async function enhanceResumeSection(
  input: EnhanceResumeSectionInput
): Promise<EnhanceResumeSectionOutput> {
  return enhanceResumeSectionFlow(input);
}

const enhanceResumeSectionFlow = ai.defineFlow(
  {
    name: 'enhanceResumeSectionFlow',
    inputSchema: EnhanceResumeSectionInputSchema,
    outputSchema: EnhanceResumeSectionOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: `You are an AI resume enhancement expert. Your task is to rewrite and improve the provided resume section.
Focus on action verbs, quantifiable results, and keyword optimization relevant to the section.

Resume Section to Improve: "${input.section}"

Original Text:
"${input.text}"

Provide only the improved text for the section as your output. Do not add any extra commentary.`,
      output: {
        schema: EnhanceResumeSectionOutputSchema,
      },
    });
    return output!;
  }
);
