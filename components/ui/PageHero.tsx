import type { ReactNode } from "react";
import { HeroPanel } from "@/components/ui/HeroPanel";

/**
 * The banner that opens an inner page: eyebrow, serif title, intro, in the same panel style as
 * the members' dashboard. Light (white with an ivory glow) by default, ink for emphasis.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Extra content under the intro (buttons, stats). */
  children?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <HeroPanel eyebrow={eyebrow} title={title} intro={intro} tone={tone}>
      {children}
    </HeroPanel>
  );
}
