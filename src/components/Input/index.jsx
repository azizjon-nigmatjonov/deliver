import { useState } from "react";
import styles from "./index.module.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Input({
  icon = "",
  className = "",
  style,
  disabled,
  error,
  type = "text",
  endAdornment,
  ...rest
}) {
  const [inputType, setInputType] = useState(type);

  const changeVisibility = () => {
    setInputType((prev) => {
      if (prev === "text") return "password";
      else if (prev === "password") return "text";
    });
  };

  return (
    <div
      className={`${
        styles.wrapper
      } border bg-white overflow-hidden flex flex-1 space-x-2 items-center rounded-lg text-body relative p-1 px-2
                font-smaller focus-within:ring-1 focus-within:outline-none transition focus-within:border-blue-300
                ${error ? "border-red-600" : "border-gray-200"}
                ${className}
            `}
      style={style}
    >
      <div>{icon}</div>
      <input type={inputType} className={styles.input} {...rest} />
      {endAdornment && (
        <div
          className="absolute flex items-center justify-center px-4 inset-y-0 right-0 cursor-pointer"
          style={{
            color: "#6E7C87",
            backgroundColor: "#F6F8F9",
            borderLeft: "1px solid #E5E9EB",
          }}
        >
          {endAdornment}
        </div>
      )}
      {disabled && (
        <div
          className="absolute inset-0 rounded-l-md cursor-not-allowed"
          style={{
            backgroundColor: "rgba(221, 226, 228, 0.5)",
            margin: 0,
            width: endAdornment ? "calc(100% - 41px)" : "100%",
          }}
        />
      )}
      {type === "password" && (
        <div
          className={`${styles.visibility_btn} ${
            inputType === "text" ? styles.active : ""
          }`}
          onClick={changeVisibility}
        >
          <VisibilityIcon style={{ fontSize: "18px" }} />
        </div>
      )}
    </div>
  );
}
