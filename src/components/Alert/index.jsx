import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import useSound from "use-sound";
import "./style.scss";

import boopSfx from "assets/sounds/notification.wav";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const AlertComponent = () => {
  const { t } = useTranslation();
  const alerts = useSelector((state) => state.alert.alerts);
  const [play] = useSound(boopSfx);

  useEffect(() => {
    if (alerts.length > 0)
      for (const alert of alerts) {
        if (alert?.data?.action === "new_order") {
          play();
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);

  return (
    <div
      className="alerts fixed left-2/4 top-5"
      style={{ transform: "translateX(-50%)" }}
    >
      {alerts?.map((alert) => (
        <Alert
          severity={alert.type}
          style={{ padding: "5px 30px" }}
          className={`${
            alert.type === "error" ? "shake-animation" : "fade_alert"
          } mb-3`}
          key={alert.id}
        >
          {alert?.data?.action === "new_order" ? (
            <>
              {t("new")} {t("order")}
            </>
          ) : (
            t(alert?.title)
          )}
        </Alert>
      ))}
    </div>
  );
};

export default AlertComponent;
