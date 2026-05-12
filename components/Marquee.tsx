import type { Settings } from "@/lib/api";

export default function Marquee({ settings }: { settings?: Settings }) {
  const defaultItems = ["GRAPHIC DESIGN", "WEB DEVELOPMENT", "3D ART", "BRANDING", "MOTION DESIGN", "UI / UX"];
  const rawItems = settings?.marquee?.items?.length ? settings.marquee.items : defaultItems;
  const speed = settings?.marquee?.speed || 30;
  // duplicate for seamless loop
  const items = [...rawItems, ...rawItems, ...rawItems];

  return (
    <div
      className="overflow-hidden border-y border-[var(--border)] py-5 bg-[var(--bg-2)]"
      aria-hidden="true"
      style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 px-8 text-xs font-medium uppercase tracking-[0.18em] opacity-35 whitespace-nowrap"
          >
            {item}
            <span className="text-[var(--accent)] opacity-100 text-[8px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
