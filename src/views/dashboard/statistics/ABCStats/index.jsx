import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useCallback, useRef, useState } from "react";
import ABCTable from "./ABCTable";
import useScrollTable from "./infiniteScroll";
import XYZStatistics from "../XYZStats";
import ABSXYZ from "../ABSXYZStats";
import Header from "components/Header";
import { useTranslation } from "react-i18next";

export const ABCStatistics = () => {
  // = = = = = = = = = = variables = = = = = = = = = = //
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const { data, hasMore, loading, totalCount } = useScrollTable(10, date, page);

  // ######## observe if it is the last tablerow ######## //
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevLimit) => prevLimit + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  return (
    <div>
      <Header title={t("products")} />
      <div className="p-4">
        <Card
          title={
            <>
              <div
                className="flex items-center gap-2.5"
                style={{ padding: "8px 0px" }}
              >
                <DashboardCountIcon />
                <div className="text-lg font-bold">ABC</div>
              </div>
            </>
          }
          bodyStyle={{ marginLeft: "-16px", marginRight: "-16px" }}
          extra={
            <>
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
            </>
          }
        >
          <ABCTable
            data={data}
            totalCount={totalCount}
            lastBookElementRef={lastElementRef}
          />
        </Card>
        <XYZStatistics />
        <ABSXYZ />
      </div>
    </div>
  );
};

export default ABCStatistics;
