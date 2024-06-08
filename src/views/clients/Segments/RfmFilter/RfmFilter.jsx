import { Input } from "alisa-ui";
import cls from "./styles.module.scss";

const RfmFilter = ({
  title,
  extraTitle,
  firstInputValue,
  secondInputValue,
  dispatchRfmState,
  rfmState,
  from,
  to,
  letter,
}) => {
  const handleInputChange = (value, type) => {
    dispatchRfmState({ type: type, payload: value });
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

  const isDisabled = () => {
    return rfmState?.[letter] > 0;
  };

  const handleFilterNumber = (filterType, value) => {
    rfmState?.[filterType] === value
      ? dispatchRfmState({ type: filterType, payload: 0 })
      : dispatchRfmState({ type: filterType, payload: value });
    dispatchRfmState({ type: "CLEAR_CASES" });
  };

  return (
    <div className={cls.main}>
      <div className={cls.headSection}>
        <p>
          {title} <span>({extraTitle})</span>
        </p>
        <div className={cls.buttons}>
          <button
            onClick={() => {
              handleFilterNumber(letter, 1);
            }}
            style={handleStyle(rfmState?.[letter], 1)}
          >
            1
          </button>
          <button
            onClick={() => {
              handleFilterNumber(letter, 2);
            }}
            style={handleStyle(rfmState?.[letter], 2)}
          >
            2
          </button>
          <button
            onClick={() => {
              handleFilterNumber(letter, 3);
            }}
            style={handleStyle(rfmState?.[letter], 3)}
          >
            3
          </button>
        </div>
      </div>
      <div className={`${cls.inputSection}`}>
        <Input
          onChange={(e) => {
            handleInputChange(e.target.value, from);
          }}
          placeholder="От"
          value={firstInputValue ?? ""}
          disabled={isDisabled()}
        />
        -
        <Input
          onChange={(e) => {
            handleInputChange(e.target.value, to);
          }}
          placeholder="До"
          value={secondInputValue ?? ""}
          disabled={isDisabled()}
        />
      </div>
    </div>
  );
};

export default RfmFilter;
