import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* Hallmark · design-system: design.md
 * Left-aligned masthead over a hairline. The previous pill-on-blur floated
 * above the content and centred the title; neither fits this system. */

interface PageTitleProps {
  title: string;
  backLink?: string;
  backLabel?: string;
  eyebrow?: string;
}

export function PageTitle({
  title,
  backLink,
  backLabel = "Retour",
  eyebrow,
}: PageTitleProps) {
  return (
    <div className="mb-6">
      {backLink && (
        <Link
          href={backLink}
          className="mb-4 inline-flex items-center gap-1.5 whitespace-nowrap rounded text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      )}
      {eyebrow && <p className="label-meta">{eyebrow}</p>}
      <h1 className="mt-1 font-display text-2xl font-medium leading-tight tracking-display">
        {title}
      </h1>
    </div>
  );
}
