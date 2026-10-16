import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  email?: string;
  github?: string;
  linkedin?: string;
};

/**
 * ContactBand — the closing dark CTA used at the foot of section pages.
 * Same heading scale, buttons and spacing as every other section.
 */
export function ContactBand({ title, description, eyebrow = "Contact", email, github, linkedin }: Props) {
  return (
    <Section spacing="lg" tone="navy">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              tone="dark"
              eyebrow={eyebrow}
              pulse
              title={title}
              description={description}
              className="max-w-2xl"
            />
            <div className="flex flex-wrap gap-3">
              {email && (
                <Button href={`mailto:${email}`} variant="inverse" size="lg" withArrow>
                  Email
                </Button>
              )}
              {github && (
                <Button href={github} variant="outline-dark" size="lg">
                  GitHub
                </Button>
              )}
              {linkedin && (
                <Button href={linkedin} variant="outline-dark" size="lg">
                  LinkedIn
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
