import { useTranslation } from "react-i18next";
import Table from "./Table";
import Header from "components/Header";

import { useState } from "react";
import Filters from "components/Filters";
import Search from "components/Search";
import { useHistory } from "react-router-dom";
import Button from "components/Button";
import AddIcon from "@mui/icons-material/Add";

export default function Reviews() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const history = useHistory();

  return (
    <>
      <Header
        title={t("reviews")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/settings/content/reviews/create");
            }}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
      <Table search={search} setSearch={setSearch} />
    </>
  );
}
