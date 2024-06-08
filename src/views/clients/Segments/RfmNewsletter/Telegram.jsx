import DatePicker from "components/DatePicker";
import DateTimePicker from "components/DateTimePicker";
import Form from "components/Form/Index";
import Gallery from "components/Gallery";
import Select from "components/Select";
import TextArea from "components/Textarea";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Telegram({ formik }) {
  const { values, setFieldValue } = formik;
  const { t } = useTranslation();
  const fileTypeOptions = [
    { value: "photo", label: t("photo") },
    { value: "video", label: t("Video") },
    { value: "gif", label: t("Gif") },
  ];
  const [fileType, setFileType] = useState({
    value: "photo",
    label: t("photo"),
  });
  return (
    <>
      <div className="flex items-end gap-8">
        <div className="w-2/3">
          <p className="flex-1 mb-[4px]">
            <span>Тип</span>
          </p>
          <Select
            height={40}
            id="tag_ids"
            options={fileTypeOptions}
            value={fileType}
            onChange={(val) => {
              setFileType(val);
            }}
          />
        </div>
        <div className="w-1/3">
          <DateTimePicker
            dateformat="DD.MM.YYYY"
            name="telegram.scheduled_at"
            defaultValue={moment(values.telegram.scheduled_at)}
            disabledDate={(date) => {
              return (
                moment(date).format("YYYY-MM-DD") <
                moment().format("YYYY-MM-DD")
              );
            }}
            onChange={(elm) => {
              setFieldValue("telegram.scheduled_at", elm);
              elm === null
                ? setFieldValue("telegram.scheduled_at", undefined)
                : setFieldValue(
                    "telegram.scheduled_at",

                    moment(elm).format("YYYY-MM-DD HH:mm:ss"),
                  );
            }}
            inputDateClear
            calendarStyle={{ zIndex: "999 !important", position: "absolute" }}
            style={{ height: "42px" }}
          />
        </div>
      </div>
      <div className="mt-3">
        <Form.Item formik={formik} name={`telegram.${fileType.value}`}>
          <div className="w-full h-full flex items-center flex-col">
            <Gallery
              extraTitle="Click to upload"
              className="w-full"
              width={"100%"}
              height={120}
              isVideo={fileType.value === "video"}
              gallery={
                values.telegram[fileType.value]
                  ? [values.telegram[fileType.value]]
                  : []
              }
              setGallery={(elm) =>
                setFieldValue(`telegram.${fileType.value}`, elm[0])
              }
              multiple={false}
              maxSize={fileType.value === "photo" ? 1 : 5}
            />
          </div>
        </Form.Item>
      </div>
      <div className="mt-3">
        <p className="flex-1 mb-[4px]">Описание</p>
        <Form.Item formik={formik} name={"telegram.text"}>
          <TextArea
            {...formik.getFieldProps(`telegram.text`)}
            placeholder="Введите описание"
          />
        </Form.Item>
      </div>
    </>
  );
}
