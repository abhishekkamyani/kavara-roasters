export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="flex flex-col gap-2 rounded-xl bg-muted p-4"
    >
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-10 animate-pulse rounded-lg bg-foreground/5"
        />
      ))}
    </div>
  );
}
