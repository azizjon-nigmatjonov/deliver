import { useState } from "react";
import Table from "./Table";
import Header from "components/Header";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import Filters from "components/Filters";
import Search from "components/Search";

export default function Apelsin() {
  const { t } = useTranslation();
  const history = useHistory();

  const [search, setSearch] = useState("");

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
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
        title="Apelsin"
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push("/home/settings/integrations/apelsin/create")
            }
          >
            {t("add")}
          </Button>
        }
      />
      <Filters extra={extraFilter}>
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
      <Table search={search} />
    </>
  );
}
