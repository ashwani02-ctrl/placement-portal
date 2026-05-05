import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ get token from Authorization header (NOT cookies)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    console.log("RAW AUTH HEADER:", authHeader);
    console.log("TOKEN ONLY:", authHeader?.split(" ")[1]);
    console.log("ALL HEADERS:", Object.fromEntries(req.headers.entries()));

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const djangoRes = await fetch(
      `${process.env.DJANGO_URL}/job/jobs/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await djangoRes.json();

    return NextResponse.json(data, {
      status: djangoRes.status,
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}