import { useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

export default function Sorter({ onChange = () => {}, customIcon = false }) {
  const [status, setStatus] = useState();

  const handleClick = () => {
    if (status === "asc") {
      onChange("desc");
      setStatus("desc");
    } else if (status === "desc") {
      onChange(undefined);
      setStatus(undefined);
    } else {
      onChange("asc");
      setStatus("asc");
    }
  };

  return (
    <div
      style={{ width: 20, height: 20, color: "#6E8BB7BF" }}
      className="fill-current cursor-pointer flex flex-col items-center"
      onClick={handleClick}
    >
      {customIcon ? (
        <>
          {status === "asc" ? (
            <div
              className={`fill-current ${
                status === "asc" ? "text-blue-600" : ""
              }`}
              style={{ marginRight: 8, marginTop: -3 }}
              key="arrowdropupicon"
            >
              <ArrowDownward fontSize="medium" />
            </div>
          ) : (
            <div
              className={`fill-current ${
                status === "desc" ? "text-blue-600" : ""
              }`}
              style={{ marginRight: "8px", marginTop: -3 }}
              key="arrowdropdownicon"
            >
              <ArrowUpward fontSize="medium" />
            </div>
          )}
        </>
      ) : (
        <>
          <div
            className={`fill-current ${
              status === "asc" ? "text-blue-600" : ""
            }`}
            style={{ marginTop: "-10px" }}
            key="arrowdropupicon"
          >
            <ArrowDropUpIcon fontSize="medium" />
          </div>
          <div
            className={`fill-current ${
              status === "desc" ? "text-blue-600" : ""
            }`}
            style={{ marginTop: "-9px" }}
            key="arrowdropdownicon"
          >
            <ArrowDropDownIcon fontSize="medium" />
          </div>
        </>
      )}
    </div>
  );
}
