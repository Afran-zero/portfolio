import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { HeroIndustry } from "@/components/hero/HeroIndustry";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Meta } from "@/components/ui/Meta";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { LiveProjectCard } from "@/components/cards/LiveProjectCard";
import { ClientCard } from "@/components/cards/ClientCard";
import { ExperienceTimeline } from "@/components/education/ExperienceTimeline";
import { CertificationList } from "@/components/about/CertificationList";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  buildPageMetadata,
} from "@/lib/seo/page-metadata";
import {
  buildPersonJsonLd,
} from "@/lib/seo/person-jsonld";

import {
  getPerson,
  getContact,
  getEducation,
  getSkills,
  getExperience,
  getProjects,
  getClientWork,
  getCertifications,
} from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  title: "Industry",
  description:
    "Industry experience of Md Kaif Afran Khan — AI engineering, full-stack development, data engineering, and client work shipped in production.",
  path: "/industry",
  images: ["/og/industry.png"],
});

export default async function IndustryPage() {
  const [
    person,
    contact,
    education,
    skills,
    experience,
    projects,
    clientWork,
    certifications,
  ] = await Promise.all([
    getPerson(),
    getContact(),
    getEducation(),
    getSkills(),
    getExperience(),
    getProjects(),
    getClientWork(),
    getCertifications(),
  ]);

  const primaryEducation = education[0];

  // A project is "live" when it has a public deployment URL and isn't
  // documented as a deep case study.
  const isLiveProject = (p: (typeof projects)[number]) =>
    Boolean(p.link && !p.case_study);
  const liveProjects = projects.filter(isLiveProject);
  const otherProjects = projects.filter((p) => !isLiveProject(p));

  // SOP §5 — JSON-LD: Person + ItemList of roles.
  const industryJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildPersonJsonLd(person, contact),
      {
        "@type": "ItemList",
        name: `${person.name} — Industry Experience`,
        itemListElement: experience.slice(0, 10).map((role, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Role",
            name: role.role,
            startDate: role.start,
            endDate: role.end ?? undefined,
            description: role.description,
            organization: {
              "@type": "Organization",
              name: role.company,
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <StructuredData data={industryJsonLd} />

      {/* ---- Hero ---- */}
      <HeroIndustry person={person} />

      {/* ---- Professional Summary ---- */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Professional Summary"
              pulse
              title="Software. AI. Data."
              description="AI engineering, full-stack apps, data pipelines, and client work in production."
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
              {person.bio} Industry is where I ship — ML pipelines,
              full-stack apps, and small-team leadership. The Academic page
              covers research and publications separately.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Education ---- */}
      {primaryEducation && (
        <Section spacing="md" tone="soft">
          <Container>
            <Reveal>
              <div className="grid gap-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <SectionHeading
                    eyebrow="Education"
                    pulse
                    title="Foundations."
                    description="BSc in CSE, Cum Laude, NSU."
                  />
                </div>
                <div className="md:col-span-8">
                  <article className="border border-border bg-bg p-6">
                    <Meta
                      items={[
                        primaryEducation.start
                          ? new Date(primaryEducation.start).getFullYear()
                          : "",
                        primaryEducation.end
                          ? `— ${new Date(primaryEducation.end).getFullYear()}`
                          : "— Present",
                      ]}
                    />
                    <h3 className="mt-3 text-xl font-medium tracking-tight text-fg">
                      {primaryEducation.degree}
                    </h3>
                    <p className="mt-1 text-sm text-fg-muted">
                      {primaryEducation.institution}
                      {primaryEducation.location && ` · ${primaryEducation.location}`}
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-widest text-fg-muted">
                      {primaryEducation.gpa !== undefined && (
                        <>
                          <dt>CGPA</dt>
                          <dd className="text-fg">
                            {primaryEducation.gpa.toFixed(2)} / {primaryEducation.gpa_scale}
                          </dd>
                        </>
                      )}
                      {primaryEducation.credits !== undefined && (
                        <>
                          <dt>Credits</dt>
                          <dd className="text-fg">{primaryEducation.credits}</dd>
                        </>
                      )}
                    </dl>
                  </article>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ---- Core Skills ---- */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Core Skills"
              pulse
              title="Technologies I use."
              description="Python, TypeScript, FastAPI, React, AWS, Kafka, Spark, PyTorch, PennyLane."
            />
            <dl className="mt-10 grid gap-8 md:grid-cols-2">
              {skills.groups.map((group) => (
                <div key={group.id} className="border border-border bg-bg p-6">
                  <dt>
                    <Eyebrow>{group.label}</Eyebrow>
                  </dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={`${group.id}-${item}`}
                        className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-fg"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Experience Timeline ---- */}
      <Section spacing="md" tone="soft">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Experience"
              pulse
              title="Where I've worked."
              description="The Data Island, Farhana Afroz Foundation, UCCHASH Prohor."
              className="max-w-2xl"
            />
          </Reveal>
          <Reveal delay={0.05} className="mt-12">
            <ExperienceTimeline items={experience} />
          </Reveal>
        </Container>
      </Section>

      {/* ---- Project Management ---- */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Project Management"
              pulse
              title="Workshops, docs, stakeholder work."
              description="A condensed view of the PM track — 0-Day AI workshop, comprehensive documentation, and stakeholder presentations."
              className="max-w-2xl"
            />
          </Reveal>
          <Reveal delay={0.05} className="mt-10">
            <div className="grid gap-6 md:grid-cols-3">
              <article className="border border-border bg-bg p-6">
                <Eyebrow>Workshops</Eyebrow>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-fg">
                  0-Day AI Workshop
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Designed and facilitated the 0-Day AI workshop for
                  4excelerate.org during the PM traineeship.
                </p>
              </article>
              <article className="border border-border bg-bg p-6">
                <Eyebrow>Documentation</Eyebrow>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-fg">
                  Comprehensive Project Docs
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Drafted comprehensive project documentation covering scope,
                  plan, and deliverables.
                </p>
              </article>
              <article className="border border-border bg-bg p-6">
                <Eyebrow>Stakeholders</Eyebrow>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-fg">
                  Stakeholder Presentations
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Presented plans and documentation to stakeholders; coordinated
                  on next steps and sign-off.
                </p>
              </article>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Client Work ---- */}
      {clientWork.length > 0 && (
        <Section spacing="md">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Client Work"
                pulse
                title="Selected engagements."
                description="Named where permitted, confidential where it isn't."
              />
            </Reveal>
            <Grid cols={2} className="mt-12">
              {clientWork.map((entry, i) => (
                <Reveal key={entry.id} delay={Math.min(i * 0.04, 0.2)}>
                  <ClientCard entry={entry} />
                </Reveal>
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* ---- Selected Projects (client work) ---- */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Client Projects"
              pulse
              title="Selected projects I've shipped."
              description="Denz, Aselo, STORE, MarketPlus, CryptoStream, Farhana Afroz Foundation."
            />
          </Reveal>

          {/* Featured live sites — bigger interactive cards, live link only. */}
          {liveProjects.length > 0 && (
            <Grid cols={2} className="mt-12">
              {liveProjects.map((project, i) => (
                <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.2)}>
                  <LiveProjectCard project={project} />
                </Reveal>
              ))}
            </Grid>
          )}

          {/* Everything else — standard cards. */}
          {otherProjects.length > 0 && (
            <Grid cols={3} className="mt-8">
              {otherProjects.map((project, i) => (
                <Reveal key={project.slug} delay={Math.min(i * 0.04, 0.2)}>
                  <ProjectCard project={project} featured={project.featured} />
                </Reveal>
              ))}
            </Grid>
          )}

          {contact.github && (
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border pt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">
                Want to dig deeper?
              </p>
              <Button
                href={contact.github}
                variant="primary"
                size="md"
                withArrow
                className="bg-blue-dark hover:bg-blue-dark/90"
              >
                Explore more on GitHub
              </Button>
            </div>
          )}
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
                description="Listed as earned."
              />
              <CertificationList items={certifications} />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ---- Contact ---- */}
      <Section spacing="lg" tone="dark">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-4">
                <Eyebrow tone="dark" pulse>Contact</Eyebrow>
                <h2 className="text-3xl font-medium leading-tight tracking-tight text-fg-on-dark md:text-5xl">
                  Looking to ship something?
                </h2>
                <p className="text-base text-fg-on-dark/70 md:text-lg">
                  Engineering work, contracts, and full-time roles — based in Dhaka, remote-friendly.
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