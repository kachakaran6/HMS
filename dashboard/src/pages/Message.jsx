import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(true);
  // http://localhost:3000/api/v1/message/all

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${baseURL}/api/v1/message/all`, {
          withCredentials: true,
        });
        setMessages(data.messages);
        console.log(data.messages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const Loader = () => (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
    </div>
  );
  return (
    <section className="space-y-6 bg-slate-50 p-6 rounded-xl">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
      </div>
      {loading ? (
        <Loader />
      ) : messages && messages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((element) => (
            <div
              key={element._id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col"
            >
              {/* SENDER HEADER */}
              <div className="px-5 py-4 border-b bg-slate-50 rounded-t-2xl">
                <p className="font-semibold text-slate-900">
                  {element.firstName} {element.lastName}
                </p>
                <p className="text-xs text-slate-500">
                  {element.email} · {element.phone}
                </p>
              </div>

              {/* MESSAGE BODY */}
              <div className="p-5 flex-1">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {element.message}
                </p>
              </div>

              {/* FOOTER (optional future actions) */}
              <div className="px-5 py-3 border-t bg-white text-xs text-slate-500">
                Message received
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-2xl p-8 text-center text-slate-500">
          No messages found
        </div>
      )}
    </section>
  );
};

export default Message;
