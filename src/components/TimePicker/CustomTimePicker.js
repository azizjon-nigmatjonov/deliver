import React from "react";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";

const DeliTimePicker = ({
  className = "",
  onChange,
  value,
  hideDisabledOptions,
  disabledHours,
  disabledMinutes,
  ...rest
}) => (
  <TimePicker
    {...rest}
    className={className}
    popupClassName={className}
    showSecond={false}
    onChange={onChange}
    hideDisabledOptions={hideDisabledOptions}
    disabledHours={disabledHours}
    disabledMinutes={disabledMinutes}
    value={value}
  />
);

export default DeliTimePicker;
