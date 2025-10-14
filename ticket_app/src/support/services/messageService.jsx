import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const messageService = {
  getMessages: async (ticket_id) => {
    try {
      const token = localStorage.getItem("SupporteraccessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await axios.get(
        `${API_BASE_URL}/tickets/complaints/${ticket_id}/messages/`,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  },

  sendMessage: async (ticket_id, message) => {
    try {
      const token = localStorage.getItem("SupporteraccessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await axios.post(
        `${API_BASE_URL}/tickets/complaints/${ticket_id}/messages/send/`,
        { message },
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },
};

export default messageService;