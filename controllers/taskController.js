import Project from "../models/Project.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";
const newTask = async (req, res) => {
  const { project } = req.body;

  //Validar el ID problema de "" en mongoDB
  const valid = mongoose.Types.ObjectId.isValid(project);

  if (!valid) {
    const error = new Error(`Project doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  const projectExists = await Project.findById(project);

  if (projectExists.creator.toString() !== req.user._id.toString()) {
    const error = new Error(`Denied Permit: Add task not allowed`);
    return res.status(404).json({ msg: error.message });
  }

  try {
    const taskSaved = await Task.create(req.body); //Otra forma de crear
    res.json(taskSaved);
  } catch (error) {
    console.log(error);
  }
};
const getTask = async (req, res) => {
  const { id } = req.params; // Id de la task

  //Validacion si tarea existe
  //Validar el ID de la task problema de "" en mongoDB
  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error(`Task doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  // Con populate consultamos la ref en el Model Task
  // Se puede hacer para evitar hacer otra peticion
  // Es decir me trae el project asosciado en la misma peticion
  const task = await Task.findById(id).populate("project");

  //Aca abajo se hacen 2 peticiones => con .populate() solo una
  // const {project} = task
  // const existProject = await Project.findById(project)

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(`Denied Permit:  Not allowed`);
    return res.status(403).json({ msg: error.message });
  }

  res.json(task);
};

const editTask = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error(`Task doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  const task = await Task.findById(id).populate("project");

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(`Denied Permit:  Not allowed`);
    return res.status(403).json({ msg: error.message });
  }

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;

  try {
    const taskEdited = await task.save();
    res.json(taskEdited);
  } catch (error) {
    console.log(error);
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error(`Task doesn't exist`);
    return res.status(404).json({ msg: error.message });
  }

  const task = await Task.findById(id).populate("project");

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(`Denied Permit:  Not allowed`);
    return res.status(403).json({ msg: error.message });
  }

  try {
    await task.deleteOne();
    res.json({ msg: "Task Deleted" });
  } catch (error) {
    console.log(error);
  }
};

const changeStateTask = async (req, res) => {};

export { newTask, getTask, editTask, deleteTask, changeStateTask };
