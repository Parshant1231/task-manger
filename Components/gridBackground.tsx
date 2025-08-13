"use client";

interface GridBackgroundProps {
  scrollY: number;
}

export function GridBackground({ scrollY }: GridBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-25">
      {/* Vertical lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-blue-400"
          style={{
            left: `${(i + 1) * 8.33}%`,
            transform: `translateY(${(scrollY * 0.1 * (i % 3)) % 100}px)`,
          }}
        />
      ))}

      {/* Horizontal lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-blue-400"
          style={{
            top: `${(i + 1) * 12.5}%`,
            transform: `translateX(${(scrollY * 0.05 * (i % 2)) % 50}px)`,
          }}
        />
      ))}
    </div>
  );
}
