
import Card from "components/Card";
import MonthPicker from "components/MonthPicker";
import { DashboardCountIcon } from "constants/icons";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useScrollTable from "./infiniteScroll";
import XYZTable from "./XYZTable";

const XYZStatistics = () => {

// = = = = = = = = = = variables = = = = = = = = = = //
    const [date, setDate] = useState("");
    const [columns, setColumns] = useState([])
    const [limit, setLimit] = useState(10);
    const pickRangeRef = useRef(null)
    const [page, setPage] = useState(1)

    const [rangeValue, setRangeValue] = useState({
      from: {
        year: moment().subtract(1, 'year').format('YYYY'),
        month: moment().subtract(1, 'year').format('MM'),
      },
      to: {
        year: moment().year(),
        month: moment().month() + 1,
      },
    });



const handleRangeDissmis = (value) => {
  setPage(1)
  setRangeValue({
    from: { year: value.from.month ? value.from.year : 2022, month: value.from.month ? value.from.month : '01' },
    to: { year: value.to.year, month: value.to.month },
  });
  setDate({
    from_date: `${ value.from.month ? value.from.year : 2022}-${
      value.from.month ? value.from.month < 10 ? `0${value.from.month}` : value.from.month : '01'
    }`,
    to_date: `${value.to.year}-${
      value.to.month < 10 ? `0${value.to.month}` : value.to.month
    }`,
  });
};


    const { data, hasMore, loading, error } = useScrollTable(limit, date, page); 

    // ######## observe if it is the last tablerow ######## //
  
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

    const makeData = useMemo(() => {
      let arr = [];

      function dateDataMaker(arr) {
        let obj = {};
        arr.forEach((el) => {
          obj[moment(el.date).format("MMMM")] = el.sum;
        });
        return obj;
      }

      arr = data?.map((item) => ({
        product_name: item?.product_name?.ru,
        all_amount_products: item?.all_amount_products,
        average_amount_products: item?.average_amount_products,
        stdo: item?.stdo,
        percent_variation: item?.percent_variation,
        group: item?.group, 
        ...dateDataMaker(item?.Months),
      }));

      return arr;
    }, [data]);
  

    const forColumns = useMemo(() => {
    
    let arr =  data?.flatMap(item => {
        return item?.Months.map(el => {
          return{
            name: moment(el.date).format("MMMM"),
            key: moment(el.date).format("MMMM"),
            position: 'center',
            type: 'price',
            minWidth: '100px'
          }
        })
      })

      return arr?.length > 0 ? arr : [];
    }, [data]);

    useEffect(() => {
      setColumns([
        {
          align: "center",
          name: "",
          key: "index",
          type: "index",
          sticky: true,
          left: 0,
          boxShadow: "inset 0px -1px 0px #E5E9EB",
          minWidth: "40px",
          zIndex: '10',
        },
        {
          name: "of.products",
          key: "product_name",
          sticky: true,
          minWidth: "225px",
          left: 47.5,
          zIndex: '10',
          boxShadow: 'inset -1px -1px 0px #e5e9eb',
        },
       
        ...forColumns?.slice(0, data?.[0]?.Months.length),
     
        {
          name: "total",
          key: "all_amount_products",
          type: "price",
          sticky: true,
          right: 371.5,
          boxShadow: "inset 1px -1px 0px #e5e9eb",
          minWidth: "120px",
        },
       
        {
          name: "Cp",
          key: "average_amount_products",
          type: "price",
          sticky: true,
          right: 271.5,
          boxShadow: "inset 1px -1px 0px #e5e9eb",
          minWidth: "100px",
        },
        {
          name: "СТДО",
          key: "stdo",
          type: "price",
          sticky: true,
          right: 161.5,
          boxShadow: "inset 1px -1px 0px #e5e9eb",
          minWidth: "110px",
        },
        {
          name: "КВ",
          key: "percent_variation",
          // type: "raw_status",
          sticky: true,
          right: 81.5,
          boxShadow: "inset 1px -1px 0px #e5e9eb",
          minWidth: "80px",
        },
        {
          name: "group",
          key: "group",
          // type: "raw_status",
          sticky: true,
          right: 0,
          boxShadow: "inset 1px -1px 0px #e5e9eb",
          minWidth: "60px",
        },
       
      ]);
    },[ data ])

    return (
      <>
        <Card
          style={{ marginTop: "16px" }}
          bodyStyle={{ padding: "0px 0px 16px 0px" }}
          title={
            <>
              <div
                className="flex items-center gap-2.5"
                style={{ padding: "8px 0px" }}
              >
                <DashboardCountIcon />
                <div className="text-lg font-bold">XYZ</div>
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
          <XYZTable
            columns={columns}
            values={makeData}
            lastBookElementRef={lastElementRef}
          />
        </Card>
      </>
    );
}


export default XYZStatistics