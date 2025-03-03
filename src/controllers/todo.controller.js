import { Todo } from "../models/todo.model.js";
import {logActivity} from "../controllers/activityLog.controller.js"


export const createTodo = async (req, res) => {
    try {
        const { ticketName, category, ticketDescription } = req.body;

        const userId = req.user._id;

        const newTodo = new Todo({
            ticketName,
            category,
            ticketDescription,
            user: userId,
        });

        await newTodo.save();
        const activityLog = await logActivity(userId,newTodo._id, ticketName, "Created")

        res.status(201).json({ success: true, message: "Todo created successfully!", data: newTodo, log: activityLog });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


export const getTodos = async (req, res) => {
    try {
        const userId = req.user._id;
        const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: todos });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


export const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);

        if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });

        res.status(200).json({ success: true, data: todo });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};



export const updateTodo = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { ticketName, category, ticketDescription } = req.body;
        const prevStatus = await Todo.findById(id);
        console.log(prevStatus.category)
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { ticketName, category, ticketDescription },
            { new: true, runValidators: true }
        );

        console.log(updatedTodo.category)

        let activityLog;
        if (prevStatus.category != category) {
            //console.log("I am in IF");
            
            activityLog = await logActivity(
                updatedTodo.user,updatedTodo._id, ticketName,"Updated", prevStatus.category, updatedTodo.category)
        }else{
            //console.log("I am in else");
            activityLog = await logActivity(updatedTodo.user,updatedTodo._id, "Updated")
        }
       

        if (!updatedTodo) return res.status(404).json({ success: false, message: "Todo not found" });

        res.status(200).json({ success: true, message: "Todo updated successfully!", data: updatedTodo, log: activityLog });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) return res.status(404).json({ success: false, message: "Todo not found" });

        const activityLog =  await logActivity(deletedTodo.user, deletedTodo._id, deletedTodo.ticketName, "Deleted")

        res.status(200).json({ success: true, message: "Todo deleted successfully!", log: activityLog});


    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const moveTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { category } = req.body;
        const prevStatus = await Todo.findById(id);

        const updatedTodo = await Todo.findByIdAndUpdate(id, { category }, { new: true, runValidators: true });

        if (!updatedTodo) return res.status(404).json({ success: false, message: "Todo not found" });
        const activityLog =  await logActivity(updatedTodo.user, updatedTodo._id, updatedTodo.ticketName, "Moved", prevStatus.category, updatedTodo.category )

        res.status(200).json({ success: true, message: "Todo moved successfully!", data: updatedTodo , logs: activityLog  });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};