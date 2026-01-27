import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  // http://localhost:3000/api/v1/message/all

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/v1/message/all`, {
          withCredentials: true,
        });
        setMessages(data.messages);
        console.log(data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Messages</h1>

      {messages && messages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((element) => (
            <div
              key={element._id}
              className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
            >
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-slate-700">
                    First Name:
                  </span>{" "}
                  {element.firstName}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Last Name:</span>{" "}
                  {element.lastName}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Email:</span>{" "}
                  {element.email}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Phone:</span>{" "}
                  {element.phone}
                </p>
              </div>

              {/* Message body */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 text-slate-700 text-sm leading-relaxed">
                {element.message}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No messages found</p>
      )}
    </section>
  );
};

export default Message;
