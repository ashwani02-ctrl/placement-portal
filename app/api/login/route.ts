import { cookies } from "next/headers";

export async function POST(req: Request) {

    try {
        const body = await req.json();

        const res = await fetch(`${process.env.DJANGO_URL}/api/auth/login/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );


        let data;
        try {
            data = await res.json();
        } catch {
            return new Response(
                JSON.stringify({ error: "Invalid response from backend" }),
                { status: 500 }
            );
        }

        const response = new Response(JSON.stringify(data), {
            status: res.status,
        });


        if (res.ok) {
            const cookieStore = await cookies();

            cookieStore.set("token", data.access, {
                httpOnly: true,
                path: "/",
            });
        }
        return response;

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
        });
    }
}