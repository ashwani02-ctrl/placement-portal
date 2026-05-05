"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login(email: string, password: string) {
        const res = await fetch(`/api/login/`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        console.log(res);

        if (!res.ok) {
            alert("Login Failed!");
            return;
        }

        router.push("/dashboard");

    }

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
            <Card className="w-100">

                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input value={email}
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={() => login(email, password)}
                        className="w-full">Login</Button>

                </CardContent>
            </Card>
            {/* <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2"
            />

            <input
                placeholder="password"
                value={password}
                minLength={1}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2"
            />

            <button
                onClick={() => login(email, password)}
                className="bg-black text-white p-2"

            >Login
            </button> */}
        </div>
    )
}

export default Login;