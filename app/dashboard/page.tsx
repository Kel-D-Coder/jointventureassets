"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { FiAlertCircle, FiArrowRight, FiCalendar, FiCheckCircle, FiClock, FiCompass, FiEdit2, FiFileText, FiHome, FiPlus } from "react-icons/fi"
import { RootState } from "@/store/store"
import { getMyAccount, getUserStats } from "@/lib/api/auth"
import { getMyRequests } from "@/lib/api/requests"
import { getListings } from "@/lib/api/listings"
import { getMyListings } from "@/lib/api/inbox"
import type { OwnedListing } from "@/lib/api/listings"
import SubmissionList from "@/components/dashboard/SubmissionList"
import OwnedListingList from "@/components/dashboard/OwnedListingList"
import type { ListingSubmission, MemberAccount } from "@/lib/inbox/types"
import StatCard from "@/components/dashboard/StatCard"
import SectionCard from "@/components/dashboard/SectionCard"
import EmptyState from "@/components/dashboard/EmptyState"
import RequestList from "@/components/dashboard/RequestList"
import QuickActions from "@/components/dashboard/QuickActions"
import { ListingCard, ListingCardSkeleton } from "@/components/listings/ListingCard"
import type { Listing, PartnerRequest } from "@/types"

interface UserStats {
  totalRequest: number
  matched: number
  availableMatches: number
}

/** Listings that suit the member's role: JV land for developers and investors, everything else otherwise. */
function recommendedFor(role: string, listings: Listing[]): Listing[] {
  const preferred = role === "Investor" ? listings.filter((listing) => listing.dealType === "jv") : listings
  return (preferred.length ? preferred : listings).slice(0, 3)
}

