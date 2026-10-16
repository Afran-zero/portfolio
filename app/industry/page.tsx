import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ContactBand } from "@/components/layout/ContactBand";
import { BackLink } from "@/components/ui/BackLink";
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
    "AI engineering, data engineering, and full-stack work by Md Kaif Afran Khan. Production AI systems, data pipelines, and client projects, with a project management background.",
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
        name: `${person.name}: Industry Experience`,
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
    <div className="bg-graph">
      <StructuredData data={industryJsonLd} />

      {/* ---- Hero ---- */}
      <HeroIndustry person={person} />

      {/* ---- Professional Summary ---- */}
      <Section spacing="sm">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Professional Summary"
              pulse
              title="Engineering with a delivery lens."
              description="Production AI, full-stack, and data work."
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
              {person.bio}
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
                  <article className="card-lift border border-border bg-bg p-6">
                    <Meta
                      items={[
                        primaryEducation.start
                          ? new Date(primaryEducation.start).getFullYear()
                          : "",
                        primaryEducation.end
                          ? `to ${new Date(primaryEducation.end).getFullYear()}`
                          : "to present",
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
              description="The stack behind the work."
            />
            <dl className="mt-10 grid gap-8 md:grid-cols-2">
              {skills.groups.map((group) => (
                <div key={group.id} className="card-lift border border-border bg-bg p-6">
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
              title="Project management."
              description="Workshops, documentation, and stakeholder delivery."
              className="max-w-2xl"
            />
          </Reveal>
          <Reveal delay={0.05} className="mt-10">
            <div className="grid gap-6 md:grid-cols-3">
              <article className="card-lift border border-border bg-bg p-6">
                <Eyebrow>Workshops</Eyebrow>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-fg">
                  0-Day AI Workshop
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Facilitated the 0-Day AI workshop for 4excelerate.org.
                </p>
              </article>
              <article className="card-lift border border-border bg-bg p-6">
                <Eyebrow>Documentation</Eyebrow>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-fg">
                  Project docs
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Scope, plan, and deliverables, documented.
                </p>
              </article>
              <article className="card-lift border border-border bg-bg p-6">
                <Eyebrow>Stakeholders</Eyebrow>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-fg">
                  Presentations
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Presented plans and next steps to stakeholders.
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
                description="Named where permitted, confidential otherwise."
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
              title="Selected projects."
              description="Denz, Aselo, STORE, MarketPlus, CryptoStream, Farhana Afroz Foundation."
            />
          </Reveal>

          {/* Featured live sites: larger cards, live link only. */}
          {liveProjects.length > 0 && (
            <Grid cols={2} className="mt-12">
              {liveProjects.map((project, i) => (
                <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.2)}>
                  <LiveProjectCard project={project} />
                </Reveal>
              ))}
            </Grid>
          )}

          {/* Everything else: standard cards. */}
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
                
              >
                More on GitHub
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
              />
              <CertificationList items={certifications} />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ---- Contact ---- */}
      <ContactBand
        title="Let's build something."
        description="Engineering roles, contracts, and client work. Based in Dhaka, open to remote."
        email={contact.email}
        github={contact.github}
        linkedin={contact.linkedin}
      />

      {/* ---- Back home ---- */}
      <Section spacing="md">
        <Container>
          <BackLink href="/">Back home</BackLink>
        </Container>
      </Section>
    </div>
  );
}