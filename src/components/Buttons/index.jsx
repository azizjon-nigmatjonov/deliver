import "./index.scss";

export default function Button(props) {
  const {
    className = "",
    children,
    icon = "",
    color = "text-gray-900",
    shape = "filled",
    size = "medium",
    type = "button",
    isVisible = true,
    ...rest
  } = props;
  const getSize = (key) => {
    switch (key) {
      case "small":
        return {
          size: "px-3 py-1",
          fontSize: "text-xs",
        };
      case "medium":
        return {
          size: "px-3 py-1 min:w-7 min:h-7",
          fontSize: "text-sm",
        };
      case "large":
        return {
          size: "px-6 py-2",
          fontSize: "text-base",
        };

      default:
        break;
    }
  };

  const getShape = (key) => {
    switch (key) {
      case "filled":
        return { color: color + " iconColor-filled hover:bg-secondary" };
      case "outlined":
        return {
          color:
            color +
            " bg-white iconColor-outlined text-gray-900  border hover:bg-secondary",
        };
      case "text":
        return { color: " bg-transparent iconColor-text " + color };

      default:
        return { color: "iconColor-filled" };
    }
  };

  if (!isVisible) return null;

  return (
    <button
      type={type}
      className={`
                      rounded-lg
                      focus:outline-none
                      transition
                      ${children ? "" : "w-9 h-9"}
                      focus:ring focus:border-blue-300 
                      ${getSize(size).size}
                      ${
                        props.disabled
                          ? "bg-gray-200 cursor-not-allowed"
                          : getShape(shape).color
                      }
                      text-white
                      ${className}
                    `}
      {...rest}
    >
      <div
        className={`flex justify-around items-center ${
          children ? "space-x-2" : ""
        } font-medium font-semibold`}
      >
        <div>{icon}</div>
        <div className={getSize(size).fontSize}>{children}</div>
      </div>
    </button>
  );
}
