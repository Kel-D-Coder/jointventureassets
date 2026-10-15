import { newId, simulate, type ContactSubmission } from "@/lib/api/mock";

/** POST /contact/create */
export function sendContactMessage(input: Omit<ContactSubmission, "id" | "createdAt">): Promise<{ message: string }> {
  return simulate((db) => {
    db.contacts.push({ ...input, id: newId("msg"), createdAt: new Date().toISOString() });
    return { message: "Thank you! Your message has been sent. We'll get back to you soon." };
  });
}
