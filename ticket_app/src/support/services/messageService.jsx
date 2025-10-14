// services/messageService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const messageService = {
  getMessages: async (ticket_id) => {
    try {
      const token = localStorage.getItem("SupporteraccessToken");
      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      };
      
      const response = await axios.get(
        `${API_BASE_URL}/tickets/complaints/${ticket_id}/messages/`,
        { headers }
      );
      
      return response.data || [];
    } catch (error) {
      console.error("Get messages error:", error);
      throw new Error(
        error.response?.data?.message || error.response?.data?.detail || "Failed to fetch messages"
      );
    }
  },

  sendMessage: async (ticket_id, messageData) => {
    try {
      const token = localStorage.getItem("SupporteraccessToken");
      const formData = new FormData();
      
      formData.append('message', messageData.message || '');
      
      if (messageData.image instanceof File) {
        formData.append('image', messageData.image);
      }

      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Let browser set Content-Type with boundary for FormData
      };

      const response = await axios.post(
        `${API_BASE_URL}/tickets/complaints/${ticket_id}/messages/send/`,
        formData,
        { 
          headers,
          timeout: 30000 // 30 second timeout for file uploads
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Send message error:", error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        "Failed to send message"
      );
    }
  },
};

export default messageService;