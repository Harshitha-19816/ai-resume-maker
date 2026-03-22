"use client";

import { ResumeData, ResumeTemplate } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface ResumePreviewProps {
    data: ResumeData;
    template: ResumeTemplate;
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
    if (template === "classic") return <ClassicTemplate data={data} />;
    if (template === "minimal") return <MinimalTemplate data={data} />;
    if (template === "professional") return <ProfessionalTemplate data={data} />;
    return <ModernTemplate data={data} />;
}

function getThemeStyles(data: ResumeData) {
    const theme = data.theme || ({} as Partial<typeof data.theme & {}>);
    const fontFamily = theme.fontFamily || "font-sans";
    
    // Map text classes to actual CSS sizes to ensure it works in PDF exports well
    // or just use tailwind classes. We'll use tailwind classes for font-family
    // but keep base size using style so it cascades properly.
    const sizeMap: Record<string, string> = {
        "text-xs": "10px",
        "text-sm": "12px",
        "text-base": "14px",
    };
    const fontSize = sizeMap[theme.fontSize || "text-xs"] || "10px";
    const headingBold = theme.headingBold !== false;
    const bulletStyle = theme.bulletStyle || "disc";
    
    return {
        fontFamilyClass: fontFamily,
        fontSizeStyle: { fontSize, lineHeight: "1.5" },
        headingClass: headingBold ? "font-bold" : "font-semibold",
        primaryColor: theme.primaryColor || "#4f46e5",
        ulStyle: { listStyleType: bulletStyle === "none" ? "none" : bulletStyle, paddingLeft: bulletStyle === "none" ? "0" : "1.2rem" }
    };
}

