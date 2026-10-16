import { getPerson } from "@/lib/content";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";

/**
 * NavShell — server-rendered wrapper. Fetches person data once on the server
 * and hands it to the client nav components.
 */
export async function NavShell() {
  const person = await getPerson();
  const brand = person.short_name ?? person.name.split(" ").slice(-1)[0];

  return (
    <>
      <DesktopNav brand={brand} />
      <MobileMenu brand={brand} />
    </>
  );
}