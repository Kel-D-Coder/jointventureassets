import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { PanelDecor } from "@/components/ui/PanelDecor";
import Logo from "@/assets/logo/jva_2-removebg-preview.png";
import sideImage from "@/assets/IMG-20251018-WA0012.jpg";
import { cx } from "@/lib/format";

/**
 * The split layout for every sign-in, sign-up and password page: a dark photo
 * panel on large screens, and the form on ivory. These pages hide the main
 * navbar, so the logo here links home.
 */
export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
  wide = false,
  back,
  hideBack = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Wider column for multi-column choices (role picker, profile form). */
  wide?: boolean;
  back?: { href: string; label: string };
  /** No way out of the page, e.g. "Complete your profile", which must be filled in. */
  hideBack?: boolean;
}) {
  return (
    <div className="grid min-h-svh bg-ivory lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        <Image src={sideImage} alt="" fill priority sizes="42vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <PanelDecor glow="bottom-left" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" aria-label="Joint Venture Assets home">
            <Image src={Logo} alt="" width={120} height={120} className="h-20 w-auto" />
          </Link>
          <div>
            <p className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.18em] text-gold uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-linear-to-r from-gold to-gold/30" />
              Joint Venture Assets
            </p>
            <p className="mt-5 max-w-md font-display text-4xl leading-snug text-white xl:text-5xl">
              Where land meets capital. Verified partners, managed deals.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/75">
              {["Every partner and title document vetted", "Joint ventures and outright sales in one place", "Agreements managed through to handover"].map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/30">
                    <FiCheck aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main className="flex flex-col bg-linear-to-b from-ivory to-white px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden" aria-label="Joint Venture Assets home">
            <Image src={Logo} alt="" width={96} height={96} className="h-12 w-auto" />
          </Link>
          {hideBack ? null : back ? (
            <Link href={back.href} className="group ml-auto inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink">
              <FiArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" /> {back.label}
            </Link>
          ) : (
            <Link href="/" className="group ml-auto inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink">
              <FiArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" /> Back to site
            </Link>
          )}
        </div>

        <div className={cx("mx-auto flex w-full flex-1 flex-col justify-center py-10", wide ? "max-w-3xl" : "max-w-md")}>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgb(14_17_22/0.04),0_30px_60px_-36px_rgb(14_17_22/0.35)] sm:p-9">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold-deep via-gold to-gold-deep" />
            {eyebrow ? <p className="text-xs font-bold tracking-[0.18em] text-gold-deep uppercase">{eyebrow}</p> : null}
            <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-[2.6rem]">{title}</h1>
            {intro ? <div className="mt-3 text-muted">{intro}</div> : null}
            <div className="mt-8">{children}</div>
          </div>
          {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
