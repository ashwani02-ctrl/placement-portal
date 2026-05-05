"use client"

import React, { useEffect, useState } from "react"
import CreateJobButton from "./create-jobbtn"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Job } from "./columns"

function page() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("/api/jobs", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })
                console.log("before json")
                const json = await res.json()
                console.log("after json")

                setJobs(json.data) // 👈 IMPORTANT
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [])

    return (
        <div className="p-6 space-y-6">
            <CreateJobButton />

            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable columns={columns} data={jobs} />
            )}
        </div>
    )
}

export default page;