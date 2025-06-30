import { Router } from "express";
import { createProjectController, DeleteController, getAllProjectsController } from "../controllers/project.controller.js";
const router = Router();


router.post("/create", createProjectController);

router.get("/getAll", getAllProjectsController);
router.delete("/delete/:id", DeleteController);

export default router;