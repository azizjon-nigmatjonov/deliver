import { useEffect, useState } from "react";
import Calendar from "rc-calendar";
import OutsideClickHandler from "react-outside-click-handler";
// import TimePickerPanel from "rc-time-picker/lib/Panel";
import "rc-time-picker/assets/index.css";
import "rc-calendar/assets/index.css";
import "./index.scss";
import DateInput from "./DateInput";
import moment from "moment";

const DatePicker = ({
  icon,
  error,
  style,
  value,
  disabled,
  className = "",
  placeholder = "Select a date",
  mode = "date",
  onChange = () => {},
  dateformat,
  inputDateClear,
  oldDateShow = false,
  isMonth = false, // you should pass this prop as true if you wanna close calendar after choosing month
  defaultValue,
  calendarStyle,
}) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const onCalendarSelect = (date) => {
    setSelectedDate(date);
    setCalendarVisible(false);
    onChange(date);
  };

  const calendarChangeHandler = (date) => {
    setSelectedDate(date);
    isMonth && setCalendarVisible(false);
    onChange(date);
  };

  const calendarSelectHandler = (date) => {
    setSelectedDate(date);
    setCalendarVisible(false);
    onChange(date);
  };

  function disabledDate(date) {
    if (!date) {
      return false;
    }

    const current = moment().startOf("day").format();
    return date.startOf("day").format() < current;
  }
  return (
    <OutsideClickHandler onOutsideClick={(e) => setCalendarVisible(false)}>
      <div className="date-picker">
        <DateInput
          icon={icon}
          style={style}
          onChange={onChange}
          disabled={disabled}
          className={className}
          dateformat={dateformat}
          placeholder={placeholder}
          defaultValue={defaultValue}
          selectedDate={selectedDate}
          isFocused={calendarVisible}
          setCalendarVisible={setCalendarVisible}
        />

        {calendarVisible && !disabled && (
          <Calendar
            className="date-picker__calendar z-50"
            value={selectedDate}
            onSelect={onCalendarSelect}
            style={calendarStyle}
            onChange={calendarChangeHandler}
            onOk={calendarSelectHandler}
            mode={mode}
            disabledDate={(!oldDateShow && disabledDate) || undefined} // can not select days before today
          />
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default DatePicker;
