import moment from "moment";
import { useEffect, useState } from "react";
import { getBranchStatistics } from "services";

export default function BranchInfiniteScroll(limit, date, orderBy, page) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [count, setCount] = useState();
  const today = moment().startOf("month").format("DD");

  const getBranch = () => {
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
    getBranchStatistics(params)
      .then((res) => {
        setCount(res?.count);
        if ((date.length > 0 && page === 1) || (page === 1 && orderBy)) {
          setData(res?.branches);
        } else {
          setData((state) => [...state, ...res?.branches]);
        }
        setHasMore(res?.branches.length > 0);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (parseInt(count) !== data.length || (orderBy && page === 1)) {
      setLoading(true);

      getBranch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, date, orderBy, page]);

  return { loading, data, hasMore, count };
}
