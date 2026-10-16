import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { BentoGrid } from "@/components/layout/BentoGrid";
import { BentoCard } from "@/components/layout/BentoCard";
import { Meta } from "@/components/ui/Meta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { OverviewSection } from "@/components/about/OverviewSection";
import { EducationTimeline } from "@/components/about/EducationTimeline";
import { LanguageProficiency } from "@/components/about/LanguageProficiency";
import { SkillsCloud } from "@/components/about/SkillsCloud";
import { ContactForm } from "@/components/contact/ContactForm";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { PublicationCard } from "@/components/cards/PublicationCard";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import {
  buildPersonJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/person-jsonld";

import {
  getPerson,
  getEducation,
  getSkills,
  getContact,
  getProjects,
  getPublications,
  getLanguages,
  getHobbies,
} from "@/lib/content";

import Avatar from "@/components/hero/Avatar";
import { ShapeBackground } from "@/components/shapes/ShapeBackground";
import { CloudField } from "@/components/sky/CloudField";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Engineer & Researcher",
  description:
    "Md Kaif Afran Khan — AI engineer and researcher working on quantum machine learning for high-energy physics, GNN baselines, and shipped web systems.",
  path: "/",
});

export default async function HomePage() {
  const [
    person,
    education,
    skills,
    contact,
    projects,
    publications,
    languages,
    hobbies,
  ] = await Promise.all([
    getPerson(),
    getEducation(),
    getSkills(),
    getContact(),
    getProjects(),
    getPublications(),
    getLanguages(),
    getHobbies(),
  ]);

  // Featured industry: Denz + MarketPlus + Farhana. Linear .find is cheaper
  // than a Map for ~8 entries.
  const findProject = (slug: string) => projects.find((p) => p.slug === slug);
  const featuredDenz = findProject("denz-ecommerce");
  const featuredMarketPlus = findProject("marketplus-stock-analytics");
  const fsmLora = publications.find((publication) => publication.id === "fsm-lora-2026");
  const farhanaFoundation = findProject("farhana-foundation-ngo");

  // Flatten skills for the bento badge cloud — SkillsCloud handles the
  // "+ N more" toggle.
  const allSkills = skills.groups.flatMap((g) => g.items);

  // SOP §5 — JSON-LD: WebSite + Person (sameAs etc. derived from contact.yaml).
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [buildWebSiteJsonLd(person), buildPersonJsonLd(person, contact)],
  };

  const roles = person.roles.length > 0 ? person.roles : [person.role];

  return (
    <>
      <StructuredData data={homeJsonLd} />

      {/* One continuous sky — applied to the page wrapper so all sections
          share the same light-blue wash + drifting clouds. Sections that
          need a different tone (split, contact) paint *over* the sky as
          overlays; the rest stay transparent so the gradient flows. */}
      <div className="relative bg-sky">
        <CloudField />

      {/* ============================================================
          1. HERO — structured text panel + blueprint-framed schematic.
          ============================================================ */}
      <Section spacing="sm" className="overflow-hidden">
        <Container>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              {/* LEFT — structured intro panel */}
              <div className="relative md:col-span-7">
                <BentoCard
                  tone="blueprint"
                  brackets
                  className="h-full"
                >
                  <HeroIntro name={person.name} roles={roles} />
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
                    Graph-learning models, QML experiments on HEP data, and
                    full-stack applications. Pick the side you came for.
                  </p>
                  <div className="mt-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-blue-dark">
                      Pick your path →
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Button
                        href="/industry"
                        variant="primary"
                        size="md"
                        withArrow
                      >
                        Industry
                      </Button>
                      <Button
                        href="/academic"
                        variant="secondary"
                        size="md"
                        withArrow
                      >
                        Academia
                      </Button>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-border pt-4">
                    <Meta items={[person.location ?? "—"]} />
                  </div>
                </BentoCard>
              </div>

              {/* RIGHT — animated avatar with geometric motion field */}
              <div className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden py-6 md:col-span-5 md:min-h-[410px] md:py-8">
                <div className="absolute left-1/2 top-1/2 z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 opacity-60 md:h-[380px] md:w-[380px]">
                  <div className="h-full w-full animate-circle-drift">
                    <ShapeBackground
                      variant="outlined-circle"
                      size={520}
                      parallax
                      parallaxAmount={18}
                      className="h-full w-full"
                    />
                  </div>
                </div>
                <div
                  className="absolute right-[-12px] top-0 z-0 h-[210px] w-[210px] opacity-85 md:right-[-24px] md:top-4 md:h-[270px] md:w-[270px]"
                  style={{
                    transform:
                      "translate(var(--mx, 0px), var(--my, 0px))",
                  }}
                >
                  <div className="h-full w-full animate-drift-slow [&_circle]:fill-blue/70">
                    <ShapeBackground variant="dot-grid" size={280} className="h-full w-full" />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-6 z-0 rounded-full bg-blue-soft/35 blur-2xl"
                  style={{
                    transform:
                      "translate(var(--mx, 0px), var(--my, 0px))",
                  }}
                />
                <Image
                  src="/portfolio-clean.svg"
                  alt=""
                  aria-hidden="true"
                  width={500}
                  height={500}
                  className="absolute z-0 h-[330px] w-[330px] opacity-[0.08] md:h-[390px] md:w-[390px]"
                />
                <div className="relative z-10 flex h-auto w-full max-w-[360px] flex-col items-center justify-center md:max-w-[390px]">
                  <div
                    aria-hidden="true"
                    className="avatar-ground absolute bottom-[54px] h-3 w-2/3 rounded-full bg-fg/25 blur-md"
                  />
                  <Avatar
                    label={`${person.name} — portrait`}
                    className="relative z-10 h-[275px] w-[275px] md:h-[330px] md:w-[330px]"
                  />
                  <div className="bg-blueprint relative z-20 flex w-full items-center justify-center border border-blue/45 bg-white px-4 py-2">
                    <Button
                      href="/media/cv/master-cv.pdf"
                      download="Md-Kaif-Afran-Khan-Master-CV.pdf"
                      variant="secondary"
                      size="sm"
                      className="bg-white"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download CV
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ============================================================
          2. ABOUT — Profile (left) + Bio/Available (right) + Skills
                    (full-width) + Education timeline.
          ============================================================ */}
      <Section spacing="xs">
        <Container>
          <Reveal>
            <OverviewSection
              person={person}
              hobbies={hobbies}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <BentoGrid gap="xs" className="mt-8">
              <BentoCard
                eyebrow="Education"
                badge={["SSC", "HSC", "BSc"]}
                brackets
                className="md:col-span-12"
              >
                <EducationTimeline items={education} />
              </BentoCard>

              <BentoCard
                eyebrow="Skills"
                brackets
                className="md:col-span-12"
              >
                <SkillsCloud items={allSkills} initial={20} />
              </BentoCard>
            </BentoGrid>
          </Reveal>
        </Container>
      </Section>

      {/* ============================================================
          3. INDUSTRY / ACADEMIA — split, blueprint tone, wireframe ticks
          ============================================================ */}
      <Section id="split" spacing="sm" tone="default" className="bg-blueprint">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Split"
              pulse
              title="Industry. Academia."
              description="Same person. Different framing."
              className="max-w-2xl"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <BentoGrid gap="md" stretch className="mt-8">
              <Link
                href="/industry"
                className="md:col-span-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                aria-label="Industry page"
              >
                <BentoCard
                  eyebrow="Industry"
                  tone="blueprint"
                  badge={["Engineering", "Client work"]}
                  className="h-full"
                >
                  <div className="flex h-full flex-col">
                    <h3 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
                      Software, AI, data, and client work.
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-fg-muted">
                      Production systems, full-stack applications, data pipelines,
                      and consulting engagements across AI, automation, and web.
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-6 font-mono text-xs uppercase tracking-widest text-blue-dark">
                      View industry <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </BentoCard>
              </Link>
              <Link
                href="/academic"
                className="md:col-span-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                aria-label="Academic page"
              >
                <BentoCard
                  eyebrow="Academia"
                  tone="blueprint"
                  badge={["Research", "Publications"]}
                  className="h-full"
                >
                  <div className="flex h-full flex-col">
                    <h3 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
                      Research, publications, and thesis.
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-fg-muted">
                      Machine learning, quantum computing, and graph learning
                      research with publications, conference talks, and thesis
                      work.
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-6 font-mono text-xs uppercase tracking-widest text-blue-dark">
                      View academia <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </BentoCard>
              </Link>
            </BentoGrid>
          </Reveal>
        </Container>
      </Section>

      {/* ============================================================
          4. SELECTED WORK — symmetric 2×2 bento, lead card is the
             Denz e-commerce site; second row: QML-as-QKD entanglement
             pathways paper + the next featured research project.
          ============================================================ */}
      {(featuredDenz || fsmLora || farhanaFoundation) && (
        <Section spacing="sm">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Selected Work"
                pulse
                title="A handful of projects."
                description="Denz, MarketPlus, FSM-LoRA, and Farhana Afroz Foundation — featured engineering and research."
                className="max-w-2xl"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <BentoGrid gap="md" stretch className="mt-8">
                {/* Row 1 — Denz + MarketPlus */}
                {featuredDenz && (
                  <div className="md:col-span-6">
                    <ProjectCard
                      project={featuredDenz}
                      featured
                      className="h-full"
                    />
                  </div>
                )}
                {featuredMarketPlus && (
                  <div className="md:col-span-6">
                    <ProjectCard
                      project={featuredMarketPlus}
                      className="h-full"
                    />
                  </div>
                )}
                {/* Row 2 — FSM-LoRA + Farhana Afroz Foundation */}
                {fsmLora && (
                  <div className="md:col-span-6">
                    <PublicationCard publication={fsmLora} className="h-full" />
                  </div>
                )}
                {farhanaFoundation && (
                  <div className="md:col-span-6">
                    <ProjectCard project={farhanaFoundation} className="h-full" />
                  </div>
                )}
              </BentoGrid>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ============================================================
          5. LANGUAGE PROFICIENCY — bars for spoken languages + a
             test-score cell for IELTS.
          ============================================================ */}
      {languages.length > 0 && (
        <Section spacing="sm">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Languages"
                pulse
                title="Language proficiency."
                description="Spoken languages and standardized test scores."
                className="max-w-2xl"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-8">
                <LanguageProficiency items={languages} />
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* ============================================================
          6. CONTACT — bento: form + alt channels (LinkedIn as Button)
          ============================================================ */}
      <Section id="contact" spacing="lg" tone="navy">
        <Container>
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Contact"
              pulse
              title="Get in touch."
              description="Research collaboration, engineering work, or anything in between."
              className="max-w-2xl"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-7">
                <ContactForm tone="dark" />
              </div>
              <div className="md:col-span-5">
                <p className="font-mono text-xs uppercase tracking-widest text-fg-on-dark/70">
                  Channels
                </p>
                <ul className="mt-4 space-y-6">
                  {contact.email && (
                    <li>
                      <p className="font-mono text-xs uppercase tracking-widest text-fg-on-dark/70">
                        Email
                      </p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="mt-1 inline-flex items-center gap-2 text-base font-medium text-fg-on-dark hover:text-blue-soft"
                      >
                        {contact.email}
                      </a>
                    </li>
                  )}
                  {contact.github && (
                    <li>
                      <p className="font-mono text-xs uppercase tracking-widest text-fg-on-dark/70">
                        GitHub
                      </p>
                      <a
                        href={contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-2 text-base font-medium text-fg-on-dark hover:text-blue-soft"
                      >
                        {contact.github.replace(/^https?:\/\//, "")}
                      </a>
                    </li>
                  )}
                  {contact.linkedin && (
                    <li>
                      <p className="font-mono text-xs uppercase tracking-widest text-fg-on-dark/70">
                        LinkedIn
                      </p>
                      <div className="mt-3">
                        <Button
                          href={contact.linkedin}
                          variant="primary"
                          size="md"
                          withArrow
                          className="bg-fg-on-dark !text-blue-dark hover:bg-fg-on-dark/90"
                        >
                          Open LinkedIn
                        </Button>
                      </div>
                    </li>
                  )}
                  <li className="border-t border-white/15 pt-4">
                    <Meta
                      className="!text-fg-on-dark/70"
                      items={[
                        contact.location ?? "—",
                        "Remote / on-site",
                        "UTC+6",
                      ]}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
      </div>
    </>
  );
}