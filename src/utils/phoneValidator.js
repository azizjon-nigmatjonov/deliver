import * as yup from "yup";
import i18n from "locales/i18n";
const PHONE_REG_EX =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
export const phoneValidation = () => {
  return yup
    .string()
    .required(i18n.t("required.field.error"))
    .matches(PHONE_REG_EX, i18n.t("invalid phone number"));
};
