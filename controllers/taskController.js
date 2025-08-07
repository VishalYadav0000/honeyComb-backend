import Task from "../models/task.js";
import moment from "moment-timezone";


// get all tasks
export const getTasks = async (req, res) => {
    try {
        const filters = req.query;
        const tasks = await Task.find(filters).sort({ dueDate: 1 });

        const formattedTasks = tasks.map((task) => {
            const indianTime = moment(task.dueDate)
                .tz("Asia/Kolkata")
                .format("DD-MM-YYYY HH:mm:ss");

            return {
                ...task._doc,
                dueDate: indianTime,
            };
        });

        res.json(formattedTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//create task
export const createTask = async (req, res) => {
    try {
        const { name, priority, dueDate } = req.body;
        const formattedDueDate = moment.tz(dueDate, "DD-MM-YYYY HH:mm:ss", "Asia/Kolkata").toDate();
        const newTask = new Task({
            name,
            priority,
            dueDate: formattedDueDate,
            timeline: [{ event: "Task created" }],
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
