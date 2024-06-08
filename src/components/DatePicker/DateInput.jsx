import {
  // Close as CloseIcon,
  CalendarToday as CalendarIcon,
  ExpandMoreRounded,
} from "@mui/icons-material";
import moment from "moment";
import { useState, useEffect } from "react";
import ReactInputMask from "react-input-mask";

const DateInput = ({
  icon,
  style,
  disabled,
  onChange,
  isFocused,
  placeholder,
  selectedDate,
  defaultValue,
  hideTimeBlock,
  className = "",
  setSelectedDate,
  setCalendarVisible,
  dateformat = "DD-MM-YYYY",
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (selectedDate || defaultValue) {
      setInputValue(
        (selectedDate ? selectedDate : defaultValue)?.format(
          dateformat || "DD-MM-YYYY HH:mm:ss",
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, dateformat]);

  // const clearInput = () => {
  //   setSelectedDate(null);
  //   onChange(null);
  //   setCalendarVisible(false);
  // };

  const onInputFocus = () => {
    setCalendarVisible(true);
  };

  const onInputChange = ({ target: { value } }) => {
    setInputValue(value);

    const date = moment(value, dateformat || "DD-MM-YYYY HH:mm:ss", true); // 3rd argument makes the validation strictly for date format
    if (date.isValid()) {
      onChange(date);
    }
  };

  return (
    <div
      style={style}
      className={`${className} date_input ${disabled ? "disabled" : ""}`}
    >
      {icon !== undefined ? icon : <CalendarIcon className="icon" />}
      <ReactInputMask
        mask={
          dateformat
            ? dateformat.replace(/[DMYH]/gi, "9")
            : "99-99-9999 99:99:99"
        }
        value={inputValue}
        onChange={onInputChange}
        placeholder={placeholder}
        onFocus={onInputFocus}
        disabled={disabled}
        className={`${icon !== undefined ? "no_icon" : ""} ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      />
      <ExpandMoreRounded
        className={`icon ${disabled ? "disabled" : ""}`}
        onClick={onInputFocus}
        style={{
          transform: isFocused ? "rotate(180deg)" : "rotate(0deg)",
          cursor: "pointer",
        }}
      />
      {/* {selectedDate && <CloseIcon className="icon" onClick={clearInput} />} */}
    </div>
  );
};

export default DateInput;
