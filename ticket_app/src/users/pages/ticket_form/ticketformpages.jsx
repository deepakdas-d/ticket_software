import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authcontext";
import { createTicket ,getDesignations} from "../../services/userservices";
import "./ticketformstyle.css";


function TicketFormPage() {
  const { authToken } = useAuth();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [designationId, setDesignationId] = useState("");

  // ✅ Fetch designations from API
  useEffect(() => {
  const fetchDesignations = async () => {
    try {
      const data = await getDesignations(authToken);
      setDesignations(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  fetchDesignations();
}, [authToken]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!designationId) {
      alert("Please select a designation!");
      return;
    }

    await createTicket(authToken, subject, description, file, designationId);

    try {
      await createTicket(authToken, subject, description, file, designationId);
      setShowModal(true);
      
      // Reset form
      setSubject("");
      setDescription("");
      setFile(null);
      setDesignationId("");
    } catch (error) {
      console.error(error);
      setError("Oops! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/tickets");
  };

  return (
    <div className="ticket-form-page">
      <h2>Submit a Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* ✅ Dropdown for designation */}
        <select
          value={designationId}
          onChange={(e) => setDesignationId(e.target.value)}
          required
        >
          <option value="">Select Designation</option>
          {designations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
}

export default TicketFormPage;