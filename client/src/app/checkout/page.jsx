"use client";
import { CREATE_ORDER } from "@/utils/constants";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CheckoutForm from '../../components/CheckoutForm'

const Checkout = () => {
  const searchParams = useSearchParams();
  const gigId = searchParams.get("gigId");
  const [clientSecret, setClientSecret] = useState("");
  const [cookies] = useCookies();
  useEffect(() => {
    const createOrder = async () => {
      try {
        const { data } = await axios.post(
          CREATE_ORDER,
          { gigId },
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.log(error);
      }
    };
    if (gigId) createOrder();
  }, [gigId]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <div className="mt-36 min-h-[80vh] max-w-full mx-20 flex flex-col gap-10 items-center">
      <h1 className="text-3xl">
        Please complete the payment to place the order
      </h1>
      {clientSecret && (
        <Elements options={options} stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Checkout;
