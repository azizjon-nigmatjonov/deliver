import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Table from "./Table";
import Header from "components/Header";
import Button from "components/Button";
import Filters from "components/Filters";
import AddIcon from "@mui/icons-material/Add";
import Search from "components/Search";

export default function Units() {
  const { t } = useTranslation();
  const history = useHistory();

  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(null);

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
        icon={FIlterIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked");
        }}
      >
        {t("filter")}
      </Button>

      <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button> */}
    </div>
  );

  return (
    <>
      <Header
        title={t("unit")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/catalog/units/create");
            }}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters extra={extraFilter}>
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
