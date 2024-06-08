import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Input } from "alisa-ui";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { ArrowBackRounded } from "@mui/icons-material";
import ReactInputMask from "react-input-mask";
import { getSmsPayments } from "services";
import { useFormik } from "formik";
import Header from "components/Header";
import Form from "components/Form/Index";
import Select from "components/Select";
import Button from "components/Button";
import { sendSms } from "services/send-sms";
import { getCountOrder } from "services/v2";
import { showAlert } from "redux/actions/alertActions";
import Card from "components/Card";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";

const SendInvoice = () => {
  const [smsPaymentList, setSmsPaymentList] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const paymentOptions = [
    {
      label: "Click",
      value: "click",
    },
    {
      label: "Payme",
      value: "payme",
    },
    {
      label: "Apelsin",
      value: "apelsin",
    },
  ];

  const StyledTableCell = withStyles((theme) => ({
    head: {
      padding: "12px 40px 12px 16px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#1A2024",
    },
    body: {
      color: "#303940",
    },
  }))(TableCell);

  const getSmsPaymentList = useCallback(() => {
    setLoader(true);
    getSmsPayments({ page: currentPage, limit })
      .then((res) => {
        setSmsPaymentList(res);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoader(false);
      });
  }, [currentPage, limit]);

  const onSubmit = (values) => {
    if (
      values.phone_number.length === 13 &&
      values.external_order_id.length === 6 &&
      values.payment_method?.value
    )
      sendSms({
        order_id: orderId,
        payment_type: values.payment_method?.value,
        phone: values.phone_number,
      })
        .then((res) => {
          dispatch(showAlert(t(res), "success"));
          getSmsPaymentList();
        })
        .catch((err) => console.log(err));
  };

  const formik = useFormik({
    initialValues: {
      phone_number: "",
      external_order_id: "",
      payment_method: "",
    },
    onSubmit,
  });

  const { values, handleSubmit, handleChange, setFieldValue } = formik;

  useEffect(() => {
    getSmsPaymentList();
  }, [currentPage, limit, getSmsPaymentList]);

  useEffect(() => {
    if (values?.external_order_id?.length === 6) {
      getCountOrder(values?.external_order_id)
        .then((res) => {
          setOrderId(res?.id);
          dispatch(showAlert(t("order.found"), "success"));
        })
        .catch((err) => console.log(err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.external_order_id, t]);

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={smsPaymentList?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
      pageCount={limit}
      onChangeLimit={(limitNumber) => setLimit(limitNumber)}
      limit={limit}
    />
  );

  return (
    <>
      <Header
        title={
          <div className="flex">
            <ArrowBackRounded
              onClick={() => history.goBack()}
              className="cursor-pointer"
            />
            <p className="ml-3">Выставить счёт</p>
          </div>
        }
      />
      <Card className="m-4" footer={pagination}>
        <form
          onSubmit={handleSubmit}
          className="flex items-start gap-3 w-full px-2 mb-4"
        >
          <div className="flex-1">
            <div className="input-label">
              <span> {t("phone.number")} </span>
            </div>
            <Form.Item formik={formik} name="phone_number">
              <ReactInputMask
                id="phone_number"
                value={values.phone_number}
                mask="+\9\98999999999"
                disabled={false}
                placeholder={t("phone.number")}
                onChange={handleChange}
                maskChar={null}
              >
                {(inputProps) => (
                  <Input {...inputProps} onChange={handleChange} />
                )}
              </ReactInputMask>
            </Form.Item>
          </div>
          <div className="flex-1">
            <div className="input-label">
              <span> {t("order.id")} </span>
            </div>
            <Form.Item formik={formik} name="external_order_id">
              <ReactInputMask
                id="external_order_id"
                value={values.external_order_id}
                mask="999999"
                disabled={false}
                placeholder={t("order.id")}
                onChange={handleChange}
                maskChar={null}
              >
                {(inputProps) => (
                  <Input {...inputProps} onChange={handleChange} />
                )}
              </ReactInputMask>
            </Form.Item>
          </div>
          <div className="flex-1">
            <div className="input-label">
              <span> {t("payment.method")} </span>
            </div>
            <Form.Item formik={formik} name="payment_method">
              <Select
                value={values.payment_method}
                options={paymentOptions}
                className="w-full"
                onChange={(val) => setFieldValue("payment_method", val)}
                placeholder={t("select.payment.method")}
              />
            </Form.Item>
          </div>
          <div className="mt-6">
            <Button type="submit" size="medium">
              {t("send.an.invoice")}
            </Button>
          </div>
        </form>
        <TableContainer
          key="table-container"
          className="rounded-lg border border-lightgray-1"
        >
          <Table aria-label="simple tabs">
            <TableHead key="table-head">
              <TableRow>
                <StyledTableCell>{t("order.id")}</StyledTableCell>
                <StyledTableCell>{t("phone.number")}</StyledTableCell>
                <StyledTableCell>{t("operator.name")}</StyledTableCell>
                <StyledTableCell>{t("order.sum")}</StyledTableCell>
                <StyledTableCell>{t("payment.type")}</StyledTableCell>
                <StyledTableCell>{t("date.branch")}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody key="table-body">
              {!loader &&
                smsPaymentList?.smspayments?.map((paymentlist, index) => (
                  <TableRow
                    key={paymentlist.id}
                    className={index % 2 === 0 ? "bg-lightgray-5 " : ""}
                  >
                    <StyledTableCell>
                      {paymentlist?.ext_order_id}
                    </StyledTableCell>
                    <StyledTableCell>{paymentlist?.phone}</StyledTableCell>
                    <StyledTableCell>
                      {paymentlist?.operator_name}
                    </StyledTableCell>
                    <StyledTableCell>
                      {paymentlist?.order_amount}
                    </StyledTableCell>
                    <StyledTableCell>
                      {t(paymentlist?.payment_type)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {moment(paymentlist?.created_at).format("DD.MM.YYYY")}
                    </StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={loader} />
      </Card>
    </>
  );
};

export default SendInvoice;
