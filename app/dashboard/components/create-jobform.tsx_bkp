"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie"
import dynamic from "next/dynamic";
import { toast } from "sonner"
import React, { useState } from "react";
import TiptapEditor from "./tiptapeditor";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldError,
    FieldContent
} from "@/components/ui/field"
import { useForm, Controller } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

export const jobSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title too long"),

    description: z
        .string()
        .min(10, "Job description is required"), // CKEditor returns HTML string

    skills: z
        .string()
        .min(2, "Enter at least one skill")
        .refine((val) => val.split(",").length >= 1, {
            message: "Skills must be comma separated",
        }),

    deadline: z
        .coerce.date()
    ,

    location: z.enum([
        "Delhi",
        "Mumbai",
        "Bangalore",
        "Hyderabad",
        "Chennai",
        "Pune",
        "Kolkata",
        "Noida",
    ]),

    salary: z
        .number()
        .min(0, "Salary must be positive")
        .max(10000000, "Salary too large"),
});

export function CreateJobForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<z.input<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: "",
            description: "",
            skills: "",
            deadline: undefined,
            location: "Delhi",
            salary: 0,
        },
    });

    // submit handler
    async function onSubmit(values: z.input<typeof jobSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                    <code>{JSON.stringify(values, null, 2)}</code>
                </pre>
            ),
            position: "top-center",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        });

        const token = Cookies.get("token");
        // toast(`token: ${token}`);

        try {
            const res = await fetch(`/api/jobs/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            const result = await res.json();


            if (res.status == 500) {
                toast.error(`${result.message}`, { position: "top-center" });
            }
            else if (!res.ok) {
                toast.error(result.message || "Job Creation failed");
                throw new Error(JSON.stringify(result));
            }
            else {
                toast("Job Created!", { position: "top-center" });
            }

        } catch (err) {
            console.error("Login error:", err);
        }
    }



    return (
        <div className={cn("flex flex-col gap-6 px-10 py-10", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create Job Form</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* <Form {...form}> */}
                    <form id="create-job-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>

                            {/* title Controller */}
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Job Title</FieldLabel>
                                        <Input {...field} placeholder="Enter job title" />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* Description Controller */}
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Job Description</FieldLabel>
                                        <TiptapEditor
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                        />
                                    </Field>
                                )}
                            />
                            {/* Skills Controller */}
                            <Controller
                                name="skills"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Skills</FieldLabel>
                                        <Input {...field} placeholder="react, node, express" />
                                    </Field>
                                )}
                            />

                            {/*  */}
                            <Controller
                                name="deadline"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Deadline</FieldLabel>

                                        <Input
                                            type="datetime-local"
                                            value={
                                                field.value
                                                    ? new Date(field.value as string | number | Date).toISOString().slice(0, 16)
                                                    : ""
                                            }
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />

                                    </Field>
                                )}
                            />
                            {/* location controller */}
                            <Controller
                                name="location"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Location</FieldLabel>
                                        <select {...field} className="border p-2 rounded">
                                            <option value="Delhi">Delhi</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Hyderabad">Hyderabad</option>
                                            <option value="Chennai">Chennai</option>
                                            <option value="Pune">Pune</option>
                                            <option value="Kolkata">Kolkata</option>
                                            <option value="Noida">Noida</option>
                                        </select>
                                    </Field>
                                )}
                            />
                            {/* salary Controller */}
                            <Controller
                                name="salary"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Salary</FieldLabel>
                                        <Input type="number" {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </Field>
                                )}
                            />

                            <Field>
                                <Button type="submit" form="create-job-form">Submit</Button>

                            </Field>
                        </FieldGroup>
                    </form>

                </CardContent>
            </Card>
            {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
        </div >
    )
}
