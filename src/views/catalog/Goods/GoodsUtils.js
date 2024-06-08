import * as Yup from "yup";
import i18n from "locales/i18n";

export const goodsValidationSchema = () => {
  return Yup.object().shape({
    description_ru: Yup.string().required(i18n.t("required.field.error")),
    description_en: Yup.string().required(i18n.t("required.field.error")),
    description_uz: Yup.string().required(i18n.t("required.field.error")),
    in_price: Yup.number().required(i18n.t("required.field.error")),
    out_price: Yup.number().required(i18n.t("required.field.error")),
    is_divisible: Yup.object()
      .required(i18n.t("required.field.error"))
      .shape({
        label: Yup.string().required(i18n.t("required.field.error")),
        value: Yup.string().required(i18n.t("required.field.error")),
      })
      .nullable(),
    title_ru: Yup.string().required(i18n.t("required.field.error")),
    title_en: Yup.string().required(i18n.t("required.field.error")),
    title_uz: Yup.string().required(i18n.t("required.field.error")),
    unit: Yup.object().required(i18n.t("required.field.error")).nullable(),
    currency: Yup.object()
      .required(i18n.t("required.field.error"))
      .shape({})
      .nullable(),
    category_ids: Yup.array()
      .required(i18n.t("required.field.error"))
      .nullable(),
    property_ids: Yup.array().of(
      Yup.object()
        .required(i18n.t("required"))
        .shape({
          label: Yup.string().required(i18n.t("required.field")),
          value: Yup.string().required(i18n.t("required.field")),
        }),
    ),
    code: Yup.string().required(i18n.t("required.field.error")),
    type: Yup.mixed().required(i18n.t("required.field.error")),
  });
};
