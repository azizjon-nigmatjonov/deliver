import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import Header from "components/Header";
import PermissionWrapper from "components/PermissionsWrapper/PermissionsWrapper";
import { LocationIcon, RoundedDollarIcon } from "constants/icons";
import { useCallback, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { showAlert } from "redux/actions/alertActions";
import { updateIikoWebHook } from "services/v2/iiko_credentials";
import Table from "./Table";
import Card from "components/Card";
import Pagination from "components/Pagination";
import OrderFilters from "./OrderFilters";
import { getCountOrder } from "services/order";
import useDebounce from "hooks/useDebounce";
import { statusTabList } from "constants/statuses";
import { OPEN_FILTERS, SET_TAB_ID } from "redux/constants";
import TuneIcon from "@mui/icons-material/Tune";
import TabLabel from "components/Tab/TabLabel";
import { StyledTab, StyledTabs } from "components/StyledTabs/index";

export default function Orders() {
  const history = useHistory();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { tab, customer_id, dateRange, external_order_id, is_open } =
    useSelector((state) => state.orderFilters);

  const [limit, setLimit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersCount, setOrdersCount] = useState([]);
  const [itemsCount, setItemsCount] = useState();

  const debouncedExtarnalOrderId = useDebounce(
    external_order_id.length === 6 ? external_order_id : "",
    700,
  );

  const getCount = useCallback(() => {
    const formatStatusList = Array.from(
      new Set(
        statusTabList
          .map((elm) => elm?.id?.split(","))
          .reduce((acc, curr) => [...acc, ...curr], [])
          .map((el) => el.trim()),
      ),
    );
    getCountOrder({
      status_ids: formatStatusList.join(","),
      start_date: dateRange?.start_date,
      end_date: dateRange?.end_date,
      customer_id: customer_id?.value,
    })
      .then((res) => setOrdersCount(res?.orders_count))
      .catch((err) => console.log(err));
  }, [dateRange, customer_id]);

  const crmType = useSelector((state) => state.auth.crm);

  const handleUpdateIiko = useCallback(() => {
    updateIikoWebHook().finally(() =>
      dispatch(showAlert(t("successfully_updated"), "success")),
    );
  }, [dispatch, t]);

  const CardTabs = (
    <>
      <StyledTabs
        value={tab || 1}
        onChange={(_, value) =>
          dispatch({
            type: SET_TAB_ID,
            payload: value,
          })
        }
        centered={false}
      >
        {statusTabList.map((elm, i) => (
          <StyledTab
            key={elm?.id}
            value={elm?.id}
            label={
              <TabLabel
                isActive={elm?.id === tab}
                count={defineCountByTabs(elm?.id, ordersCount)}
              >
                {t(elm?.label)}
              </TabLabel>
            }
            {...a11yProps(i)}
          />
        ))}
      </StyledTabs>
      <Button
        icon={TuneIcon}
        iconColor={is_open ? "#0E73F6" : ""}
        onClick={() => dispatch({ type: OPEN_FILTERS, payload: !is_open })}
        style={{
          backgroundColor: is_open ? "white" : "",
          borderColor: "1px solid #E5E9EB",
          color: is_open ? "#0E73F6" : "",
        }}
      >
        {is_open ? t("close.filter") : t("open.filter")}
      </Button>
    </>
  );

  useEffect(getCount, [getCount, dateRange, customer_id]);

  const headerBtns = (
    <div className="flex items-center gap-4">
      {crmType === "iiko" && (
        <Button
          onClick={() => handleUpdateIiko()}
          style={{
            backgroundColor: "white",
            color: "#0E73F6",
            border: "1px solid #E5E9EB",
          }}
        >
          {t("update.token")}
        </Button>
      )}
      <Button
        size="medium"
        icon={RoundedDollarIcon}
        onClick={() => history.push(`/home/orders/sendinvoice`)}
        style={{
          backgroundColor: "white",
          color: "#0E73F6",
          border: "1px solid #E5E9EB",
        }}
      >
        {t("send.an.invoice")}
      </Button>
      <PermissionWrapper permission="map_tracking" action="get">
        <Button
          size="medium"
          icon={LocationIcon}
          onClick={() => history.push(`/home/orders/trackcourier`)}
          style={{
            backgroundColor: "white",
            color: "#0E73F6",
            border: "1px solid #E5E9EB",
          }}
        >
          {t("show.in.map")}
        </Button>
      </PermissionWrapper>
      <PermissionWrapper permission="order" action="add">
        <Button
          size="medium"
          icon={AddIcon}
          onClick={() => history.push(`/home/orders/create`)}
        >
          {t("create.order")}
        </Button>
      </PermissionWrapper>
    </div>
  );

  return (
    <>
      <Header title={t("orders")} endAdornment={headerBtns} />
      <Card
        className="m-4"
        filters={CardTabs}
        footer={
          <Pagination
            count={itemsCount}
            onChange={setCurrentPage}
            onChangeLimit={(limitNumber) => setLimit(limitNumber)}
            limit={limit}
          />
        }
      >
        <OrderFilters inputRef={inputRef} />
        <Table
          limit={limit}
          inputRef={inputRef}
          getCount={getCount}
          currentPage={currentPage}
          setItemsCount={setItemsCount}
          externalOrderId={debouncedExtarnalOrderId}
        />
      </Card>
    </>
  );
}

// Some tabs includes more than 1 orders statuses. Therefore, we need this function
function defineCountByTabs(id, statuses = []) {
  if (id.length > 400) {
    return 0;
  } else {
    const ids = id.split(",");
    if (ids.length > 1) {
      let count = 0;
      for (const status of statuses) {
        if (ids.includes(status.status_id)) {
          count += +status.count;
        }
      }

      return count;
    } else {
      return statuses.find((elm) => id === elm.status_id)?.count ?? 0;
    }
  }
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
