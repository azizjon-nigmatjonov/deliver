import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Tag from "components/Tag/index";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import orderTimer from "helpers/orderTimer";
import { statusTag, statuses } from "./statuses";
import numberToPrice from "helpers/numberToPrice";
import SwitchColumns from "components/Filters/SwitchColumns";
import CheckIcon from "@mui/icons-material/Check";
import ActionMenu from "components/ActionMenu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import RepeatIcon from "@mui/icons-material/Repeat";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import Comment from "@mui/icons-material/Comment";
import { deliveryIcon, getSourceIcon, paymentTypeIconMake } from "./form/api";
import { useDispatch, useSelector } from "react-redux";
import { orderHistoryAction } from "redux/actions/orderHistoryAction";
import PrintIcon from "@mui/icons-material/Print";
import { getOrderById } from "services/v2";
import moment from "moment";
import { sendOrderCRM } from "services/v2/crm";
import SmsIcon from "@mui/icons-material/Sms";
import { showAlert } from "redux/actions/alertActions";
import copyIcon from "assets/icons/copy_icon.svg";
import styles from "./styles.module.scss";

export default function useColumns({
  limit,
  currentPage,
  setSortby,
  setModalInfo,
  setIsthereCauses,
  setCauses,
  causesForCanceletion,
  causesForCompletion,
  setModalComment,
  setCauseStatus,
  setIsDrawerOpen,
  setOrderForPrint,
}) {
  const [columns, setColumns] = useState([]);

  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const lateTimeData = useSelector((state) => state.lateTime.payload);
  const crmType = useSelector((state) => state.auth.crm);
  const processOnlyPaid = useSelector(
    (state) => state?.auth?.procces_only_paid,
  );

  const genActions = useCallback(
    (record) => {
      const {
        OperatorAcceptedStatusId,
        VendorReadyStatusId,
        VendorAcceptedStatusId,
        CourierAcceptedStatusId,
        CourierPickedUpStatusId,
        FinishedStatusId,
        OperatorCancelledStatusId,
      } = statuses;
      if (
        // record?.status_id === VendorAcceptedStatusId ||
        record?.status_id === VendorReadyStatusId ||
        record?.status_id === CourierAcceptedStatusId
      ) {
        return [
          // {
          //   title: t("edit"),
          //   icon: <EditIcon />,
          //   color: "primary",
          //   action: () => history.push(`/home/orders/${record?.id}`),
          // },

          {
            title: t("add.order"),
            icon: <RepeatIcon />,
            color: "primary",
            action: () =>
              history.push(`/home/orders/repeat/${record?.id}?repeat=true`),
          },
          {
            title: t("courier.declined"),
            icon: <DirectionsCarIcon />,
            color: "error",
            action: () => {
              setModalInfo({
                open: true,
                title: "Курьер отменил заказ?!",
                type: "order_canceled_by_courier",
                id: record?.id,
                shipper_id: record?.shipper_id,
                record,
              });
              setIsthereCauses(false);
            },
          },
          {
            title: t("cancel"),
            icon: <ClearIcon />,
            color: "error",
            action: () => {
              setModalInfo({
                open: true,
                type: "cancel",
                id: record?.id,
                shipper_id: record?.shipper_id,
                record,
              });
              setIsthereCauses(true);
              setCauses(causesForCanceletion);
              setCauseStatus("b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1");
            },
          },
          {
            title: t("end.process"),
            icon: <CheckIcon />,
            color: "success",
            action: () => {
              setModalInfo({
                open: true,
                type: "complete",
                title: "Заказ завершен?",
                id: record?.id,
                shipper_id: record?.shipper_id,
              });
              setIsthereCauses(true);
              setCauses(causesForCompletion);
              setCauseStatus("e665273d-5415-4243-a329-aee410e39465");
            },
          },
          {
            title: t("Комментарий к кухне"),
            icon: <SmsIcon />,
            color: "primary",
            action: () => {
              setModalComment({
                title: "Комментарий к кухне",
                open: true,
                type: "comment",
                record: record,
              });
              setIsthereCauses(true);
              setCauses(causesForCanceletion);
            },
          },
        ];
      } else if (FinishedStatusId === record?.status_id) {
        return [
          {
            title: t("comment"),
            icon: <Comment />,
            color: "primary",
            action: () => {
              setModalComment({
                open: true,
                type: "comment",
                record: record,
              });
              setIsthereCauses(true);
              setCauses(causesForCanceletion);
            },
          },
        ];
      } else if (
        record?.status_id === OperatorAcceptedStatusId ||
        record?.status_id === VendorAcceptedStatusId
      ) {
        if (!record?.courier_id?.length) {
          return [
            {
              title: t("edit"),
              icon: <EditIcon />,
              color: "primary",
              action: () => history.push(`/home/orders/${record?.id}`),
            },
            {
              title: t("add.order"),
              icon: <RepeatIcon />,
              color: "primary",
              action: () =>
                history.push(`/home/orders/repeat/${record?.id}?repeat=true`),
            },
            {
              title: t("Комментарий к кухне"),
              icon: <SmsIcon />,
              color: "primary",
              action: () => {
                setModalComment({
                  title: "Комментарий к кухне",
                  open: true,
                  type: "comment",
                  record: record,
                });
                setIsthereCauses(true);
                setCauses(causesForCanceletion);
              },
            },
            {
              title: t("print"),
              icon: <PrintIcon />,
              color: "success",
              action: () => {
                // setOrderForPrint(record);
                getOrderById(record?.id)
                  .then((res) => setOrderForPrint(res))
                  .catch((err) => console.log(err));
                crmType !== "none"
                  ? sendOrderCRM(record?.id)
                  : setIsDrawerOpen(true);
              },
            },
            {
              title: t("end.process"),
              icon: <CheckIcon />,
              color: "success",
              action: () => {
                setModalInfo({
                  open: true,
                  type: "complete",
                  title: "Заказ завершен?",
                  id: record?.id,
                  shipper_id: record?.shipper_id,
                  record,
                });
                setIsthereCauses(true);
                setCauses(causesForCompletion);
                setCauseStatus("e665273d-5415-4243-a329-aee410e39465");
              },
            },
            {
              title: t("cancel"),
              icon: <ClearIcon />,
              color: "error",
              action: () => {
                setModalInfo({
                  open: true,
                  type: "cancel",
                  id: record?.id,
                  shipper_id: record?.shipper_id,
                  record,
                });
                setIsthereCauses(true);
                setCauses(causesForCanceletion);
                setCauseStatus("b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1");
              },
            },
          ];
        } else {
          return [
            {
              title: t("edit"),
              icon: <EditIcon />,
              color: "primary",
              action: () => history.push(`/home/orders/${record?.id}`),
            },
            {
              title: t("add.order"),
              icon: <RepeatIcon />,
              color: "primary",
              action: () => history.push(`/home/orders/repeat/${record?.id}`),
            },
            {
              title: t("print"),
              icon: <PrintIcon />,
              color: "success",
              action: () => {
                // setOrderForPrint(record);
                getOrderById(record?.id)
                  .then((res) => setOrderForPrint(res))
                  .catch((err) => console.log(err));
                crmType !== "none"
                  ? sendOrderCRM(record?.id)
                  : setIsDrawerOpen(true);
              },
            },
            {
              title: t("courier.declined"),
              icon: <DirectionsCarIcon />,
              color: "error",
              action: () => {
                setModalInfo({
                  open: true,
                  title: "Курьер отменил заказ?!",
                  type: "order_canceled_by_courier",
                  id: record?.id,
                  shipper_id: record?.shipper_id,
                  record,
                });
              },
            },

            {
              title: t("cancel"),
              icon: <ClearIcon />,
              color: "error",
              action: () => {
                setModalInfo({
                  open: true,
                  type: "cancel",
                  id: record?.id,
                  shipper_id: record?.shipper_id,
                  record,
                });
                setIsthereCauses(true);
                setCauses(causesForCanceletion);
                setCauseStatus("b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1");
              },
            },
            {
              title: t("end.process"),
              icon: <CheckIcon />,
              color: "success",
              action: () => {
                setModalInfo({
                  open: true,
                  type: "complete",
                  title: "Заказ завершен?",
                  id: record?.id,
                  shipper_id: record?.shipper_id,
                  record,
                });
                setIsthereCauses(true);
                setCauses(causesForCompletion);
                setCauseStatus("e665273d-5415-4243-a329-aee410e39465");
              },
            },
          ];
        }
      } else if (record?.status_id === OperatorCancelledStatusId) {
        return [];
      } else if (record?.status_id === CourierPickedUpStatusId) {
        return [
          {
            title: t("cancel"),
            icon: <ClearIcon />,
            color: "error",
            action: () => {
              setCauseStatus("b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1");
              setModalInfo({
                open: true,
                type: "cancel",
                id: record?.id,
                shipper_id: record?.shipper_id,
                record,
              });
              setIsthereCauses(true);
              setCauses(causesForCanceletion);
            },
          },
          {
            title: t("end.process"),
            icon: <CheckIcon />,
            color: "success",
            action: () => {
              setCauseStatus("e665273d-5415-4243-a329-aee410e39465");
              setModalInfo({
                open: true,
                type: "complete",
                title: "Заказ завершен?",
                id: record?.id,
                shipper_id: record?.shipper_id,
                record,
              });
              setIsthereCauses(true);
              setCauses(causesForCompletion);
              setCauseStatus("e665273d-5415-4243-a329-aee410e39465");
            },
          },
        ];
      } else {
        return [
          {
            title: t("edit"),
            icon: <EditIcon />,
            color: "primary",
            action: () => history.push(`/home/orders/${record?.id}`),
          },
          {
            title: t("end.process"),
            icon: <CheckIcon />,
            color: "success",
            action: () => {
              setCauseStatus("e665273d-5415-4243-a329-aee410e39465");
              setModalInfo({
                open: true,
                type: "complete",
                title: "Заказ завершен?",
                id: record?.id,
                shipper_id: record?.shipper_id,
                record,
              });
              setIsthereCauses(true);
              setCauses(causesForCompletion);
              setCauseStatus("e665273d-5415-4243-a329-aee410e39465");
            },
          },
          {
            title: t("cancel"),
            icon: <ClearIcon />,
            color: "error",
            action: () => {
              setCauseStatus("b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1");
              setModalInfo({
                open: true,
                type: "cancel",
                id: record?.id,
                shipper_id: record?.shipper_id,
                record,
              });
              setIsthereCauses(true);
              setCauses(causesForCanceletion);
            },
          },
        ];
      }
    },
    [
      t,
      history,
      crmType,
      setCauses,
      setModalInfo,
      setCauseStatus,
      setIsDrawerOpen,
      setModalComment,
      setIsthereCauses,
      setOrderForPrint,
      causesForCompletion,
      causesForCanceletion,
    ],
  );

  const handleOperatorAccepted = (record, startTime) => {
    let start = moment(startTime);
    let operatorAccepted = moment(record?.finished_at);

    let diff_s = operatorAccepted.diff(start, "seconds");
    let differenceForAccepted = moment
      .utc(moment.duration(diff_s, "seconds").asMilliseconds())
      .format("HH:mm:ss");

    return differenceForAccepted !== "Invalid date"
      ? differenceForAccepted
      : "-----";
  };

  const handleTimeColor = useCallback((record) => {
    const ORDER_TIMER = Math.round(
      moment
        .duration(
          orderTimer(
            record?.operator_accepted_at,
            record?.finished_at?.length
              ? record?.finished_at
              : record?.status_notes?.find(
                  (status_note) =>
                    status_note?.status_id ===
                      process.env.REACT_APP_OPERATOR_CANCELED_STATUS_ID ||
                    status_note?.status_id ===
                      process.env.REACT_APP_SERVER_CANCELED_STATUS_ID,
                )?.created_at,
            record?.future_time,
            record?.status_id,
            "operator_accepted_timer",
          ),
        )
        .asMinutes(),
    );

    const HANDLE_OPERATOR_ACCEPTED = Math.round(
      moment.duration(handleOperatorAccepted(record)).asMinutes(),
    );
    const time =
      record?.status_id === process.env.REACT_APP_FINISHED_STATUS_ID
        ? HANDLE_OPERATOR_ACCEPTED
        : ORDER_TIMER;

    if (time >= 30 && time < 40) {
      return "warning";
    } else if (time >= 40) {
      return "error";
    }

    return "success";
  }, []);

  const handleOperatorAcceptedColor = (record) => {
    const ORDER_TIMER_FOR_ACCEPTED = Math.round(
      moment
        .duration(
          orderTimer(
            record?.operator_accepted_at,
            record?.finished_at?.length
              ? record?.finished_at
              : record?.status_notes?.find(
                  (status_note) =>
                    status_note?.status_id ===
                      process.env.REACT_APP_OPERATOR_CANCELED_STATUS_ID ||
                    status_note?.status_id ===
                      process.env.REACT_APP_SERVER_CANCELED_STATUS_ID,
                )?.created_at,
            record?.future_time,
            record?.status_id,
            "operator_accepted_timer",
          ),
        )
        .asMinutes(),
    );

    if (
      record?.free_delevery_time > 0 &&
      ORDER_TIMER_FOR_ACCEPTED >= Number(record?.free_delevery_time)
    ) {
      return "red";
    }

    return "blue";
  };

  const ComputeOperatorTimer = useCallback((record, paidTime) => {
    let result;
    if (isNaN(new Date(paidTime))) {
      result = "--:--:--";
    } else if (record?.status_id === process.env.REACT_APP_FINISHED_STATUS_ID) {
      result = handleOperatorAccepted(record, paidTime);
    } else {
      result = orderTimer(
        paidTime,
        record?.finished_at?.length
          ? record?.finished_at
          : record?.status_notes?.find(
              (status_note) =>
                status_note?.status_id ===
                  process.env.REACT_APP_OPERATOR_CANCELED_STATUS_ID ||
                status_note?.status_id ===
                  process.env.REACT_APP_SERVER_CANCELED_STATUS_ID,
            )?.created_at,
        record?.future_time,
        record?.status_id,
        "operator_accepted_timer",
      );
    }
    return result;
  }, []);

  const initialCols = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("client.name"),
        key: "name",
        render: (record) => (
          <div>
            <div
              className="record_client_name"
              onClick={() =>
                dispatch(
                  orderHistoryAction({ id: record?.client_id, toggle: true }),
                )
              }
            >
              {record?.client_name}
            </div>
            <a
              href={`tel:${record?.client_phone_number}`}
              className="text-info cursor-pointer block"
            >
              {record?.client_phone_number}
            </a>
          </div>
        ),
      },
      {
        title: t("order_id"),
        key: "order_id",
        render: (record) => (
          <>
            <div
              className="record_order_id text-center"
              onClick={() => {
                // The code below does the same thing, but with status complete, you cant see and swipe to the details of order
                record?.status_id === "e665273d-5415-4243-a329-aee410e39465"
                  ? history.push(`/home/orders/${record?.id}?status=completed`)
                  : history.push(`/home/orders/${record?.id}?redirect=true`);
              }}
            >
              {record?.external_order_id}
            </div>
            <div className={styles.copy}>
              <img
                src={copyIcon}
                title={t("copy")}
                alt="copy"
                className="cursor-pointer w-5 h-5"
                onClick={() => {
                  navigator.clipboard.writeText(record?.id);
                  dispatch(showAlert(t("successfully_copied"), "success"));
                }}
              />
            </div>
          </>
        ),
      },
      {
        title: t("timer"),
        key: "timer",
        sorter: true,
        onSort: (order) => {
          setSortby(() => {
            if (order === "asc") {
              return "created_at";
            } else if (order === "desc") {
              return "-created_at";
            }
          });
        },
        render: (record) => {
          return (
            <div className="flex justify-center">
              <div className="w-36">
                <Tag
                  color={handleTimeColor(record)}
                  lightMode={true}
                  size="large"
                  shape="subtle"
                >
                  <span className="flex items-center">
                    <AccessTimeIcon fontSize="small" className="mr-2" />
                    {orderTimer(
                      record?.created_at,
                      record?.finished_at?.length
                        ? record?.finished_at
                        : record?.status_notes?.find(
                            (status_note) =>
                              status_note?.status_id ===
                                process.env
                                  .REACT_APP_OPERATOR_CANCELED_STATUS_ID ||
                              status_note?.status_id ===
                                process.env.REACT_APP_SERVER_CANCELED_STATUS_ID,
                          )?.created_at,
                      record?.future_time,
                      record?.status_id,
                    )}
                  </span>
                </Tag>
                <div className="text-center text-xs mt-2">
                  {statusTag(record?.status_id, t)}
                </div>
              </div>
            </div>
          );
        },
      },

      {
        title: t("courier"),
        key: "courier",
        // filterOptions: couriers,
        // onFilter: (ids) => {
        //   setFilters((old) => ({
        //     ...old,
        //     courier_id: ids.length ? ids.join(",") : undefined,
        //   }));
        // },
        render: (record) => (
          <div>
            {record?.courier.first_name
              ? `${record?.courier.first_name} ${record?.courier.last_name}`
              : "----"}
            <a
              href={`tel:${record?.courier.phone}`}
              className="text-info cursor-pointer block"
            >
              {record?.courier.phone}
            </a>
          </div>
        ),
      },
      {
        title: t("branch"),
        key: "branch",
        // filterOptions: branches,
        // onFilter: (ids) => {
        //   setFilters((old) => ({
        //     ...old,
        //     branch_ids: ids.length ? ids.join(",") : undefined,
        //   }));
        // },
        render: (record) => (
          <div>
            {record?.steps[0].branch_name}
            <span className="text-info cursor-pointer block">
              {record?.steps[0].phone_number}
            </span>
          </div>
        ),
      },
      {
        title: t("operator_accepted_timer"),
        key: "operator_accepted_timer",
        render: (record) => {
          return (
            <div className="flex justify-center">
              <div className="w-36">
                <Tag
                  color={
                    lateTimeData?.free_delevery_for_delayed_order
                      ? handleOperatorAcceptedColor(record)
                      : handleTimeColor(record)
                  }
                  size="large"
                  shape="subtle"
                  lightMode={true}
                >
                  <span
                    className={`text-${
                      lateTimeData?.free_delevery_for_delayed_order
                        ? handleOperatorAcceptedColor(record)
                        : handleTimeColor(record)
                    }-600 flex items-center`}
                  >
                    <AccessTimeIcon fontSize="small" className="mr-2" />
                    {processOnlyPaid
                      ? record?.payment_type === "cash"
                        ? ComputeOperatorTimer(
                            record,
                            record?.operator_accepted_at,
                          )
                        : (record?.payment_type === "click" ||
                            record?.payment_type === "payme" ||
                            record?.payment_type === "apelsin") &&
                          record?.paid
                        ? ComputeOperatorTimer(record, record?.paid_time)
                        : "00:00:00"
                      : // : record?.operator_accepted_at.slice(10, record?.operator_accepted_at.length)
                        ComputeOperatorTimer(
                          record,
                          record?.operator_accepted_at,
                        )}
                    {/* {record?.status_id ===
                      process.env.REACT_APP_FINISHED_STATUS_ID
                        ? handleOperatorAccepted(record, record?.operator_accepted_at)
                        : orderTimer(
                            record?.operator_accepted_at,
                            record?.finished_at?.length
                              ? record?.finished_at
                              : record?.status_notes?.find(
                                  (status_note) =>
                                    status_note?.status_id ===
                                    "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
                                )?.created_at,
                            record?.future_time,
                            record?.status_id,
                            "operator_accepted_timer",
                          )} */}
                  </span>
                </Tag>
              </div>
            </div>
          );
        },
      },
      {
        title: t("delivery.type"),
        key: "delivery.type",
        render: (record) => (
          <div className="flex justify-center items-center flex-col">
            <div
              style={{
                width: 72,
                height: 72,
                border: "1px solid #EEEEEE",
                borderRadius: "50%",
              }}
              className="flex justify-center items-center"
            >
              {deliveryIcon(record?.delivery_type)}
            </div>
            <div className="text-center">
              {Math.round(record?.distance / 10) / 100} {t("km")}
            </div>
          </div>
        ),
      },
      {
        title: t("order.price"),
        key: "price",
        sorter: true,
        onSort: (order) => {
          setSortby(() => {
            if (order === "asc") {
              return "order_amount";
            } else if (order === "desc") {
              return "-order_amount";
            }
          });
        },
        // filterOptions: payment_types,
        // onFilter: (types) => {
        //   setFilters((old) => ({
        //     ...old,
        //     payment_type: types.length ? types.join(",") : undefined,
        //   }));
        // },
        render: (record) => (
          <div className="flex items-center justify-center flex-col">
            <div
              style={{
                width: 72,
                height: 72,
                backgroundColor:
                  record?.payment_type !== "cash" && record?.paid
                    ? "#BBFBD0"
                    : "transparent",
                border: "1px solid #EEEEEE",
                borderRadius: "50%",
              }}
              className="flex justify-center"
            >
              <img
                className={`w-full ${
                  record?.payment_type === "cash"
                    ? "object-cover"
                    : "object-none"
                }`}
                src={paymentTypeIconMake(record?.payment_type)}
                alt={record?.payment_type}
              />
            </div>
            <div className="text-center">
              {record?.order_amount
                ? numberToPrice(record?.order_amount + record?.delivery_price)
                : "----"}
            </div>
          </div>
        ),
      },
      {
        title: t("client.address"),
        key: "client.address",
        render: (record) => (
          <div className="w-44">
            {/* <Tooltip title={record?.to_address} placement="top"> */}
            <span>{record?.to_address}</span>
            {/* </Tooltip> */}
          </div>
        ),
      },
      {
        title: t("source"),
        key: "source",
        render: (record) => (
          <div className="flex justify-center align-middle flex-col">
            <img
              className="object-none"
              src={getSourceIcon(record?.source)}
              alt={record?.source}
            />
          </div>
        ),
      },
      {
        title: t("date.branch"),
        key: "created_at",
        render: (record) => (
          <div className="flex justify-center align-middle flex-col">
            {moment(record?.created_at).format("DD.MM.YYYY HH:mm")}
          </div>
        ),
      },
    ],
    [
      t,
      limit,
      currentPage,
      setSortby,
      ComputeOperatorTimer,
      handleTimeColor,
      dispatch,
      history,
      lateTimeData?.free_delevery_for_delayed_order,
      processOnlyPaid,
    ],
  );

  useEffect(() => {
    const _columns = [
      ...initialCols,
      {
        title: (
          <SwitchColumns
            columns={initialCols}
            onChange={(val) => {
              setColumns((prev) => [...val, prev[prev.length - 1]]);
            }}
          />
        ),
        key: "actions",
        render: (record) =>
          record?.status_id !== "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1" && (
            <div className="flex gap-2 justify-end">
              <ActionMenu
                record={record}
                isInOrders={true}
                id={record?.id}
                actions={genActions(record)}
                paymentType={record?.payment_type}
              />
            </div>
          ),
      },
    ];

    setColumns(_columns);
  }, [
    genActions,
    initialCols,
    // t,
    // limit,
    // history,
    // setCauses,
    // genActions,
    // initialCols,
    // currentPage,
    // setModalInfo,
    // setIsthereCauses,
    // causesForCompletion,
    // causesForCanceletion,
  ]);

  return columns;
}
