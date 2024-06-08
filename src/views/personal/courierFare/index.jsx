import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "components/Header";
import Button from "components/Button";

//icon
import AddIcon from "@mui/icons-material/Add";
import Filters from "components/Filters";
import Search from "components/Search";
import TableFare from "./Table";

const CourierFare = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [search, setSearch] = useState("");

  return (
    <div>
      <Header
        title={t("courier.fare")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push("/home/personal/couriers/courier-fare/create")
            }
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Search debounceTime={350} setSearch={(value) => setSearch(value)} />
      </Filters>
      <TableFare search={search} />
    </div>
  );
};

export default CourierFare;
