import i18n from "locales/i18n";

var translate = function (str) {
  return i18n.t(str);
};

export default function genSelectOption(
  val = "",
  location,
  details,
) {
  if (Array.isArray(val)) {
    return val.map((el) => ({
      label: translate(el),
      value: el,
      location,
      details,
    }));
  }

  return { label: translate(val), value: val, location, details };
}
