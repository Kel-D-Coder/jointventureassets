"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { FiCheckCircle, FiCompass, FiFileText, FiHome, FiPlus } from "react-icons/fi"
import { RootState } from "@/store/store"
import { getMyAccount, getUserStats } from "@/lib/api/auth"
import { getMyRequests } from "@/lib/api/requests"
import { getListings } from "@/lib/api/listings"
import { getMySubmissions } from "@/lib/api/inbox"
import SubmissionList from "@/components/dashboard/SubmissionList"
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

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats>()
  const [requests, setRequests] = useState<PartnerRequest[]>([])
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [submissions, setSubmissions] = useState<ListingSubmission[]>([])
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
    Promise.all([getUserStats(user.id), getMyRequests(token), getListings()])
      .then(([userStats, myRequests, allListings]) => {
        if (cancelled) return
        setStats(userStats)
        setRequests(myRequests)
        setListings(allListings)
      })
      .catch((error) => console.error("Couldn't load the dashboard:", error))
      .finally(() => !cancelled && setIsLoading(false))

    // Listing submissions live in the shared demo inbox; a failure there shouldn't block the rest.
    getMyAccount(user.id)
      .then((mine) => !cancelled && setAccount(mine))
      .catch(() => undefined)

    getMySubmissions(user.email)
      .then((mine) => !cancelled && setSubmissions(mine))
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, router, token, user])

  if (!isAuthenticated || !user) {
    return null
  }

  const firstName = user.fullName.split(" ")[0]
  const pending = requests.filter((request) => request.status === "pending").length

  return (
    <main className="bg-white pb-24">
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 py-12 sm:px-6 lg:px-8">
          <div>
            <p className="eyebrow text-gold-deep">
              {user.role}
              {user.category ? ` · ${user.category}` : ""}
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Welcome back, {firstName}</h1>
            <p className="mt-3 text-muted">
              {pending
                ? `${pending} of your requests ${pending === 1 ? "is" : "are"} with our team for review.`
                : "Here's where your requests and opportunities stand."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/submit-request" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-ink/85">
              <FiPlus aria-hidden="true" /> New request
            </Link>
            <Link href="/dashboard/profile" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-bold text-ink hover:border-ink">
              Edit profile
            </Link>
          </div>
        </div>
      </section>

      {account && (account.status !== "active" || !account.profileCompleted || (account.role === "Investor" && !account.documents?.companyProfile)) ? (
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold-soft/40 p-5">
            <p className="text-sm text-ink">
              {account.status === "suspended"
                ? "Your account is suspended. Please contact info@jointventureassets.com."
                : !account.profileCompleted
                  ? "Finish your profile so our team can approve your account."
                  : account.role === "Investor" && !account.documents?.companyProfile
                    ? "Upload your company profile so our team can approve your account."
                    : "Your account is awaiting approval. Our team usually reviews new profiles within 48 hours."}
            </p>
            <Link href="/dashboard/profile" className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-ink/85">
              {account.profileCompleted ? "View my profile" : "Complete my profile"}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl space-y-8 px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<FiFileText aria-hidden="true" />} label="My requests" value={isLoading ? "…" : requests.length} note={`${pending} under review`} />
          <StatCard icon={<FiCheckCircle aria-hidden="true" />} label="Accepted" value={isLoading ? "…" : (stats?.matched ?? 0)} note="Requests our team has taken on" />
          <StatCard icon={<FiCompass aria-hidden="true" />} label="Open opportunities" value={isLoading ? "…" : (stats?.availableMatches ?? 0)} note="Accepted requests from other members" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <SectionCard title="My requests" action={{ label: "New request", href: "/submit-request" }}>
            {isLoading ? (
              <div className="space-y-3" aria-busy="true">
                {[0, 1, 2].map((index) => <div key={index} className="h-16 animate-pulse rounded-xl bg-ivory" />)}
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

          <SectionCard title="Recommended for you" action={{ label: "All listings", href: "/listings" }}>
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

        <SectionCard title="My property listings" action={{ label: "List a property", href: "/listings/submit" }}>
          {submissions.length ? (
            <SubmissionList submissions={submissions} />
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
