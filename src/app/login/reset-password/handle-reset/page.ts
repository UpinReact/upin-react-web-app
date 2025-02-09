
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token"); // Extract the token
  const type = searchParams.get("type"); // Extract the type (e.g., "recovery")

  if (type === "recovery" && token) {
    // Redirect to your app with the token
    return NextResponse.redirect(`upin://auth/callback?token=${token}`);
  }

  // Handle invalid requests
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}