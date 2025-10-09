import { useEffect, useState } from "react";
import messageService from "../services/messageService";

const useMessages = (ticket_id) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await messageService.getMessages(ticket_id);
      setMessages(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticket_id) {
      fetchMessages();
    }
  }, [ticket_id]);

  const sendMessage = async (message) => {
    try {
      const newMessage = await messageService.sendMessage(ticket_id, message);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err.message || "Failed to send message");
      throw err;
    }
  };

  return { messages, loading, error, sendMessage, refresh: fetchMessages };
};

export default useMessages;