import projectModel from "../models/project.model.js";
import { createProject, getAllProjects } from "../services/project.service.js";

export async function createProjectController(req, res){
    const { projectname } = req.body;

    const newProject = await createProject(projectname);

    return res.status(201).json({
        status: "success",
        data: newProject,
    });
}

export async function getAllProjectsController(req, res) {
    const projects = await getAllProjects();

    return res.status(201).json({
        status: "success",
        data: projects,
    })
}

export async function DeleteController(req, res){
    const { id } = req.params;
    try {
        await projectModel.findByIdAndDelete(id);
        res.status(200).json({message: "Project deleted successfully"});
    } catch (error) {
        res.status(500).json({ error: "Failed to delete project" });
    }
}