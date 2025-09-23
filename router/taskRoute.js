import express from "express";
import { addTask, deleteTask, editTask, getAllTasks, getSingleTask } from "../controller/task.js";

const taskRoute = express.Router();

taskRoute.post("/addtask", addTask);
taskRoute.put("/edittask/:id", editTask);
taskRoute.delete("/deletetask/:id", deleteTask);
taskRoute.get("/taskall", getAllTasks);
taskRoute.get("task/:id", getSingleTask);




export default taskRoute;
