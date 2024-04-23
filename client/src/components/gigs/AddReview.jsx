import { reducerCase } from "@/context/constants";
import { stateContextProvider } from "@/context/StateContext";
import { ADD_REVIEW } from "@/utils/constants";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { FaStar } from "react-icons/fa";

const AddReview = ({gigId}) => {
  const [cookies] = useCookies();
  const [{}, dispatch] = stateContextProvider();
  const [data, setData] = useState({ reviewText: "", rating: 0 });

  const addReview = async () => {
    try {
      const {
        data: { newReview },
      } = await axios.post(`${ADD_REVIEW}/${gigId}`, data, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      if (newReview) {
        setData({ reviewText: "", rating: 0 });
        dispatch({
          type: reducerCase.ADD_REVIEW,
          newReviews: newReview,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mb-10">
      <h3 className="text-2xl my-5 font-normal text-gray-600">
        Give nazat a review
      </h3>
      <div className="flex flex-col items-start justify-start gap-3">
        <textarea
          name="reviewText"
          id="reviewText"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add a message"
          value={data.reviewText}
          onChange={(e) => setData({ ...data, reviewText: e.target.value })}
        ></textarea>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              className={`cursor-pointer ${
                data.rating >= num ? "text-yellow-400" : "text-gray-400"
              }`}
              onClick={() => setData({ ...data, rating: num })}
            />
          ))}
        </div>
        <button
          onClick={addReview}
          className="flex items-center justify-center text-md text-white font-semibold py-2 border-green-500 bg-green-500 rounded-md w-full mt-5"
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default AddReview;
