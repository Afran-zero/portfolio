import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import { Mail, Github, Linkedin } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildContactPointJsonLd } from "@/lib/seo/person-jsonld";
import { ContactForm } from "@/components/contact/ContactForm";
import { getContact, getPerson } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Md Kaif Afran Khan about AI engineering, data projects, or research collaboration. Send a message or email directly.",
  path: "/contact",
  type: "profile",
  images: ["/og/contact.png"],
});

export default async function ContactPage() {
  const [person, contact] = await Promise.all([getPerson(), getContact()]);

  return (
    <>
      <StructuredData data={buildContactPointJsonLd(person, contact)} />

      {/* ---- Channels ---- */}
      <Section spacing="lg">
        <Container width="narrow">
          <SectionHeading
            eyebrow="Contact"
            pulse
            title="Get in touch."
            description="Have a project, a role, or a research idea? Say hello."
          />
          <Grid cols={3} className="mt-12">
            {contact.email && (
              <article className="group flex h-full flex-col border border-border bg-bg p-6 card-lift">
                <Eyebrow>Email</Eyebrow>
                <div className="mt-4 flex flex-1 items-center">
                  <a
                    href={`mailto:${contact.email}`}
                    aria-label={`Email: ${contact.email}`}
                    className="inline-flex h-12 w-12 items-center justify-center border border-border bg-bg text-fg btn-press hover:border-blue hover:bg-blue-50 hover:text-blue-dark"
                  >
                    <Mail className="h-6 w-6" aria-hidden="true" />
                  </a>
                </div>
                <p className="mt-3 break-all font-mono text-micro uppercase tracking-widest text-fg-muted">
                  {contact.email}
                </p>
              </article>
            )}
            {contact.github && (
              <article className="group flex h-full flex-col border border-border bg-bg p-6 card-lift">
                <Eyebrow>GitHub</Eyebrow>
                <div className="mt-4 flex flex-1 items-center">
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub: ${person.name}`}
                    className="inline-flex h-12 w-12 items-center justify-center border border-border bg-bg text-fg btn-press hover:border-blue hover:bg-blue-50 hover:text-blue-dark"
                  >
                    <Github className="h-6 w-6" aria-hidden="true" />
                  </a>
                </div>
                <p className="mt-3 break-all font-mono text-micro uppercase tracking-widest text-fg-muted">
                  github.com/{contact.github.split("github.com/")[1]?.split("/")[0] ?? ""}
                </p>
              </article>
            )}
            {contact.linkedin && (
              <article className="group flex h-full flex-col border border-border bg-bg p-6 card-lift">
                <Eyebrow>LinkedIn</Eyebrow>
                <div className="mt-4 flex flex-1 items-center">
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn: ${person.name}`}
                    className="inline-flex h-12 w-12 items-center justify-center border border-border bg-bg text-fg btn-press hover:border-blue hover:bg-blue-50 hover:text-blue-dark"
                  >
                    <Linkedin className="h-6 w-6" aria-hidden="true" />
                  </a>
                </div>
                <p className="mt-3 break-all font-mono text-micro uppercase tracking-widest text-fg-muted">
                  linkedin.com/in/md-kaif-afran-khan
                </p>
              </article>
            )}
          </Grid>
        </Container>
      </Section>

      {/* ---- Send a message ---- */}
      <Section id="message" spacing="md" tone="soft">
        <Container width="narrow">
          <SectionHeading
            eyebrow="Message"
            pulse
            title="Send a message."
            description="Opens your mail app with a pre-filled message. No tracking."
          />
          <div className="mt-10 border border-border bg-bg p-6 md:p-8">
            <ContactForm />
          </div>
        </Container>
      </Section>

      {/* ---- Back home ---- */}
      <Section spacing="md">
        <Container width="narrow">
          <BackLink href="/">Back home</BackLink>
        </Container>
      </Section>
    </>
  );
}