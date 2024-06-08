import { useState } from "react";
import Table from "./Table";
import Header from "components/Header";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import Filters from "components/Filters";
import Search from "components/Search";

export default function Payme() {
  const { t } = useTranslation();
  const history = useHistory();
  const [search, setSearch] = useState("");

  return (
    <>
      <Header
        title="Payme"
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push("/home/settings/integrations/payme/create")
            }
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
