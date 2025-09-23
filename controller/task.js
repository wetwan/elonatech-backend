import Task from "../model/taskmodel.js";

export const addTask = async (req, res) => {
  const { name, taskId, description } = req.body;

  try {
    // If you're attaching user to req (e.g. from middleware), extend Request type
    const taskId = req.user?._id;

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing details: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    const taskData = {
      name,
      taskId,
      description,
      status: "pending",
      createdAt: Date.now(),
    };

    // Save to database
    const task = new Task(taskData);
    await task.save();

    res.json({
      success: true,
      task: {
        _id: task._id,
        name: task.name,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        userId: task.userId,
        taskId,
      },
      // token: generateToken(user._id),
      message: "Task created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error registering user:", error.message);
      res.json({ success: false, message: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.json({ success: false, message: "An unknown error occurred" });
    }
  }
};
export const editTask = async (req, res) => {
  const { id } = req.params; // <-- get from URL
  const { name, description, status } = req.body;

  try {
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    existingTask.name = name || existingTask.name;
    existingTask.description = description || existingTask.description;
    existingTask.status = status || existingTask.status;

    const updatedTask = await existingTask.save();

    res.json({
      success: true,
      task: updatedTask,

      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params; // get task id from URL

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // fetch all tasks

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params; // task ID from URL
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error fetching task:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

