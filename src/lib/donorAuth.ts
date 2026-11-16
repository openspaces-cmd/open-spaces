// Simple shared-password gate for the internal donor report.
// Set DONOR_REPORT_PASSWORD in Vercel; share it only with the people who
// should see giving data. The cookie holds a hash, never the password.

import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export const DONOR_COOKIE = "os_donor_report";

const password = () => process.env.DONOR_REPORT_PASSWORD || "";

export const isDonorAuthConfigured = () => password().length >= 8;

export const hashPassword = (pw: string) =>
  createHash("sha256").update(`open-spaces-donors:${pw}`).digest("hex");

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
};

export const checkPassword = (attempt: string) =>
  isDonorAuthConfigured() && safeEqual(hashPassword(attempt), hashPassword(password()));

export async function isDonorAuthed() {
  if (!isDonorAuthConfigured()) return false;
  const value = (await cookies()).get(DONOR_COOKIE)?.value ?? "";
  return safeEqual(value, hashPassword(password()));
}
