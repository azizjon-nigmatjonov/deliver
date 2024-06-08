import React, { useState } from "react";
import Button from "components/Button";
import Card from "components/Card";
import Header from "components/Header";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import Filters from "components/Filters";
import TableMenu from "./Table";
import { useHistory } from "react-router-dom";
import Search from "components/Search";

const Menu = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [search, setSearch] = useState();

  return (
    <div>
      <Header
        title={t("menu")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/catalog/menu/create-menu");
            }}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
      <Card className="m-4">
        <TableMenu search={search} />
      </Card>
    </div>
  );
};
export default Menu;
