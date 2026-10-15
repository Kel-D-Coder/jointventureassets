import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowLeft } from "react-icons/fi";
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
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Wider column for multi-column choices (role picker, profile form). */
  wide?: boolean;
  back?: { href: string; label: string };
}) {
  return (
    <div className="grid min-h-svh bg-ivory lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        <Image src={sideImage} alt="" fill priority sizes="42vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" aria-label="Joint Venture Assets home">
            <Image src={Logo} alt="" width={120} height={120} className="h-20 w-auto" />
          </Link>
          <div>
            <p className="eyebrow text-gold">Joint Venture Assets</p>
            <p className="mt-4 max-w-md font-display text-3xl leading-snug text-white xl:text-4xl">
              Where land meets capital. Verified partners, managed deals.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-gray-300">
              <li>✓ Every partner and title document vetted</li>
              <li>✓ Joint ventures and outright sales in one place</li>
              <li>✓ Agreements managed through to handover</li>
            </ul>
          </div>
        </div>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden" aria-label="Joint Venture Assets home">
            <Image src={Logo} alt="" width={96} height={96} className="h-12 w-auto" />
          </Link>
          {back ? (
            <Link href={back.href} className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
              <FiArrowLeft aria-hidden="true" /> {back.label}
            </Link>
          ) : (
            <Link href="/" className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
              <FiArrowLeft aria-hidden="true" /> Back to site
            </Link>
          )}
        </div>

        <div className={cx("mx-auto flex w-full flex-1 flex-col justify-center py-10", wide ? "max-w-3xl" : "max-w-md")}>
          {eyebrow ? <p className="eyebrow text-gold-deep">{eyebrow}</p> : null}
          <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
          {intro ? <div className="mt-3 text-muted">{intro}</div> : null}
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-8 text-center text-sm text-muted">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
