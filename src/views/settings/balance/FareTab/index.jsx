import React, { useState } from "react";
import FareTable from "./FareTable";
import CurrentFareForm from "./CurrentFareForm";

const Fare = ({ isTable }) => {
  const [fareName, setFareName] = useState("");
  return (
    <div className="m-4">
      {isTable ? (
        <FareTable fareName={fareName} />
        ) : (
        <CurrentFareForm setFareName={setFareName} />
      )}
    </div>
  );
};

export default Fare;
