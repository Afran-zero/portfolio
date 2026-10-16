/**
 * CV variant registry — single source of truth for both the `/cv` index page
 * (which lists variants) and `next.config.ts` (which issues static 308
 * redirects). Adding a variant here updates both surfaces together.
 */

export type CvVariant = {
  id: "academic" | "industry" | "professional" | "master";
  label: string;
  audience: string;
  description: string;
  /** PDF filename under `public/media/cv/` (without path). */
  pdf: string;
};

export const cvVariants: readonly CvVariant[] = [
  {
    id: "academic",
    label: "Academic CV",
    audience: "Research / Grad school",
    description:
      "Publications, thesis, ongoing research lines, conferences, " +
      "academic projects. For research roles, PhD / MSc applications, " +
      "grant reviewers.",
    pdf: "academic-cv.pdf",
  },
  {
    id: "industry",
    label: "Industry CV",
    audience: "Hiring managers / Clients",
    description:
      "AI engineering at The Data Island, shipped full-stack and data " +
      "projects, certifications. For hiring managers, recruiters, " +
      "engineering clients.",
    pdf: "industry-cv.pdf",
  },
  {
    id: "professional",
    label: "Professional CV",
    audience: "General applications",
    description:
      "Same content as the industry CV under the SOP-aligned URL " +
      "name. Alias for `/cv/industry`.",
    pdf: "industry-cv.pdf",
  },
  {
    id: "master",
    label: "Master CV",
    audience: "Single-document overview",
    description:
      "Identity, education, experience, projects, and research in one " +
      "document. Use when you don't know the reader's audience.",
    pdf: "master-cv.pdf",
  },
];

export const cvVariantRoutes = cvVariants.map((v) => ({
  source: `/cv/${v.id}`,
  destination: `/media/cv/${v.pdf}`,
  permanent: true,
}));