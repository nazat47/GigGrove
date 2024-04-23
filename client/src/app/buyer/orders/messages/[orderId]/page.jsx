import React from "react";
import MessageContainer from "../../../../../components/messages/MessageContainer";

const page = ({ params }) => {
  return (
    <div className="mt-36">
      <MessageContainer orderId={params.orderId} />
    </div>
  );
};

export default page;
