import Input from "components/Input";
import React from "react";
import DatePicker from "components/DatePicker/index.jsx";
import Form from "components/Form/Index";
import moment from "moment";
import DateTimePicker from "components/DateTimePicker";
import TextArea from "components/Textarea";

const Notification = ({ formik }) => {
  const { values, handleChange, setFieldValue } = formik;
  return (
    <>
      <div className="flex items-end gap-8">
        <div className="w-2/3">
          <p>Название</p>
          <Form.Item formik={formik} name="notification.title">
            <Input
              placeholder="Напишите свой текст"
              value={values.notification.title}
              onChange={handleChange}
              name="notification.title"
              style={{ height: "42px" }}
            />
          </Form.Item>
        </div>
        <div className="w-1/3">
          <Form.Item formik={formik} name="notification.scheduled_at">
            <DateTimePicker
              dateformat="DD.MM.YYYY"
              name="notification.scheduled_at"
              defaultValue={moment(values.notification.scheduled_at)}
              disabledDate={(scheduled_at) => {
                return (
                  moment(scheduled_at).format("YYYY-MM-DD") <
                  moment().format("YYYY-MM-DD")
                );
              }}
              onChange={(elm) => {
                //console.log(moment(elm).format("YYYY-MM-DD"))
                setFieldValue("notification.scheduled_at", elm);
                elm === null
                  ? setFieldValue("notification.scheduled_at", undefined)
                  : setFieldValue("notification.scheduled_at", elm);
              }}
              inputDateClear
              calendarStyle={{ zIndex: "999 !important", position: "absolute" }}
              style={{ height: "42px" }}
            />
          </Form.Item>
        </div>
      </div>
      <div className="mt-4">
        <p>Текст рассылки</p>
        <Form.Item formik={formik} name="notification.content">
           <TextArea
            {...formik.getFieldProps(`notification.content`)}
            placeholder="Напишите свой текст"
            name="notification.content"
          />
        </Form.Item>
      </div>
    </>
  );
};

export default Notification;
