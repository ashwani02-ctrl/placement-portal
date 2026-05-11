"use client";

import { useEffect, useState } from "react";

export default function ResumePreview() {
    const [resume, setResume] = useState<any>(null);

    useEffect(() => {
        const storedData = localStorage.getItem("resumeData");

        if (storedData) {
            setResume(JSON.parse(storedData));
        }
    }, []);

    if (!resume) {
        return <div className="p-10">No resume data found.</div>;
    }

    const generatePDF = async () => {
        const response = await fetch("/api/pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resume),
        });

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "resume.pdf";

        a.click();

        window.URL.revokeObjectURL(url);
    };

    const formatDate = (iso: string) => {
        if (!iso) return "";

        const [y, m, d] = iso.split("-");

        return `${d}/${m}/${y}`;
    };

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">

            {/* Resume Container */}
            <div className="max-w-5xl mx-auto">

                {/* Resume Paper */}
                <div className="bg-white border border-slate-300 shadow-xl rounded-md p-12 min-h-[1200px]">

                    {/* Name */}
                    <h1 className="text-2xl flex justify-center  text-slate-800">
                        {resume.name}
                    </h1>

                    {/* Contact & Social Media */}
                    <div className="mt-3 flex flex-wrap justify-center items-center text-sm text-slate-700">

                        {resume.phone && <span>{resume.phone}</span>}

                        {resume.phone && resume.email && (
                            <span className="mx-2 text-slate-400">|</span>
                        )}

                        {resume.email && <span>{resume.email}</span>}

                        {resume.socialMedia && (
                            <>
                                <span className="mx-2 text-slate-400">|</span>

                                <div className="flex items-center flex-wrap">
                                    {resume.socialMedia
                                        .replace(/<[^>]+>/g, "")
                                        .split(/\s+/)
                                        .filter(Boolean)
                                        .map((link: string, index: number, array: string[]) => (
                                            <div
                                                key={index}
                                                className="flex items-center"
                                            >
                                                <a
                                                    href={
                                                        link.startsWith("http")
                                                            ? link
                                                            : `https://${link}`
                                                    }
                                                    target="_blank"
                                                    className="underline text-slate-700 hover:text-blue-600"
                                                >
                                                    {link}
                                                </a>

                                                {index !== array.length - 1 && (
                                                    <span className="mx-2 text-slate-400">
                                                        |
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}

                    </div>

                    {/* Summary */}
                    {resume.summary && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold border-b pb-2 mb-3 text-slate-800">
                                Summary
                            </h2>

                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: resume.summary,
                                }}
                            />
                        </div>
                    )}

                    {/* Education */}
                    {resume.educationEntries?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold border-b pb-2 mb-5 text-slate-800">
                                Education
                            </h2>

                            <div className="space-y-6">
                                {resume.educationEntries.map((edu: any) => (
                                    <div key={edu.id} className="pb-4">
                                        <div className="flex justify-between items-start">

                                            {/* Left */}
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 leading-tight">
                                                    {edu.title}
                                                </h3>

                                                <p className="text-slate-700 leading-tight">
                                                    {edu.organisation}
                                                </p>
                                            </div>

                                            {/* Right */}
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500">
                                                    {edu.from && formatDate(edu.from)}{" "}
                                                    -{" "}
                                                    {edu.ongoing
                                                        ? "Present"
                                                        : edu.to
                                                            ? formatDate(edu.to)
                                                            : ""}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {edu.city}, {edu.country}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="mt-3 prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: edu.subjects,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Experience */}
                    {resume.experienceEntries?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold border-b pb-2 mb-5 text-slate-800">
                                Experience
                            </h2>

                            <div className="space-y-6">
                                {resume.experienceEntries.map((exp: any) => (
                                    <div
                                        key={exp.id}
                                        className="pb-4"
                                    >
                                        <div className="flex justify-between items-start">

                                            {/* Left */}
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 leading-tight">
                                                    {exp.occupation}
                                                </h3>

                                                <p className="text-slate-700 leading-tight">
                                                    {exp.employer}
                                                </p>
                                            </div>

                                            {/* Right */}
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500">
                                                    {exp.from && formatDate(exp.from)}{" "}
                                                    -{" "}
                                                    {exp.ongoing
                                                        ? "Present"
                                                        : exp.to
                                                            ? formatDate(exp.to)
                                                            : ""}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {exp.city}, {exp.country}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="mt-3 prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: exp.activities,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Skills */}
                    {resume.skills && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold border-b pb-2 mb-3 text-slate-800">
                                Skills
                            </h2>

                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: resume.skills,
                                }}
                            />
                        </div>
                    )}



                    {/* Custom Sections */}
                    {resume.miscFields?.map((field: any) => (
                        <div key={field.id} className="mt-8">
                            <h2 className="text-2xl font-semibold border-b pb-2 mb-3 text-slate-800">
                                {field.label}
                            </h2>

                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: field.value,
                                }}
                            />
                        </div>
                    ))}

                </div>

                {/* Generate PDF Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={generatePDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition"
                    >
                        Generate PDF
                    </button>
                </div>

            </div>
        </div >
    );
}