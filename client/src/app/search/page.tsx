"use client";
import { SEARCH_GIGS } from "@/utils/constants";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SearchGridItem from "../../components/search/SearchGridItem";
const SearchPage = () => {
  const [gigs, setGigs] = useState([]);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  useEffect(() => {
    const getGigs = async () => {
      try {
        const { data } = await axios.get(
          `${SEARCH_GIGS}?searchTerm=${q}&category=${category}`
        );
        setGigs(data.gigs);
      } catch (error) {
        console.log(error);
      }
    };
    if (category || q) {
      getGigs();
    }
  }, [category, q]);
  return (
    <div className="mt-36 mx-24 mb-24">
      {q && (
        <h3 className="text-4xl mb-10">
          Results for <strong>{q}</strong>
        </h3>
      )}
      <div className="flex gap-4">
        <button className="py-3 px-5 border border-gray-400 rounded-lg font-medium">
          Category
        </button>
        <button className="py-3 px-5 border border-gray-400 rounded-lg font-medium">
          Budget
        </button>
        <button className="py-3 px-5 border border-gray-400 rounded-lg font-medium">
          Delivery Time
        </button>
      </div>
      <div>
        <div className="my-4">
          <span className="font-medium text-gray-400">
            {gigs.length} services available
          </span>
        </div>
        <div className="grid grid-cols-4">
          {gigs?.map((gig,i) => (
            <SearchGridItem gig={gig} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
