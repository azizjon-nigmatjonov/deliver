import MonthPicker from "components/MonthPicker";
import moment from "moment";
import { useRef } from "react";
import cls from "./styles.module.scss";

const Filter = ({ AbcXyzState, dispatchAbcXyz }) => {
  // AbcXyz details
  const onChange = (value, type) => {
    dispatchAbcXyz({ type: type, payload: value });
  };

  const handleStyle = (state, value) => {
    if (state === value) {
      return {
        backgroundColor: "#0e73f6",
        border: "none",
        color: "#fff",
      };
    }
  };

  // Month picker details
  const pickRangeRef = useRef(null);

  const handleRangeDismiss = (value) => {
    dispatchAbcXyz({
      type: "from_date",
      payload: `${value.from.month ? value.from.year : 2023}-${
        value.from.month
          ? value.from.month > 9
            ? value.from.month
            : `0${value.from.month}`
          : moment().subtract(1, "month").format("MM")
      }`,
    });
    dispatchAbcXyz({
      type: "to_date",
      payload: `${value.to.year}-${
        value.to.month
          ? value.to.month > 9
            ? value.to.month
            : `0${value.to.month}`
          : moment().format("MM")
      }`,
    });
  };

  return (
    <div className={cls.filters}>
      <div className={cls.abcxyz}>
        <div className={cls.abcxyz_wrapper}>
          ABC
          <div className={cls.buttons}>
            <button
              onClick={() => {
                onChange("A", "abc");
              }}
              style={handleStyle(AbcXyzState?.abc, "A")}
            >
              A
            </button>
            <button
              onClick={() => {
                onChange("B", "abc");
              }}
              style={handleStyle(AbcXyzState?.abc, "B")}
            >
              B
            </button>
            <button
              onClick={() => {
                onChange("C", "abc");
              }}
              style={handleStyle(AbcXyzState?.abc, "C")}
            >
              C
            </button>
          </div>
        </div>
        <div className={cls.abcxyz_wrapper}>
          XYZ
          <div className={cls.buttons}>
            <button
              onClick={() => {
                onChange("X", "xyz");
              }}
              style={handleStyle(AbcXyzState?.xyz, "X")}
            >
              X
            </button>
            <button
              onClick={() => {
                onChange("Y", "xyz");
              }}
              style={handleStyle(AbcXyzState?.xyz, "Y")}
            >
              Y
            </button>
            <button
              onClick={() => {
                onChange("Z", "xyz");
              }}
              style={handleStyle(AbcXyzState?.xyz, "Z")}
            >
              Z
            </button>
          </div>
        </div>
      </div>
      <MonthPicker
        value={{
          from: {
            year: moment(AbcXyzState.from_date).year(),
            month: moment(AbcXyzState.from_date).format("MM"),
          },
          to: {
            year: moment(AbcXyzState.to_date).year(),
            month: moment(AbcXyzState.to_date).format("MM"),
          },
        }}
        pickRangeRef={pickRangeRef}
        handleRangeDissmis={handleRangeDismiss}
      />
    </div>
  );
};

export default Filter;
