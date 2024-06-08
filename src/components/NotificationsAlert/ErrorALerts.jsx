import styles from "./style.module.scss";
import { SmileIcon, WarningTriangle } from "constants/icons";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const ErrorAlerts = ({ data, setItems, notifications }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        className={`${
          data?.type === "warning"
            ? styles.warning
            : data?.type === "news"
            ? styles.news
            : styles.alert
        } ${styles.NotificationDrop}`}
      >
        <div className={styles.Notification}>
          <div className={open ? styles.OpenedContent : styles.Content}>
            {data?.type === "news" ? <SmileIcon /> : <WarningTriangle />}
            <p className={open ? styles.openedTitle : styles.title}>
              {data?.title.ru}: {data?.text?.ru}
            </p>
          </div>
          {data?.type !== "alert" && (
            <div className={styles.Buttons}>
              {data?.title.ru.length + data?.text?.ru.length > 200 && (
                <button className={styles.more} onClick={() => setOpen(!open)}>
                  Читать больше
                </button>
              )}
              <CloseIcon
                onClick={() =>
                  setItems(
                    notifications?.filter((item) => item?.id !== data?.id),
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlerts;
