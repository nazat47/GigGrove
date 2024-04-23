"use client";
import { stateContextProvider } from "@/context/StateContext";
import { useRouter } from "next/navigation";
import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { FiClock, FiRefreshCcw } from "react-icons/fi";

const Pricing = () => {
  const [{ currentUser, gigData }, dispatch] = stateContextProvider();
  const router = useRouter();
  return (
    <>
      {gigData && (
        <div className="sticky top-36 mb-10 h-max w-96">
          <div className="border p-10 flex flex-col gap-5">
            <div className="flex justify-between">
              <h4 className="text-md font-normal text-gray-600">
                {gigData.shortDesc}
              </h4>
              <h6 className="font-medium text-lg">${gigData.price}</h6>
            </div>
            <div>
              <div className="text-gray-400 font-semibold text-sm flex gap-6">
                <div className="flex items-center gap-2">
                  <FiClock className="text-xl" />
                  <span>{gigData.deliveryTime} Days Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiRefreshCcw className="text-xl" />
                  <span>{gigData.revisions} Revisions</span>
                </div>
              </div>
            </div>
            <ul>
              {gigData?.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <BsCheckLg className="text-green-600 text-lg" />
                  <span className="text-gray-500">{feature}</span>
                </li>
              ))}
            </ul>
            {gigData.userId === currentUser?.id ? (
              <button
                onClick={() => router.push(`/seller/gigs/${gigData.id}`)}
                className="flex items-center bg-green-600 text-white py-2 justify-center font-bold text-lg relative rounded"
              >
                <span>Edit</span>
                <BiRightArrowAlt className="text-2xl absolute right-4" />
              </button>
            ) : (
              <button
                onClick={() => router.push(`/checkout?gigId=${gigData.id}`)}
                className="flex items-center bg-green-600 text-white py-2 justify-center font-bold text-lg relative rounded"
              >
                <span>Continue</span>
                <BiRightArrowAlt className="text-2xl absolute right-4" />
              </button>
            )}
          </div>
          {gigData?.userId !== currentUser?.id && (
            <div className="flex items-center justify-center mt-5">
              <button className="w-5/6 hover:bg-gray-400 py-1 border border-gray-400 px-5 text-gray-400 hover:text-white transition-all duration-300 text-lg rounded font-bold">
                Contact Me
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Pricing;
