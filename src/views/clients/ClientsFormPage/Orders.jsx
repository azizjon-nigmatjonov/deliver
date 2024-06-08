import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import { getOrdersWithAveragePrice } from "services";
import Tag from "components/Tag";

export default function ClientOrders({ customer_id }) {
  const { t } = useTranslation();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(1);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, limit]);

  const getItems = (page) => {
    if (customer_id) {
      setLoader(true);
      getOrdersWithAveragePrice(customer_id, { limit, page })
        .then((res) => {
          setCount(res?.count);
          setItems({
            count: res?.count,
            data: res?.orders,
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoader(false));
    }
  };

  const TabLabel = ({ isActive = false, count, children }) => {
    return (
      <div className="flex items-center">
        <span className="px-1">{children}</span>
        {count > 0 && (
          <span
            className={`inline-flex items-center 
                justify-center px-1.5 py-1 ml-2 text-xs 
                font-bold leading-none text-red-100 
                bg-blue-600 rounded-full`}
          >
            {count}
          </span>
        )}
      </div>
    );
  };

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={count}
      limit={limit}
      onChangeLimit={(limitNumber) => setLimit(limitNumber)}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  );

  return (
    <Card
      className="m-4"
      footer={pagination}
      title={[<TabLabel count={items.count}>{t("history.orders")}</TabLabel>]}
    >
      <TableContainer className="mt-4 rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>{t("order_id")}</TableCell>
              <TableCell>{t("created.date")}</TableCell>
              <TableCell>{t("client.address")}</TableCell>
              <TableCell>{t("sum")}</TableCell>
              <TableCell>{t("branch")}</TableCell>
              <TableCell>{t("delivery.type")}</TableCell>
              <TableCell>{t("source")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items?.data?.map((order, index) => (
                <TableRow
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  key={order.id}
                >
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>{order.external_order_id}</TableCell>
                  <TableCell>{order.created_at}</TableCell>
                  <TableCell>{order.to_address}</TableCell>
                  <TableCell>{order.order_amount}</TableCell>
                  {/* <TableCell>----</TableCell> */}
                  <TableCell>{order.steps[0]?.branch_name}</TableCell>
                  <TableCell>
                    <Tag color="warning" className="p-1">
                      {t(order.delivery_type)}
                    </Tag>
                  </TableCell>
                  <TableCell>
                    <Tag className="p-1">{t(order.source)}</Tag>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <LoaderComponent isLoader={loader} />
      </TableContainer>
    </Card>
  );
}
