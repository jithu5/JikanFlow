import { useFetchAllProjects } from "@/apiQuery/apiQuery";
import { AddProject } from "@/components";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/user";
import { useMemo } from "react";

type ProjectCardData = {
    id: string;
    title: string;
    description: string;
    startedAt: string;
    inProgress: number;
    onHold: number;
    usersCount: number;
};

function DashboardLanding() {
    const { token } = useUserStore();
    const { data, isLoading, error } = useFetchAllProjects(token);

    const projects: ProjectCardData[] = useMemo(() => {
        if (!data) return [];

        return data.map((project: any) => {
            const inProgress = project.tasks.filter(
                (task: any) => task.status === "IN_PROGRESS"
            ).length;

            const onHold = project.tasks.filter(
                (task: any) => task.status === "HOLD"
            ).length;

            return {
                id: project.id,
                title: project.title,
                description: project.description,
                startedAt: project.createdAt,
                inProgress,
                onHold,
                usersCount: project.users.length,
            };
        });
    }, [data]);

    if (isLoading) return <p className="p-6">Loading projects...</p>;
    if (error) return <p className="p-6 text-red-600">Error loading projects</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-md:px-10 px-4 py-1 flex justify-between">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">My Projects</h2>

                {/* Add new projects */}
                <AddProject />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
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

                        <div className="flex gap-4 mb-3">
                            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                In Progress: {project.inProgress}
                            </div>
                            <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                                On Hold: {project.onHold}
                            </div>
                        </div>

                        <div className="text-xs text-gray-600 mb-3">
                            👥 {project.usersCount} members
                        </div>

                        <div className="flex justify-between mt-auto">
                            <Button variant={"link"} className="text-sm text-blue-600 hover:underline cursor-pointer">
                                📊 View Analytics
                            </Button>
                            <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition cursor-pointer">
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
