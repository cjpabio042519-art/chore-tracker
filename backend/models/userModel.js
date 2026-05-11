const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const JSON_SERVER_URL = 'http://localhost:3001';

const userModel = {
  findByEmail: async (email) => {
    try {
      const response = await axios.get(`${JSON_SERVER_URL}/users?email=${email}`);
      return response.data[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      return null;
    }
  },

  create: async (userData) => {
    try {
      const newUser = {
        id: uuidv4(),
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString()
      };
      const response = await axios.post(`${JSON_SERVER_URL}/users`, newUser);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Could not create user');
    }
  }
};

module.exports = userModel;
