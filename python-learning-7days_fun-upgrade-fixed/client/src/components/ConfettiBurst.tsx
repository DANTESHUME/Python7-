import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const EMOJIS = ["✨", "🎉", "⭐", "🔥", "✅", "🧠"];

type Particle = { id: string; x: number; delay: number; emoji: string };

export default function ConfettiBurst({
  show,
  className,
  onDone,
}: {
  show: boolean;
  className?: string;
  onDone?: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      x: Math.random() * 100,
      delay: Math.random() * 250,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));
  }, [show]);

  useEffect(() => {
    if (!show) return;
    setMounted(true);
    const t = setTimeout(() => {
      setMounted(false);
      onDone?.();
    }, 1100);
    return () => clearTimeout(t);
  }, [show, onDone]);

  if (!show || !mounted) return null;

  return (
    <div className={cn("pointer-events-none fixed inset-0 z-[60]", className)}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 text-2xl animate-confetti"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}ms`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
