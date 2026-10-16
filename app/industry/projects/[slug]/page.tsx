import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";
import { BackLink } from "@/components/ui/BackLink";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Meta } from "@/components/ui/Meta";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ShapeBackground } from "@/components/shapes/ShapeBackground";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { SITE_URL, buildPersonJsonLd } from "@/lib/seo/person-jsonld";

import {
  getCaseStudyProjects,
  getProject,
  getProjects,
  getPerson,
  getContact,
} from "@/lib/content";

/**
 * Pre-render only projects that opted into case_study: true.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const projects = await getCaseStudyProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return buildPageMetadata({
    title: project.name,
    description:
      project.summary.length > 160
        ? project.summary.slice(0, 157) + "..."
        : project.summary,
    path: `/industry/projects/${project.slug}`,
    type: "article",
  });
}

type DetailProps = {
  title: string;
  body: string;
};

function Detail({ title, body }: DetailProps) {
  return (
    <div className="grid gap-4 border-t border-border/60 pt-8 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-3">
        <Eyebrow>{title}</Eyebrow>
      </div>
      <div className="md:col-span-9">
        <p className="max-w-3xl text-base leading-relaxed text-fg-muted md:text-lg">
          {body}
        </p>
      </div>
    </div>
  );
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project || !project.case_study) notFound();

  const [allProjects, person, contact] = await Promise.all([
    getProjects(),
    getPerson(),
    getContact(),
  ]);
  const related = allProjects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3);

  // SOP §5 — JSON-LD: SoftwareSourceCode + Person author.
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        name: project.name,
        description: project.summary,
        url: `${SITE_URL}/industry/projects/${project.slug}`,
        dateCreated: `${project.year}-01-01`,
        author: buildPersonJsonLd(person, contact),
        programmingLanguage: project.stack,
        codeRepository: project.github,
        downloadUrl: project.link ?? undefined,
      },
    ],
  };

  return (
    <>
      <StructuredData data={projectJsonLd} />

      {/* ---- Project Hero ---- */}
      <Section spacing="lg" className="overflow-hidden">
        <ShapeBackground
          variant="blue-rect"
          size={520}
          className="pointer-events-none absolute right-[-120px] top-[-40px] -z-10 h-[520px] w-[520px] opacity-90 md:right-[-80px]"
        />
        <Container>
          <Reveal>
            <BackLink href="/industry">Back to industry</BackLink>
            <Eyebrow className="mt-8">
              {project.category} · {project.year}
            </Eyebrow>
            <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-6xl">
              {project.name}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted md:text-xl">
              {project.summary}
            </p>
            <div className="mt-8">
              <Meta items={project.stack} />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.github && (
                <Button
                  href={project.github}
                  variant="primary"
                  size="md"
                  className="[&_svg]:h-4 [&_svg]:w-4"
                >
                  GitHub
                  <Github className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {project.link && (
                <Button
                  href={project.link}
                  variant="secondary"
                  size="md"
                  className="[&_svg]:h-4 [&_svg]:w-4"
                >
                  Visit project
                  <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Case study body ---- */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <div className="space-y-10">
              <Detail title="Problem" body={project.summary} />
              {project.impact && (
                <Detail title="Results" body={project.impact} />
              )}
              <Detail
                title="Methodology"
                body={`Built with ${project.stack.join(", ")}.`}
              />
              </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Related projects ---- */}
      {related.length > 0 && (
        <Section spacing="md" tone="soft">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Related"
                title="More in this category."
                index="01"
              />
              <Grid cols={3} className="mt-10">
                {related.map((p) => (
                  <article
                    key={p.slug}
                    className="card-lift border border-border bg-bg p-6"
                  >
                    <Eyebrow>{p.category}</Eyebrow>
                    <h3 className="mt-3 text-lg font-medium tracking-tight text-fg">
                      <Link
                        href={
                          p.case_study
                            ? `/industry/projects/${p.slug}`
                            : p.github ?? "#"
                        }
                        className="hover:text-blue-dark"
                      >
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                      {p.summary}
                    </p>
                    <Meta className="mt-4" items={[String(p.year), ...p.stack.slice(0, 2)]} />
                  </article>
                ))}
              </Grid>
            </Reveal>
          </Container>
        </Section>
      )}
    </>
  );
}