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
      const sortedMessages = data.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setMessages(sortedMessages);
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

  const sendMessage = async (messageData) => {
    try {
      await messageService.sendMessage(ticket_id, messageData);
      await fetchMessages();
    } catch (err) {
      setError(err.message || "Failed to send message");
      throw err;
    }
  };

  return { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    refresh: fetchMessages 
  };
};

export default useMessages;