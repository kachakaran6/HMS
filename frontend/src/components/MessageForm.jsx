import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/message/send`,
        { firstName, lastName, email, phone, message },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      toast.success(data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      toast.error("Failed to send message", err.message);
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Send Us a Message
          </h2>

          <form onSubmit={handleMessage} className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Message */}
            <textarea
              rows={5}
              placeholder="Write your message..."
              className="input resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MessageForm;
