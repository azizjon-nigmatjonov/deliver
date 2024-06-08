import { useRef } from "react";
import RcSelect, { components } from "react-select";
import ComboIcon from "../../assets/icons/combo-icon.svg";

export const customStyles = ({
  error = false,
  borderRight = "1px solid #eee",
  borderLeft = "1px solid #eee",
  width = "100%",
  height = "32px",
  showClearIcons,
  containerValue,
  dropdownIndicator,
}) => ({
  control: (styles) => {
    return {
      ...styles,
      width: width,
      minHeight: height,
      borderRadius: 6,
      border: error
        ? "1px solid rgb(220, 38, 37)"
        : "1px solid rgba(229, 231, 235)",
      ":hover": {
        border: error
          ? "1px solid rgb(220, 38, 37, 0.5)"
          : "1px solid rgba(64, 148, 247, 1)",
      },
      borderRight: borderRight,
      boderLeft: borderLeft,

      ":focus-within": {
        border: "1px solid var(--primary-color)",
        boxShadow:
          "var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
      },
    };
  },
  valueContainer: (provided, state) => ({
    ...provided,
    padding: containerValue ? "0 0 0 50px " : "0 14px",
    fontSize: "14px",
    lineHeight: "140%",
  }),
  multiValue: (provided, { data }) => ({
    ...provided,
    backgroundColor: data?.color ? data?.color : "#EEF0F2",
    borderRadius: "4px",
    padding: `0px ${data.isFixed ? "5px" : "0px"} 0px 5px`,
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: "#303940",
    // fontSize: "100%",
    // padding: "2px 5px 2px 0",
  }),
  input: (provided, state) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: (state) => ({
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: height,
  }),
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: "#999",
    };
  },
  option: (styles, { data, isDisabled, isSelected }) => ({
    ...styles,
    fontWeight: 500,
    color: isDisabled ? "#3039408F" : isSelected ? "#fff" : "#303940",
    paddingLeft: isDisabled ? "6px" : "24px",
    borderBottom: "1px solid #E5E9EB",
    display: isDisabled ? "flex" : "block",
    alignItems: isDisabled ? "center" : undefined,
    gap: isDisabled ? "4px" : undefined,
  }),
  multiValueRemove: (provided, { data }) =>
    !showClearIcons || data.isFixed
      ? { ...provided, display: "none" }
      : {
          ...provided,
          borderRadius: "4px",
          color: "#9aa6ac",
          fontSize: "16px",
          cursor: "pointer",
        },
  dropdownIndicator: (base, state) => {
    return !showClearIcons || !dropdownIndicator
      ? { ...base, display: "none" }
      : { ...base, padding: "6px 8px" };
  },
});

function Select({
  children,
  className = "",
  placeholder = "",
  width = "100%",
  height = "32px",
  isClearable = false,
  isSearchable = false,
  isMulti = false,
  disabled = false,
  isLoading = false,
  options = [],
  borderRight,
  borderLeft,
  maxMenuHeight = "initial",
  customOptionMulti = false,
  defaultValue,
  style,
  error,
  onChange,
  onInputChange,
  onClickOption,
  useZIndex,
  dropdownIndicator = true,
  showClearIcons = true,
  containerValue,
  ...rest
}) {
  const MultiValueLabel = (props) => {
    return (
      customOptionMulti && (
        <div
          className="cursor-pointer"
          onClick={() => onClickOption(props.data)}
        >
          <components.MultiValueLabel {...props} />
        </div>
      )
    );
  };

  const ValueContainer = ({ children, ...props }) => {
    return (
      <components.ValueContainer {...props}>
        {!!children && (
          <div>
            <img
              src={containerValue ? containerValue : ComboIcon}
              alt="valuecontainer"
              style={{
                position: "absolute",
                backgroundColor: "#f4f6fa",
                padding: "10px 16px",
                left: -1,
                bottom: -1,
              }}
            />
          </div>
        )}
        {children}
      </components.ValueContainer>
    );
  };

  const selectRef = useRef();

  return (
    <div
      style={style}
      className={`${className} text-body focus-within:z-40 border-0`}
    >
      <RcSelect
        className="basic-single"
        classNamePrefix="select"
        ref={selectRef}
        components={
          (customOptionMulti && { MultiValueLabel },
          containerValue && { ValueContainer })
        }
        placeholder={placeholder}
        defaultValue={defaultValue}
        isDisabled={disabled}
        isLoading={isLoading}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        maxMenuHeight={maxMenuHeight}
        options={options}
        styles={customStyles({
          error,
          borderRight,
          borderLeft,
          width,
          height,
          showClearIcons,
          dropdownIndicator,
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        })}
        onChange={onChange}
        onInputChange={onInputChange}
        menuPortalTarget={useZIndex && document.querySelector("body")}
        {...rest}
      />
      {/* <input
        tabIndex={-1}
        autoComplete="off"
        style={{
          opacity: 0,
          width: "100%",
          height: 0,
          position: "absolute",
        }}
        // onChange={noop}
        value=""
        onFocus={() => selectRef.focus()}
        required={true}
      /> */}
    </div>
  );
}

export default Select;
