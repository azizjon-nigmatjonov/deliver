import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTopCouriers } from "services";
import TopTable from "./Table";
import Pagination from "components/Pagination";

const TopCouriers = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(false);
  // const [loading, setLoading] = useState(true);
  const [count, setCount] = useState();
  const [limit, setLimit] = useState(10);
  const today = moment().startOf("month").format("DD");
  const [orderBy, setOrderBy] = useState({});

  const getCouriers = useCallback(() => {
    // setLoading(true);
    getTopCouriers({
      from_date: date
        ? moment(date[0]).format("YYYY-MM-DD")
        : moment().startOf("month").format("YYYY-MM-DD"),
      to_date: date
        ? moment(date[1]).format("YYYY-MM-DD")
        : today === "01"
        ? moment().add(1, "days").format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      page: page,
      limit: limit,
      sort: orderBy ? orderBy?.sort : "",
      order_by: orderBy ? orderBy?.value : "",
    }).then((res) => {
      setData(res?.couriers);
      setCount(res?.count);
      // setHasMore(res?.count > limit);
    });
    // .finally(() => setLoading(false));
  }, [date, limit, orderBy, page, today]);

  // ######## observe if it is the last tablerow ######## //
  // const observer = useRef();
  // const lastElementRef = useCallback(
  //   (node) => {
  //     if (loading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         setLimit((prev) => prev + 10);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [loading, hasMore],
  // );

  useEffect(() => {
    getCouriers();
  }, [limit, date, orderBy, getCouriers]);

  return (
    <Card
      title={
        <div
          className="flex items-center gap-2.5"
          style={{ padding: "8px 0px" }}
        >
          <DashboardCountIcon />
          <div className="text-lg font-bold">{t("the.best.ten.couriers")}</div>
        </div>
      }
      extra={
        <div className="flex items-center gap-3">
          <p>
            {t("all.couriers")}: {count}
          </p>
          <RangePicker
            style={{ width: "272px" }}
            hideTimePicker
            dateValue={[
              date && date[0] !== null
                ? moment(date[0])
                : date[0] === null
                ? moment().startOf("month")
                : moment().startOf("month"),
              date && date[1] !== null
                ? moment(date[1])
                : date[1] === null
                ? moment()
                : moment(),
            ]}
            onChange={(e) => {
              setDate(
                e[0] === null && e[1] === null
                  ? [moment().startOf("month"), moment()]
                  : e,
              );
              setPage(1);
            }}
          />
        </div>
      }
      footer={
        <Pagination
          count={count}
          onChange={setPage}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
      }
    >
      <TopTable
        data={data}
        type={"courier"}
        // lastElementRef={lastElementRef}
        setOrderBy={setOrderBy}
      />
    </Card>
  );
};

export default TopCouriers;
