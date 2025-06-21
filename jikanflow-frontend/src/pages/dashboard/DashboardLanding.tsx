type Project = {
    id: string;
    title: string;
    description: string;
    startedAt: string;
    inProgress: number;
    onHold: number;
};

const dummyProjects: Project[] = [
    {
        id: "1",
        title: "Client Website Redesign",
        description: "Redesign the homepage and product pages for the client.",
        startedAt: "2024-06-01",
        inProgress: 4,
        onHold: 1,
    },
    {
        id: "2",
        title: "Portfolio Build",
        description: "Create personal portfolio using Next.js and Tailwind CSS.",
        startedAt: "2024-05-15",
        inProgress: 2,
        onHold: 0,
    },
    {
        id: "3",
        title: "Mobile App for TrackFlow",
        description: "Build mobile version using React Native with shared logic.",
        startedAt: "2024-06-10",
        inProgress: 3,
        onHold: 1,
    },
    {
        id: "4",
        title: "Blog Automation Tool",
        description: "Tool for content creators to automate blog workflows.",
        startedAt: "2024-04-20",
        inProgress: 5,
        onHold: 2,
    },
    {
        id: "5",
        title: "AI Note Summarizer",
        description: "Add AI summarization feature for task notes and time logs.",
        startedAt: "2024-06-05",
        inProgress: 1,
        onHold: 0,
    },
    {
        id: "6",
        title: "Invoice System Revamp",
        description: "Redesign invoice logic and PDF formatting.",
        startedAt: "2024-05-28",
        inProgress: 2,
        onHold: 2,
    },
    {
        id: "7",
        title: "RabbitMQ Notification Service",
        description: "Standalone service to manage reminders and email alerts.",
        startedAt: "2024-06-08",
        inProgress: 4,
        onHold: 0,
    },
    {
        id: "8",
        title: "DevOps Pipeline Setup",
        description: "Set up CI/CD using GitHub Actions and Docker Compose.",
        startedAt: "2024-06-02",
        inProgress: 2,
        onHold: 1,
    },
    {
        id: "9",
        title: "Client CRM Integration",
        description: "Integrate third-party CRM API to sync client contacts.",
        startedAt: "2024-05-18",
        inProgress: 3,
        onHold: 0,
    },
    {
        id: "10",
        title: "Kanban UX Redesign",
        description: "Improve drag-and-drop experience and add column limits.",
        startedAt: "2024-06-03",
        inProgress: 5,
        onHold: 1,
    },
];

function DashboardLanding() {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">My Projects</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dummyProjects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white rounded-xl shadow p-5 border border-gray-200"
                    >
                        <h3 className="text-xl font-semibold text-gray-800">
                            {project.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">{project.description}</p>
                        <p className="text-gray-400 text-xs mb-3">
                            Started: {new Date(project.startedAt).toLocaleDateString()}
                        </p>

                        <div className="flex gap-4 mb-4">
                            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                In Progress: {project.inProgress}
                            </div>
                            <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                                On Hold: {project.onHold}
                            </div>
                        </div>

                        <div className="flex justify-between mt-auto">
                            <button className="text-sm text-blue-600 hover:underline">
                                📊 View Analytics
                            </button>
                            <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition">
                                ➡️ Open Project
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardLanding;
