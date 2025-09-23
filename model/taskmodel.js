
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, required: true, default: "pending" },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: { type: "String", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
