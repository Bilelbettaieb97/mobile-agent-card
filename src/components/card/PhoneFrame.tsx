import { type ReactNode } from "react";

/** iPhone-style frame with a scrollable inner viewport. */
export function PhoneFrame({ children }: { children: ReactNode }) {
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
        </div>
      </div>
    </div>
  );
}
