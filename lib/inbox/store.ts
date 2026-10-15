/**
 * Server-side storage for the demo inbox: one JSON file, seeded on first read.
 * Locally it lives in .demo-data/inbox.json (git-ignored); on Vercel, whose
 * file system is read-only, it falls back to the temp folder.
 *
 * This is a stand-in until the real backend is reconnected.
 */
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { seedInbox, seedSubmissions } from "@/lib/inbox/seed";
import { seedAccounts } from "@/lib/inbox/seedAccounts";
import type { InboxItem, PublicItem } from "@/lib/inbox/types";

const FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), "jva-demo-inbox.json")
  : path.join(process.cwd(), ".demo-data", "inbox.json");

/**
 * Brings an inbox file saved by an earlier version up to date: adds the demo
 * member accounts, the sample title documents and the sample JV enquiry
 * answers if they're missing.
 */
function upgrade(items: InboxItem[]): { items: InboxItem[]; changed: boolean } {
  let changed = false;
  if (!items.some((item) => item.kind === "account")) {
    items.push(...structuredClone(seedAccounts));
    changed = true;
  }
  for (const seed of seedSubmissions) {
    const item = items.find((candidate) => candidate.id === seed.id);
    if (item?.kind === "listing-submission" && !item.documents?.length && seed.documents?.length) {
      item.documents = structuredClone(seed.documents);
      changed = true;
    }
  }
  for (const seed of seedInbox) {
    if (seed.kind !== "enquiry" || !seed.jv) continue;
    const item = items.find((candidate) => candidate.id === seed.id);
    if (item?.kind === "enquiry" && !item.jv) {
      item.jv = structuredClone(seed.jv);
      changed = true;
    }
  }
  return { items, changed };
}

/** Accounts go out without their password. */
export function toPublic(item: InboxItem): PublicItem {
  if (item.kind !== "account") return item;
  const account: Omit<typeof item, "password"> & { password?: string } = { ...item };
  delete account.password;
  return account;
}

async function read(): Promise<InboxItem[]> {
  try {
    const { items, changed } = upgrade(JSON.parse(await fs.readFile(FILE, "utf8")) as InboxItem[]);
    if (changed) await write(items);
    return items;
  } catch {
    await write(seedInbox);
    return structuredClone(seedInbox);
  }
}

async function write(items: InboxItem[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(items, null, 2));
}

// Changes run one at a time, so two quick submissions can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();

function serial<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

export function listItems(): Promise<InboxItem[]> {
  return serial(async () => (await read()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function getItem(id: string): Promise<InboxItem | null> {
  return serial(async () => (await read()).find((item) => item.id === id) ?? null);
}

export function addItem(item: InboxItem): Promise<InboxItem> {
  return serial(async () => {
    const items = await read();
    items.push(item);
    await write(items);
    return item;
  });
}

/** Returns the updated item, or null when there's no item with that id. */
export function updateItem(id: string, patch: Partial<InboxItem>): Promise<InboxItem | null> {
  return serial(async () => {
    const items = await read();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = { ...items[index], ...patch, id, updatedAt: new Date().toISOString() } as InboxItem;
    items[index] = updated;
    await write(items);
    return updated;
  });
}

export function removeItem(id: string): Promise<boolean> {
  return serial(async () => {
    const items = await read();
    const remaining = items.filter((item) => item.id !== id);
    if (remaining.length === items.length) return false;
    await write(remaining);
    return true;
  });
}

export function resetInbox(): Promise<void> {
  return serial(() => write(seedInbox));
}
