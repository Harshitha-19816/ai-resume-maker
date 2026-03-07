import { ResumeData } from "@/types/resume";

export const SAMPLE_RESUME_DATA: ResumeData = {
    personalInfo: {
        fullName: "Alexander Rossi",
        email: "alex.rossi@email.com",
        phone: "+1 (555) 234-5678",
        location: "San Francisco, CA",
        website: "alexrossi.dev",
        linkedin: "linkedin.com/in/alexrossi",
        github: "github.com/alexrossi",
        summary:
            "Strategic Senior Product Manager with 8+ years of experience leading cross-functional teams to build customer-first products. Known for increasing user retention by 45% and generating $2M+ in new ARR. Passionate about data-driven product development and scalable design systems.",
    },
    experience: [
        {
            id: "exp-1",
            company: "TechFlow Solutions",
            position: "Senior Product Manager",
            location: "San Francisco, CA",
            startDate: "Jan 2021",
            endDate: "",
            current: true,
            description: [
                "Led a cross-functional team of 12 to deliver the company's flagship analytics platform, resulting in 150% increase in enterprise adoption",
                "Increased customer retention by 45% through data-driven product improvements and A/B testing initiatives",
                "Managed a $3M product budget, reducing costs by 20% while maintaining feature velocity",
            ],
        },
        {
            id: "exp-2",
            company: "InnovateTech Inc.",
            position: "Product Manager",
            location: "New York, NY",
            startDate: "Mar 2018",
            endDate: "Dec 2020",
            current: false,
            description: [
                "Launched 4 key features that drove App Store ratings from 3.8 to 4.6 stars with over 10K reviews",
                "Collaborated with design and engineering teams to ship a real-time collaboration feature used by 50K+ users",
                "Defined product roadmap aligned with business goals, resulting in 30% revenue growth year over year",
            ],
        },
    ],
    education: [
        {
            id: "edu-1",
            institution: "Stanford University",
            degree: "Master of Business Administration",
            field: "Technology Management",
            startDate: "2016",
            endDate: "2018",
            gpa: "3.9",
        },
        {
            id: "edu-2",
            institution: "University of California, Berkeley",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2012",
            endDate: "2016",
        },
    ],
    skills: [
        "Product Strategy",
        "Agile & Scrum",
        "Data Analytics",
        "User Research",
        "A/B Testing",
        "SQL & Python",
        "Figma & Design",
        "Jira & Confluence",
        "Cross-functional Leadership",
        "Roadmap Planning",
    ],
    projects: [
        {
            id: "proj-1",
            name: "Analytics Dashboard Platform",
            description:
                "Built and shipped an enterprise analytics dashboard serving 200+ B2B clients with real-time data visualization and custom reporting capabilities.",
            technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
            link: "https://example.com/analytics",
        },
        {
            id: "proj-2",
            name: "Mobile Engagement Suite",
            description:
                "Designed and launched a mobile engagement toolkit enabling push notifications, in-app messaging, and user segmentation for 1M+ end users.",
            technologies: ["React Native", "Firebase", "GraphQL"],
            link: "https://example.com/mobile",
        },
    ],
};
