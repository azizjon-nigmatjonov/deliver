import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { AddRounded } from "@mui/icons-material";
import Filters from "components/Filters";
import Header from "components/Header";
import Table from "./GalleryTable";
import Button from "components/Button/Buttonv2";
import Search from "components/Search";

const Gallery = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [search, setSearch] = useState("");

  return (
    <>
      <Header
        title={t("events")}
        endAdornment={
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => history.push("/home/marketing/gallery/create")}
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

export default Gallery;
