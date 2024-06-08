import { Input } from "alisa-ui";
import React from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";

const PhoneInput = (
  { onChange, value, placeholder = "phone.number" },
  disabled = false,
) => {
  const { t } = useTranslation();
  return (
    <ReactInputMask
      id="phone"
      disabled={false}
      maskplaceholder={t(placeholder)}
      value={value}
      mask="+\9\98999999999"
      onChange={onChange}
    >
      {(inputProps) => (
        
        <Input
          {...inputProps}
          placeholder={t(placeholder)}
          onChange={onChange}
          size="large"
        />

      )}
    </ReactInputMask>
  );
};

export default PhoneInput;
