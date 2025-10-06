const BASE_URL = import.meta.env.VITE_API_BASE_URL;



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