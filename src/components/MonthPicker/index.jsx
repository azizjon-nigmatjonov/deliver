import { useTranslation } from "react-i18next";
import Picker from "react-month-picker";
import "./style.scss";

export default function MonthPicker({
  value,
  pickRangeRef,
  handleRangeDissmis,
}) {
  const { t } = useTranslation();

  const pickerLang = {
    months: [
      t("January"),
      t("February"),
      t("March"),
      t("April"),
      t("May"),
      t("June"),
      t("July"),
      t("August"),
      t("September"),
      t("October"),
      t("November"),
      t("December"),
    ],
    from: t("from"),
    to: t("to"),
  };

  const makeText = (m) => {
    if (m && m.year && m.month) {
      return pickerLang.months[m.month - 1] + ". " + m.year;
    } else {
      return "?";
    }
  };

  const handleClickRangeBox = (e) => {
    pickRangeRef.current.show();
  };

  const handleRangeChange = (value, text, listIndex) => {
    // if(listIndex === 1){
    //   console.log("TUGADI")
    //   handleRangeDissmis()
    // }
  };

  return (
    <>
      <div className="edit">
        <Picker
          ref={pickRangeRef}
          value={value}
          lang={pickerLang}
          theme="light"
          onDismiss={handleRangeDissmis}
          onChange={handleRangeChange}
        >
          <div
            style={{
              fontSize: "14px",
              border: "1px solid #E4E7EB",
              borderRadius: "6px",
              padding: "5px 14px",
              color: "#30393F",
            }}
            onClick={handleClickRangeBox}
          >
            {makeText(value.from) + " ~ " + makeText(value.to)}
          </div>
        </Picker>
      </div>
    </>
  );
}
