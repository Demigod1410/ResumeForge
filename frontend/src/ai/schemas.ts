import {z} from 'zod';

// From extract-resume-data.ts
export const ExperienceEntrySchema = z.object({
  title: z.string().describe('Job title'),
  company: z.string().describe('Company name'),
  dates: z.string().describe('Employment dates'),
  description: z
    .string()
    .describe('Description of responsibilities and achievements'),
});
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;

export const EducationEntrySchema = z.object({
  degree: z.string().describe('Degree or certification'),
  school: z.string().describe('School or institution name'),
  dates: z.string().describe('Dates of attendance'),
});
export type EducationEntry = z.infer<typeof EducationEntrySchema>;

export const ProjectEntrySchema = z.object({
  name: z.string().describe('The name of the project'),
  description: z.string().describe('A description of the project'),
  link: z.string().optional().describe('A URL link to the project'),
});
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;

export const ResumeDataSchema = z.object({
  name: z.string().describe("The candidate's full name as it appears on the resume."),
  email: z.string().describe("The candidate's primary email address. This is a required field."),
  phone: z.string().describe("The candidate's primary phone number."),
  experience: z
    .array(ExperienceEntrySchema)
    .optional()
    .describe('List of work experiences.'),
  education: z
    .array(EducationEntrySchema)
    .optional()
    .describe('List of educational qualifications.'),
  skills: z.array(z.string()).optional().describe('List of skills.'),
  projects: z
    .array(ProjectEntrySchema)
    .optional()
    .describe('List of personal or professional projects.'),
});
export type ResumeData = z.infer<typeof ResumeDataSchema>;

export const ExtractResumeDataInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file (PDF or DOCX) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ExtractResumeDataInput = z.infer<
  typeof ExtractResumeDataInputSchema
>;

// From enhance-resume-section.ts
export const EnhanceResumeSectionInputSchema = z.object({
  section: z
    .string()
    .describe(
      'The name of the resume section (e.g., "Summary", "Experience Description", "Skills").'
    ),
  text: z.string().describe('The text content of the section to be improved.'),
});
export type EnhanceResumeSectionInput = z.infer<
  typeof EnhanceResumeSectionInputSchema
>;

export const EnhanceResumeSectionOutputSchema = z.object({
  enhancedText: z
    .string()
    .describe('The resume section text with AI-powered improvements.'),
});
export type EnhanceResumeSectionOutput = z.infer<
  typeof EnhanceResumeSectionOutputSchema
>;
