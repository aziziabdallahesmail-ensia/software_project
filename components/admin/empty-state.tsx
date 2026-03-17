interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
