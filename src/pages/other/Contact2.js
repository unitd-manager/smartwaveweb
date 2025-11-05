import React, { useState } from "react";
import api from "../../constants/api";

function Contact2() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await api.post("/email/sendMail", form);
      if (response.data.success) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (error) {
      setStatus("⚠️ Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto" }}>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          name="email"
          placeholder="Your Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button
          type="submit"
          style={{
            background: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default Contact2;
