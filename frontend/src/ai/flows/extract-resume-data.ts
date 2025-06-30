'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting structured data from a resume document.
 *
 * The flow takes a data URI of a resume file (PDF or DOCX) as input and returns a structured JSON object
 * representing the resume's content.
 */

import {ai} from '@/ai/genkit';
import {
  type ExtractResumeDataInput,
  ExtractResumeDataInputSchema,
  type ResumeData,
  ResumeDataSchema,
} from '@/ai/schemas';

export async function extractResumeData(
  input: ExtractResumeDataInput
): Promise<ResumeData> {
  return extractResumeDataFlow(input);
}

const extractResumeDataPrompt = ai.definePrompt({
  name: 'extractResumeDataPrompt',
  input: {schema: ExtractResumeDataInputSchema},
  output: {schema: ResumeDataSchema},
  prompt: `**CRITICAL INSTRUCTIONS: AI RESUME PARSER**

You are a high-precision AI resume parser. Your goal is to extract structured data from the provided resume. Adhere to these rules:
1.  **JSON ONLY:** Your output must be ONLY a valid JSON object matching the \`ResumeData\` schema. No extra text or markdown.
2.  **ACCURACY FIRST:** Never invent data. If a field is missing, follow the rules below. It is better to leave a field empty than to fill it with incorrect information.
3.  **PRESERVE CONTENT:** Extract text exactly as it is written. Do not correct or rephrase.

**FIELD-SPECIFIC INSTRUCTIONS:**

-   \`name\` (string, **REQUIRED**):
    -   Extract the candidate's full name.
    -   It's usually at the top of the resume.
    -   If not found, return \`""\`.
-   \`email\` (string, **REQUIRED**):
    -   Find the candidate's email address.
    -   It must contain an "@" symbol.
    -   If not found, return \`""\`.
-   \`phone\` (string, **REQUIRED**):
    -   Find the candidate's phone number.
    -   Extract it exactly as written.
    -   If not found, return \`""\`.
-   \`experience\` (array, optional):
    -   Look for sections titled "Experience", "Work History", or "Employment".
    -   For each job, extract the \`title\`, \`company\`, \`dates\`, and \`description\`.
    -   If this section is missing, return \`[]\`.
-   \`education\` (array, optional):
    -   Look for sections titled "Education", "Academic Background", or "Qualifications".
    -   For each entry, extract the \`degree\`, \`school\`, and \`dates\`.
    -   This is a critical section. Search for it carefully.
    -   If this section is missing, return \`[]\`.
-   \`skills\` (array, optional):
    -   Look for a section titled "Skills" or "Technical Skills".
    -   Extract the list of skills as written.
    -   If this section is missing, return \`[]\`.
-   \`projects\` (array, optional):
    -   Look for sections titled "Projects", "Personal Projects", or "Portfolio".
    -   For each project, extract the \`name\`, \`description\`, and \`link\` (if available).
    -   If this section is missing, return \`[]\`.

**Resume to Parse:**
{{media url=resumeDataUri}}`,
});

const extractResumeDataFlow = ai.defineFlow(
  {
    name: 'extractResumeDataFlow',
    inputSchema: ExtractResumeDataInputSchema,
    outputSchema: ResumeDataSchema,
  },
  async input => {
    const {output} = await extractResumeDataPrompt(input);
    return output!;
  }
);
