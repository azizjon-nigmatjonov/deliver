import InputWithAdornment from "components/inputWithAdornments";

function ColorInput({ value, handleChange, ...props }) {
  return (
    <InputWithAdornment
      className="grid grid-cols-3 border border-lightgray-1 rounded-md w-40"
      style={{ container: { height: "32px", width: "172px" } }}
      prefix={
        <div
          className="min-h-5 min-w-5 w-5 h-5 ml-3 flex items-center overflow-hidden rounded shadow"
          style={{ backgroundColor: value }}
        />
      }
      suffix={
        <div
          className="flex items-center justify-center text-sm h-full ml-3"
          style={{
            background: "#F6F8F9",
            borderLeft: "1px solid #E5E9EB",
          }}
        >
          HEX
        </div>
      }
      onChange={handleChange}
      value={value}
      type="text"
      {...props}
    />
  );
}

export default ColorInput;
