import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cvVariants } from "@/lib/cv";
import { SITE_URL } from "@/lib/seo/person-jsonld";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Download the academic, industry, or master CV of Md Kaif Afran Khan, an AI engineer, data engineer, and researcher in Dhaka, Bangladesh.",
  alternates: { canonical: `${SITE_URL}/cv` },
  openGraph: {
    title: "CV: Md Kaif Afran Khan",
    description:
      "Download the academic, industry, or master CV of Md Kaif Afran Khan.",
    url: `${SITE_URL}/cv`,
    siteName: "Kaif | AI Engineer and Data Engineer",
    locale: "en_US",
    type: "website",
  },
};

export default function CvIndexPage() {
  return (
    <Section spacing="lg">
      <Container width="narrow">
        <SectionHeading
          eyebrow="CV"
          pulse
          title="Download CV."
          description={`${cvVariants.length} versions, by audience.`}
        />

        <Grid cols={4} className="mt-12">
          {cvVariants.map((v) => (
            <article
              key={v.id}
              className="card-lift group border border-border bg-bg p-6"
            >
              <Eyebrow>{v.audience}</Eyebrow>
              <h3 className="mt-3 text-lg font-medium text-fg">
                <Link
                  href={`/cv/${v.id}`}
                  className="inline-flex items-center gap-2 hover:text-blue-dark"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {v.label}
                </Link>
              </h3>
              <p className="mt-3 text-sm text-fg-muted">{v.description}</p>
              <Link
                href={`/cv/${v.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-blue-dark"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download PDF
              </Link>
            </article>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}