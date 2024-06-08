import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Table from "./Table";
import Header from "components/Header";
import Button from "components/Button";
import Filters from "components/Filters";
import AddIcon from "@mui/icons-material/Add";
import Select from "components/Select";

const userTypeOptions = [
  {
    label: "Пользователь админ панели",
    value: "2a1efd4a-d527-4cc2-adfa-a7546021f0f6",
  },
  {
    label: " Пользователь филиала",
    value: "195899b2-bd4d-4c51-a09e-c66b9a6bd22a",
  },
];

export default function UserRoles() {
  const { t } = useTranslation();
  const history = useHistory();

  const [userType, setUserType] = useState("");

  return (
    <>
      <Header
        title={t("user-roles")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/settings/user-roles/create");
            }}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Select
          placeholder="Тип пользователя"
          isClearable
          onChange={(value) => setUserType(value)}
          width={280}
          options={userTypeOptions}
        />
      </Filters>
      <Table userTypeId={userType?.value} />
    </>
  );
}
