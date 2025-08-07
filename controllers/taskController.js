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

//update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const updates = req.body;
    for (const key in updates) {
      if (key !== "timeline") {
        task[key] = updates[key];
        task.timeline.push({ event: `${key} updated` });
      }
    }
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//DELETE task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
