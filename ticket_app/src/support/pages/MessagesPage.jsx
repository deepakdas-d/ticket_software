import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert, Form, Button } from "react-bootstrap";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import useMessages from "../hooks/useMessages";
import "../styles/MessagesPage.css";

const MessagesPage = () => {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const { messages, loading, error, sendMessage, refresh } =
    useMessages(ticket_id);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const chatBodyRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage("");
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
        </Alert>
        <Button onClick={refresh} variant="primary" className="mt-2">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <div className="messages-page-container">
      {/* Header */}
      <div className="chat-header d-flex align-items-center">
        <FaArrowLeft
          className="back-arrow"
          onClick={() => navigate("/supportertickets")}
        />
        <h5 className="mb-0 ms-2">Messages for Ticket: {ticket_id}</h5>
      </div>

      {/* Chat Body */}
      <div className="chat-body" ref={chatBodyRef}>
        <div className="chat-inner">
          {messages.length === 0 ? (
            <div className="text-center text-muted mt-3">No messages yet.</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${
                  msg.sender_role === "supporter"
                    ? "user-message" // LEFT (gray bubble)
                    : "supporter-message" // RIGHT (blue bubble)
                }`}
              >
                <div className="chat-text">{msg.message}</div>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="chat-image"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Input */}
      <Form className="message-input-container" onSubmit={handleSendMessage}>
        <Form.Group className="d-flex align-items-center">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            className="message-input"
            style={{ resize: "none" }}
          />
          <Button
            variant="primary"
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="ms-2 send-button"
          >
            {sending ? <Spinner size="sm" /> : <FaPaperPlane />}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default MessagesPage;
