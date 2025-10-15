const BASE_URL = import.meta.env.VITE_API_URL;



export const getProfile = async (authToken) => {
  const res = await fetch(`${BASE_URL}/tickets/profile/`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const createTicket = async (authToken, subject, description, file,designationId) => {
  const formData = new FormData();
  formData.append("subject", subject);
  formData.append("description", description);
  formData.append("designation_id", designationId);
  if (file) formData.append("image", file);

  const res = await fetch(`${BASE_URL}/tickets/complaints/create/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create ticket");
  return res.json();
};

export const raiseTicket = async (formData, file = null) => {
  const formdata = new FormData();

  // Append form fields
  Object.keys(formData).forEach((key) => {
    formdata.append(key, formData[key]);
  });

  // Append file if present
  if (file) {
    formdata.append("image", file);
  }

  try {
    const response = await fetch(`${BASE_URL}/tickets/complaints/create/`, {
      method: "POST",
      body: formdata,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to raise ticket");
    }

    return await response.json(); // return success data
  } catch (error) {
    console.error("Raise Ticket API error:", error);
    throw error;
  }
};

export const getDesignations = async (authToken) => {
  const res = await fetch(`${BASE_URL}/tickets/designationname/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch designations");
  return res.json();
};

export const requestPasswordReset = async (email) => {  
  const res = await fetch(`${BASE_URL}/users/password-reset/request/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to send OTP");
  return data;
};

// STEP 2: Verify OTP
export const verifyOtp = async (email, otp) => {
  const res = await fetch(`${BASE_URL}/users/password-reset/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Invalid OTP");
  return data;
};

// (Optional) STEP 3: Reset password
export const resetPassword = async (email, otp, newPassword) => {
  const res = await fetch(`${BASE_URL}/users/password-reset/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      otp,
      new_password: newPassword,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Password reset failed");
  return data;
};
// STEP 3: Update password
export const updatePassword = async (email, newPassword, confirmPassword) => {
  const res = await fetch(`${BASE_URL}/users/password-reset/update-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Password update failed");
  return data;
};


export const getRaisedTickets = async (authToken) => {
  const res = await fetch(`${BASE_URL}/tickets/complaints/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(errorData || "Failed to fetch raised tickets");
  }

  return await res.json(); // returns an array


};

/**
 * Fetch details of a specific ticket by its ID.
 * @param {string} ticketId
 * @param {string} authToken
 * @returns {Promise<Object>} Ticket details JSON
 */
export const getTicketDetails = async (ticketId, authToken) => {
  const res = await fetch(`${BASE_URL}/tickets/complaints/by-ticket/${ticketId}/`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch ticket details");
  }

  return await res.json();
};

/**
 * Append a new description or image to a ticket
 * @param {number|string} id - internal ticket database ID
 * @param {string} authToken
 * @param {string} description
 * @param {File|null} image
 * @returns {Promise<Object>}
 */
export const updateTicketDescription = async (id, authToken, description, image = null) => {
  const formData = new FormData();
  formData.append("description", description || "");
  if (image) formData.append("image", image);

  const res = await fetch(`${BASE_URL}/tickets/complaints/${id}/append-description/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(errorData || "Failed to update ticket");
  }

  return await res.json();
};

// ✅ Fetch messages for a specific ticket
export const getTicketMessages = async (ticketId, authToken) => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const res = await fetch(`${BASE_URL}/tickets/complaints/${ticketId}/messages/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch ticket messages");
  }

  return res.json();
};

/**
 * Send a new message to a ticket
 * @param {string} ticketId - ID of the ticket
 * @param {string} message - Message text to send
 * @param {string} authToken - User authentication token
 * @returns {Promise<Object>} - The saved message object
 */
export const sendTicketMessage = async (ticketId, message, imageFile, authToken) => {
  if (!message.trim() && !imageFile) throw new Error("Please enter a message or attach an image");

  const BASE_URL = import.meta.env.VITE_API_URL;

  // Use FormData for text + file upload
  const formData = new FormData();
  formData.append("message", message);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`${BASE_URL}/tickets/complaints/${ticketId}/messages/send/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      // ❌ DON'T set Content-Type manually for FormData — browser will handle it
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to send message");
  }

  return res.json();
};

