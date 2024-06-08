import DatePicker from "components/DatePicker/index.jsx";
import Form from "components/Form/Index";
import moment from "moment";
import TextArea from "components/Textarea";
import { useTranslation } from "react-i18next";

const Sms = ({ formik }) => {
  const { values, setFieldValue } = formik;
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-8">
      <div className="w-2/3">
        <Form.Item formik={formik} name="sms.message" label={t("sms")}>
          <TextArea
            {...formik.getFieldProps(`sms.message`)}
            placeholder="Напишите свой текст"
            name="sms.message"
          />
        </Form.Item>
      </div>
      <div className="w-1/3">
        <Form.Item formik={formik} name="sms.scheduled_at" label={t("by_time")}>
          <DatePicker
            icon={null}
            dateformat="DD.MM.YYYY HH:mm"
            placeholder={t("enter.date")}
            onChange={(e) => {
              e === null
                ? setFieldValue("sms.scheduled_at", undefined)
                : setFieldValue("sms.scheduled_at", e);
            }}
            value={moment(values.sms.scheduled_at)}
            oldDateShow={false}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default Sms;
