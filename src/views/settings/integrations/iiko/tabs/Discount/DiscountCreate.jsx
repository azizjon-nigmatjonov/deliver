import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Form from "components/Form/Index";
import Select from "components/Select";
import Modal from "components/Modal";
import {
  getCRMDiscounts,
  getIntergrationDiscountsByID,
  postIntegrationDiscounts,
} from "services/v2";
import discountService, {
  putIntegrationDiscounts,
} from "services/v2/discounts";
import { useSelector } from "react-redux";

export default function DiscountCreate({
  systemDiscountID,
  open,
  onClose,
  refetch,
}) {
  const { t } = useTranslation();
  const lang = useSelector((state) => state.lang.current);

  const [allDiscounts, setAllDiscounts] = useState();
  const [iikoDiscounts, setIikoDiscounts] = useState();

  const onSubmit = (values) => {
    const data = {
      discount_data: {
        iiko_discount_id: values.iiko_discount_id.value,
        iiko_discount_name: values.iiko_discount_id.label,
      },
      system_discount_id: values.system_discount_id.value,
    };
    systemDiscountID
      ? putIntegrationDiscounts(data).then(() => {
          onClose();
          refetch();
        })
      : postIntegrationDiscounts(data).then(() => {
          onClose();
          refetch();
        });
  };

  const formik = useFormik({
    initialValues: {
      discount_data: {
        iiko_discount_id: "",
        iiko_discount_name: "",
      },
      system_discount_id: "",
    },
    onSubmit,
  });

  const { values, handleSubmit, setFieldValue, resetForm } = formik;

  const fetchData = useCallback(() => {
    if (systemDiscountID) {
      getIntergrationDiscountsByID(systemDiscountID)
        .then((res) => {
          setFieldValue("iiko_discount_id", {
            label: res?.discount_data?.iiko_discount_name,
            value: res?.discount_data?.iiko_discount_id,
          });
          setFieldValue("system_discount_id", {
            label: res?.system_discount_name[lang],
            value: res?.system_discount_id,
          });
        })
        .catch((err) => console.log(err));
    }
  }, [systemDiscountID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    !systemDiscountID && open && resetForm();
  }, [systemDiscountID, open, resetForm]);

  useEffect(() => {
    discountService
      .getList({
        page: 1,
        limit: 50,
        is_only_active: true,
      })
      .then((res) => {
        setAllDiscounts(
          res?.discounts?.map((item) => ({
            label: item.name[lang],
            value: item.id,
          })),
        );
      })
      .catch((error) => console.log(error));

    getCRMDiscounts("iiko", { page: 1, limit: 50 }).then((res) => {
      setIikoDiscounts(
        res?.discounts?.map((item) => ({
          label: item?.discount_data?.name,
          value: item?.discount_data?.id,
        })),
      );
    });
  }, [lang]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      isWarning={false}
      onConfirm={handleSubmit}
      modalOverflow="visible"
      title={t("Связать скидку")}
      close={t("cancel")}
      confirm={t("add")}
    >
      <div className="flex mt-2 mb-4 gap-4">
        <div className="flex-1 ">
          <div className="input-label">{t("Delever")}</div>
          <Form.Item formik={formik} name="system_discount_id">
            <Select
              height={40}
              id="system_discount_id"
              isSearchable
              options={allDiscounts}
              value={values.system_discount_id}
              onChange={(val) => setFieldValue("system_discount_id", val)}
            />
          </Form.Item>
        </div>
        <div className="flex-1">
          <div className="input-label">{t("IIKO")}</div>
          <Form.Item formik={formik} name="iiko_discount_id">
            <Select
              height={40}
              id="iiko_discount_id"
              isSearchable
              options={iikoDiscounts}
              value={values.iiko_discount_id}
              onChange={(val) => setFieldValue("iiko_discount_id", val)}
            />
          </Form.Item>
        </div>
      </div>
    </Modal>
  );
}
