import { Router } from "express";
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo, moveTodo } from "../controllers/todo.controller.js";
import { getActivityLogs } from "../controllers/activityLog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const todoRouter = Router();

todoRouter.post("/create", verifyJWT, createTodo);
todoRouter.get("/getall", verifyJWT, getTodos);
todoRouter.get("/get/:id", verifyJWT, getTodoById);
todoRouter.put("/update/:id", verifyJWT, updateTodo);
todoRouter.delete("/delete/:id", verifyJWT, deleteTodo);
todoRouter.put("/move/:id", verifyJWT, moveTodo);
todoRouter.get("/activitylogs/:id", verifyJWT, getActivityLogs)

export default todoRouter;
