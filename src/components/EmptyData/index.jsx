import React from "react";
import noData from "./img/empty-drawer- (2).png";
import "./style.scss";

function EmptyData({ title = "No Data", loading }) {
  if (loading) return null;

  return (
    <div className="EmptyDataComponent">
      <div className="block">
        <div className="icon">
          <img src={noData} alt="no data" />
        </div>
        <h2 variant="body1">{title}</h2>
      </div>
    </div>
  );
}

export default EmptyData;
