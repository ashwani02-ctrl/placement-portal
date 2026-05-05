"use client";

import { useState } from "react";
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function CreateJobForm() {
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState<Date | undefined>();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const payload = {
            title: e.target.title.value,
            description,
            location: e.target.location.value,
            salary: e.target.salary.value,
            deadline,
        };

        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // 🔥 important for cookies/session auth
                body: JSON.stringify(payload),
            });

            const raw = await res.text();

            let data;
            try {
                data = JSON.parse(raw); // 👈 try parsing JSON
            } catch {
                console.error("Raw response:", raw); // 🔥 THIS is what you need to see
                throw new Error("Server returned HTML instead of JSON");
            }

            if (!res.ok) {
                throw new Error(data?.message || "Something went wrong");
            }

            console.log("Success:", data);

            // Optional UX improvements
            alert("Job posted successfully");
            e.target.reset();

        } catch (error: any) {
            console.error("Error:", error.message);
            alert(error.message);
        }
    };

    //   if (!editor) return null;

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <Card className="shadow-xl border rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        Post a Job
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Fill in the details to publish a new job opening
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                                name="title"
                                placeholder="e.g. Frontend Developer"
                                required
                            />
                        </div>

                        {/* Location + Salary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    name="location"
                                    placeholder="e.g. Delhi / Remote"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Salary</Label>
                                <Input
                                    name="salary"
                                    placeholder="e.g. ₹6-10 LPA"
                                />
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="space-y-2">
                            <Label>Application Deadline</Label>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deadline
                                            ? format(deadline, "PPP")
                                            : "Pick a deadline"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={deadline}
                                        onSelect={setDeadline}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Description (TipTap Editor) */}
                        <div className="space-y-2">
                            <Label>Job Description</Label>

                            <div className="border rounded-2xl overflow-hidden bg-background">
                                <SimpleEditor
                                    value={description}
                                    onChange={setDescription}
                                />

                            </div>



                            <p className="text-xs text-muted-foreground">
                                Add responsibilities, requirements, and benefits.
                            </p>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end">
                            <Button type="submit" className="px-6">
                                Publish Job
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}