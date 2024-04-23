import { HOST } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaStar } from "react-icons/fa";

const SearchGridItem = ({ gig }) => {
  const router = useRouter();
  const calculateRatings = () => {
    const { reviews } = gig;
    let rating = 0;
    if (!reviews?.length) {
      return 0;
    }
    reviews?.forEach((review) => {
      rating += review.rating;
    });
    return (rating / reviews.length).toFixed(1);
  };

  return (
    <div
      onClick={() => router.push(`/gig/${gig.id}`)}
      className="max-w-[300px] flex flex-col gap-2 p-1 cursor-pointer mb-8"
    >
      <div className="relative w-64 h-40">
        <Image
          src={`${HOST}/uploads/${gig.images[0]}`}
          alt="gig"
          fill
          className="rounded-xl"
        />
      </div>
      <div className="flex items-center gap-3">
        <div>
          {gig?.createdBy?.profileImage ? (
            <Image
              src={`${HOST}/${gig?.createdBy?.profileImage}`}
              alt="profile"
              height={30}
              width={30}
              className="rounded-full"
            />
          ) : (
            <div className="bg-purple-500 size-36 flex items-center justify-center rounded-full relative">
              <span className="text-lg text-white">
                {gig?.createdBy.email[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <span className="text-md">
          <strong className="font-medium">{gig.createdBy?.username}</strong>
        </span>
      </div>
      <div>
        <p className="line-clamp-2 text-gray-700">{gig.title}</p>
      </div>
      <div className="flex items-center gap-1 text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${
              Math.ceil(calculateRatings()) >= star
                ? "text-yellow-400"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="font-medium">{calculateRatings()}</span>
        <span className="text-[#74767e]">{`(${gig?.reviews?.length})`}</span>
      </div>
      <div>
        <strong className="font-medium">
          From <span className="text-green-700">${gig.price}</span>
        </strong>
      </div>
    </div>
  );
};

export default SearchGridItem;
