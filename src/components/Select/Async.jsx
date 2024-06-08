import AsyncSelect from "react-select/async";

const customStyles = (styles, error = false, minWidth) => {
  return {
    ...styles,
    control: (base, { data, isDisabled }) => {
      return {
        ...base,
        backgroundColor: isDisabled ? "#f2f2f2" : "#fff",
        сolor: isDisabled ? "rgba(0, 0, 0, 0.38)" : "#000",
        minWidth: minWidth || 176,
        borderRadius: 6,
        height: "100%",
        minHeight: 0,
        border: error ? "2px solid #F76659" : "1px solid rgba(229, 231, 235)",
        ":hover": {
          border: error
            ? "2px solid #f7675979"
            : "1px solid rgba(64, 148, 247, 1)",
        },
        ":focus-within": {
          border: "1px solid var(--primary-color)",
          boxShadow:
            "var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
        },
      };
    },
    valueContainer: (base, state) => ({
      ...base,
      padding: "0 14px",
      fontSize: "14px",
      lineHeight: "140%",
    }),
    indicatorSeparator: (base, state) => ({
      display: "none",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      padding: "6px 8px",
    }),
    clearIndicator: (base, state) => ({
      ...base,
      padding: "6px 8px",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 1350 }),
    menu: (base, state) => {
      return { ...base, zIndex: 2, position: "absolute" };
    },
    option: (base, { data, isDisabled, isSelected }) => ({
      ...base,
      fontWeight: 500,
      color: isDisabled ? "#3039408F" : isSelected ? "#fff" : "#303940",
      paddingLeft: isDisabled ? "6px" : "24px",
      borderBottom: "1px solid #E5E9EB",
      display: isDisabled ? "flex" : "block",
      alignItems: isDisabled ? "center" : undefined,
      gap: isDisabled ? "4px" : undefined,
      wordBreak: "break-all",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: "#EEF0F2",
      borderRadius: "4px",
      padding: "0px 0px 0px 5px",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: "#303940",
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      borderRadius: "4px",
      color: "#9AA6AC",
      fontSize: "16px",
      cursor: "pointer",
    }),
  };
};

export default function Async({
  loadOptions = () => {},
  onChange = () => {},
  onInputChange = () => {},
  defaultOptions,
  cacheOptions = false,
  isClearable = false,
  isMulti = false,
  styles = {},
  minWidth,
  useZIndex = true,
  error,
  errorText,
  ...rest
}) {
  return (
    <>
      <AsyncSelect
        isMulti={isMulti}
        isClearable={isClearable}
        cacheOptions={cacheOptions}
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        onChange={onChange}
        onInputChange={onInputChange}
        menuPortalTarget={
          !useZIndex ? document.getElementById("portal-root") : null
        }
        styles={customStyles(styles, error, minWidth)}
        {...rest}
      />
      {errorText && (
        <p
          style={{
            fontWeight: 500,
            fontSize: 12,
            color: "#F76659",
          }}
        >
          {errorText}
        </p>
      )}
    </>
  );
}
