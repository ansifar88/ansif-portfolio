import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const rateLimitMap = new Map<string, RateLimitState>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = rateLimitMap.get(key);

  if (!current || now > current.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  rateLimitMap.set(key, current);

  return current.count > MAX_REQUESTS;
}

async function sendViaResend(payload: { name: string; email: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return { sent: false, reason: "missing_config" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `Portfolio contact: ${payload.name}`,
      html: `<p><strong>Name:</strong> ${payload.name}</p><p><strong>Email:</strong> ${payload.email}</p><p><strong>Message:</strong></p><p>${payload.message.replace(/\n/g, "<br/>")}</p>`
    })
  });

  if (!response.ok) {
    return { sent: false, reason: "provider_error" as const };
  }

  return { sent: true as const };
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;

  const name = body.name?.trim() || "";
  const email = body.email?.trim() || "";
  const message = body.message?.trim() || "";
  const company = body.company?.trim() || "";

  if (company) {
    return NextResponse.json({ ok: true, message: "Thanks for your message." });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, message: "Please fill in all fields." },
      { status: 400 }
    );
  }

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { ok: false, message: "Name should be between 2 and 80 characters." },
      { status: 400 }
    );
  }

  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { ok: false, message: "Message should be between 10 and 2000 characters." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again after a few minutes." },
      { status: 429 }
    );
  }

  const result = await sendViaResend({ name, email, message });

  if (result.sent) {
    return NextResponse.json({
      ok: true,
      message: "Thanks for reaching out. Your message was sent successfully."
    });
  }

  if (result.reason === "provider_error") {
    return NextResponse.json(
      { ok: false, message: "Unable to deliver message now. Please email me directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks for reaching out. Message captured successfully."
  });
}
