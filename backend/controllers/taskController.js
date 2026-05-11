const taskModel = require('../models/taskModel');

const taskController = {
  getTasks: async (req, res) => {
    try {
      const userId = req.user.id;
      const tasks = await taskModel.getByUserId(userId);
      res.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  },

  createTask: async (req, res) => {
    try {
      const userId = req.user.id;
      const { title, dueDate, time } = req.body;
      if (!title || !dueDate) {
        return res.status(400).json({ message: 'Title and due date are required' });
      }
      const newTask = await taskModel.create({ userId, title, dueDate, time: time || '', completed: false });
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Failed to create task' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const updates = req.body;
      const existingTask = await taskModel.getById(taskId);
      if (!existingTask) return res.status(404).json({ message: 'Task not found' });
      if (existingTask.userId !== userId) return res.status(403).json({ message: 'Unauthorized to update this task' });
      const updatedTask = await taskModel.update(taskId, updates);
      res.json(updatedTask);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Failed to update task' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const existingTask = await taskModel.getById(taskId);
      if (!existingTask) return res.status(404).json({ message: 'Task not found' });
      if (existingTask.userId !== userId) return res.status(403).json({ message: 'Unauthorized to delete this task' });
      await taskModel.delete(taskId);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  }
};

module.exports = taskController;
