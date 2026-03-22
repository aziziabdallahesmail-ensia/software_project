interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
      <div className="icon-container icon-container-lg bg-secondary text-muted-foreground mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
