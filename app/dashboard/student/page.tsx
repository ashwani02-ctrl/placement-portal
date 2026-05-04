import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { DataTable } from "./data-table"
import { columns } from "./columns"
import { cookies } from 'next/headers'

export type Student = {
    id: string
    user: string
    email?: string
    phone: string
    course?: string
    batch?: string
}

async function getData(): Promise<Student[]> {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    if (!token?.value) {
        console.log("No token found")
        return []
    }
    console.log("TOKEN:", token?.value)

    try {
        const res = await fetch(`${process.env.DJANGO_URL}/student/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token?.value}`,
            },
            cache: "no-store", // ✅ important for fresh data
        })

        console.log("STATUS:", res.status)

        if (!res.ok) throw new Error("students GET error")

        const result = await res.json()

        console.log("RESPONSE:", result)

        return result.data


    } catch (err) {
        console.log("Error:", err)

        // ✅ FIXED fallback data
        return Array.from({ length: 10 }, () => ({
            id: crypto.randomUUID(),
            user: "demo_user",
            email: "demo@gmail.com",
            phone: "9000000000",
            course: "b.tech",
            batch: "2027",
        }))
    }
}

async function StudentPage() {
    const data = await getData()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Students</CardTitle>
            </CardHeader>

            <CardContent>
                <DataTable columns={columns} data={data} />
            </CardContent>
        </Card>


    )
}

export default StudentPage