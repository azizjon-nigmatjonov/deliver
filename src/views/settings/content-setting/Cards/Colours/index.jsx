import React from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import ColorInput from "components/FormElements/ColorInput";
import { useTranslation } from "react-i18next";
import ColourExmple from "assets/ColourExample.png";

const Colours = ({ formik }) => {
  const { t } = useTranslation();

  const { handleChange, values } = formik;

  return (
    <Card
      title={t("colour.systems")}
      className="h-full flex flex-col"
      bodyClass="flex gap-5 justify-between flex-wrap h-full"
    >
      <div className="flex-1">
        <div className="flex justify-between gap-4 items-center">
          <div className="input-label label-x">
            <label>{t("primary")}</label>
          </div>
          <div>
            <Form.Item formik={formik} name="colours.primary">
              <ColorInput
                value={values?.colours?.primary}
                handleChange={handleChange}
                title={t("primary")}
                id="colours.primary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-between gap-4 my-4 items-center">
          <div className="input-label label-x">
            <label>{t("secondary")}</label>
          </div>
          <div>
            <Form.Item formik={formik} name="colours.secondary">
              <ColorInput
                value={values?.colours?.secondary}
                handleChange={handleChange}
                title={t("secondary")}
                id="colours.secondary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-between gap-4 items-center">
          <div className="input-label label-x">
            <label>{t("brand_color")}</label>
          </div>
          <div>
            <Form.Item formik={formik} name="colours.brand">
              <ColorInput
                value={values?.colours?.brand}
                handleChange={handleChange}
                title={t("brand_color")}
                id="colours.brand"
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className="border flex-1 flex flex-wrap gap-2 p-2">
        <div>
          <h2 className="mb-4">{t("example")}</h2>
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2">
              <small>{t("main")}: </small>
              <div
                className="min-h-5 min-w-5 w-5 h-5 ml-3 flex items-center overflow-hidden rounded shadow"
                style={{ backgroundColor: "#FE6A00" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <small>{t("secondary")}: </small>
              <div
                className="min-h-5 min-w-5 w-5 h-5 ml-3 flex items-center overflow-hidden rounded shadow"
                style={{ backgroundColor: "#ffb27b" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <small>{t("brand")}: </small>
              <div
                className="min-h-5 min-w-5 w-5 h-5 ml-3 flex items-center overflow-hidden rounded shadow"
                style={{ backgroundColor: "#5982E7" }}
              />
            </div>
          </div>
        </div>
        <img src={ColourExmple} alt="colourExample" className="flex-1 object-contain" />
      </div>
    </Card>
  );
};

export default Colours;
