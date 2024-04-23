"use client";
import { CONFIRM_ORDER } from "@/utils/constants";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";

const SuccessPage = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  useEffect(() => {
    const changeOrderStatus = async () => {
      try {
        const { data } = await axios.post(
          CONFIRM_ORDER,
          { paymentIntent },
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        if(data.success){
          console.log("success")
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (paymentIntent) {
      changeOrderStatus();
      setTimeout(() => router.push("/buyer/orders"), 5000);
    } else {
      router.push("/");
    }
  }, [paymentIntent]);
  return (
    <div className="mt-36 h-[80vh] flex items-center px-20 pt-20 flex-col">
      <h1 className="text-4xl text-center">
        Payment successful. You are being redirected to the orders page.
      </h1>
      <h1 className="text-4xl text-center">Please do not close the page</h1>
    </div>
  );
};

export default SuccessPage;