// Modern Template
function ModernTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects } = data;
    const { fontFamilyClass, fontSizeStyle, headingClass, ulStyle } = getThemeStyles(data);

    return (
        <div
            id="resume-preview"
            className={`bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl ${fontFamilyClass}`}
            style={fontSizeStyle}
        >
            <div className="bg-gradient-to-r from-violet-600 to-teal-600 text-white px-8 py-6">
                <h1 className={`text-2xl tracking-tight ${headingClass}`}>
                    {personalInfo.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-violet-100">
                    {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {personalInfo.location}</span>}
                    {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {personalInfo.website}</span>}
                    {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {personalInfo.linkedin}</span>}
                    {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" /> {personalInfo.github}</span>}
                </div>
            </div>

            <div className="px-8 py-6 space-y-5">
                {personalInfo.summary && (
                    <section>
                        <h2 className={`text-sm text-violet-600 uppercase tracking-wider border-b border-violet-200 pb-1 mb-2 ${headingClass}`}>
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                    </section>
                )}

                {experience.length > 0 && (
                    <section>
                        <h2 className={`text-sm text-violet-600 uppercase tracking-wider border-b border-violet-200 pb-1 mb-2 ${headingClass}`}>
                            Experience
                        </h2>
                        <div className="space-y-3">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`text-gray-900 ${headingClass}`}>{exp.position}</h3>
                                            <p className="text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                                        </div>
                                        <span className="text-gray-500 text-xs whitespace-nowrap">
                                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    {exp.description.filter(d => d.trim()).length > 0 && (
                                        <ul className="mt-1 space-y-0.5 text-gray-700" style={ulStyle}>
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

                {education.length > 0 && (
                    <section>
                        <h2 className={`text-sm text-violet-600 uppercase tracking-wider border-b border-violet-200 pb-1 mb-2 ${headingClass}`}>
                            Education
                        </h2>
                        <div className="space-y-2">
                            {education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className={`text-gray-900 ${headingClass}`}>
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

                {skills.length > 0 && (
                    <section>
                        <h2 className={`text-sm text-violet-600 uppercase tracking-wider border-b border-violet-200 pb-1 mb-2 ${headingClass}`}>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded text-xs font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {projects.length > 0 && (
                    <section>
                        <h2 className={`text-sm text-violet-600 uppercase tracking-wider border-b border-violet-200 pb-1 mb-2 ${headingClass}`}>
                            Projects
                        </h2>
                        <div className="space-y-2">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-gray-900 ${headingClass}`}>{project.name}</h3>
                                        {project.link && (
                                            <a href={project.link} className="text-violet-600 text-xs hover:underline" target="_blank" rel="noopener noreferrer">↗</a>
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
    const { fontFamilyClass, fontSizeStyle, headingClass, ulStyle } = getThemeStyles(data);

    return (
        <div
            id="resume-preview"
            className={`bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl px-10 py-8 ${fontFamilyClass}`}
            style={{ ...fontSizeStyle, fontFamily: data.theme?.fontFamily ? undefined : "'Times New Roman', serif" }}
        >
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                <h1 className={`text-3xl tracking-wide uppercase ${headingClass}`}>
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
                        <h2 className={`text-sm uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 ${headingClass}`}>
                            Summary
                        </h2>
                        <p className="text-gray-700">{personalInfo.summary}</p>
                    </section>
                )}

                {experience.length > 0 && (
                    <section>
                        <h2 className={`text-sm uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 ${headingClass}`}>
                            Professional Experience
                        </h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between">
                                    <strong className={headingClass}>{exp.position}</strong>
                                    <span className="text-gray-500 text-xs">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <div className="italic text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
                                <ul className="mt-1 text-gray-700 space-y-0.5" style={ulStyle}>
                                    {exp.description.filter(d => d.trim()).map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {education.length > 0 && (
                    <section>
                        <h2 className={`text-sm uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 ${headingClass}`}>
                            Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="flex justify-between mb-1">
                                <div>
                                    <strong className={headingClass}>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</strong>
                                    <span className="text-gray-600"> — {edu.institution}</span>
                                </div>
                                <span className="text-gray-500 text-xs">{edu.startDate} — {edu.endDate}</span>
                            </div>
                        ))}
                    </section>
                )}

                {skills.length > 0 && (
                    <section>
                        <h2 className={`text-sm uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 ${headingClass}`}>
                            Skills
                        </h2>
                        <p className="text-gray-700">{skills.join(" • ")}</p>
                    </section>
                )}

                {projects.length > 0 && (
                    <section>
                        <h2 className={`text-sm uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 ${headingClass}`}>
                            Projects
                        </h2>
                        {projects.map((p) => (
                            <div key={p.id} className="mb-2">
                                <strong className={headingClass}>{p.name}</strong>
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
    const { fontFamilyClass, fontSizeStyle, headingClass, ulStyle } = getThemeStyles(data);

    return (
        <div
            id="resume-preview"
            className={`bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl px-12 py-10 ${fontFamilyClass}`}
            style={fontSizeStyle}
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
                        <h2 className={`text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 ${headingClass}`}>Experience</h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between">
                                    <span className={`text-gray-900 ${headingClass}`}>{exp.position} <span className="font-normal text-gray-500">at {exp.company}</span></span>
                                    <span className="text-gray-400 text-xs">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <ul className="mt-1 text-gray-600 space-y-0.5" style={ulStyle}>
                                    {exp.description.filter(d => d.trim()).map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {education.length > 0 && (
                    <section>
                        <h2 className={`text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 ${headingClass}`}>Education</h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="flex justify-between mb-1">
                                <span className={`text-gray-900 ${headingClass}`}>{edu.degree} in {edu.field} — <span className="text-gray-500">{edu.institution}</span></span>
                                <span className="text-gray-400 text-xs">{edu.startDate} – {edu.endDate}</span>
                            </div>
                        ))}
                    </section>
                )}

                {skills.length > 0 && (
                    <section>
                        <h2 className={`text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 ${headingClass}`}>Skills</h2>
                        <p className="text-gray-600">{skills.join(", ")}</p>
                    </section>
                )}

                {projects.length > 0 && (
                    <section>
                        <h2 className={`text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 ${headingClass}`}>Projects</h2>
                        {projects.map((p) => (
                            <div key={p.id} className="mb-2">
                                <span className={`text-gray-900 ${headingClass}`}>{p.name}</span>
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
    const { fontFamilyClass, fontSizeStyle, headingClass, ulStyle } = getThemeStyles(data);

    return (
        <div
            id="resume-preview"
            className={`bg-white text-gray-900 w-[210mm] min-h-[297mm] mx-auto shadow-2xl flex ${fontFamilyClass}`}
            style={fontSizeStyle}
        >
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
                        <h3 className={`text-xs uppercase tracking-wider text-slate-400 mb-2 ${headingClass}`}>Skills</h3>
                        <div className="space-y-1">
                            {skills.map((skill, i) => (
                                <div key={i} className="px-2 py-1 bg-slate-700 rounded text-xs">{skill}</div>
                            ))}
                        </div>
                    </div>
                )}

                {education.length > 0 && (
                    <div className="mt-6">
                        <h3 className={`text-xs uppercase tracking-wider text-slate-400 mb-2 ${headingClass}`}>Education</h3>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-2">
                                <p className={`text-xs ${headingClass}`}>{edu.degree}</p>
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
                        <h2 className={`text-sm text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2 ${headingClass}`}>
                            Profile
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                    </section>
                )}

                {experience.length > 0 && (
                    <section>
                        <h2 className={`text-sm text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2 ${headingClass}`}>
                            Experience
                        </h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between">
                                    <strong className={headingClass}>{exp.position}</strong>
                                    <span className="text-gray-500 text-xs">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <p className="text-gray-600 text-xs">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                                <ul className="mt-1 text-gray-700 space-y-0.5" style={ulStyle}>
                                    {exp.description.filter(d => d.trim()).map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {projects.length > 0 && (
                    <section>
                        <h2 className={`text-sm text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2 ${headingClass}`}>
                            Projects
                        </h2>
                        {projects.map((p) => (
                            <div key={p.id} className="mb-2">
                                <strong className={headingClass}>{p.name}</strong>
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
    );
}
