import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.DJANGO_URL}/job/jobs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" }, // 🔥 force JSON
    });

  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ message: err.message }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${process.env.DJANGO_URL}/job/jobs/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store", // 👈 important for fresh data
    })

    // Handle non-JSON (you faced this earlier)
    const text = await res.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error("Invalid JSON from backend:", text)
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error("API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    )
  }
}