import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageTitleProps {
  title: string;
  backLink?: string;
  backLabel?: string;
}

export function PageTitle({ title, backLink, backLabel = "Back" }: PageTitleProps) {
  return (
    <div className="relative flex items-center justify-center mb-8">
      {backLink && (
        <Link
          href={backLink}
          className="absolute left-0 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </Link>
      )}
      <h1 className="text-2xl font-bold text-center">{title}</h1>
    </div>
  );
}
