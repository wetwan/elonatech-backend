import express from "express";
import {
  addTask,
  deleteTask,
  editTask,
  getAllTasks,
  getSingleTask,
} from "../controller/task.js";
import { protectUser } from "../middleware/authMiddle.js";

const taskRoute = express.Router();

taskRoute.post("/addtask", protectUser, addTask);
taskRoute.patch("/edittask/:id", protectUser, editTask);
taskRoute.delete("/deletetask/:id", protectUser, deleteTask);
taskRoute.get("/taskall", protectUser, getAllTasks);
taskRoute.get("task/:id", protectUser, getSingleTask);

export default taskRoute;
