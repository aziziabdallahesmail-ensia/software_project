interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
        <span className="text-muted-foreground opacity-50">{icon}</span>
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
}
