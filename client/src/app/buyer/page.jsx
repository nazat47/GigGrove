"use client";
import { stateContextProvider } from "@/context/StateContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Buyer = () => {
  const [{ isSeller }] = stateContextProvider();
  const router = useRouter();
  useEffect(() => {
    if (isSeller) {
      router.push("/seller");
    }
  },[]);
  return (
    <div className="mt-36 flex items-center justify-center mb-12">
      Dashboard
    </div>
  );
};

export default Buyer;
