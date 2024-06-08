import { useCallback, useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import TextFilter from "components/Filters/TextFilter";
import LoaderComponent from "components/Loader";
import Modal from "components/Modal";
import { ModalOrderHistory } from "components/Modal Order History";
import { statusTabList } from "constants/statuses";
import orderTimer from "helpers/orderTimer";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getCancelingReasons,
  getCompletionReasons,
  removeCourierFromOrder,
  useOrderList,
} from "services";
import { UpdateVendorComment } from "services/customerComment";
import { postUserLog } from "services/userLog";
import axios from "utils/axios";
import PrintOrder from "./PrintOrder";
import useColumns from "./useColumns";
import styles from "./styles.module.scss";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      position: "relative",
    },
  },
}));

function OrdersTable({
  limit,
  inputRef,
  getCount,
  currentPage,
  setItemsCount,
  externalOrderId,
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const {
    tab,
    branches,
    courier_id,
    customer_id,
    statuses,
    dateRange,
    delivery_type,
    payment_method,
  } = useSelector((state) => state.orderFilters);
  const lateTimeData = useSelector((state) => state.lateTime.payload);
  const { editing_orders } = useSelector((state) => state.socketData);
  const { name, shipper_id } = useSelector((state) => state?.auth);
  const modal_data = useSelector((state) => state?.orderHistoryReducer);

  const [modalInfo, setModalInfo] = useState(null);
  const [modalComment, setModalComment] = useState(null);
  const [msg, setMsg] = useState("");
  const [causes, setCauses] = useState([]);
  const [cause, setCause] = useState();
  const [causeStatus, setCauseStatus] = useState("");
  const [isThereCauses, setIsthereCauses] = useState(false);
  const [sort_by, setSortby] = useState("");
  const [comment, setComment] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orderForPrint, setOrderForPrint] = useState({});
  const [causesForCanceletion, setCausesForCanceletion] = useState([]);
  const [causesForCompletion, setCausesForCompletion] = useState([]);

  let columns = useColumns({
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
  });

  const { data, isLoading, refetch } = useOrderList({
    params: {
      branch_ids:
        branches?.length > 0 ? String(branches?.map((el) => el.value)) : null,
      courier_id: courier_id?.value ?? null,
      status_ids:
        statuses?.length > 0 ? String(statuses?.map((el) => el.value)) : tab,
      delivery_type: delivery_type?.value,
      payment_type: payment_method?.value ?? null,
      external_order_id: externalOrderId,
      sort_by: sort_by,
      page: currentPage,
      limit,
      start_date: handleStartDate(
        tab,
        dateRange?.start_date,
        inputRef?.current?.value,
      ),
      end_date: dateRange?.end_date,
      customer_id: customer_id?.value,
    },
    props: {
      enabled: true,
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
      onError: (err) => console.log(err),
      onSuccess: (res) => {
        getCount();
        setItemsCount(res?.count);
      },
    },
  });

  useEffect(() => {
    getCancelingReasons({ shipper_id: shipper_id })
      .then((res) => {
        let causesData = [];
        res?.canceling_reasons?.forEach((el) => {
          causesData.push({ value: el.id, label: el.text });
        });
        setCausesForCanceletion(causesData);
      })
      .catch((err) => console.log(err));
  }, [shipper_id]);

  useEffect(() => {
    getCompletionReasons()
      .then((res) => {
        let causesData = [];
        res?.finishing_reasons?.forEach((el) => {
          causesData.push({ label: el.text, value: el.id });
        });
        setCausesForCompletion(causesData);
      })
      .catch((err) => console.log(err));
  }, []);

  // UserLogs runs here
  const changeStatus = useCallback(() => {
    // const data = {
    //   action: t(modalInfo.type),
    //   courier_id: modalInfo?.record?.courier_id,
    //   courier_name: modalInfo?.record?.courier?.first_name,
    //   description:
    //     modalInfo?.type === "order_canceled_by_courier"
    //       ? `Заказ снят с курьера ${
    //           modalInfo?.record?.courier?.first_name +
    //           (modalInfo?.record?.courier?.last_name
    //             ? modalInfo?.record?.courier?.last_name
    //             : "")
    //         }`
    //       : msg?.length > 0
    //       ? msg
    //       : cause,
    //   integration_request: "",
    //   integration_response: "",
    //   operator_id: shipper_id,
    //   operator_name: name,
    //   order_id: modalInfo?.record?.id,
    //   vendor_id: "",
    //   vendor_name: "",
    // };
    // postUserLog(data);

    if (modalInfo?.type !== "order_canceled_by_courier") {
      axios
        .patch(
          `/order/${modalInfo?.id}/change-status?shipper_id=${modalInfo?.shipper_id}`,
          {
            description: msg?.length ? msg : cause.label,
            status_id: causeStatus,
            reason_id: cause.value,
          },
        )
        .then((res) => {
          setModalInfo(null);
          refetch();
        })
        .catch((err) => console.log(err));
    } else {
      removeCourierFromOrder(modalInfo?.id).catch((err) => console.log(err));
      setModalInfo(null);
      refetch();
    }
  }, [
    msg,
    cause,
    modalInfo,
    refetch,
    causeStatus,
    // name,
    // shipper_id,
    // t,
    // causeID,
  ]);
  const sendComment = useCallback(() => {
    const data = {
      comment: comment,
    };
    const logData = {
      action: "Комментарий к кухне",
      courier_id: "",
      courier_name: "",
      description: comment,
      integration_request: "",
      integration_response: "",
      operator_id: shipper_id,
      operator_name: name,
      order_id: modalComment?.record?.id,
      vendor_id: "",
      vendor_name: "",
    };
    UpdateVendorComment(data, modalComment?.record?.id).then(() =>
      setModalComment({ ...modalComment, open: false }),
    );
    postUserLog(logData);
    setComment(null);
  }, [comment, modalComment, name, shipper_id]);
  useEffect(() => {
    if (modalInfo === null) {
      setMsg("");
    }
  }, [modalInfo]);

  // useEffect(() => {
  //   refetch();
  // }, [
  //   // tab,
  //   // limit,
  //   // statuses,
  //   // branches,
  //   // dateRange,
  //   // courier_id,
  //   // currentPage,
  //   // customer_id,
  //   // delivery_type,
  //   // payment_method,
  //   // externalOrderId,
  //   refetch,
  // ]);

  const handleTableRowColor = (elm) => {
    const OPERATOR_ACCEPTED_AT = Math.round(
      moment
        .duration(
          orderTimer(
            elm?.operator_accepted_at,
            elm?.finished_at?.length
              ? elm.finished_at
              : elm?.status_notes?.find(
                  (status_note) =>
                    status_note?.status_id ===
                    "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
                )?.created_at,
            elm?.future_time,
            elm?.status_id,
            "operator_accepted_timer",
          ),
        )
        .asMinutes(),
    );
    if (OPERATOR_ACCEPTED_AT >= lateTimeData?.time)
      return lateTimeData?.color?.hex;

    return "";
  };

  const handleTableColumns = (e, elm, index2) => {
    if (columns.length - 1 === index2) {
      e.stopPropagation();
    }
    if (index2 !== 1 && index2 !== 2 && index2 !== 11) {
      if (elm.status_id === "e665273d-5415-4243-a329-aee410e39465") {
        history.push({
          pathname: `/home/orders/${elm.id}`,
          search: "status=completed",
        });
      } else history.push(`/home/orders/${elm.id}`);
    }
  };

  return (
    <div className={classes.root}>
      <TableContainer
        key="table-container"
        className="rounded-md border border-bordercolor"
      >
        <Table aria-label="simple table" className="orders-table">
          <TableHead key="table-head">
            <TableRow>
              {columns.map((elm, i) =>
                columns.length - 1 === i ? (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ) : (
                  <TableCell key={elm.key}>
                    <TextFilter customIcon={true} {...elm} />
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody key="table-body">
            {!isLoading &&
              data?.orders?.map((elm, index) => (
                <TableRow
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  key={elm.id}
                  style={{
                    backgroundColor: handleTableRowColor(elm),
                  }}
                >
                  {columns.map((col, index2) => (
                    <TableCell
                      key={col.key + elm.id}
                      className={
                        col.key === "branch" ? "whitespace-nowrap" : ""
                      }
                      onClick={(e) => handleTableColumns(e, elm, index2)}
                    >
                      <div
                        className={
                          col?.key === "order_id"
                            ? editing_orders?.[elm.id]
                              ? `${styles.orderId} ${styles.editing}`
                              : styles.orderId
                            : ""
                        }
                      >
                        {col.render
                          ? col.render(elm, index)
                          : elm[col.dataIndex]}
                        {col?.key === "order_id" && (
                          <div className={styles.editing_text}>
                            {t("editing")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={isLoading} />

      <Modal
        key="modal"
        disable={
          modalInfo?.type === "order_canceled_by_courier" ? false : !cause
        }
        open={Boolean(modalInfo?.open)}
        isWarning={!modalInfo?.title}
        title={modalInfo?.title}
        onClose={() => {
          setModalInfo({
            ...modalInfo,
            open: false,
          });

          //This is for waiting to set averything to null otherwise Modal is changing before closing
          setTimeout(() => {
            setModalInfo(null);
          }, [1000]);
        }}
        onConfirm={changeStatus}
        loading={false}
      >
        {isThereCauses && (
          <CasesHandlerComponent
            causes={causes}
            msg={msg}
            setMsg={setMsg}
            cause={cause}
            setCause={setCause}
          />
        )}
      </Modal>
      <Modal
        key="modal1"
        disable={!comment?.length}
        open={modalComment?.open}
        isWarning={false}
        title={modalComment?.title ?? "Оставить комментарий"}
        onClose={() => {
          setModalComment({
            ...modalComment,
            open: false,
          });
        }}
        onConfirm={sendComment}
        loading={false}
      >
        <TextareaAutosize
          className="w-full rounded-md border border-lightgray-1 mt-1 p-2 mb-2"
          placeholder={"Оставить комментарий"}
          multiline
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          minRows={4}
          maxRows={4}
          autoFocus
        />
      </Modal>
      <ModalOrderHistory toggle={modal_data?.toggle} id={modal_data?.id} />
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <PrintOrder orderForPrint={orderForPrint} isDrawerOpen />
      </Drawer>
    </div>
  );
}

export default OrdersTable;

function CasesHandlerComponent({ msg, setMsg, causes, cause, setCause }) {
  return (
    <div className="mb-3">
      <FormControl component="fieldset">
        <FormLabel component="legend">Причина</FormLabel>
        <RadioGroup aria-label="gender" name="gender1">
          {causes.map((item) => (
            <FormControlLabel
              key={item.value}
              value={item.value}
              control={<Radio />}
              label={item.label}
              onChange={() => setCause(item)}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {cause?.label === "Другой" && (
        <TextareaAutosize
          className="w-full rounded-md border border-lightgray-1 mt-1 p-2"
          multiline="true"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          minRows={4}
          maxRows={4}
          autoFocus
          placeholder="Причина...."
        />
      )}
    </div>
  );
}

var beginning = moment("2018-01-01T00:00:00.001Z").format("YYYY-MM-DD");

function handleStartDate(tabValue, start_date, range_picker_value) {
  if (
    !range_picker_value &&
    isSame(tabValue, statusTabList[statusTabList.length - 1].id)
  ) {
    return beginning;
  }
  return start_date;
}

function isSame(ids1 = "", ids2 = "") {
  var arrIds1 = ids1.split(",");
  var arrIds2 = ids2.split(",");
  var map = arrIds1.reduce(
    (map, cur) => {
      map[cur] = cur;
      map.length += 1;
      return map;
    },
    { length: 0 },
  );
  var result = true;

  arrIds2.forEach((id) => {
    if (map[id] !== id) {
      result = false;
    }
  });

  return arrIds2.length === map?.length && result;
}
