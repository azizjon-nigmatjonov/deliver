import React from "react";
import { Input } from "alisa-ui";

const SuperInput = ({
  onChange,
  value = "",
  maxLength = "",
  isValidateNumber = false,
  ...rest
}) => {
  return (
    <Input
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      {...rest}
      onKeyPress={(event) => {
        if (isValidateNumber && !/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
    />
  );
};

export default SuperInput;
