import Button from "components/Button";
import Header from "components/Header";
import React, { useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import Filters from "components/Filters";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import Table from "./TgPostTable";
import Search from "components/Search";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import Select from "components/Select";

const initialStates = {
  from_date: "2020-01-01",
  to_date: moment().add(1, "d").format("YYYY-MM-DD"),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "DATE_TIME":
      return {
        ...state,
        from_date: moment(action.payload[0]).format("YYYY-MM-DD"),
        to_date: moment(action.payload[1]).format("YYYY-MM-DD"),
      };
    case "CLEAR":
      return initialStates;
    default:
      return state;
  }
};

const selectOptions = (t) => [
  {
    label: t("photo"),
    value: "photo",
  },
  {
    label: t("Video"),
    value: "video",
  },
  {
    label: t("Gif"),
    value: "gif",
  },
];

const TelegramPost = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [state, dispatch] = useReducer(reducer, initialStates);
  const [contentType, setContentType] = useState("");

  return (
    <>
      <Header
        title={t("telegram.post")}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/marketing/telegram-post/create");
            }}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <div className="flex gap-4">
          <Search setSearch={(value) => setSearch(value)} />
          <RangePicker
            hideTimePicker
            disablefuture="true"
            placeholder={t("from.date.to.date")}
            onChange={(e) =>
              e[0]
                ? dispatch({ type: "DATE_TIME", payload: e })
                : dispatch({ type: "CLEAR" })
            }
          />
          <Select
            isClearable
            width="250px"
            options={selectOptions(t)}
            placeholder={t("choose.content.type")}
            onChange={(val) => setContentType(val)}
          />
        </div>
      </Filters>
      <Table search={search} state={state} contentType={contentType} />
    </>
  );
};

export default TelegramPost;
