/**
 * Typed content getters.
 * Each function reads a YAML file and validates it with Zod.
 * Invalid content fails at build time (per PLAN §69).
 *
 * Used by Server Components.
 */

import { z } from "zod";

import {
  PersonSchema,
  EducationSchema,
  SkillsSchema,
  CertificationSchema,
  LanguageSchema,
  HobbiesSchema,
  ContactSchema,
  ExperienceSchema,
  ProjectSchema,
  ClientWorkSchema,
  GitHubRepoSchema,
  ResearchSchema,
  PublicationSchema,
  ThesisSchema,
  ConferenceSchema,
  ResearchProjectSchema,
  type Person,
  type Education,
  type Skills,
  type Certification,
  type Language,
  type Hobbies,
  type Contact,
  type Experience,
  type Project,
  type ClientWork,
  type GitHubRepo,
  type Research,
  type Publication,
  type Thesis,
  type Conference,
  type ResearchProject,
} from "./schemas";
import { readYAML } from "./yaml";

export async function getPerson(): Promise<Person> {
  const raw = await readYAML<unknown>("content/shared/person.yaml");
  return PersonSchema.parse(raw);
}

export async function getEducation(): Promise<Education[]> {
  const raw = await readYAML<unknown>("content/shared/education.yaml");
  return z.array(EducationSchema).parse(raw);
}

export async function getSkills(): Promise<Skills> {
  const raw = await readYAML<unknown>("content/shared/skills.yaml");
  return SkillsSchema.parse(raw);
}

export async function getCertifications(): Promise<Certification[]> {
  const raw = await readYAML<unknown>("content/shared/certifications.yaml");
  return z.array(CertificationSchema).parse(raw);
}

export async function getLanguages(): Promise<Language[]> {
  const raw = await readYAML<unknown>("content/shared/languages.yaml");
  return z.array(LanguageSchema).parse(raw);
}

export async function getHobbies(): Promise<Hobbies> {
  const raw = await readYAML<unknown>("content/shared/hobbies.yaml");
  return HobbiesSchema.parse(raw);
}

export async function getContact(): Promise<Contact> {
  const raw = await readYAML<unknown>("content/shared/contact.yaml");
  return ContactSchema.parse(raw);
}

// ---- Industry ----

/**
 * Experience, sorted reverse chronological. Current roles (end: null) sort last
 * so the timeline reads newest-first when end is set, and current role at bottom.
 */
export async function getExperience(): Promise<Experience[]> {
  const raw = await readYAML<unknown>("content/industry/experience.yaml");
  const list = z.array(ExperienceSchema).parse(raw);
  return [...list].sort((a, b) => {
    if (!a.end && b.end) return 1;
    if (a.end && !b.end) return -1;
    return new Date(b.end ?? b.start).getTime() - new Date(a.end ?? a.start).getTime();
  });
}

/**
 * Projects, featured first then by year descending.
 */
export async function getProjects(): Promise<Project[]> {
  const raw = await readYAML<unknown>("content/industry/projects.yaml");
  const list = z.array(ProjectSchema).parse(raw);
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.year - a.year;
  });
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((p) => p.slug === slug);
}

/**
 * Projects that have case_study: true — drives generateStaticParams.
 */
export async function getCaseStudyProjects(): Promise<Project[]> {
  const list = await getProjects();
  return list.filter((p) => p.case_study);
}

export async function getClientWork(): Promise<ClientWork[]> {
  const raw = await readYAML<unknown>("content/industry/client-work.yaml");
  return z.array(ClientWorkSchema).parse(raw);
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const raw = await readYAML<unknown>("content/industry/github.yaml");
  return z.array(GitHubRepoSchema).parse(raw);
}

// ---- Academic ----

export async function getResearchProfile(): Promise<Research> {
  const raw = await readYAML<unknown>("content/academic/research.yaml");
  return ResearchSchema.parse(raw);
}

export async function getPublications(): Promise<Publication[]> {
  const raw = await readYAML<unknown>("content/academic/publications.yaml");
  const list = z.array(PublicationSchema).parse(raw);
  // Newest first.
  return [...list].sort((a, b) => b.year - a.year);
}

export async function getThesis(): Promise<Thesis> {
  const raw = await readYAML<unknown>("content/academic/thesis.yaml");
  return ThesisSchema.parse(raw);
}

export async function getConferences(): Promise<Conference[]> {
  const raw = await readYAML<unknown>("content/academic/conferences.yaml");
  const list = z.array(ConferenceSchema).parse(raw);
  return [...list].sort((a, b) => b.year - a.year);
}

export async function getResearchProjects(): Promise<ResearchProject[]> {
  const raw = await readYAML<unknown>("content/academic/research-projects.yaml");
  return z.array(ResearchProjectSchema).parse(raw);
}

export async function getResearchProject(
  slug: string,
): Promise<ResearchProject | undefined> {
  const list = await getResearchProjects();
  return list.find((p) => p.slug === slug);
}