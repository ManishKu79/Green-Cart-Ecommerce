import { useState } from "react";
import axios from "axios";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/contact", formData);
      if (res.status === 200) {
        toast.success("Message sent successfully!")
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      toast.error("Failed to send message.")
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
            >
              Send Message
            </button>
            {status && <p className="text-sm mt-2">{status}</p>}
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Our Contact Details</h2>
          <div className="flex items-center space-x-3">
            <FaPhone className="text-green-500" />
            <span>+91 6287066294</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-green-500" />
            <span>GreenCart@example.com</span>
          </div>

          <h3 className="text-xl font-semibold mt-6">Connect With Us</h3>
          <div className="flex space-x-4 text-green-500 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
