import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Header from "components/Header";
import Button from "components/Button";
import Table from "./discountsTable";

export default function Discounts() {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <Header
        title={t("surcharges_and_discounts")}
        endAdornment={
          <Button
            size="medium"
            icon={AddIcon}
            onClick={() => history.push("/home/settings/discounts/create")}
          >
            {t("add")}
          </Button>
        }
      />
      <div style={{ padding: "20px" }}>
        <Table />
      </div>
    </>
  );
}
