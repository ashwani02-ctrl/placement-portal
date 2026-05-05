"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const controller = new AbortController();
    const timeout = 10 * 60 * 1000; // 10 minutes

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    async function login(email: string, password: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/login/`, {
                method: "POST",
                // credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                signal: controller.signal,
            });
            console.log(res);

            if (!res.ok) {
                alert("Login Failed!");
                return;
            }

            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md shadow-lg border">

                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold">
                        Login
                    </CardTitle>
                    <CardDescription>
                        Enter your email and password to continue
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            login(email, password)
                        }}
                        className="space-y-4"
                    >

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Button */}
                        <Button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Login
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;