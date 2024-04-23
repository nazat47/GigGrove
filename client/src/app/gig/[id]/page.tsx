"use client";
import { stateContextProvider } from "@/context/StateContext";
import { CHECK_GIG_ORDER, GET_GIG_DETAILS_USER } from "@/utils/constants";
import Details from "../../../components/gigs/Details";
import Pricing from "../../../components/gigs/Pricing";
import axios from "axios";
import React, { useEffect } from "react";
import { reducerCase } from "@/context/constants";
import { useCookies } from "react-cookie";

const GigDetails = ({ params }) => {
  const gigId = params.id;
  const [{ currentUser }, dispatch] = stateContextProvider();
  const [cookies] = useCookies();

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const {
          data: { gigs },
        } = await axios.get(`${GET_GIG_DETAILS_USER}/${gigId}`);
        dispatch({ type: reducerCase.GIG_DATA, gigData: gigs });
      } catch (error) {
        console.log(error);
      }
    };
    if (gigId) fetchGigData();
  }, [gigId, dispatch]);

  useEffect(() => {
    const checkGigOrder = async () => {
      try {
        const { data } = await axios.get(`${CHECK_GIG_ORDER}/${gigId}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        dispatch({
          type: reducerCase.HAS_ORDERED_GIG,
          hasOrdered: data.hasOrdered,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) checkGigOrder();
  }, [currentUser, gigId, dispatch]);

  return (
    <div className="mt-36 grid grid-cols-3 mx-32 gap-20">
      <Details gigId={gigId}/>
      <Pricing />
    </div>
  );
};

export default GigDetails;
