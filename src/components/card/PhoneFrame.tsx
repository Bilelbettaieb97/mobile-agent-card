import { type ReactNode } from "react";

/** iPhone-style frame with a scrollable inner viewport. */
export function PhoneFrame({ children, gridOverlay = false, scrollHint = false }: { children: ReactNode; gridOverlay?: boolean; scrollHint?: boolean }) {
  return (
    <div className="relative mx-auto" style={{ width: 360 }}>
      <div
        className="relative rounded-[44px] p-[10px] shadow-2xl"
        style={{
          background: "linear-gradient(180deg, oklch(0.22 0.01 250), oklch(0.1 0.01 250))",
          boxShadow: "0 30px 80px -20px oklch(0 0 0 / 0.7), 0 0 0 1px oklch(0.3 0.02 250 / 0.5)",
        }}
      >
        <div className="relative overflow-hidden rounded-[36px] bg-background" style={{ height: 720 }}>
          {/* notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-6 w-28 rounded-full bg-black/90 border border-white/10" />
          <div className="h-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {children}
          </div>

          {/* Scroll hint fade */}
          {scrollHint && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent z-20" />
          )}

          {/* GRID OVERLAY */}
          {gridOverlay && <GridOverlay />}
        </div>
      </div>
    </div>
  );
}

function GridOverlay() {
  // Inner phone screen is 340px wide (360 - 2*10 padding). Card uses 20px (px-5) gutters.
  const GUTTER = 20;
  const COLS = 4;
  const innerW = 340 - GUTTER * 2;
  const colW = innerW / COLS;

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {/* horizontal 8px rhythm */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, oklch(0.78 0.13 200) 0 1px, transparent 1px 8px)",
        }}
      />
      {/* safe-area gutters */}
      <div
        className="absolute top-0 bottom-0 border-x border-dashed"
        style={{ left: GUTTER, right: GUTTER, borderColor: "oklch(0.85 0.18 25 / 0.55)" }}
      />
      {/* 4-column grid */}
      {Array.from({ length: COLS - 1 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: GUTTER + colW * (i + 1),
            background: "oklch(0.78 0.13 200 / 0.45)",
          }}
        />
      ))}
      {/* tap-target ruler (44px iOS guideline) at top */}
      <div
        className="absolute left-0 right-0 border-y border-dashed"
        style={{ top: 8, height: 44, borderColor: "oklch(0.85 0.18 140 / 0.5)" }}
      />
      {/* center axis */}
      <div
        className="absolute top-0 bottom-0 w-px left-1/2"
        style={{ background: "oklch(0.85 0.18 25 / 0.6)" }}
      />
    </div>
  );
}

