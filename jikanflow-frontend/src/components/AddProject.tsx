import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // if you have it
import { useState } from "react";
import { useAddProject } from "@/apiQuery/apiQuery";
import useUserStore from "@/store/user";
import toast from "react-hot-toast";
import useProjectStore from "@/store/projetcs";

function AddProject() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const { token } = useUserStore()
    const {addProject} = useProjectStore()

    const useAddProjectMutation = useAddProject(token)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) return alert("Project title is required.");

        // 🔁 TODO: Call your API to add project
        console.log("Creating Project:", { title, description });
        try {
            const responseData = await useAddProjectMutation.mutateAsync(
                {
                    title,
                    description
                }
            )
            addProject(responseData)
            console.log(responseData)
        } catch (error: any) {
            toast.error(error?.response?.data)
        }
        finally {
            // Optionally clear form
            setTitle("");
            setDescription("");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="cursor-pointer">
                    Add Project
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Project</DialogTitle>
                        <DialogDescription>
                            Enter your project title and description to create a new project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. AI Interview App"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Short description of the project..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Create Project</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddProject;
