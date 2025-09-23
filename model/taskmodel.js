
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: [true, "please provide a title"] },
  description: { type: String, default: "no description" },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
