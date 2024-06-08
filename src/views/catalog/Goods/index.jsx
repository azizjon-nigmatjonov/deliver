import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Table from "./Table";
import Header from "components/Header";
import Button from "components/Button";
import Filters from "components/Filters";
import AddIcon from "@mui/icons-material/Add";
import Search from "components/Search";

export default function Goods() {
  const { t } = useTranslation();
  const history = useHistory();

  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(null);

  return (
    <>
      <Header
        title={t("goods")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/catalog/goods/create");
            }}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
      <Table
        createModal={createModal}
        setCreateModal={setCreateModal}
        search={search}
      />
    </>
  );
}
