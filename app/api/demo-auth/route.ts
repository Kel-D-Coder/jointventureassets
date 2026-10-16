/**
 * Demo sign-in for the website, against the member accounts in the demo inbox
 * (so the admin dashboard sees every sign-up). Passwords are stored as plain
 * text: this is a stand-in for the real auth API, not something to deploy.
 *
 * POST /api/demo-auth  { action: "login", email, password }
 *                      { action: "register", fullName, email, password, role, category }
 *                      { action: "google" }
 *                      { action: "account-exists", email }
 *                      { action: "reset-password", email, password }
 */
import { addItem, listItems, toPublic, updateItem } from "@/lib/inbox/store";
import { filled } from "@/lib/inbox/rules";
import type { MemberRole, StoredAccount } from "@/lib/inbox/types";
import { json, preflight } from "../demo-inbox/cors";

export const dynamic = "force-dynamic";

const ROLES: MemberRole[] = ["Landowner", "Investor", "Buyer"];

/** The account "Continue with Google" signs in as in demo mode. */
const GOOGLE_DEMO = { fullName: "Ada Nwankwo", email: "ada.nwankwo@gmail.com", role: "Landowner" as MemberRole, category: "Individual" };

const normalise = (email: unknown) => (typeof email === "string" ? email.trim().toLowerCase() : "");

async function findByEmail(email: string): Promise<StoredAccount | undefined> {
  return (await listItems()).find((item): item is StoredAccount => item.kind === "account" && item.email.toLowerCase() === email);
}

function newAccount(input: Pick<StoredAccount, "fullName" | "email" | "password" | "role" | "category"> & { phoneNumber?: string }): StoredAccount {
  const now = new Date().toISOString();
  return {
    ...input,
    id: `usr-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    kind: "account",
    phoneNumber: input.phoneNumber ?? "",
    profile: {},
    documents: {},
    profileCompleted: false,
    // New members can use the site straight away; the JVA team approves them from the dashboard.
    status: "pending",
    createdAt: now,
    updatedAt: now,
    lastActiveAt: now,
  };
}

async function signIn(account: StoredAccount) {
  if (account.status === "suspended") {
    return json({ message: "This account has been suspended. Please contact info@jointventureassets.com." }, 403);
  }
  const updated = await updateItem(account.id, { lastActiveAt: new Date().toISOString() } as Partial<StoredAccount>);
  return json(toPublic(updated ?? account));
}

export function OPTIONS() {
  return preflight();
}

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => ({}))) ?? {}) as Record<string, unknown>;
  const email = normalise(body.email);

  switch (body.action) {
    case "login": {
      const account = await findByEmail(email);
      if (!account || account.password !== body.password) return json({ message: "Invalid email or password." }, 401);
      return signIn(account);
    }

    case "register": {
      const role = body.role as MemberRole;
      if (!filled(body.fullName) || !email || typeof body.password !== "string" || body.password.length < 8) {
        return json({ message: "Please give your name, email and a password of at least 8 characters." }, 400);
      }
      if (!filled(body.phoneNumber)) return json({ message: "Please give a phone number we can reach you on." }, 400);
      if (!ROLES.includes(role)) return json({ message: "Please choose whether you're a landowner, investor or buyer." }, 400);
      if (await findByEmail(email)) return json({ message: "An account with this email already exists." }, 409);
      const account = newAccount({
        fullName: String(body.fullName).trim(),
        email,
        password: body.password,
        phoneNumber: String(body.phoneNumber).trim(),
        role,
        category: typeof body.category === "string" && body.category ? body.category : "Individual",
      });
      await addItem(account);
      return json(toPublic(account), 201);
    }

    case "google": {
      const existing = await findByEmail(GOOGLE_DEMO.email);
      if (existing) return signIn(existing);
      const account = newAccount({ ...GOOGLE_DEMO, password: Math.random().toString(36) });
      await addItem(account);
      return json(toPublic(account), 201);
    }

    case "account-exists":
      return (await findByEmail(email)) ? json({ exists: true }) : json({ message: "No account was found with that email." }, 404);

    case "reset-password": {
      const account = await findByEmail(email);
      if (!account) return json({ message: "No account was found with that email." }, 404);
      if (typeof body.password !== "string" || body.password.length < 8) return json({ message: "Your password needs at least 8 characters." }, 400);
      await updateItem(account.id, { password: body.password } as Partial<StoredAccount>);
      return json({ message: "Password reset successfully" });
    }

    default:
      return json({ message: "Unknown request." }, 400);
  }
}
