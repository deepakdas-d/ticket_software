import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert, Form, Button, Modal } from "react-bootstrap";
import { FaArrowLeft, FaPaperPlane, FaImage, FaTimes, FaSpinner } from "react-icons/fa";
import useMessages from "../hooks/useMessages";
import "../styles/MessagesPage.css";

const MessagesPage = () => {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const { messages, loading, error, sendMessage, refresh } = useMessages(ticket_id);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP only)');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      event.target.value = '';
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedImage) return;

    setSending(true);
    try {
      const messageData = {
        message: newMessage.trim(),
        image: selectedImage ? selectedImage : null
      };
      await sendMessage(messageData);
      setNewMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      // Error handled by hook
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImage(null);
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
    <>
      <div className="messages-page-container">
        {/* Header */}
        <div className="messages-chat-header">
          <div className="messages-header-content">
            <FaArrowLeft
              className="messages-back-arrow"
              onClick={() => navigate("/supportertickets")}
            />
            <h5 className="messages-header-title" style={{color: 'white'}}>Ticket #{ticket_id}</h5>
          </div>
        </div>

        {/* Chat Body */}
      <div className="messages-chat-body" ref={chatBodyRef}>
  <div className="messages-chat-inner">
    {messages.length === 0 ? (
      <div className="messages-empty-state">
        <p>No messages yet. Start the conversation!</p>
      </div>
    ) : (
      messages.map((msg) => (
        <div
          key={msg.id}
          className={`messages-chat-bubble ${
            msg.sender_role === "supporter"
              ? "messages-user-message"
              : "messages-supporter-message"
          }`}
        >
         

          {/* Message text */}
          <div className="messages-chat-text">{msg.message}</div>

          {/* Optional image */}
          {msg.image && (
            <img
              src={msg.image}
              alt="attachment"
              className="messages-chat-image"
              onClick={() => openImageModal(msg.image)}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* Timestamp */}
          <div className="messages-chat-time">{msg.created_at}</div>
        </div>
      ))
    )}
    {sending && (
      <div className="messages-sending-indicator">
        <FaSpinner className="messages-spin-icon" />
        <span>Sending...</span>
      </div>
    )}
  </div>
</div>


        {/* Message Input */}
        <Form className="messages-input-container" onSubmit={handleSendMessage}>
          <Form.Group className="messages-input-wrapper">
            <Form.Control
              as="textarea"
              rows={1}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              className="messages-message-input"
            />
            
            <div className="messages-file-input-wrapper">
              <label htmlFor="image-upload" className="messages-file-upload-btn">
                <FaImage />
              </label>
              <input
                id="image-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                disabled={sending}
                className="messages-file-input"
              />
            </div>

            {imagePreview && (
              <div className="messages-preview-wrapper">
                <img src={imagePreview} alt="Preview" className="messages-image-preview" />
                <button
                  type="button"
                  className="messages-remove-image-btn"
                  onClick={removeImage}
                  disabled={sending}
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              disabled={sending || (!newMessage.trim() && !selectedImage)}
              className="messages-send-button"
            >
              {sending ? <FaSpinner className="messages-spin-icon" /> : <FaPaperPlane />}
            </Button>
          </Form.Group>
        </Form>
      </div>

      {/* Image Preview Modal */}
      <Modal 
        show={showImageModal} 
        onHide={closeImageModal} 
        size="lg" 
        centered
        className="messages-image-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="messages-modal-body">
          {modalImage && (
            <img 
              src={modalImage} 
              alt="Full preview" 
              className="messages-modal-image"
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MessagesPage;