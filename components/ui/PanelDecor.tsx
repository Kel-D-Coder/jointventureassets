import { cx } from "@/lib/format";

/**
 * The soft gold light and fine grid behind the dark panels (the dashboard's welcome panel,
 * Quick actions). Put it first inside a `relative overflow-hidden` dark element, and give the
 * content after it `relative` so it sits on top.
 */
export function PanelDecor({ glow = "top-right", className }: { glow?: "top-right" | "bottom-left" | "top-center"; className?: string }) {
  return (
    <div aria-hidden="true" className={cx("pointer-events-none absolute inset-0", className)}>
      <div
        className={cx(
          "absolute h-80 w-80 rounded-full bg-gold/20 blur-3xl",
          glow === "top-right" && "-top-32 -right-24",
          glow === "bottom-left" && "-bottom-32 -left-24",
          glow === "top-center" && "-top-40 left-1/2 w-[36rem] -translate-x-1/2",
        )}
      />
      <div
        className={cx(
          "absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px]",
          glow === "bottom-left" ? "[mask-image:linear-gradient(to_right,black,transparent_70%)]" : "[mask-image:linear-gradient(to_left,black,transparent_70%)]",
        )}
      />
    </div>
  );
}
