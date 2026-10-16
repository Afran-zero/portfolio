/**
 * Zod schemas for every content entity.
 * Invalid YAML fails the build (per PLAN §69).
 *
 * Schemas are the contract between YAML files and React components.
 * If you add a field to YAML, add it here too.
 */

import { z } from "zod";

// ---- Primitives ----

const url = z
  .string()
  .url()
  .refine((u) => /^https?:\/\//.test(u), { message: "Links must be http(s)" });

const isoDate = z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
  message: "Must be a valid date string",
});

// ---- Person ----

export const PersonSchema = z.object({
  name: z.string().min(1),
  short_name: z.string().optional(),
  role: z.string().min(1),
  roles: z.array(z.string()).default([]),
  bio: z.string().min(1),
  location: z.string().optional(),
  portrait_path: z.string().default("/portfolio.svg"),
  pronouns: z.string().optional(),
});

export type Person = z.infer<typeof PersonSchema>;

// ---- Education ----

export const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  location: z.string().optional(),
  start: isoDate.optional(),
  end: isoDate.optional().nullable(),
  credits: z.number().int().nonnegative().optional(),
  gpa: z.number().nonnegative().optional(),
  gpa_scale: z.number().positive().default(4.0),
  thesis: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export type Education = z.infer<typeof EducationSchema>;

// ---- Skills ----

export const SkillGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  items: z.array(z.string()),
});

export const SkillsSchema = z.object({
  groups: z.array(SkillGroupSchema),
});

export type Skill = z.infer<typeof SkillGroupSchema>;
export type Skills = z.infer<typeof SkillsSchema>;

// ---- Experience ----

export const ExperienceSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string().optional(),
  start: isoDate,
  end: isoDate.nullable().optional(),
  description: z.string(),
  stack: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

// ---- Project (industry) ----

export const ProjectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  summary: z.string(),
  year: z.number().int(),
  stack: z.array(z.string()).default([]),
  impact: z.string().optional(),
  github: url.optional(),
  link: url.optional(),
  case_study: z.boolean().default(false),
  featured: z.boolean().default(false),
  /**
   * Optional thumbnail path (under /public). When set, ProjectCard renders
   * a 16:9 image area at the top. Omit if no asset is available yet.
   */
  image: z.string().optional(),
  image_alt: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

// ---- Client work ----

export const ClientWorkSchema = z.object({
  id: z.string(),
  name: z.string(),
  confidential: z.boolean().default(false),
  domain: z.string(),
  role: z.string(),
  start: isoDate.optional(),
  end: isoDate.nullable().optional(),
  description: z.string(),
  highlights: z.array(z.string()).optional(),
  stack: z.array(z.string()).optional(),
});

export type ClientWork = z.infer<typeof ClientWorkSchema>;

// ---- GitHub ----

export const GitHubRepoSchema = z.object({
  name: z.string(),
  description: z.string(),
  language: z.string().optional(),
  stars: z.number().int().nonnegative().optional(),
  url: url,
});

export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

// ---- Research ----

export const ResearchSchema = z.object({
  profile: z.string(),
  interests: z.array(z.string()),
  methods: z.array(z.string()).default([]),
});

export type Research = z.infer<typeof ResearchSchema>;

// ---- Publication ----

export const PublicationStatusSchema = z.enum([
  "Published",
  "Accepted",
  "Under Review",
  "Preprint",
]);

export const PublicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  venue: z.string(),
  year: z.number().int(),
  status: PublicationStatusSchema,
  doi: z.string().optional(),
  arxiv: url.optional(),
  paper_url: url.optional(),
  abstract: z.string().optional(),
});

export type Publication = z.infer<typeof PublicationSchema>;

// ---- Thesis ----

export const ThesisSchema = z.object({
  title: z.string(),
  abstract: z.string(),
  supervisor: z.string().optional(),
  status: z.string(),
  pdf_url: url.optional(),
  /**
   * Additional thesis-track works rendered beneath the main thesis block
   * (e.g., companion papers in the same research line). Each entry has at
   * least an `id` (cross-reference to publications.yaml) and a `title`.
   */
  additional_work: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        status: z.string().optional(),
      }),
    )
    .optional(),
});

export type Thesis = z.infer<typeof ThesisSchema>;

// ---- Conference ----

export const ConferenceSchema = z.object({
  id: z.string(),
  year: z.number().int(),
  name: z.string(),
  contribution: z.string(),
  location: z.string().optional(),
});

export type Conference = z.infer<typeof ConferenceSchema>;

// ---- Certifications ----

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  year: z.number().int(),
  url: url.optional(),
  file: z.string().optional(),
});

export type Certification = z.infer<typeof CertificationSchema>;

// ---- Languages (spoken + test scores) ----

export const LanguageSchema = z.object({
  name: z.string(),
  level: z.string(),
  /**
   * Optional CEFR-aligned proficiency on a 0–10 scale. Used by the
   * Language Proficiency section to draw a small bar. Omit for test
   * scores (e.g. IELTS) that report a band, not a CEFR level.
   */
  score: z.number().min(0).max(10).optional(),
});

export type Language = z.infer<typeof LanguageSchema>;

// ---- Hobbies ----

export const HobbiesSchema = z.object({
  items: z.array(z.string()),
});

export type Hobbies = z.infer<typeof HobbiesSchema>;

// ---- Contact ----

export const ContactSchema = z.object({
  email: z.string().email().optional(),
  github: url.optional(),
  linkedin: url.optional(),
  scholar: url.optional(),
  orcid: url.optional(),
  location: z.string().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

// ---- Research project (detail) ----

export const ResearchProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  question: z.string(),
  motivation: z.string().optional(),
  background: z.string().optional(),
  method: z.string(),
  setup: z.string().optional(),
  results: z.string(),
  limitations: z.string().optional(),
  future_work: z.string().optional(),
  paper_url: url.optional(),
  repo_url: url.optional(),
});

export type ResearchProject = z.infer<typeof ResearchProjectSchema>;