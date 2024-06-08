import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getOrderById, getOrdersWithAveragePrice } from "services";
import HistoryChanges from "../HistoryChanges";
import Pagination from "components/Pagination";
import Input from "components/Input";
import Modal from "components/ModalV2";

const ClientOrderHistory = ({ client_id }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersWithAveragePrice, setOrdersWithAveragePrice] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    getOrdersWithAveragePrice(client_id, { page: currentPage, limit: 10 })
      .then((res) => setOrdersWithAveragePrice(res))
      .catch((error) => console.log(error));
  }, [client_id, currentPage]);

  const OrderHandler = (order) => {
    // setModalLoadingStatus(true);

    getOrderById(order.id)
      .then((res) => {
        setOrderData(res);
        setModalStatus(true);
      })
      .catch((err) => console.log(err));
    // .finally(() => setModalLoadingStatus(false));
  };

  return (
    <>
      <div className="flex w-full">
        <div className="border border-lightgray-1 mr-4 w-1/3 rounded-md">
          <p className="font-semibold text-black-1 border-b px-2 py-4">
            {t("information.about.client")}
          </p>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label>{t("fullName")}</label>
              <Input
                readOnly
                value={ordersWithAveragePrice?.orders[0]?.client_name}
              />
            </div>
            <div>
              <label>Номер телефона:</label>
              <Input
                readOnly
                value={ordersWithAveragePrice?.orders[0]?.client_phone_number}
              />
            </div>
            <div>
              <label>Количество заказов</label>
              <Input readOnly value={ordersWithAveragePrice?.count} />
            </div>
            <div>
              <label>Средный чек</label>
              <Input
                readOnly
                value={`${ordersWithAveragePrice?.average_sum} сум`}
              />
            </div>
            <div>
              <label>Дата создания:</label>
              <Input
                readOnly
                value={ordersWithAveragePrice?.orders[0]?.created_at}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col border border-lightgray-1 w-2/3 rounded-md">
          <p className="font-semibold text-black-1 border-b px-2 py-4">
            Заказы клиента {`(${ordersWithAveragePrice?.count || 0})`}
          </p>
          <div className="flex flex-col justify-between flex-1">
            <TableContainer
              style={{ overflowY: "auto", maxHeight: "60vh" }}
              className="border border-lightgray-1"
            >
              <Table aria-label="simple-table">
                <TableHead className="sticky top-0 bg-white">
                  <TableRow>
                    <TableCell>ID заказа</TableCell>
                    <TableCell>Адрес клиента</TableCell>
                    <TableCell>Тип оплаты</TableCell>
                    <TableCell>Итоговая сумма</TableCell>
                    <TableCell>Дата</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersWithAveragePrice?.orders?.map((order, index) => (
                    <TableRow
                      key={order.external_order_id}
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    >
                      <TableCell
                        onClick={() => OrderHandler(order)}
                        // onClick={() => history.push("orders/" + order.id)}
                      >
                        {order?.external_order_id}
                      </TableCell>
                      <TableCell>{order?.to_address}</TableCell>
                      <TableCell>{t(order?.payment_type)}</TableCell>
                      <TableCell>
                        {Number(order?.order_amount) +
                          Number(order.delivery_price)}
                      </TableCell>
                      <TableCell>{order.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="py-2">
              <Pagination
                title={t("general.count")}
                count={ordersWithAveragePrice?.count}
                onChange={(pageNumber) => setCurrentPage(pageNumber)}
                pageCount={10}
                limit={10}
                noLimitChange
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalStatus}
        title="История изменений"
        onClose={() => setModalStatus(false)}
        fullScreen={true}
      >
        <HistoryChanges data={orderData} isModal={true} />
      </Modal>
    </>
  );
};

export default ClientOrderHistory;
