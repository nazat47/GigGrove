"use client";
import { stateContextProvider } from "@/context/StateContext";
import { GET_SELLER_DATA } from "@/utils/constants";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const SellerDashboard = () => {
  const [cookies] = useCookies();
  const [{ currentUser, isSeller }] = stateContextProvider();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(undefined);
  useEffect(() => {
    const getSellerData = async () => {
      try {
        const { data } = await axios.get(GET_SELLER_DATA, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        if (data.dashboardData) {
          setDashboardData(data.dashboardData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) getSellerData();
  }, [currentUser]);

  useEffect(() => {
    if (!isSeller) {
      router.push("/buyer");
    }
  }, []);
  return (
    <div className="mt-36">
      {currentUser && (
        <div className="flex min-h-[80vh] my-10 mt-0 px-32 gap-5">
          <div className="shadow-md h-max p-10 flex flex-col gap-5 min-w-96 w-96">
            <div className="flex gap-5 justify-center items-center">
              <div>
                {currentUser?.imageName ? (
                  <Image
                    src={currentUser?.imageName}
                    alt="Profile"
                    width={140}
                    height={140}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-500 size-10 flex items-center justify-center rounded-full relative">
                    <span className="text-5xl text-white">
                      {currentUser?.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 text-lg font-medium">
                  {currentUser?.username}
                </span>
                <span className="font-bold text-md">
                  {currentUser?.fullName}
                </span>
              </div>
            </div>
            <div className="border-t py-5">
              <p>{currentUser?.description}</p>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 gap-10 w-full">
              <div
                className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => router.push("/seller/gigs")}
              >
                <h2 className="text-xl">Total Gigs</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  {dashboardData?.gigs}
                </h3>
              </div>
              <div
                className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => router.push("/seller/orders")}
              >
                <h2 className="text-xl">Total Orders</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  {dashboardData?.orders}
                </h3>
              </div>
              <div
                className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => router.push("/seller/unread-messages")}
              >
                <h2 className="text-xl"> Unread Messages</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  {dashboardData?.unreadMsgs}
                </h3>
              </div>

              <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl">Earnings Today</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  ${dashboardData?.dailyRevenue}
                </h3>
              </div>
              <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl">Earnings Monthly</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  ${dashboardData?.monthlyRevenue}
                </h3>
              </div>
              <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl">Earnings Yearly</h2>
                <h3 className="text-[#1DBF73] text-3xl font-extrabold">
                  ${dashboardData?.revenue}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
