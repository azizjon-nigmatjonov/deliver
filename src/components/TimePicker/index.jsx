import moment from "moment";
import "rc-time-picker/assets/index.css";
import StyledTimePicker from "./StyledTimePicker";

export default function TimePicker({
  onChange,
  futureTime,
  value,
  isTodaySelected,
  ...rest
}) {
  const getDisabledHours = () => {
    var hours = [];
    for (var i = 0; i < moment().hour(); i++) {
      hours.push(i);
    }
    if (+futureTime + moment().minute() > 60) {
      hours.push(moment().hour());
    }
    return isTodaySelected ? hours : null;
  };

  const getDisabledMinutes = (selectedHour) => {
    var minutes = [];

    if (moment().minute() + +futureTime < 60) {
      if (selectedHour === moment().hour()) {
        for (var i = 0; i < moment().minute() + +futureTime; i++) {
          minutes.push(i);
        }
      }
    } else {
      for (
        var k = 0;
        k < Math.abs(+futureTime - (60 - moment().minute()));
        k++
      ) {
        minutes.push(k);
      }
    }

    return isTodaySelected ? minutes : null;
  };
  return (
    <StyledTimePicker
      value={value}
      //   showHour={false}
      placeholder="Время"
      showSecond={false}
      inputReadOnly={true}
      onChange={onChange}
      allowEmpty
      hideDisabledOptions={isTodaySelected}
      disabledHours={getDisabledHours}
      disabledMinutes={getDisabledMinutes}
      {...rest}
    />
  );
}
