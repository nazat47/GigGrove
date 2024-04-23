"use client";
import { GET_GIG } from "@/utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Gigs = () => {
  const [cookies] = useCookies();
  const [gigs, setGigs] = useState([]);
  useEffect(() => {
    const userGigs = async () => {
      try {
        const { data } = await axios.get(GET_GIG, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        setGigs(data.gigs);
      } catch (error) {
        console.log(error);
      }
    };
    userGigs();
  }, []);
  return (
    <div className="mt-36 min-h-[80vh] px-32 my-10">
      <h1 className="m-5 text-2xl font-semibold">All your Gigs</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {gigs?.map(({ title, category, price, deliveryTime, id }) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {title}
                </th>
                <td className="px-6 py-4">{category}</td>
                <td className="px-6 py-4">{deliveryTime}</td>
                <td className="px-6 py-4">{price}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/seller/gigs/${id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
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

export default Gigs;
