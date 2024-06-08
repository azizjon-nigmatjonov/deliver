import React, { useEffect, useState } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";
import { useFormik } from "formik";
import Select from "components/Select";
import Switch from "components/Switch";
import { useSelector } from "react-redux";
import { getShipper } from "services";
import { useFares } from "services/v2/fares";

const CurrentFareForm = ({ setFareName, open, id }) => {
  const [fareId, setFareId] = useState("");
  const { t } = useTranslation();
  const formik = useFormik({});

  const { values, setValues } = formik;

  const { shipper_id } = useSelector((state) => state.auth);

  useEffect(() => {
    getShipper(shipper_id).then((res) => {
      setFareId(res?.shipper_fare_id);
    });
  }, [shipper_id]);

  const { getFareByID } = useFares({
    fareIDParams: open ? id : fareId,
    fareIDProps: {
      enabled: open && id ? true : fareId ? true : false,
      onSuccess: (res) => {
        setValues({
          name: res?.name,
          fix_price: res?.fix_price,
          subscription_fee:
            res?.subscription_fee === "fixed"
              ? t("subscription_fixed")
              : res?.subscription_fee === "percent"
              ? t("subscription_percent")
              : t("subscription_none"),
          currency: res?.currency,
          delivery: res?.delivery.fixed_price,
          self_pickup: res?.self_pickup.fixed_price,
          aggregator: res?.aggregator.fixed_price,
          delivery_percent: res?.delivery.percent,
          self_pickup_percent: res?.self_pickup.percent,
          aggregator_percent: res?.aggregator.percent,
          with_delivery_price: res?.with_delivery_price,
        });
        setFareName(res?.name);
      },
    },
  });

  return (
    <div className={`flex flex-col gap-5 ${open ? "w-full" : "w-1/2"}`}>
      <Card className="" title={t("fill_inputs")}>
        <div className="flex gap-5 mb-4">
          <div className="w-1/2">
            <label htmlFor={"name"}>{t("name")}</label>
            <Input
              id="name"
              size="large"
              formik={formik}
              value={values?.name}
              type="text"
              disabled
            />
          </div>
          <div className="w-1/2">
            <label htmlFor={"fixed_price"}>{t("fixed_price")}</label>
            <Input
              id="fixed_price"
              size="large"
              formik={formik}
              value={values?.fix_price}
              type="number"
              disabled
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-1/2">
            <label htmlFor={"fee"}>{t("subscription_fee")}</label>
            <Select
              id="fee"
              formik={formik}
              value={[
                {
                  label: values?.subscription_fee,
                  value: values?.subscription_fee,
                },
              ]}
              placeholder={""}
              disabled
            />
          </div>
          <div className="w-1/2">
            <label htmlFor={"currency"}>{t("currency")}</label>
            <Select
              id="currency"
              formik={formik}
              value={[
                {
                  label: values?.currency,
                  value: values?.currency,
                },
              ]}
              placeholder={""}
              disabled
            />
          </div>
        </div>
      </Card>
      {values?.subscription_fee === t("subscription_fixed") && (
        <Card className="" title={t("initial_order_price")}>
          <div className="flex justify-between">
            <div>
              <label htmlFor={"fair"}>{t("fair")}</label>
              <Input
                id="fair"
                size="large"
                formik={formik}
                value={values?.delivery}
                type="text"
                disabled
              />
            </div>
            <div>
              <label htmlFor={"pickup"}>{t("pickup")}</label>
              <Input
                id="pickup"
                size="large"
                formik={formik}
                value={values?.self_pickup}
                type="text"
                disabled
              />
            </div>
            <div>
              <label htmlFor={"aggregator"}>{t("aggregator")}</label>
              <Input
                id="aggregator"
                size="large"
                formik={formik}
                value={values?.aggregator}
                type="text"
                disabled
              />
            </div>
          </div>
        </Card>
      )}
      {values?.subscription_fee === t("subscription_percent") && (
        <Card className="" footer title={t("persent_of_initial_order_price")}>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between w-1/2">
              <label htmlFor={"fair"}>{t("fair")}</label>
              <Input
                id="fair"
                size="large"
                formik={formik}
                value={values?.delivery_percent}
                type="text"
                disabled
              />
            </div>
            <div className="flex items-center justify-between w-1/2">
              <label htmlFor={"pickup"}>{t("pickup")}</label>
              <Input
                id="pickup"
                size="large"
                formik={formik}
                value={values?.self_pickup_percent}
                type="text"
                disabled
              />
            </div>
            <div className="flex items-center justify-between w-1/2">
              <label htmlFor={"aggregator"}>{t("aggregator")}</label>
              <Input
                id="aggregator"
                size="large"
                formik={formik}
                value={values?.aggregator_percent}
                type="text"
                disabled
              />
            </div>

            <div className="flex items-center justify-between w-1/2">
              <label htmlFor={"with_fair_price"}>{t("with_fair_price")}</label>
              <Switch
                disabled
                id="active"
                checked={values?.with_delivery_price}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CurrentFareForm;
