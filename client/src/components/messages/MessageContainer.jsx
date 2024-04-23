"use client";
import { stateContextProvider } from "@/context/StateContext";
import { ADD_MESSAGE, GET_MESSAGES } from "@/utils/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BsCheckAll } from "react-icons/bs";
import { FaRegPaperPlane } from "react-icons/fa";
import Moment from "react-moment";

const MessageContainer = ({ orderId }) => {
  const [cookies] = useCookies();
  const [{ currentUser }] = stateContextProvider();
  const [recieverId, setRecieverId] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`${GET_MESSAGES}/${orderId}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        setMessages(data.message);
        setRecieverId(data.recieverId);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser && orderId) {
      getMessages();
    }
  }, [currentUser, orderId, messages]);

  const sendMessage = async () => {
    try {
      if (text.length) {
        const { data } = await axios.post(
          `${ADD_MESSAGE}/${orderId}`,
          { text, recieverId },
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        console.log(data);
        if (data) {
          setMessages([...messages, data]);
          setText("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[80vh] ">
      <div className="max-h-[80vh] flex flex-col justify-center items-center">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 w-[80vw] border flex-col">
          <div className="mt-8">
            <div className="space-y-4 h-[50vh] overflow-y-auto pr-4">
              {messages?.map((message) => (
                <div
                  className={`flex ${
                    message.senderId === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                  key={message?.id}
                >
                  <div
                    className={`inline-block rounded-lg ${
                      message.senderId === currentUser.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    } px-4 py-2 max-w-xs break-all`}
                  >
                    <p>{message.text}</p>
                    <span
                      className={`text-sm ${
                        message.senderId === currentUser.id
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      <Moment fromNow>{message.createdAt}</Moment>
                    </span>
                    <span>
                      {message.senderId === currentUser.id &&
                        message.isRead && <BsCheckAll />}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="rounded-full py-2 px-4 mr-2 w-full shadow-lg"
              name="message"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <button
              type="submit"
              className="bg-green-600 text-white rounded-full px-4 py-2"
              onClick={sendMessage}
            >
              <FaRegPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
