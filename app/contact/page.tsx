import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Github, Linkedin } from "lucide-react";

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
    "Contact Md Kaif Afran Khan for research collaboration, engineering work, or any other inquiry. Email, GitHub, and LinkedIn.",
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
          <Eyebrow pulse>Contact</Eyebrow>
          <SectionHeading
            title="Get in touch."
            description="Research collaboration, engineering work, or anything in between."
            className="mt-4"
          />
          <Grid cols={3} className="mt-12">
            {contact.email && (
              <article className="group flex h-full flex-col border border-border bg-bg p-6 transition-colors hover:border-blue">
                <Eyebrow>Email</Eyebrow>
                <div className="mt-4 flex flex-1 items-center">
                  <a
                    href={`mailto:${contact.email}`}
                    aria-label={`Email — ${contact.email}`}
                    className="inline-flex h-12 w-12 items-center justify-center border border-border bg-bg text-fg transition-colors hover:border-blue hover:bg-blue-50 hover:text-blue-dark"
                  >
                    <Mail className="h-6 w-6" aria-hidden="true" />
                  </a>
                </div>
                <p className="mt-3 break-all font-mono text-[10px] uppercase tracking-widest text-fg-muted">
                  {contact.email}
                </p>
              </article>
            )}
            {contact.github && (
              <article className="group flex h-full flex-col border border-border bg-bg p-6 transition-colors hover:border-blue">
                <Eyebrow>GitHub</Eyebrow>
                <div className="mt-4 flex flex-1 items-center">
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub — ${person.name}`}
                    className="inline-flex h-12 w-12 items-center justify-center border border-border bg-bg text-fg transition-colors hover:border-blue hover:bg-blue-50 hover:text-blue-dark"
                  >
                    <Github className="h-6 w-6" aria-hidden="true" />
                  </a>
                </div>
                <p className="mt-3 break-all font-mono text-[10px] uppercase tracking-widest text-fg-muted">
                  github.com/{contact.github.split("github.com/")[1]?.split("/")[0] ?? ""}
                </p>
              </article>
            )}
            {contact.linkedin && (
              <article className="group flex h-full flex-col border border-border bg-bg p-6 transition-colors hover:border-blue">
                <Eyebrow>LinkedIn</Eyebrow>
                <div className="mt-4 flex flex-1 items-center">
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn — ${person.name}`}
                    className="inline-flex h-12 w-12 items-center justify-center border border-border bg-bg text-fg transition-colors hover:border-blue hover:bg-blue-50 hover:text-blue-dark"
                  >
                    <Linkedin className="h-6 w-6" aria-hidden="true" />
                  </a>
                </div>
                <p className="mt-3 break-all font-mono text-[10px] uppercase tracking-widest text-fg-muted">
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
          <Eyebrow pulse>Message</Eyebrow>
          <SectionHeading
            title="Send a message."
            description="Fill in the form below — it opens your mail client with a pre-filled message addressed to me. No external service, no tracking."
            className="mt-4"
          />
          <div className="mt-10 border border-border bg-bg p-6 md:p-8">
            <ContactForm />
          </div>
        </Container>
      </Section>

      {/* ---- Back home ---- */}
      <Section spacing="md">
        <Container width="narrow">
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