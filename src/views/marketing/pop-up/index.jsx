import Button from "components/Button";
import Filters from "components/Filters";
import Header from "components/Header";
import Input from "components/Input";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import PopUpsTable from "./Table";
import { useHistory } from "react-router-dom";

const PopUp = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [search, setSearch] = useState("");

  return (
    <>
      <Header
        title={t("pop.ups.list")}
        endAdornment={
          <Button onClick={() => history.push("/home/marketing/popup/create")}>
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Input
          // onChange={onSearch}
          width={250}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon />}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Filters>
      <PopUpsTable search={search} />
    </>
  );
};

export default PopUp;
