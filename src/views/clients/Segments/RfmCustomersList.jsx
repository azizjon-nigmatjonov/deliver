import { useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCustomerList } from "services";
import Pagination from "components/Pagination";
import SettinsSliderIcon from "assets/icons/settings-slider-icon.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ExpandLess } from "@mui/icons-material";
import { downloadCustomersListRfm } from "services/v2/excel";
import RfmFilter from "./RfmFilter/RfmFilter";
import Card from "components/Card";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import RfmCustomersTable from "./RfmCustomersTable";
import RfmNewsletter from "./RfmNewsletter/RfmNewsletter";

const initialState = {
  r: 0,
  f: 0,
  m: 0,
  from_recency: "",
  to_recency: "",
  from_frequency: "",
  to_frequency: "",
  from_monetary: "",
  to_monetary: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "r":
      return {
        ...state,
        r: action.payload,
      };
    case "f":
      return {
        ...state,
        f: action.payload,
      };
    case "m":
      return {
        ...state,
        m: action.payload,
      };
    case "from_recency":
      return {
        ...state,
        from_recency: action.payload,
      };
    case "to_recency":
      return {
        ...state,
        to_recency: action.payload,
      };
    case "from_frequency":
      return {
        ...state,
        from_frequency: action.payload,
      };
    case "to_frequency":
      return {
        ...state,
        to_frequency: action.payload,
      };
    case "from_monetary":
      return {
        ...state,
        from_monetary: action.payload,
      };
    case "to_monetary":
      return {
        ...state,
        to_monetary: action.payload,
      };
    case "CLEAR_CASES":
      return {
        ...state,
        from_recency: "",
        to_recency: "",
        from_frequency: "",
        to_frequency: "",
        from_monetary: "",
        to_monetary: "",
      };
    default:
      return state;
  }
};

const RfmCustomersList = ({ tab }) => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState({});
  const [rfmState, dispatchRfmState] = useReducer(reducer, initialState);
  const [filterStatus, setFilterStatus] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { t } = useTranslation();

  const { refetch, isFetching } = useCustomerList({
    params: {
      page: currentPage,
      limit,
    },
    rfmState,
    props: {
      enabled: tab === 1,
      onError: (err) => console.log(err),
      onSuccess: (res) => {
        setCustomers({
          data: res?.customers,
          count: res?.count,
        });
      },
    },
  });
  const downloadURL = (url, name) => {
    var link = document.createElement("a");
    link.setAttribute("download", name);
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadExcel = () => {
    downloadCustomersListRfm({ ...rfmState }).then((res) => {
      downloadURL(res?.url, res?.file_name);
    });
  };

  return (
    <>
      <div
        style={{ minHeight: "calc(100vh - 56px)" }}
        className="flex flex-col"
      >
        <div className="flex-1 flex flex-col justify-between">
          <Card
            className="m-4"
            title={
              <div
                className="flex items-center cursor-pointer"
                style={{ userSelect: "none", width: "fit-content" }}
                onClick={() => setFilterStatus((prev) => !prev)}
              >
                <img src={SettinsSliderIcon} alt="settings" className="mr-2" />
                <span className="mr-1">{t("filter")}</span>
                {filterStatus ? (
                  <ExpandMoreIcon
                    style={{ color: "#0e73f6", cursor: "pointer" }}
                  />
                ) : (
                  <ExpandLess style={{ color: "#0e73f6", cursor: "pointer" }} />
                )}
              </div>
            }
            footer={
              <Pagination
                title={t("general.count")}
                count={customers?.count}
                onChange={(pageNumber) => setCurrentPage(pageNumber)}
                pageCount={limit}
                limit={limit}
                onChangeLimit={(limitNumber) => setLimit(limitNumber)}
              />
            }
            extra={
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1">
                  <p>{t("clients_count")}: </p>
                  <span>{customers?.count}</span>
                </div>
                <Button
                  icon={DownloadIcon}
                  iconClassName="text-blue-600"
                  color="zinc"
                  shape="outlined"
                  size="medium"
                  onClick={downloadExcel}
                >
                  {t("download")}
                </Button>
              </div>
            }
          >
            {filterStatus && (
              <div className="flex items-center justify-between flex-wrap gap-4 p-4 mb-4 border border-lightgray-1 rounded-md">
                <RfmFilter
                  title="Recency"
                  extraTitle="Дни с последнего заказа"
                  firstInputValue={rfmState.from_recency}
                  secondInputValue={rfmState.to_recency}
                  dispatchRfmState={dispatchRfmState}
                  rfmState={rfmState}
                  from="from_recency"
                  to="to_recency"
                  letter="r"
                />
                <RfmFilter
                  title="Frequency"
                  extraTitle="Количество заказов"
                  firstInputValue={rfmState.from_frequency}
                  secondInputValue={rfmState.to_frequency}
                  dispatchRfmState={dispatchRfmState}
                  rfmState={rfmState}
                  from="from_frequency"
                  to="to_frequency"
                  letter="f"
                />
                <RfmFilter
                  title="Monetary"
                  extraTitle="Сумма заказов"
                  firstInputValue={rfmState.from_monetary}
                  secondInputValue={rfmState.to_monetary}
                  dispatchRfmState={dispatchRfmState}
                  rfmState={rfmState}
                  from="from_monetary"
                  to="to_monetary"
                  letter="m"
                />
                <Button onClick={() => refetch()}>{t("to.filter")}</Button>
              </div>
            )}
            <RfmCustomersTable
              currentPage={currentPage}
              limit={limit}
              loader={isFetching}
              customers={customers}
            />
          </Card>
          <div className="flex sticky bottom-0 justify-end items-center w-full bg-white p-4">
            <Button onClick={() => setOpenModal(true)}>Создать рассылку</Button>
          </div>
        </div>
      </div>

      <RfmNewsletter
        open={openModal}
        onClose={() => setOpenModal(false)}
        rfmState={rfmState}
      />
    </>
  );
};

export default RfmCustomersList;
