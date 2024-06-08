import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Table from "./Table";
import Header from "components/Header";
import Button from "components/Button";
import AddIcon from "@mui/icons-material/Add";
import PermissionWrapper from "components/PermissionsWrapper/PermissionsWrapper";

export default function Operator() {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <Header
        title={t("operator")}
        endAdornment={
          <PermissionWrapper permission="operator" action="add">
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => history.push("/home/personal/operator/create")}
            >
              {t("add")}
            </Button>
          </PermissionWrapper>
        }
      />
      <Table />
    </>
  );
}
