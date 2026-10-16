"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Badge } from "@/components/layout/Badge";

type Props = {
  items: string[];
  /** Initial visible count. Defaults to 8. */
  initial?: number;
};

/**
 * SkillsCloud — badge grid with a "+ N more" toggle.
 *
 * Renders the first `initial` items, then a compact pill button that
 * expands to reveal the rest. Collapses back via the same button.
 */
export function SkillsCloud({ items, initial = 8 }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const visible = expanded ? items : items.slice(0, initial);
  const hidden = items.length - initial;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {visible.map((item, i) => (
          <Badge key={`${i}-${item}`} variant="soft">
            {item}
          </Badge>
        ))}
      </div>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-2 border border-border bg-bg px-3 py-1.5 font-mono text-micro uppercase tracking-widest text-fg-muted transition-colors hover:border-blue hover:bg-blue-50 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
        >
          {expanded ? (
            <>
              <Minus className="h-3 w-3" aria-hidden="true" />
              Show less
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" aria-hidden="true" />
              {hidden} more
            </>
          )}
        </button>
      )}
    </div>
  );
}