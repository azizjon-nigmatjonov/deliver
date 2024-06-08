import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Form from "components/Form/Index";
import Select from "components/Select";
import Modal from "components/Modal";
import { Input } from "alisa-ui";
import * as yup from "yup";
import { useAggregators, useIIKOAggregators } from "services";
import {
  useAggregator,
  useAggregatorMutations,
} from "services/v2/crm_aggregators";
import { showAlert } from "redux/actions/alertActions";
import { useDispatch, useSelector } from "react-redux";

const AggregatorsCreate = ({ setOpen, open, refetch, byID, clearID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang.current);

  const { postAggregator } = useAggregatorMutations({
    props: {
      onSuccess: () => {
        setOpen(false);
        refetch();
        dispatch(showAlert(t("successfully_created"), "success"));
      },
    },
  });
  const { putAggregator } = useAggregatorMutations({
    props: {
      onSuccess: () => {
        setOpen(false);
        refetch();
        dispatch(showAlert(t("successfully_updated"), "success"));
      },
    },
  });

  const { data } = useAggregator({
    id: byID,
    props: {
      enabled: byID ? true : false,
      onSuccess: (res) => {
        setFieldValue("system_aggregator_id", {
          label: res?.system_aggregator_name[lang],
          value: res?.system_aggregator_id,
        });
        setFieldValue("aggregator_data", {
          label: res?.aggregator_data?.iiko_name,
          value: res?.aggregator_data?.iiko_id,
        });
      },
    },
  });

  const { aggregatorsQuery } = useAggregators({
    aggregatorsParams: {
      page: 1,
    },
    aggregatorsProps: {
      enabled: true,
      select: (res) => {
        const arr = res?.aggregators.map((agg) => ({
          value: agg?.id,
          label: agg?.name,
        }));
        return arr;
      },
    },
  });

  const { aggregatorsIIKOQuery } = useIIKOAggregators({
    props: {
      enabled: true,
      select: (res) => {
        const arr = res?.order_types.map((agg) => ({
          value: agg?.id,
          label: agg?.name,
        }));
        return arr;
      },
    },
  });

  const initialValues = {
    aggregator_data: {
      iiko_id: "",
      iiko_name: "",
    },
    system_aggregator_id: "",
  };

  const validationSchema = () => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));

    return yup.object().shape({
      aggregator_data: defaultSchema,
      system_aggregator_id: defaultSchema,
    });
  };

  const onSubmit = (values) => {
    const data = {
      aggregator_data: {
        iiko_id: values.aggregator_data.value,
        iiko_name: values.aggregator_data.label,
      },
      system_aggregator_id: values.system_aggregator_id.value,
    };

    byID ? putAggregator.mutate(data) : postAggregator.mutate(data);
    resetForm();
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const { values, handleChange, setFieldValue, handleSubmit, resetForm } =
    formik;

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        setFieldValue("aggregator_data", "");
        setFieldValue("system_aggregator_id", "");
        clearID();
      }}
      isWarning={false}
      onConfirm={handleSubmit}
      modalOverflow="visible"
      title={t("Связать скидку")}
      close={t("cancel")}
      confirm={t("add")}
      width={500}
    >
      <div className="flex mb-8 gap-4">
        <div className="flex-1 mb-4">
          <div className="input-label">{t("Delever")}</div>
          <Form.Item formik={formik} name="system_aggregator_id">
            <Select
              height={40}
              id="system_aggregator_id"
              options={aggregatorsQuery?.data}
              value={values.system_aggregator_id}
              onChange={(val) => setFieldValue("system_aggregator_id", val)}
              maxMenuHeight={110}
              width={200}
            />
          </Form.Item>
        </div>
        <div className="flex-1 mb-4">
          <div className="input-label">{t("IIKO")}</div>
          <Form.Item formik={formik} name="aggregator_data">
            <Select
              height={40}
              id="aggregator_data"
              options={aggregatorsIIKOQuery?.data}
              value={values.aggregator_data}
              onChange={(val) => setFieldValue("aggregator_data", val)}
              maxMenuHeight={110}
              width={200}
            />
          </Form.Item>
        </div>
      </div>
    </Modal>
  );
};

export default AggregatorsCreate;
