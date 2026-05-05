import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${process.env.DJANGO_URL}/api/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json(data, {
                status: res.status,
            });
        }

        // Set cookies for Next.js
        const cookieStore = await cookies();

        cookieStore.set("access", data.access, {
            httpOnly: true,
            secure: true,
            path: "/"
        });

        cookieStore.set("refresh", data.refresh, {
            httpOnly: true,
            secure: true,
            path: "/"
        });

        return NextResponse.json({ message: "Login successful" }, { status: 200 });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}