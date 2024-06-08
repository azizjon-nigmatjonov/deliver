import React, { useMemo, useState } from "react";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import { useTranslation } from "react-i18next";
import Sms from "./Sms";
import { postRfmSms } from "services/v2/sms";
import moment from "moment";
import Modal from "components/ModalV2";
import { useFormik } from "formik";
import Telegram from "./Telegram";
import { postTelegramContent } from "services/telegram";
import Notification from "./Notification";
import { postNotification } from "services/v2/notification";
import Button from "components/Button/Buttonv2";

const RfmNewsletter = ({ open, onClose, rfmState }) => {
  // const [message, setMessage] = useState("");

  const { t } = useTranslation();
  // const [date, setDate] = useState(moment());
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const initialValues = useMemo(
    () => ({
      sms: {
        message: "",
        date: new Date(),
      },
      telegram: {
        text: "",
        scheduled_at: new Date(),
        video: "",
        photo: "",
        animation: "",
        file: "",
      },
      notification: {
        content: "",
        scheduled_at: "",
        title: "",
      },
    }),
    [],
  );
  const body = (data) => ({
    ...data,
    scheduled_at: moment(data.scheduled_at).isValid()
      ? moment(data.scheduled_at).format("YYYY-MM-DD HH:mm:ss")
      : "",
    filter: {
      ...rfmState,
      type: "rfm",
    },
  });
  const onSubmit = async (data, { resetForm }) => {
    if (value === 0) {
      await sendSms(body(data.sms));
    } else if (value === 1) {
      await sendTelegram(body(data.telegram));
    } else {
      await sendNotification(body(data.notification));
    }
    resetForm({ data: "" });
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const { handleSubmit } = formik;
  async function sendSms(data) {
    await postRfmSms({
      ...data,
      text: data.message,
    })
      .then(() => {
        onClose();
      })
      .catch((err) => console.log(err));
  }
  async function sendTelegram(data) {
    await postTelegramContent(data)
      .then(() => {
        onClose();
      })
      .catch((err) => console.log(err));
  }
  async function sendNotification(data) {
    await postNotification(data)
      .then(() => {
        onClose();
      })
      .catch((err) => console.log(err));
  }
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );
  const [value, setValue] = useState(0);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("newsletter")}
      maxWidth="md"
      fullWidth
      contentsx={{ overflow: "visible" }}
    >
      <div className="mb-4" style={{ minHeight: "400px" }}>
        <div className="mb-4 border-b">
          <StyledTabs
            value={value}
            onChange={handleChangeTab}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={tabLabel(t("sms"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("Telegram"))} {...a11yProps(1)} />
            <StyledTab label={tabLabel(t("app"))} {...a11yProps(2)} />
          </StyledTabs>
        </div>
        <TabPanel value={value} index={0}>
          <Sms formik={formik} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Telegram formik={formik} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Notification formik={formik} />
        </TabPanel>
      </div>
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        {t("send")}
      </Button>
    </Modal>
  );
};

export default RfmNewsletter;
