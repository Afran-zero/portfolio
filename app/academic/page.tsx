import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { HeroAcademic } from "@/components/hero/HeroAcademic";
import { ShapeBackground } from "@/components/shapes/ShapeBackground";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { QuantumPaperCard } from "@/components/cards/QuantumPaperCard";
import { PublicationItem } from "@/components/cards/PublicationItem";
import { EducationAcademic } from "@/components/education/EducationAcademic";
import { CertificationList } from "@/components/about/CertificationList";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildPersonJsonLd } from "@/lib/seo/person-jsonld";

import {
  getPerson,
  getContact,
  getEducation,
  getResearchProfile,
  getPublications,
  getThesis,
  getConferences,
  getResearchProjects,
  getCertifications,
  getLanguages,
} from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  title: "Academic",
  description:
    "Academic profile of Md Kaif Afran Khan — research in machine learning, quantum computing, and graph learning, plus publications and thesis.",
  path: "/academic",
  images: ["/og/academic.png"],
});

export default async function AcademicPage() {
  const [
    person,
    education,
    research,
    publications,
    thesis,
    conferences,
    projects,
    certifications,
    languages,
    contact,
  ] = await Promise.all([
    getPerson(),
    getEducation(),
    getResearchProfile(),
    getPublications(),
    getThesis(),
    getConferences(),
    getResearchProjects(),
    getCertifications(),
    getLanguages(),
    getContact(),
  ]);

  // SOP §5 — JSON-LD: Person + ItemList of educational programs.
  const academicJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildPersonJsonLd(person, contact),
      {
        "@type": "ItemList",
        name: `${person.name} — Academic Profile`,
        itemListElement: education.slice(0, 10).map((ed, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "EducationalOccupationalProgram",
            name: ed.degree,
            educationalCredentialAwarded: ed.degree,
            startDate: ed.start,
            endDate: ed.end ?? undefined,
            description: ed.highlights?.join(" "),
            provider: {
              "@type": "EducationalOrganization",
              name: ed.institution,
              address: ed.location
                ? { "@type": "PostalAddress", addressLocality: ed.location }
                : undefined,
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <StructuredData data={academicJsonLd} />

      {/* ---- Hero ---- */}
      <HeroAcademic person={person} research={research} />

      {/* ---- Research Profile ---- */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Research Profile"
              pulse
              title="Where the work points."
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
              {research.profile}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Education (academic framing) ---- */}
      <Section spacing="md" tone="soft">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Education"
              pulse
              title="Where I trained."
            />
          </Reveal>
          <Reveal delay={0.05} className="mt-10">
            <EducationAcademic items={education} />
          </Reveal>
        </Container>
      </Section>

      {/* ---- Research Interests ---- */}
      <Section spacing="md" className="overflow-hidden">
        <Container>
          <ShapeBackground
            variant="triangle"
            size={420}
            parallax
            parallaxAmount={14}
            className="absolute -right-32 top-8 -z-10 h-[420px] w-[420px] opacity-30"
          />
          <Reveal>
            <SectionHeading
              eyebrow="Research Interests"
              pulse
              title="What I'm drawn to."
              description="The questions I keep returning to."
            />
            <div className="mt-10">
              <ul
                role="list"
                className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
              >
                {research.interests.map((item) => (
                  <li
                    key={item}
                    className="border border-border bg-bg px-4 py-3 font-mono text-xs uppercase tracking-widest text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Publications ---- */}
      <Section spacing="md" tone="soft">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Publications"
              pulse
              title="Papers, preprints, posters."
              description="FSM-LoRA (ICAISF 2026), TAL-GRN (Under Review), persona multiplicity (thesis)."
            />
          </Reveal>
          <div className="mt-10 space-y-6">
            {publications.length === 0 ? (
              <p className="font-mono text-sm uppercase tracking-widest text-fg-muted">
                No publications yet.
              </p>
            ) : (
              publications.map((pub, i) => (
                <Reveal key={pub.id} delay={Math.min(i * 0.04, 0.2)}>
                  <PublicationItem publication={pub} />
                </Reveal>
              ))
            )}
          </div>
        </Container>
      </Section>

      {/* ---- Thesis ---- */}
      <Section spacing="md" className="overflow-hidden">
        <Container>
          <ShapeBackground
            variant="semi-circle"
            size={520}
            parallax
            parallaxAmount={18}
            className="absolute -right-40 top-0 -z-10 h-[260px] w-[520px] opacity-35"
          />
          <Reveal>
            <SectionHeading
              eyebrow="Thesis"
              pulse
              title="What I'm writing."
            />
            <article className="mt-10 border-l-2 border-blue pl-6">
              <Eyebrow>
                {thesis.status}
                {thesis.supervisor && ` · Supervisor: ${thesis.supervisor}`}
              </Eyebrow>
              <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight text-fg md:text-2xl">
                {thesis.title}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
                {thesis.abstract}
              </p>
              {thesis.pdf_url && (
                <div className="mt-6">
                  <Button
                    href={thesis.pdf_url}
                    variant="primary"
                    size="md"
                    className="[&_svg]:h-4 [&_svg]:w-4"
                  >
                    Download Thesis PDF
                    <Download className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </article>
            {thesis.additional_work?.map((entry) => (
              <article key={entry.id} className="mt-10 border-l-2 border-blue pl-6">
                <Eyebrow>
                  Additional thesis work{entry.status && ` · ${entry.status}`}
                </Eyebrow>
                <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight text-fg md:text-2xl">
                  {entry.title}
                </h3>
              </article>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* ---- Quantum Papers (featured, ongoing) ---- */}
      {(() => {
        const quantumProjects = projects.filter((p) =>
          ["qml-as-qkd-entanglement-pathways", "piqagat-quantum-adaptive-gat"].includes(
            p.slug,
          ),
        );
        if (quantumProjects.length === 0) return null;
        return (
          <Section spacing="md" tone="navy" id="quantum" className="overflow-hidden">
            <ShapeBackground
              variant="outlined-circle"
              size={620}
              parallax
              parallaxAmount={24}
              className="absolute -right-48 top-[-100px] -z-0 h-[620px] w-[620px] opacity-30 [&_circle]:stroke-blue"
            />
            <Container className="relative z-10">
              <Reveal>
                <SectionHeading
                  tone="dark"
                  eyebrow="Quantum Papers"
                  pulse
                  title="Quantum, ongoing."
                  description="QML on E91/BBM92 entanglement pathways, and a quantum-adaptive GAT for muon regression."
                />
              </Reveal>
              <Grid cols={2} className="mt-12">
                {quantumProjects.map((project, i) => (
                  <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.2)}>
                    <QuantumPaperCard project={project} />
                  </Reveal>
                ))}
              </Grid>
            </Container>
          </Section>
        );
      })()}

      {/* ---- Conferences ---- */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Conferences & Talks"
              pulse
              title="Where I've presented."
            />
            <ul className="mt-10 space-y-6">
              {conferences.length === 0 ? (
                <li className="font-mono text-sm uppercase tracking-widest text-fg-muted">
                  No conference entries yet.
                </li>
              ) : (
                conferences.map((conf) => (
                  <li
                    key={conf.id}
                    className="grid gap-3 border-b border-border/60 pb-6 md:grid-cols-12 md:gap-6"
                  >
                    <span className="font-mono text-sm uppercase tracking-widest text-blue md:col-span-2">
                      {conf.year}
                    </span>
                    <div className="md:col-span-10">
                      <p className="text-base font-medium text-fg">
                        {conf.name}
                        {conf.location && (
                          <span className="text-fg-muted"> · {conf.location}</span>
                        )}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                        {conf.contribution}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Certifications ---- */}
      {certifications.length > 0 && (
        <Section spacing="md">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Certifications"
                pulse
                title="Coursework and credentials."
              />
              <CertificationList items={certifications} />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ---- Languages ---- */}
      {languages.length > 0 && (
        <Section spacing="md" tone="soft">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Languages"
                pulse
                title="Spoken."
              />
              <ul className="mt-8 space-y-3">
                {languages.map((lang) => (
                  <li
                    key={lang.name}
                    className="flex items-baseline justify-between border-b border-border/60 pb-3 font-mono text-sm"
                  >
                    <span className="text-fg">{lang.name}</span>
                    <span className="uppercase tracking-widest text-fg-muted">
                      {lang.level}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ---- Academic CV ---- */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-6 border-l-2 border-blue pl-6 md:flex-row md:items-center md:justify-between">
              <div>
                <Eyebrow>Academic CV</Eyebrow>
                <h3 className="mt-2 text-xl font-medium tracking-tight text-fg md:text-2xl">
                  One-page CV for academic applications.
                </h3>
              </div>
              <Button href="/cv/academic" variant="primary" size="md">
                Download Academic CV
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Contact ---- */}
      <Section spacing="lg" tone="dark">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-4">
                <Eyebrow tone="dark" pulse>Contact</Eyebrow>
                <h2 className="text-3xl font-medium leading-tight tracking-tight text-fg-on-dark md:text-5xl">
                  Open to research collaboration.
                </h2>
                <p className="text-base text-fg-on-dark/70 md:text-lg">
                  Interested in MSc, MRes, PhD, and joint research.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {contact.email && (
                  <Button href={`mailto:${contact.email}`} variant="primary" size="lg" withArrow>
                    Email
                  </Button>
                )}
                {contact.github && (
                  <Button
                    href={contact.github}
                    variant="secondary"
                    size="lg"
                    className="border-fg-on-dark/30 bg-transparent text-fg-on-dark hover:border-fg-on-dark hover:bg-fg-on-dark/10"
                  >
                    GitHub
                  </Button>
                )}
                {contact.linkedin && (
                  <Button
                    href={contact.linkedin}
                    variant="secondary"
                    size="lg"
                    className="border-fg-on-dark/30 bg-transparent text-fg-on-dark hover:border-fg-on-dark hover:bg-fg-on-dark/10"
                  >
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Back home ---- */}
      <Section spacing="md" tone="default">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue-dark hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back home
          </Link>
        </Container>
      </Section>
    </>
  );
}