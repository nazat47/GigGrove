"use client";
import { stateContextProvider } from "@/context/StateContext";
import { GET_SELLER_ORDERS } from "@/utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const SellerOrders = () => {
  const [cookies] = useCookies();
  const [orders, setOrders] = useState([]);
  const [{ currentUser }] = stateContextProvider();
  useEffect(() => {
    const getSellerOrders = async () => {
      try {
        const { data } = await axios.get(GET_SELLER_ORDERS, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) getSellerOrders();
  }, [currentUser]);
  return (
    <div className="mt-36 min-h-[80vh] px-32 my-10">
      <h1 className="m-5 text-2xl font-semibold">All your Orders</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Message
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr
                key={order.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {order.id}
                </th>
                <td className="px-6 py-4">{order.gig?.title}</td>
                <td className="px-6 py-4">{order.gig?.category}</td>
                <td className="px-6 py-4">{order.gig?.price}</td>
                <td className="px-6 py-4">{order.gig?.deliveryTime}</td>
                <td className="px-6 py-4">{order.createdAt.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/buyer/orders/messages/${order.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Send Message
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;
