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
      // Sort messages by created_at in ascending order (oldest first)
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

  // No polling - only refresh when explicitly called

  const sendMessage = async (message) => {
    try {
      await messageService.sendMessage(ticket_id, message);
      // Refresh messages after successful send to get the actual message with correct data
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