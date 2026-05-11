const axios = require('axios');

const JSON_SERVER_URL = 'http://localhost:3001';

const taskModel = {
  getByUserId: async (userId) => {
    try {
      const response = await axios.get(`${JSON_SERVER_URL}/tasks?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      return [];
    }
  },

  getById: async (taskId) => {
    try {
      const response = await axios.get(`${JSON_SERVER_URL}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  create: async (taskData) => {
    try {
      const newTask = {
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const response = await axios.post(`${JSON_SERVER_URL}/tasks`, newTask);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error.message);
      throw new Error('Could not create task');
    }
  },

  update: async (taskId, updates) => {
    try {
      const response = await axios.patch(`${JSON_SERVER_URL}/tasks/${taskId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error.message);
      throw new Error('Could not update task');
    }
  },

  delete: async (taskId) => {
    try {
      await axios.delete(`${JSON_SERVER_URL}/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error.message);
      throw new Error('Could not delete task');
    }
  }
};

module.exports = taskModel;
