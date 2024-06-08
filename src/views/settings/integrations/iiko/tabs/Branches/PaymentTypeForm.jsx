import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { getIikoPaymentTypes } from "services/v2/Iiko";
import { useFormik } from "formik";
import {
  deletePaymentType,
  getPaymentTypes,
  postPaymentTypes,
} from "services/v2/crm";
import AsyncSelect from "components/Select/Async";
import Form from "components/Form/Index";
import Select from "components/Select";
import { useSelector } from "react-redux";
import Modal from "components/ModalV2";
import Button from "components/Button/Buttonv2";

export default function PaymentTypeForm({ branchId, open, onClose }) {
  const { t } = useTranslation();
  const { shipper_id } = useSelector((state) => state.auth);
  let debounce = setTimeout(() => {}, 0);
  const deleverPaymentTypes = [
    { label: t("cash"), value: "cash" },
    { label: "Click", value: "click" },
    { label: "Payme", value: "payme" },
    { label: "Apelsin", value: "apelsin" },
    { label: t("transfer"), value: "transfer" },
  ];

  const [loader, setLoader] = useState(true);
  const [branchPaymentTypes, setBranchPaymentTypes] = useState(null);

  const onSubmit = (values) => {
    const data = {
      ...values,
      delever_payment_type: values.delever_payment_type.value,
      branch_id: branchId,
      iiko_id: values.iiko_id,
      shipper_id,
    };
    postPaymentTypes(data).then(() => {
      onClose();
      resetForm();
      fetchData();
    });
  };

  const formik = useFormik({
    initialValues: {
      iiko_id: "",
      code: "",
      name: "",
      crm_type: "iiko",
      payment_type_kind: "",
      delever_payment_type: "",
    },
    onSubmit,
  });

  const { values, handleSubmit, setFieldValue, resetForm } = formik;

  const fetchData = useCallback(() => {
    if (branchId) {
      getPaymentTypes({ crm_type: "iiko", branch_id: branchId })
        .then((res) => {
          setBranchPaymentTypes(res?.paymentTypes);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    }
  }, [branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    resetForm();
  }, [open, resetForm]);

  const onDelete = (id) => {
    deletePaymentType(id)
      .then(fetchData)
      .catch((err) => console.log(err));
  };

  const loadPaymentTypes = (inputValue, callback) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      getIikoPaymentTypes({ branch_id: branchId, search: inputValue })
        .then((res) => {
          let paymentTypes = res?.paymentTypes?.map((elm) => ({
            label: elm?.name || "",
            value: elm?.code,
            id: elm?.id,
            payment_type_kind: elm?.paymentTypeKind,
          }));
          callback(paymentTypes);
        })
        .catch((error) => console.log(error));
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("payment.types")}
      contentsx={{ overflowY: "visible" }}
    >
      <TableContainer className="relative rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Delever</TableCell>
              <TableCell>IIKO</TableCell>
              <TableCell>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              branchPaymentTypes?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{t(item.deleverPaymentType)}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <div
                      className="bg-red-100 flex justify-center rounded-md py-1"
                      onClick={() => onDelete(item.id)}
                    >
                      <DeleteIcon style={{ color: "red" }} fontSize="small" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex my-4 gap-4">
        <div className="flex-1">
          <Form.Item
            formik={formik}
            label={t("choose.payment_type")}
            name="delever_payment_type"
          >
            <Select
              id="delever_payment_type"
              options={deleverPaymentTypes}
              value={values.delever_payment_type}
              onChange={(val) => setFieldValue("delever_payment_type", val)}
            />
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item formik={formik} label={t("choose.payment_type")}>
            <AsyncSelect
              defaultOptions
              cacheOptions
              isSearchable
              value={{
                label: values?.name,
                value: values?.code,
                iiko_id: values?.id,
                payment_type_kind: values?.payment_type_kind,
              }}
              loadOptions={loadPaymentTypes}
              placeholder={t("choose.crm_type")}
              onChange={(val) => {
                setFieldValue("name", val.label);
                setFieldValue("code", val.value);
                setFieldValue("iiko_id", val.id);
                setFieldValue("payment_type_kind", val.payment_type_kind);
              }}
            />
          </Form.Item>
        </div>
      </div>
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        {t("add")}
      </Button>
    </Modal>
  );
}
