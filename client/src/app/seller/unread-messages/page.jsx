"use client";
import { stateContextProvider } from "@/context/StateContext";
import { GET_UNREAD_MESSAGES, MARK_MESSAGE_AS_READ } from "@/utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Unread = () => {
  const [cookies] = useCookies();
  const [{ currentUser }] = stateContextProvider();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const getUnreads = async () => {
      try {
        const { data } = await axios.get(GET_UNREAD_MESSAGES, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) getUnreads();
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      const { data } = await axios.put(
        `${MARK_MESSAGE_AS_READ}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      if (data.success) {
        const clonesMessages = [...messages];
        const index = clonesMessages.findIndex((msg) => msg.id === id);
        clonesMessages.splice(index, 1);
        setMessages(clonesMessages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-36 min-h-[80vh] my-10 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Unread Messages</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Text
              </th>
              <th scope="col" className="px-6 py-3">
                Sender Name
              </th>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Mark as Read
              </th>
              <th scope="col" className="px-6 py-3">
                View Conversation
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={message.text}
                >
                  <th scope="row" className="px-6 py-4 ">
                    {message?.text}
                  </th>
                  <th scope="row" className="px-6 py-4 ">
                    {message?.sender?.fullName}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {message.orderId}
                  </th>
                  <td className="px-6 py-4 ">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        markAsRead(message.id);
                      }}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      Mark as Read
                    </Link>
                  </td>
                  <td className="px-6 py-4 ">
                    <Link
                      href={`/seller/orders/messages/${message.orderId}`}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Unread;
