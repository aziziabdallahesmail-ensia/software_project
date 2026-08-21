/* Hallmark · design-system: design.md
 * Left-aligned, hairline-framed. Centred empty states read as error pages. */

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="surface flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
      <span className="icon-container icon-container-lg shrink-0">{icon}</span>
      <div className="min-w-0">
        <h3 className="font-display text-base font-medium tracking-display">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
