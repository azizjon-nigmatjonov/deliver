import { useState, useEffect } from "react";
import Calendar from "rc-calendar";
import OutsideClickHandler from "react-outside-click-handler";
import TimePickerPanel from "rc-time-picker/lib/Panel";
import "rc-time-picker/assets/index.css";
import "rc-calendar/assets/index.css";
import "./index.scss";
import DateInput from "./DateInput";
import moment from "moment";

const DateTimePicker = ({
  disabled,
  error,
  className = "",
  style,
  placeholder = "Select a date",
  value,
  hideTimeBlock,
  hideTimePicker = false,
  onChange = () => {},
  dateformat,
  inputDateClear,
  ...rest
}) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);
  useEffect(() => {
    setSelectedDate();
  }, [inputDateClear]);
  const calendarChangeHandler = (date) => {
    setSelectedDate(date);
    // setCalendarVisible(false);
    onChange(date);
  };

  const calendarSelectHandler = (date) => {
    setSelectedDate(date);
    setCalendarVisible(false);
    onChange(date);
  };

  const timePickerElement = <TimePickerPanel />;

  return (
    <OutsideClickHandler onOutsideClick={(e) => setCalendarVisible(false)}>
      <div className="date-picker">
        <DateInput
          dateformat={dateformat}
          placeholder={placeholder}
          className={className}
          setCalendarVisible={setCalendarVisible}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarVisible={calendarVisible}
          disabled={disabled}
          error={error}
          hideTimeBlock={hideTimeBlock}
          style={style}
          onChange={onChange}
          {...rest}
        />

        {calendarVisible && !disabled && (
          <Calendar
            className="date-picker__calendar z-50"
            value={selectedDate}
            // defaultValue={moment()}
            onSelect={calendarChangeHandler}
            onChange={calendarChangeHandler}
            onOk={calendarSelectHandler}
            timePicker={!hideTimePicker ? timePickerElement : null}
            {...rest}
          />
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default DateTimePicker;
