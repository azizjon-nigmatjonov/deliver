import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Clipboard from "assets/icons/clipboard.svg";
import moment from "moment/moment";
import Button from "components/Button";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import HeaderDataWrapper from "./HeaderDataWrapper";

const HeaderDatas = ({ kitchenData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const showAverageTimer = () => {
    return kitchenData.average_time
      ? moment(kitchenData.average_time, "HH:mm:ss").format("HH:mm:ss")
      : "00:00:00";
  };
  return (
    <div className="flex gap-4">
      <Button onClick={() => history.push("/home/kitchen/finance")}>
        {t("finance")}
      </Button>
      <Button onClick={() => history.push("/home/kitchen-couriers")}>
        {t("couriers")}
      </Button>
      <Button onClick={() => history.push("/home/kitchen-history-orders")}>
        {t("history.orders")}
      </Button>
      <HeaderDataWrapper>
        <img src={Clipboard} alt="clipboard" />
        <p>Всего: {kitchenData.count || 0}</p>
      </HeaderDataWrapper>
      <HeaderDataWrapper>
        <AccessTimeIcon style={{ color: "#6E8BB7" }} />
        <p>{showAverageTimer()}</p>
      </HeaderDataWrapper>
    </div>
  );
};

export default HeaderDatas;
