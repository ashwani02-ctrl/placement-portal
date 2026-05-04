import { cookies } from "next/headers";

export async function POST() {
  try {
    // call Django logout API
    await fetch(`${process.env.DJANGO_URL}/api/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // clear cookie
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      path: "/",
      expires: new Date(0), // delete cookie
    });

    return new Response(JSON.stringify({ message: "Logged out" }), {
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Logout failed" }), {
      status: 500,
    });
  }
}