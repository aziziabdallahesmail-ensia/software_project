import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageTitleProps {
  title: string;
  backLink?: string;
  backLabel?: string;
}

export function PageTitle({ title, backLink, backLabel = "Retour" }: PageTitleProps) {
  return (
    <div className="relative mb-8 flex min-h-12 items-center justify-center rounded-full border border-emerald-100/80 bg-white/80 px-6 py-3 shadow-sm shadow-emerald-950/5 backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70">
      {backLink && (
        <Link
          href={backLink}
          className="absolute left-3 inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-900/60 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </Link>
      )}
      <h1 className="text-center text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">{title}</h1>
    </div>
  );
}
