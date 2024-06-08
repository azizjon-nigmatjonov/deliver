import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Table from "./Table";
import Header from "components/Header";
import Button from "components/Button";
import Filters from "components/Filters";
import AddIcon from "@mui/icons-material/Add";
import Search from "components/Search";

export default function Cancels() {
  const { t } = useTranslation();
  const history = useHistory();

  const [search, setSearch] = useState("");

  return (
    <>
      <Header
        title={t("cancel-reasons")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/settings/content/cancel-reasons/create");
            }}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
      <Table search={search} />
    </>
  );
}
