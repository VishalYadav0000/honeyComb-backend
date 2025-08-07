import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  event: String,
  timestamp: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
  status: { type: Boolean, default: false },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  reminderSent: { type: Boolean, default: false },
  timeline: [timelineSchema],
});

export default mongoose.model("Task", taskSchema);