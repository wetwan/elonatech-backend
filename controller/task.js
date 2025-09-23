import Task from "../model/taskmodel.js";

export const addTask = async (req, res) => {
  const { name, description } = req.body || {};

  try {
    const missingFields = [];
    if (!name) missingFields.push("name");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing details: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    const taskData = {
      name,
      description,
      status: "pending",
      createdAt: Date.now(),
      user: req.user._id,
    };

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
        userId: task.user,
      },
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
  const userId = req.user._id;
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

    if (!updatedTask.user.equals(userId)) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this task",
      });
    }

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
  const userId = req.user._id;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
        if (!deletedTask.user.equals(userId)) {
      res
        .status(401)
        .json({
          success: false,
          message: "Not authorized to access this task",
        });
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
    const userId = req.user._id;
    const tasks = await Task.find({ user: userId }); // fetch all tasks

    res.json({
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // task ID from URL

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    if (!task.user.equals(userId)) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this task",
      });
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
