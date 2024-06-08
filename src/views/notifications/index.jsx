import { useState } from "react";
import { useNotificationAlerts } from "services/v2/notification-alerts";
import TableNotifications from "./TableNotificaitons";
import CModal from "components/Modal";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss";
import Header from "components/Header";

const Notifications = () => {
  const [id, setId] = useState("");
  const [dataByID, setDataByID] = useState();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { getNotificationAlertsByIDQuery } = useNotificationAlerts({
    notificationAlertsId: id,
    notificationIdProps: {
      enabled: !!id,
      onSuccess: (res) => setDataByID(res),
    },
  });

  return (
    <div>
      <Header title={t("notification")} />
      <TableNotifications setId={setId} setOpen={setOpen} />
      <CModal
        title={t("general.information")}
        footer={null}
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={true}
        isWarning={false}
      >
        {console.log(dataByID)}
        <label className={styles.label} htmlFor="title">
          {t("name")}
        </label>
        <p className={styles.text}>{dataByID?.title?.ru}</p>
        <label className={styles.label} htmlFor="title">
          {t("text")}
        </label>
        <p className={styles.text}>{dataByID?.text?.ru}</p>
      </CModal>
    </div>
  );
};

export default Notifications;
