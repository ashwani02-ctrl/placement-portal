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

        let data;
        try {
            data = await res.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid response from backend" },
                { status: 500 }
            );
        }

        const response = NextResponse.json(data, {
            status: res.status,
        });

        if (res.ok) {
            response.cookies.set("token", data.access, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                secure: false,
            });
        }

        return response;

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}