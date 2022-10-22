import express from "express";
import {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addContributor,
  deleteContributor,
  getTasks,
} from "../controllers/projectController.js";

import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

// router.get("/", checkAuth, getProjects);
// router.post("/", checkAuth, newProject);
router.route("/").get(checkAuth, getProjects).post(checkAuth, newProject);

router
  .route("/:id")
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject);

  router.post('/add-contributor/:id', checkAuth, addContributor)
  router.post('/delete-contributor/:id', checkAuth, deleteContributor)
  
  //el id es el de el proyecto para listar las tareas del projecto
  router.get('/tasks/:id', checkAuth, getTasks)

export default router;
