import styled from "@emotion/styled";
import TimePicker from "./CustomTimePicker";

const StyledTimePicker = styled(TimePicker)`
  & .rc-time-picker-panel-select-option-selected {
    background-color: #edeffe;
    font-weight: normal;
  }

  & .rc-time-picker-clear,
  & .rc-time-picker-clear-icon:after {
    font-size: 15px;
    margin-top: 3px;
  }

  & .rc-time-picker-panel-select,
  & .rc-time-picker-input,
  & .rc-time-picker-panel-input {
    font-size: 16px;
    cursor: pointer;
    padding-left: 11px; 
    border-radius: 6px; 
    border: 1px solid #E5E9EB;
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

export default StyledTimePicker;
