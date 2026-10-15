import { NextResponse } from "next/server";

/** The admin dashboard runs on another port, so the demo inbox allows cross-origin calls. */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

export function preflight() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
