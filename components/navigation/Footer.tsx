import Link from "next/link";
import { getContact, getPerson } from "@/lib/content";

/**
 * Footer — minimal per PLAN §59.
 */
export async function Footer() {
  const [person, contact] = await Promise.all([getPerson(), getContact()]);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-6 lg:px-8">
        <div className="space-y-2">
          <p className="font-mono text-lg font-medium tracking-tight text-fg">
            {person.short_name ?? person.name}
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">
            AI Engineer · Researcher · Software Developer
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-fg-muted">
            <li>
              <Link href="/industry" className="hover:text-fg">
                Industry
              </Link>
            </li>
            <li>
              <Link href="/academic" className="hover:text-fg">
                Academia
              </Link>
            </li>
            {contact.github && (
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg"
                >
                  GitHub
                </a>
              </li>
            )}
            {contact.linkedin && (
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg"
                >
                  LinkedIn
                </a>
              </li>
            )}
            <li>
              <Link href="/cv/professional" className="hover:text-fg">
                CV
              </Link>
            </li>
          </ul>
        </nav>
        <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">
          © {new Date().getFullYear()} {person.name}
        </p>
      </div>
    </footer>
  );
}