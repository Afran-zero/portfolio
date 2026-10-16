import { ArrowRight } from "lucide-react";

import { AboutPhoto } from "@/components/about/AboutPhoto";
import { AvailablePulse } from "@/components/about/AvailablePulse";
import { Button } from "@/components/ui/Button";
import { Meta } from "@/components/ui/Meta";
import type { Person } from "@/lib/schemas";
import type { Hobbies } from "@/lib/schemas";

type Props = {
  person: Person;
  hobbies: Hobbies;
};

/**
 * OverviewSection — 2-column Profile + Bio/Available layout.
 *
 * Left column: framed photo, name, title, role pills, hobbies.
 * Right column: Bio (top) + Available CTA (bottom), equal-height.
 *
 * Mobile collapses to a single column.
 */
export function OverviewSection({
  person,
  hobbies,
}: Props) {
  return (
    <section className="mt-8">
      <header className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue">
        <span aria-hidden="true">//</span>
        <span>Overview</span>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* LEFT — Profile */}
        <article className="card-lift relative flex flex-col border border-border bg-bg p-6 lg:col-span-4">
          <span aria-hidden="true" className="corner-tl" />
          <span aria-hidden="true" className="corner-tr" />
          <span aria-hidden="true" className="corner-bl" />
          <span aria-hidden="true" className="corner-br" />

          <AboutPhoto
            src={person.portrait_path}
            alt={`${person.name}, portrait`}
            shape="portrait"
            className="aspect-[4/5] w-full max-w-[280px] self-center"
          />

          <h2 className="mt-6 text-2xl font-medium leading-tight tracking-tight text-fg md:text-3xl">
            {person.name}
          </h2>
          <h3 className="mt-1 font-mono text-xs uppercase tracking-widest text-fg-muted">
            {person.role}
          </h3>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {person.roles.map((r) => (
              <li key={r}>
                <span className="inline-flex items-center rounded-sm border border-blue/30 bg-blue-50 px-2 py-1 font-mono text-micro uppercase tracking-widest text-blue-dark">
                  {r}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">
              Hobbies
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {hobbies.items.map((h) => (
                <li
                  key={h}
                  className="font-mono text-micro uppercase tracking-widest text-fg-muted"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* RIGHT — Bio + Available (equal-height stack) */}
        <div className="grid grid-cols-1 gap-6 lg:col-span-8 lg:grid-rows-2 lg:gap-8">
          {/* Bio */}
          <article className="card-lift relative flex flex-col border border-border bg-bg p-6">
            <span aria-hidden="true" className="corner-tl" />
            <span aria-hidden="true" className="corner-tr" />
            <span aria-hidden="true" className="corner-bl" />
            <span aria-hidden="true" className="corner-br" />

            <h3 className="font-mono text-xs uppercase tracking-widest text-blue">
              Bio
            </h3>
            <p className="mt-4 text-base text-fg-muted md:text-lg leading-relaxed">
              {person.bio}
            </p>
          </article>

          {/* Available CTA */}
          <article className="relative flex flex-col justify-between border border-blue/30 bg-blue-dark p-6 text-fg-on-dark">
            <span aria-hidden="true" className="corner-tl-light" />
            <span aria-hidden="true" className="corner-tr-light" />
            <span aria-hidden="true" className="corner-bl-light" />
            <span aria-hidden="true" className="corner-br-light" />

            <div>
              <p className="text-2xl font-medium tracking-tight text-fg-on-dark md:text-3xl">
                <AvailablePulse />
              </p>
              <h3 className="mt-2 text-base font-medium text-fg-on-dark md:text-lg">
                Open to engineering and research
              </h3>
              <Meta
                className="mt-3 !text-fg-on-dark/70"
                items={[
                  person.location ?? "",
                  "Remote / On-Site",
                  "UTC+6",
                ]}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                href="#contact"
                variant="primary"
                size="md"
                className="bg-fg-on-dark !text-blue-dark hover:bg-fg-on-dark/90"
              >
                Get in touch
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}