import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const newProject = async (req, res) => {
  // console.log(req.user)
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectSaved = await project.save();
    res.json(projectSaved);
  } catch (error) {
    console.log(error);
  }
};

const getProjects = async (req, res) => {
  const projects = await Project.find().where("creator").equals(req.user);

  res.json(projects);
};

const getProject = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error(`Project doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error(`Project doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar el acceso al project Creado
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(`No access Data`);
    return res.status(404).json({ msg: error.message });
  }

  //Obtener las tareas
  const tasks = await Task.find().where('project').equals(project._id)

  res.json({project, tasks});
};

const editProject = async (req, res) => {
  const { id } = req.params;

  //Problema de mongo de las comiilas '"string"'
  //Cuando el ID por paramas no existe el error detiene la ejecucion del server
  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error(`Project doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error(`Project doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar el acceso al project Creado
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(`No access Data`);
    return res.status(404).json({ msg: error.message });
  }

  //Edicion

  //Nombre del Proyecto en DB es igual (=) lo que viene desde el body(frontend) si no (||) deje El nombre del project que ya esta el DB
  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.dueDate = req.body.dueDate || project.dueDate;
  project.client = req.body.client || project.client;

  try {
    const projectEdited = await project.save();
    res.json(projectEdited); // Prodria enviar el mensage de ok aqui?
  } catch (error) {
    console.log(error);
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  //Problema de mongo de las comiilas '"string"'
  //Cuando el ID por paramas no existe el error detiene la ejecucion del server
  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error(`Project doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error(`Project doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar el acceso al project Creado
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(`No access Data`);
    return res.status(404).json({ msg: error.message });
  }

  try {
    await project.deleteOne();
    res.json({ msg: `Project Deleted` });
  } catch (error) {
    console.log(error);
  }
};

const addContributor = async (req, res) => {};

const deleteContributor = async (req, res) => {};

//Option 1 // tambien puede estar en el controller de tareas
//Forma menos eficiente
const getTasks = async (req, res) => {
  const { id } = req.params;

  //Validate if project exist
  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error(`Project doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  // Para obtener tareas tienes que ser Creador o colaborador

  //Busco todas las tares con .find()
  // .where() = 'project' que es el projectid en el obj de la tarea
  //.equals() = hace referencia al id de ese projecto
  const tasks = await Task.find().where("project").equals(id);
  console.log(tasks);
};

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addContributor,
  deleteContributor,
  getTasks,
};
