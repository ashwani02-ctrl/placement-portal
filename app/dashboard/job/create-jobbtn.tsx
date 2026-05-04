"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

function CreateJobButton(){
    const router = useRouter();
    return (
        <div className="pt-2 pl-3 pb-2">
            <Button variant={'outline'}
            className="focus:ring-2 focus:ring-gray-400"
            onClick={()=>{router.push("/dashboard/job/create")}}>
                <PlusIcon/> Add New Job
            </Button>
        </div>
    )
}

export default CreateJobButton