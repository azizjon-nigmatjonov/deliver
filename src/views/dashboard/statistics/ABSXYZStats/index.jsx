import Card from "components/Card";
import MonthPicker from "components/MonthPicker";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { getABCXYZ } from "services";
import ABSXYZTable from "./ABSXYZTable";

const ABSXYZ = () => {
  const pickRangeRef = useRef(null);
  const [date, setDate] = useState("");
  const [data, setData] = useState();

  const [rangeValue, setRangeValue] = useState({
    from: {
      year: moment().year(),
      month: moment().subtract(1, "month").format("MM"),
    },
    to: {
      year: moment().year(),
      month: moment().month() + 1,
    },
  });

  const handleRangeDissmis = (value) => {
    setRangeValue({
      from: {
        year: value.from.month ? value.from.year : 2022,
        month: value.from.month ? value.from.month : 12,
      },
      to: { year: value.to.year, month: value.to.month },
    });
    setDate({
      from_date: `${value.from.month ? value.from.year : 2022}-${
        value.from.month
          ? value.from.month < 10
            ? `0${value.from.month}`
            : value.from.month
          : "12"
      }`,
      to_date: `${value.to.year}-${
        value.to.month < 10 ? `0${value.to.month}` : value.to.month
      }`,
    });
  };

  const getData = () => {
    const params = {
      from_date: date
        ? date?.from_date
        : moment().subtract(1, "month").format("YYYY-MM"),
      to_date: date ? date?.to_date : moment().format("YYYY-MM"),
    };
    getABCXYZ(params).then((res) => setData(res));
  };

  useEffect(() => {
    getData();
  }, [date]);

  const makeData = useMemo(() => {
    let arr = [];
    arr = [
      {
        percent: data?.ax.product_percent,
        count: data?.ax?.product_count,
      },
      {
        percent: data?.ay.product_percent,
        count: data?.ay?.product_count,
      },
      {
        percent: data?.az.product_percent,
        count: data?.az?.product_count,
      },
      {
        percent: data?.bx.product_percent,
        count: data?.bx?.product_count,
      },
      {
        percent: data?.by.product_percent,
        count: data?.by?.product_count,
      },
      {
        percent: data?.bz.product_percent,
        count: data?.bz?.product_count,
      },
      {
        percent: data?.cx.product_percent,
        count: data?.cx?.product_count,
      },
      {
        percent: data?.cy.product_percent,
        count: data?.cy?.product_count,
      },
      {
        percent: data?.cz.product_percent,
        count: data?.cz?.product_count,
      },
    ];

    return arr;
  }, [data]);

  return (
    <>
      <Card
        style={{ marginTop: "16px" }}
        title={
          <>
            <div
              className="flex items-center gap-2.5"
              style={{ padding: "8px 0px" }}
            >
              <DashboardCountIcon />
              <div className="text-lg font-bold">ABC-XYZ</div>
            </div>
          </>
        }
        extra={
          <>
            <MonthPicker
              value={rangeValue}
              pickRangeRef={pickRangeRef}
              handleRangeDissmis={handleRangeDissmis}
            />
          </>
        }
      >
        <ABSXYZTable
          y={[
            { text: "A", description: "Высокая прибыль" },
            { text: "B", description: "Средняя прибыль" },
            { text: "C", description: "Низкая прибыль" },
          ]}
          x={[
            "",
            { text: "X", description: "Высокая стабильность" },
            { text: "Y", description: "Средняя стабильность" },
            { text: "Z", description: "Низкая стабильность" },
          ]}
          data={makeData}
        />
      </Card>
    </>
  );
};

export default ABSXYZ;
