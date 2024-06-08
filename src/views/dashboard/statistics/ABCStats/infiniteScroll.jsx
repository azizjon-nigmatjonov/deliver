import moment from "moment";
import { useEffect, useState } from "react";
import { getABC } from "services";

export default function useScrollTable(limit, date, page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const today = moment().startOf("month").format("DD");

  useEffect(() => {
    setLoading(true);
    setError(false);
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
    };
    getABC(params)
      .then((res) => {
        setTotalCount(res?.all_product_amount);
        if (date && page === 1) {
          setData(res?.products);
        } else {
          setData((prev) => {
            return prev.concat(res?.products);
          });
        }
        setHasMore(res?.products.length > 0);
        setLoading(false);
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, page]);

  return { loading, error, data, hasMore, totalCount };
}
