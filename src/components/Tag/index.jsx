import { memo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material";

function Tag({
  children,
  icon: Icon,
  className = "",
  color = "blue",
  loading = false,
  disabled,
  shape = "filled",
  removable = false,
  size = "medium",
  textStyle,
  borderColor,
  lightMode,
  ...rest
}) {
  const [isClicked, setIsClicked] = useState(false);
  const theme = useTheme();

  const getSize = (key) => {
    switch (key) {
      case "small":
        return {
          size: "px-1",
          fontSize: "text-xs",
          radius: "rounded",
        };
      case "medium":
        return {
          size: "px-3",
          fontSize: "text-md",
          radius: "rounded-md",
        };
      case "large":
        return {
          size: "px-2 py-1",
          fontSize: "text-md",
          radius: "rounded-md",
        };

      default:
        break;
    }
  };

  const getShape = (key) => {
    switch (key) {
      case "filled":
        return {
          color: `bg-${color}-100 iconColor-filled text-${color}-600`,
        };
      case "outlined":
        return {
          color: `bg-transparent text-${color}-600 border  ${
            borderColor ? borderColor : `border-${color}-600"`
          }`,
        };
      case "subtle":
        return { color: `bg-${color}-100 text-${color}-600` };

      default:
        return { color: "iconColor-filled" };
    }
  };

  return (
    !isClicked && (
      <div
        className={`
          flex
          focus:outline-none
          transition
          justify-center
          text-white
          ${children ? "" : "w-9 h-9"}
          focus:ring focus:border-blue-300 
          ${getSize(size).size}
          ${getSize(size).radius}
          ${disabled ? "bg-gray-200 cursor-not-allowed" : getShape(shape).color}
          ${className}
        `}
        style={{
          backgroundColor: color
            ? (lightMode
                ? theme.palette[color]?.light
                : theme.palette[color]?.main) || "inherit"
            : "inherit",
          color: color
            ? (lightMode
                ? theme.palette[color]?.main
                : theme.palette[color]?.contrastText) || "inherit"
            : "inherit",
        }}
        onClick={() => console.log(theme.palette, theme.palette[color])}
        {...rest}
      >
        <div
          className={`flex  items-center ${
            children ? "space-x-1" : ""
          } font-semibold`}
        >
          {Icon && <Icon style={{ fontSize: "18px" }} />}

          <div className={`${getSize(size).fontSize}`} style={textStyle}>
            {children}
          </div>
          {removable && (
            <CloseIcon
              style={{ fontSize: "14px" }}
              className="cursor-pointer"
              onClick={() => setIsClicked((prev) => !prev)}
            />
          )}
        </div>
      </div>
    )
  );
}

export default memo(Tag);
