import React from "react";

const HeaderDataWrapper = ({ children }) => {
  return (
    <div className="flex items-center gap-3 border border-lightgray-1 text-sm rounded-md px-4 h-9">
      {children}
    </div>
  );
};

export default HeaderDataWrapper;
