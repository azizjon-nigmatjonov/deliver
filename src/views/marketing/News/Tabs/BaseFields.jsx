import { cloneElement } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import RangePicker from "components/DateTimePicker/RangePicker";
import Form from "components/Form/Index";
import Gallery from "components/Gallery/v2";

function BaseFields({ formik, lang }) {
  const { t } = useTranslation();
  const { values, setFieldValue } = formik;

  return (
    <div className="flex flex-col gap-3 pt-4">
      {cloneElement(lang, {
        formik: formik,
      })}
      <Form.Item formik={formik} name="image" label={t("photo")}>
        <div className="flex items-center gap-3">
          <Gallery
            width={100}
            height={100}
            gallery={values.images?.length ? values.images : []}
            setGallery={(images) => {
              setFieldValue("images", [...images]);
            }}
            maxSizeText=""
            bottomText={false}
            // maxSizeText="max.size.1mb"
            // extraTitle="600x400"
            // accept="image/jpeg"
            style={{ flexDirection: "row" }}
          />
        </div>
      </Form.Item>
      <Form.Item formik={formik} name="from_date" label={t("time_date")}>
        <RangePicker
          hideTimePicker
          placeholder={t("choose.period")}
          dateValue={[
            values.from_date ? moment(values.from_date) : undefined,
            values.to_date ? moment(values.to_date) : undefined,
          ]}
          onChange={(e) => {
            if (e[0] === null) {
              setFieldValue("from_date", undefined);
              setFieldValue("to_date", undefined);
            } else {
              setFieldValue("from_date", moment(e[0]).format("YYYY-MM-DD"));
              setFieldValue("to_date", moment(e[1]).format("YYYY-MM-DD"));
            }
          }}
        />
      </Form.Item>
    </div>
  );
}

export default BaseFields;
