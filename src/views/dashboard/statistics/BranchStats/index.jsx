import { useCallback, useEffect, useState } from "react";
import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useTranslation } from "react-i18next";
import BranchTable from "./BranchTable";
import Pagination from "components/Pagination";
import { getBranchStatistics } from "services";

const StatisticsByBranch = () => {
  // = = = = = = = = = = variables = = = = = = = = = = //
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [orderBy, setOrderBy] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const today = moment().startOf("month").format("DD");
  // const { loading, data, hasMore, count } = BranchInfiniteScroll(
  //   limit,
  //   date,
  //   orderBy,
  //   page,
  // );

  const getBranches = useCallback(() => {
    const params = {
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
    };
    setLoading(true);
    getBranchStatistics(params)
      .then((res) => {
        setData(res?.branches);
        setCount(res?.count);
      })
      .finally(() => setLoading(false));
  }, [date, limit, orderBy, page, today]);

  useEffect(() => {
    getBranches();
  }, [limit, date, orderBy, getBranches]);

  return (
    <>
      <Card
        title={
          <div
            className="flex items-center gap-2.5"
            style={{ padding: "8px 0px" }}
          >
            <DashboardCountIcon />
            <div className="text-lg font-bold">{t("branch")}</div>
          </div>
        }
        extra={
          <div className="flex items-center gap-3">
            <div>
              {" "}
              {t("all.branches")}: {count}
            </div>
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
        <BranchTable loading={loading} data={data} setOrderBy={setOrderBy} />
      </Card>
    </>
  );
};

export default StatisticsByBranch;