/** "CHIBUNDU" or "chibundu" -> "Chibundu". */
function properCase(name: string): string {
  return name.toLowerCase().replace(/(^|[\s'-])\p{L}/gu, (match) => match.toUpperCase())
}

function greeting(hour: number): string {
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

const accountBadge: Record<MemberAccount["status"], { label: string; className: string }> = {
  active: { label: "Account active", className: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/30" },
  pending: { label: "Awaiting approval", className: "bg-gold/15 text-gold-soft ring-gold/40" },
  suspended: { label: "Suspended", className: "bg-red-400/15 text-red-200 ring-red-300/30" },
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats>()
  const [requests, setRequests] = useState<PartnerRequest[]>([])
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [submissions, setSubmissions] = useState<ListingSubmission[]>([])
  const [ownedListings, setOwnedListings] = useState<OwnedListing[]>([])
  const [account, setAccount] = useState<MemberAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login")
      return
    }

    let cancelled = false
    Promise.all([getUserStats(user.id, token), getMyRequests(token), getListings()])
      .then(([userStats, myRequests, allListings]) => {
        if (cancelled) return
        setStats(userStats)
        setRequests(myRequests)
        setListings(allListings)
      })
      .catch((error) => console.error("Couldn't load the dashboard:", error))
      .finally(() => !cancelled && setIsLoading(false))

    // A failure loading the account shouldn't block the rest of the dashboard.
    getMyAccount(user.id, token ?? undefined)
      .then((mine) => !cancelled && setAccount(mine))
      .catch(() => undefined)

    if (token) {
      // Listing requests they sent, and listings the JVA team made with them as the owner.
      getMyListings(token)
        .then((mine) => {
          if (cancelled) return
          setSubmissions(mine.submissions)
          setOwnedListings(mine.listings)
        })
        .catch(() => undefined)
    }

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, router, token, user])

  if (!isAuthenticated || !user) {
    return null
  }

  const fullName = properCase(user.fullName.trim())
  const firstName = fullName.split(" ")[0]
  const initials = fullName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("")
  const pending = requests.filter((request) => request.status === "pending").length
  // A listing request that has become one of their listings shows once, as the listing.
  const madeIntoListings = new Set(ownedListings.map((listing) => listing.sourceSubmissionId).filter(Boolean))
  const pendingSubmissions = submissions.filter((submission) => !madeIntoListings.has(submission.id))
  const badge = account ? accountBadge[account.status] : null
  const memberSince = account?.createdAt
    ? new Date(account.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null

  return (
    <main className="bg-white pb-24">
      <section className="bg-linear-to-b from-ivory to-white">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-2 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-9 text-white shadow-[0_24px_60px_-30px_rgb(14_17_22/0.6)] sm:px-10 sm:py-11">
            {/* Soft gold light and a fine grid, for depth without distraction. */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_left,black,transparent_70%)]"
            />

            <div className="relative flex flex-wrap items-center justify-between gap-8">
              <div className="flex min-w-0 items-center gap-5">
                <div className="hidden h-16 w-16 shrink-0 place-items-center rounded-full bg-linear-to-br from-gold to-gold-deep p-[2px] sm:grid">
                  <span className="grid h-full w-full place-items-center rounded-full bg-ink-soft font-display text-xl tracking-wide text-gold-soft">
                    {initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/60">{greeting(new Date().getHours())},</p>
                  <h1 className="mt-1 truncate font-display text-4xl leading-tight text-white sm:text-5xl">
                    {firstName}
                    <span className="text-gold">.</span>
                  </h1>
                  <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-white/70">
                    {pending
                      ? `${pending} of your requests ${pending === 1 ? "is" : "are"} with our team for review. We'll let you know as soon as there's news.`
                      : "Here's where your requests and opportunities stand today."}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-white/8 px-3 py-1.5 tracking-wide text-white/85 ring-1 ring-white/15">
                      {user.role}
                      {user.category ? ` · ${user.category}` : ""}
                    </span>
                    {badge ? (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 ${badge.className}`}>
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                        {badge.label}
                      </span>
                    ) : null}
                    {memberSince ? (
                      <span className="inline-flex items-center gap-1.5 px-1 text-white/55">
                        <FiCalendar aria-hidden="true" /> Member since {memberSince}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                <Link
                  href="/submit-request"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink shadow-[0_8px_24px_-8px_rgb(201_162_74/0.7)] transition hover:-translate-y-0.5 hover:bg-gold-soft sm:flex-none"
                >
                  <FiPlus aria-hidden="true" /> New request
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/8 hover:ring-white/50 sm:flex-none"
                >
                  <FiEdit2 aria-hidden="true" /> Edit profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {account && (account.status !== "active" || !account.profileCompleted || (account.role === "Investor" && !account.documents?.companyProfile)) ? (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div
            className={`relative flex flex-wrap items-center gap-5 overflow-hidden rounded-2xl border p-5 sm:p-6 ${
              account.status === "suspended" ? "border-red-200 bg-red-50/70" : "border-gold/40 bg-linear-to-r from-gold-soft/60 via-gold-soft/25 to-white"
            }`}
          >
            <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${account.status === "suspended" ? "bg-red-400" : "bg-gold"}`} />
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg ${
                account.status === "suspended" ? "bg-red-100 text-red-700" : "bg-ink text-gold"
              }`}
            >
              {account.status === "suspended" ? <FiAlertCircle aria-hidden="true" /> : <FiClock aria-hidden="true" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">
                {account.status === "suspended" ? "Your account is suspended" : account.profileCompleted ? "Almost there" : "One step left"}
              </p>
              <p className="mt-0.5 text-sm text-muted">
                {account.status === "suspended"
                  ? "Please contact info@jointventureassets.com and our team will help."
                  : !account.profileCompleted
                    ? "Finish your profile so our team can approve your account."
                    : account.role === "Investor" && !account.documents?.companyProfile
                      ? "Upload your company profile so our team can approve your account."
                      : "Your account is awaiting approval. Our team usually reviews new profiles within 48 hours."}
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink-soft"
            >
              {account.profileCompleted ? "View my profile" : "Complete my profile"}
              <FiArrowRight aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl space-y-8 px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<FiFileText aria-hidden="true" />} label="My requests" value={isLoading ? "…" : requests.length} note={`${pending} under review`} />
          <StatCard icon={<FiCheckCircle aria-hidden="true" />} label="Accepted" value={isLoading ? "…" : (stats?.matched ?? 0)} note="Requests our team has taken on" />
          <StatCard icon={<FiCompass aria-hidden="true" />} label="Open opportunities" value={isLoading ? "…" : (stats?.availableMatches ?? 0)} note="Accepted requests from other members" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <SectionCard title="My requests" subtitle="What you've asked our team to find, and where each one stands." action={{ label: "New request", href: "/submit-request" }}>
            {isLoading ? (
              <div className="space-y-3" aria-busy="true">
                {[0, 1, 2].map((index) => <div key={index} className="h-20 animate-pulse rounded-2xl border border-line bg-ivory/70" />)}
              </div>
            ) : requests.length > 0 ? (
              <RequestList requests={requests} />
            ) : (
              <EmptyState
                icon={<FiPlus aria-hidden="true" className="h-5 w-5" />}
                title="No requests yet"
                description="Tell us about your land, or what you're looking for, and we'll find the right partners."
                action={{ label: "Create a request", href: "/submit-request" }}
              />
            )}
          </SectionCard>

          <SectionCard title="Recommended for you" subtitle="Live listings picked for your profile." action={{ label: "All listings", href: "/listings" }}>
            {listings ? (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {recommendedFor(user.role, listings).slice(0, 2).map((listing) => (
                  <li key={listing.id}>
                    <ListingCard listing={listing} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <ListingCardSkeleton />
                <ListingCardSkeleton />
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard title="My property listings" subtitle="Your listings on the platform, and properties you've submitted for review." action={{ label: "List a property", href: "/listings/submit" }}>
          {ownedListings.length || pendingSubmissions.length ? (
            <div className="space-y-4">
              {ownedListings.length ? <OwnedListingList listings={ownedListings} /> : null}
              {pendingSubmissions.length ? <SubmissionList submissions={pendingSubmissions} /> : null}
            </div>
          ) : (
            <EmptyState
              icon={<FiHome aria-hidden="true" className="h-5 w-5" />}
              title="Nothing listed yet"
              description="Have land or property for a joint venture or sale? Submit it and follow its review here."
              action={{ label: "List your property", href: "/listings/submit" }}
            />
          )}
        </SectionCard>

        <QuickActions />
      </div>
    </main>
  )
}
