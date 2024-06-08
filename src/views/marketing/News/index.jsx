import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { AddRounded } from "@mui/icons-material";
import Filters from "components/Filters";
import Header from "components/Header";
import Table from "./NewsTable";
import Button from "components/Button/Buttonv2";
import Search from "components/Search";

const News = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [search, setSearch] = useState("");

  return (
    <>
      <Header
        title={t("news")}
        endAdornment={
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => history.push("/home/marketing/news/create")}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Search setSearch={setSearch} />
      </Filters>
      <Table search={search} />
    </>
  );
};

export default News;
