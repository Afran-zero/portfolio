import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ShapeBackground } from "@/components/shapes/ShapeBackground";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { SITE_URL, buildPersonJsonLd } from "@/lib/seo/person-jsonld";

import {
  getResearchProjects,
  getResearchProject,
  getPerson,
  getContact,
} from "@/lib/content";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const projects = await getResearchProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getResearchProject(slug);
  if (!project) return {};
  const description =
    project.results.length > 160
      ? project.results.slice(0, 157) + "..."
      : project.results;
  return buildPageMetadata({
    title: project.title,
    description,
    path: `/academic/research/${project.slug}`,
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

function OptionalDetail({
  title,
  body,
}: {
  title: string;
  body: string | undefined;
}) {
  if (!body) return null;
  return <Detail title={title} body={body} />;
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getResearchProject(slug);
  if (!project) notFound();

  const [person, contact] = await Promise.all([getPerson(), getContact()]);

  // SOP §5 — JSON-LD: ScholarlyArticle + Person author.
  const researchJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ScholarlyArticle",
        headline: project.title,
        abstract: project.results,
        url: `${SITE_URL}/academic/research/${project.slug}`,
        author: buildPersonJsonLd(person, contact),
        keywords: project.method,
        isBasedOn: project.paper_url,
        codeRepository: project.repo_url,
      },
    ],
  };

  return (
    <>
      <StructuredData data={researchJsonLd} />

      {/* ---- Project Hero ---- */}
      <Section spacing="lg" className="overflow-hidden">
        <ShapeBackground
          variant="outlined-circle"
          size={520}
          parallax
          parallaxAmount={10}
          className="pointer-events-none absolute -right-24 -top-10 -z-10 h-[520px] w-[520px] md:-right-16"
        />
        <Container width="narrow">
          <Reveal>
            <Link
              href="/academic"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue-dark hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to academic
            </Link>
            <Eyebrow className="mt-8">Research</Eyebrow>
            <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-tight text-fg md:text-5xl">
              {project.title}
            </h1>
            <div
              aria-hidden="true"
              className="mt-10 h-px w-full bg-border"
            />
          </Reveal>
        </Container>
      </Section>

      {/* ---- Research body ---- */}
      <Section spacing="md">
        <Container width="narrow">
          <Reveal>
            <div className="space-y-10">
              <Detail title="Research Question" body={project.question} />
              <OptionalDetail title="Motivation" body={project.motivation} />
              <OptionalDetail title="Background" body={project.background} />
              <Detail title="Method" body={project.method} />
              <OptionalDetail title="Experimental Setup" body={project.setup} />
              <Detail title="Results" body={project.results} />
              <OptionalDetail
                title="Ablation / Comparison"
                body={undefined}
              />
              <OptionalDetail title="Limitations" body={project.limitations} />
              <OptionalDetail
                title="Future Work"
                body={project.future_work}
              />
            </div>

            {(project.paper_url || project.repo_url) && (
              <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border/60 pt-10">
                {project.paper_url && (
                  <Button
                    href={project.paper_url}
                    variant="primary"
                    size="md"
                    className="[&_svg]:h-4 [&_svg]:w-4"
                  >
                    Paper
                    <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
                {project.repo_url && (
                  <Button
                    href={project.repo_url}
                    variant="secondary"
                    size="md"
                    className="[&_svg]:h-4 [&_svg]:w-4"
                  >
                    Repository
                    <Github className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            )}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}