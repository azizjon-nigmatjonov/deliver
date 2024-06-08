import styles from "./style.module.scss";
import { useState } from "react";
import { useNotificationAlerts } from "services/v2/notification-alerts";
import ErrorAlerts from "./ErrorALerts";

const NotificationsAlert = () => {
  const [items, setItems] = useState();

  const { getNotificationAlertsQuery } = useNotificationAlerts({
    notificationParams: {
      page: 1,
      limit: 10,
      is_admin_panel: true,
    },
    notificationProps: {
      enabled: true,
      onSuccess: (res) => setItems(res?.notifications),
    },
  });

  return (
    <div className={styles.NotificationsWrapper}>
      {items?.map((item) => (
        <ErrorAlerts data={item} setItems={setItems} notifications={items} />
      ))}
    </div>
  );
};

export default NotificationsAlert;
