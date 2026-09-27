export function OpeningHours({ hours }: { hours: string }) {
  const rows = hours
    .split(/\s*·\s*|\n/)
    .map((row) => row.trim())
    .filter(Boolean);
  if (!rows.length) return <span>Hours not provided</span>;

  return (
    <ul aria-label="Opening hours" className="min-w-0 space-y-1.5">
      {rows.map((row, index) => {
        const match = row.match(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*(.*)$/i,
        );
        return (
          <li key={`${row}-${index}`} className="flex flex-wrap justify-between gap-x-5 gap-y-1">
            {match ? (
              <>
                <span className="font-medium">{match[1]}</span>
                <span className="tabular-nums">{match[2]}</span>
              </>
            ) : (
              <span>{row}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
