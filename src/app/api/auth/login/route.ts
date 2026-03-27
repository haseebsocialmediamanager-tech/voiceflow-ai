import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// Shared in-memory store — same module reference as signup (works within one serverless instance)
// For production, replace with a real database query
declare global {
  // eslint-disable-next-line no-var
  var _vfUsers: Map<string, { id: string; name: string; email: string; phone: string; hash: string; plan: string; createdAt: string }> | undefined;
}

// Use globalThis to share across hot reloads in development
if (!globalThis._vfUsers) {
  globalThis._vfUsers = new Map();
}
const users = globalThis._vfUsers;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email?.includes("@")) return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    if (!password) return NextResponse.json({ error: "Password is required." }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();
    const user = users.get(normalizedEmail);

    if (!user) {
      return NextResponse.json({ error: "No account found with this email. Please sign up first." }, { status: 404 });
    }

    const hash = createHash("sha256").update(password + normalizedEmail).digest("hex");
    if (hash !== user.hash) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const { hash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
