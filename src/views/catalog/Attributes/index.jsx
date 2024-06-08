import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import Button from "components/Button";
import Table from "./Table";
import AddIcon from "@mui/icons-material/Add";
import { useHistory } from "react-router-dom";
import Search from "components/Search";

export default function Attributes() {
  const { t } = useTranslation();
  const history = useHistory();

  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(null);

  return (
    <>
      <Header
        title={t("product.attributes")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => history.push("/home/catalog/attributes/create")}
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
