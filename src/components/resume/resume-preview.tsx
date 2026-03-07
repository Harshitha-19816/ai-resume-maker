"use client";

import { ResumeData, ResumeTemplate } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface ResumePreviewProps {
    data: ResumeData;
    template: ResumeTemplate;
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
    const { personalInfo, experience, education, skills, projects } = data;

    if (template === "classic") return <ClassicTemplate data={data} />;
    if (template === "minimal") return <MinimalTemplate data={data} />;
    if (template === "professional") return <ProfessionalTemplate data={data} />;

    // Modern template (default)
    return (
        <div
            id="resume-preview"
            className="bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", lineHeight: "1.5" }}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
                <h1 className="text-2xl font-bold tracking-tight">
                    {personalInfo.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-indigo-100">
                    {personalInfo.email && (
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {personalInfo.email}
                        </span>
                    )}
                    {personalInfo.phone && (
                        <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {personalInfo.phone}
                        </span>
                    )}
                    {personalInfo.location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {personalInfo.location}
                        </span>
                    )}
                    {personalInfo.website && (
                        <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {personalInfo.website}
                        </span>
                    )}
                    {personalInfo.linkedin && (
                        <span className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3" /> {personalInfo.linkedin}
                        </span>
                    )}
                    {personalInfo.github && (
                        <span className="flex items-center gap-1">
                            <Github className="w-3 h-3" /> {personalInfo.github}
                        </span>
                    )}
                </div>
            </div>

            <div className="px-8 py-6 space-y-5">
                {/* Summary */}
                {personalInfo.summary && (
                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-200 pb-1 mb-2">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-200 pb-1 mb-2">
                            Experience
                        </h2>
                        <div className="space-y-3">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                            <p className="text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                                        </div>
                                        <span className="text-gray-500 text-xs whitespace-nowrap">
                                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    {exp.description.filter(d => d.trim()).length > 0 && (
                                        <ul className="mt-1 space-y-0.5 list-disc list-inside text-gray-700">
                                            {exp.description.filter(d => d.trim()).map((desc, i) => (
                                                <li key={i}>{desc}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-200 pb-1 mb-2">
                            Education
                        </h2>
                        <div className="space-y-2">
                            {education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                                        </h3>
                                        <p className="text-gray-600">{edu.institution}</p>
                                    </div>
                                    <span className="text-gray-500 text-xs whitespace-nowrap">
                                        {edu.startDate} — {edu.endDate}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-200 pb-1 mb-2">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-200 pb-1 mb-2">
                            Projects
                        </h2>
                        <div className="space-y-2">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                className="text-indigo-600 text-xs hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                ↗
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-gray-700">{project.description}</p>
                                    {project.technologies.length > 0 && (
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            Tech: {project.technologies.join(", ")}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

// Classic Template
function ClassicTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects } = data;
    return (
        <div
            id="resume-preview"
            className="bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl px-10 py-8"
            style={{ fontFamily: "'Times New Roman', serif", fontSize: "11px", lineHeight: "1.6" }}
        >
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                <h1 className="text-3xl font-bold tracking-wide uppercase">
                    {personalInfo.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-gray-600 text-xs">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>| {personalInfo.phone}</span>}
                    {personalInfo.location && <span>| {personalInfo.location}</span>}
                    {personalInfo.website && <span>| {personalInfo.website}</span>}
                    {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
                </div>
            </div>

            <div className="space-y-4">
                {personalInfo.summary && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Summary
                        </h2>
                        <p className="text-gray-700">{personalInfo.summary}</p>
                    </section>
                )}

                {experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Professional Experience
                        </h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between">
                                    <strong>{exp.position}</strong>
                                    <span className="text-gray-500 text-xs">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <div className="italic text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
                                <ul className="list-disc list-inside mt-1 text-gray-700 space-y-0.5">
                                    {exp.description.filter(d => d.trim()).map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="flex justify-between mb-1">
                                <div>
                                    <strong>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</strong>
                                    <span className="text-gray-600"> — {edu.institution}</span>
                                </div>
                                <span className="text-gray-500 text-xs">{edu.startDate} — {edu.endDate}</span>
                            </div>
                        ))}
                    </section>
                )}

                {skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Skills
                        </h2>
                        <p className="text-gray-700">{skills.join(" • ")}</p>
                    </section>
                )}

                {projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">
                            Projects
                        </h2>
                        {projects.map((p) => (
                            <div key={p.id} className="mb-2">
                                <strong>{p.name}</strong>
                                <p className="text-gray-700">{p.description}</p>
                                {p.technologies.length > 0 && (
                                    <p className="text-gray-500 text-xs">Technologies: {p.technologies.join(", ")}</p>
                                )}
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}

// Minimal Template
function MinimalTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects } = data;
    return (
        <div
            id="resume-preview"
            className="bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl px-12 py-10"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", lineHeight: "1.6" }}
        >
            <h1 className="text-3xl font-light tracking-tight text-gray-900">
                {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-gray-500 text-xs">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
            <div className="w-12 h-px bg-gray-300 my-5" />

            <div className="space-y-5">
                {personalInfo.summary && (
                    <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
                )}

                {experience.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Experience</h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-900">{exp.position} <span className="font-normal text-gray-500">at {exp.company}</span></span>
                                    <span className="text-gray-400 text-xs">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <ul className="mt-1 text-gray-600 space-y-0.5">
                                    {exp.description.filter(d => d.trim()).map((d, i) => <li key={i} className="before:content-['–'] before:mr-2 before:text-gray-300">{d}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Education</h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="flex justify-between mb-1">
                                <span className="text-gray-900">{edu.degree} in {edu.field} — <span className="text-gray-500">{edu.institution}</span></span>
                                <span className="text-gray-400 text-xs">{edu.startDate} – {edu.endDate}</span>
                            </div>
                        ))}
                    </section>
                )}

                {skills.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Skills</h2>
                        <p className="text-gray-600">{skills.join(", ")}</p>
                    </section>
                )}

                {projects.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Projects</h2>
                        {projects.map((p) => (
                            <div key={p.id} className="mb-2">
                                <span className="font-medium text-gray-900">{p.name}</span>
                                <p className="text-gray-600">{p.description}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}

// Professional Template
function ProfessionalTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects } = data;
    return (
        <div
            id="resume-preview"
            className="bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", lineHeight: "1.5" }}
        >
            <div className="flex">
                {/* Left Sidebar */}
                <div className="w-1/3 bg-slate-800 text-white p-6 min-h-[297mm]">
                    <h1 className="text-xl font-bold mb-1">{personalInfo.fullName || "Your Name"}</h1>

                    <div className="space-y-1.5 text-xs text-slate-300 mt-4">
                        {personalInfo.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{personalInfo.email}</p>}
                        {personalInfo.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{personalInfo.phone}</p>}
                        {personalInfo.location && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{personalInfo.location}</p>}
                        {personalInfo.website && <p className="flex items-center gap-1.5"><Globe className="w-3 h-3" />{personalInfo.website}</p>}
                        {personalInfo.linkedin && <p className="flex items-center gap-1.5"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</p>}
                        {personalInfo.github && <p className="flex items-center gap-1.5"><Github className="w-3 h-3" />{personalInfo.github}</p>}
                    </div>

                    {skills.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Skills</h3>
                            <div className="space-y-1">
                                {skills.map((skill, i) => (
                                    <div key={i} className="px-2 py-1 bg-slate-700 rounded text-xs">{skill}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Education</h3>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-2">
                                    <p className="font-semibold text-xs">{edu.degree}</p>
                                    <p className="text-slate-300 text-xs">{edu.field}</p>
                                    <p className="text-slate-400 text-xs">{edu.institution}</p>
                                    <p className="text-slate-500 text-xs">{edu.startDate} – {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Content */}
                <div className="flex-1 p-6 space-y-5">
                    {personalInfo.summary && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2">
                                Profile
                            </h2>
                            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2">
                                Experience
                            </h2>
                            {experience.map((exp) => (
                                <div key={exp.id} className="mb-3">
                                    <div className="flex justify-between">
                                        <strong>{exp.position}</strong>
                                        <span className="text-gray-500 text-xs">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                                    </div>
                                    <p className="text-gray-600 text-xs">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                                    <ul className="list-disc list-inside mt-1 text-gray-700 space-y-0.5">
                                        {exp.description.filter(d => d.trim()).map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    )}

                    {projects.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2">
                                Projects
                            </h2>
                            {projects.map((p) => (
                                <div key={p.id} className="mb-2">
                                    <strong>{p.name}</strong>
                                    <p className="text-gray-700">{p.description}</p>
                                    {p.technologies.length > 0 && (
                                        <p className="text-gray-500 text-xs">Tech: {p.technologies.join(", ")}</p>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
