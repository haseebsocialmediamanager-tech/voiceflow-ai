import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

type VFUser = { id: string; name: string; email: string; phone: string; hash: string; plan: string; createdAt: string };

declare global {
  // eslint-disable-next-line no-var
  var _vfUsers: Map<string, VFUser> | undefined;
}

// Shared with login route via globalThis (resets on cold start — use a real DB in production)
if (!globalThis._vfUsers) {
  globalThis._vfUsers = new Map();
}
const users = globalThis._vfUsers;

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name?.trim()) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    if (!email?.includes("@")) return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    if (!phone || phone.length < 7) return NextResponse.json({ error: "Valid phone number is required." }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();
    if (users.has(normalizedEmail)) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hash = createHash("sha256").update(password + normalizedEmail).digest("hex");
    const user: VFUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      hash,
      plan: "free",
      createdAt: new Date().toISOString(),
    };

    users.set(normalizedEmail, user);

    const { hash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
