import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import Header from "../../../components/Header";
import Button from "../../../components/Button";

import AddIcon from "@mui/icons-material/Add";
import BPTable from "./BPTable";

const BonusPenalty = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div>
      <Header
        title={t("courier.bonus-penalty")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push(
                "/home/personal/couriers/courier-bonus-penalty/create",
              )
            }
          >
            {t("add")}
          </Button>
        }
      />
      <BPTable />
    </div>
  );
};

export default BonusPenalty;
