import React from "react";
import { useTranslation } from "react-i18next";

const CardTab = ({
  title = "initial title",
  count = 0,
  bgColor = "#0E73F6",
  className = "",
}) => {
  const cardStyles = {
    backgroundColor: `${bgColor}`,
    // maxWidth: "326px",
    // width: "100%",
    padding: "12px",
    color: "#fff",
    borderRadius: "6px 6px 0 0 ",
  };

  const { t } = useTranslation();

  return (
    <div style={cardStyles} className={`block ${className}`}>
      <p className="font-bold">
        {t(title)} ({count})
      </p>
    </div>
  );
};

export default CardTab;
