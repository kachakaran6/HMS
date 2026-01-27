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
    <section className="page messages">
      <h1>Message</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((element) => {
            return (
              <div className="card">
                <div className="details">
                  <p>
                    First Name: <span>{element.firstName}</span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastName}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No messages found</p>
        )}
      </div>
    </section>
  );
};

export default Message;
