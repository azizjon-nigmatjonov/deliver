import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Header from "components/Header";
import { getOrdersWithAveragePrice } from "services";
import { useHistory } from "react-router-dom";
import parseQuery from "helpers/parseQuery";
import NewCaller from "./NewCaller";
import { getOrderById } from "services/v2";
import HistoryChanges from "views/orders/form/HistoryChanges";
import { CircularProgress } from "@mui/material";
import Input from "components/Input";
import moment from "moment";
import { statusTag } from "views/orders/statuses";
import Button from "components/Button/Buttonv2";
import { AddRounded } from "@mui/icons-material";
import Modal from "components/ModalV2";
import customerService from "services/customer";

const OperatorCalls = () => {
  const { t } = useTranslation();
  const [customer, setCustomer] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loader, setLoader] = useState(true);
  const history = useHistory();
  const { caller } = parseQuery();
  const [orderData, setOrderData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);
  const [callerPhone, setCallerPhone] = useState("");

  useEffect(() => {
    let phoneNumber = caller?.includes("@")
      ? caller?.split("@")[0]?.slice(-9)
      : caller?.slice(-9);
    setCallerPhone(phoneNumber);
  }, [caller]);

  const columns = [
    {
      title: t("order.id"),
      key: "order_id",
      render: (record) => {
        // getOrderById(record.id);
        return record.external_order_id;
      },
      onClick: (record) => {
        OrderHandler(record.id);
      },
    },
    {
      title: t("client.address"),
      key: "address",
      render: (record) => record.to_address,
    },
    {
      title: t("payment.type"),
      key: "payment_type",
      render: (record) => t(record.payment_type),
    },
    {
      title: t("total_amount"),
      key: "total_amount",
      render: (record) => <>{record.order_amount}</>,
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => statusTag(record.status_id, t),
      // <div
      //   style={{
      //     backgroundColor: getStatusColor(record.status_id),
      //     color: "#fff",
      //   }}
      //   className="py-1 px-4 rounded-md"
      // >
      //   {getStatusName(record.status_id)}
      // </div>
    },
  ];

  // const getStatusName = (statusId) => {
  //   switch (statusId) {
  //     case "986a0d09-7b4d-4ca9-8567-aa1c6d770505":
  //       return t("new");
  //     case "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3":
  //       return t("branch.accepted");
  //     case "c4227d1b-c317-46f8-b1e3-a48c2496206f":
  //       return t("branch.declined");
  //     case "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd":
  //       return t("branch.prepared");
  //     case "8781af8e-f74d-4fb6-ae23-fd997f4a2ee0":
  //       return t("courier.accepted");
  //     case "6ba783a3-1c2e-479c-9626-25526b3d9d36":
  //       return t("courier.declined");
  //     case "84be5a2f-3a92-4469-8283-220ca34a0de4":
  //       return t("courier.onTheWay");
  //     case "79413606-a56f-45ed-97c3-f3f18e645972":
  //       return t("delivered");
  //     case "ccb62ffb-f0e1-472e-bf32-d130bea90617":
  //       return t("operator.accepted");
  //     case "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1":
  //       return t("operator.declined");
  //     case "e665273d-5415-4243-a329-aee410e39465":
  //       return t("finished");
  //     case "d39cb255-6cf5-4602-896d-9c559d40cbbe":
  //       return t("server.declined");
  //     default:
  //       break;
  //   }
  // };

  // const getStatusColor = (statusId) => {
  //   switch (statusId) {
  //     case "986a0d09-7b4d-4ca9-8567-aa1c6d770505":
  //       return "#2db7f5";
  //     case "8781af8e-f74d-4fb6-ae23-fd997f4a2ee0":
  //       return "#108ee9";
  //     case "84be5a2f-3a92-4469-8283-220ca34a0de4":
  //       return "#13c2c2";
  //     case "79413606-a56f-45ed-97c3-f3f18e645972":
  //       return "#722ed1";
  //     case "6ba783a3-1c2e-479c-9626-25526b3d9d36":
  //       return "#bf3939";
  //     case "e665273d-5415-4243-a329-aee410e39465":
  //       return "#87d068";
  //     case "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3":
  //       return "#001529";
  //     case "c4227d1b-c317-46f8-b1e3-a48c2496206f":
  //       return "#ed2d2d";
  //     case "d39cb255-6cf5-4602-896d-9c559d40cbbe":
  //       return "#ed2d2d";
  //     case "ccb62ffb-f0e1-472e-bf32-d130bea90617":
  //       return "#42f5d7";
  //     case "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1":
  //       return "#e36464";
  //     case "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd":
  //       return "#51EC7C";
  //     default:
  //       break;
  //   }
  // };

  const OrderHandler = (id) => {
    getOrderById(id)
      .then((res) => {
        setOrderData(res);
        setModalStatus(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setLoader(true);
    if (callerPhone) {
      customerService
        .getSMSCustomers({ search: `+998${callerPhone}` })
        .then((res) => {
          setCustomer(res?.customers[0] || []);
          res?.count === "0" ? setIsNewUser(true) : setIsNewUser(false);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    }
  }, [callerPhone]);

  useEffect(() => {
    customer?.id &&
      getOrdersWithAveragePrice(customer?.id)
        .then((res) => {
          setCustomerOrders(res);
        })
        .catch((err) => console.log(err));
  }, [customer]);

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 56px)" }}>
      <Header
        title={`${t("new.call.from")} +998${callerPhone || ""} `}
        endAdornment={
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() =>
              isNewUser
                ? history.push(
                    `/home/orders/create?newUserNumber=+998${callerPhone}`,
                  )
                : history.push(`/home/orders/create?customerId=${customer?.id}`)
            }
          >
            {t("create.order")}
          </Button>
        }
      />
      <div
        className={`flex-1 flex justify-center gap-4 p-4 ${
          loader && "items-center"
        }`}
      >
        {loader && <CircularProgress size={130} color="primary" />}
        {isNewUser ? (
          <NewCaller />
        ) : (
          !loader && (
            <>
              <Card title={t("information.about.client")}>
                <div className="px-4 flex flex-col gap-4">
                  <div>
                    <label className="input-label mb-1">{t("fullName")}</label>
                    <Input readOnly value={customer?.name} />
                  </div>
                  <div>
                    <label className="input-label mb-1">Номер телефона:</label>
                    <Input readOnly value={customer?.phone} />
                  </div>
                  <div>
                    <label className="input-label mb-1">
                      Количество заказов
                    </label>
                    <Input readOnly value={customer?.orders_amount} />
                  </div>
                  <div>
                    <label className="input-label mb-1">Средный чек</label>
                    <Input
                      readOnly
                      value={`${customer?.average_price || 0} сум`}
                    />
                  </div>
                  <div>
                    <label className="input-label mb-1">Дата создания:</label>
                    <Input
                      readOnly
                      value={moment(customer?.created_at).format("DD.MM.YYYY")}
                    />
                  </div>
                </div>
              </Card>
              <Card title={t("client.orders")}>
                <TableContainer
                  style={{ overflowY: "auto", maxHeight: "70vh" }}
                  className="rounded-md border border-bordercolor"
                >
                  <Table aria-label="simple-table">
                    <TableHead className="sticky top-0 bg-white">
                      <TableRow>
                        {columns.map((elm) => (
                          <TableCell key={elm.key}>{elm?.title}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerOrders?.orders?.map((element, index) => (
                        <TableRow
                          key={element.id}
                          className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                        >
                          {columns.map((col) => (
                            <TableCell
                              key={col.key}
                              onClick={() => col?.onClick(element)}
                            >
                              {col.render ? col.render(element, index) : "----"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              <Modal
                open={modalStatus}
                title="История изменений"
                onClose={() => setModalStatus(false)}
                fullScreen={true}
              >
                <HistoryChanges data={orderData} isModal={true} />
              </Modal>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default OperatorCalls;
