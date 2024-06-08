import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useMemo } from "react";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import AsyncSelect from "components/Select/Async";
import Checkbox from "components/Checkbox/Checkbox";
import { getGoods } from "services/v2";
import {
  postModifier,
  getModifierById,
  updateModifier,
} from "services/v2/modifier";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import Modal from "components/ModalV2";
import Button from "components/Button/Buttonv2";

const AddModifierModal = ({
  modifierModalStatus,
  setModifierModalStatus,
  isLoading,
  getModifier,
  singleModifierId,
  setSingleModifierId,
}) => {
  const { t } = useTranslation();
  const params = useParams();

  const onSubmit = (values) => {
    const data = {
      connected_modifiers: [
        {
          add_to_price: values.connected_modifiers?.add_to_price,
          id: values.connected_modifiers.selectedProduct?.value,
          is_compulsory: values.connected_modifiers?.is_compulsory,
          is_checkbox: values.connected_modifiers?.is_checkbox,
          max_amount: Number(values.connected_modifiers?.max_amount),
          min_amount: Number(values.connected_modifiers?.min_amount),
          send_as_product: values.connected_modifiers.send_as_product,
        },
      ],
      parent_id: params.id,
    };

    const dataForUpdate = {
      add_to_price: values.connected_modifiers.add_to_price,
      product_id: values.connected_modifiers.product_id,
      is_compulsory: values.connected_modifiers.is_compulsory,
      is_checkbox: values.connected_modifiers.is_checkbox,
      max_amount: Number(values.connected_modifiers.max_amount),
      min_amount: Number(values.connected_modifiers.min_amount),
      send_as_product: values.connected_modifiers.send_as_product,
    };
    singleModifierId !== null
      ? updateModifier(singleModifierId.id, dataForUpdate)
          .then(() => {
            setModifierModalStatus(false);
            resetForm();
            setSingleModifierId(null);
          })
          .catch((error) => console.log(error))
          .finally(() => getModifier())
      : postModifier(data)
          .then(() => {
            setModifierModalStatus(false);
            resetForm();
            setSingleModifierId(null);
          })
          .catch((error) => console.log(error))
          .finally(() => getModifier());
  };

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      connected_modifiers: yup.object({
        selectedProduct: defaultSchema,
        max_amount: defaultSchema,
        min_amount: defaultSchema,
      }),
    });
  }, [t]);

  const initialValues = useMemo(
    () => ({
      connected_modifiers: {
        add_to_price: false,
        selectedProduct: "",
        is_compulsory: false,
        is_checkbox: false,
        max_amount: null,
        min_amount: null,
        send_as_product: false,
      },
      parent_id: "",
    }),
    [],
  );

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
  });

  const { values, setFieldValue, handleSubmit, resetForm, setValues, errors } =
    formik;

  useEffect(() => {
    if (singleModifierId !== null) {
      getModifierById(singleModifierId.id)
        .then((res) => {
          setValues({
            connected_modifiers: {
              add_to_price: res?.add_to_price,
              selectedProduct: {
                label: res?.name?.ru,
                value: res?.id,
              },
              is_compulsory: res?.is_compulsory,
              is_checkbox: res?.is_checkbox,
              max_amount: res?.max_amount,
              min_amount: res?.min_amount,
              id: singleModifierId.id,
              product_id: res?.to_product_id,
              send_as_product: res?.send_as_product,
            },
          });
        })
        .catch((err) => console.log(err));
    }
  }, [singleModifierId, setValues]);

  const loadModifiers = useCallback((input, cb) => {
    getGoods({ type: "modifier", limit: 15, search: input })
      .then((res) => {
        let modifiers = res?.products.map((elm) => ({
          label: elm.title.ru,
          value: elm.id,
        }));
        cb(modifiers);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Modal
      open={modifierModalStatus}
      onClose={() => {
        setModifierModalStatus(false);
        resetForm();
        setSingleModifierId(null);
      }}
      title={t("add.modifier")}
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="input-label">
            <span>{t("min.amount")}</span>
          </div>
          <div className="col-span-2">
            <Form.FieldArrayItem
              formik={formik}
              custom="true"
              custom_error={errors["connected_modifiers"]?.["min_amount"]}
            >
              <Input
                size="large"
                id="min_amount"
                type="number"
                value={values.connected_modifiers.min_amount}
                onChange={(val) =>
                  setFieldValue(
                    "connected_modifiers.min_amount",
                    val.target.value,
                  )
                }
                placeholder={t("input.min.amount")}
              />
            </Form.FieldArrayItem>
          </div>
        </div>
        <div className="flex-1">
          <div className="input-label">
            <span>{t("max.amount")}</span>
          </div>
          <div className="col-span-2">
            <Form.FieldArrayItem
              formik={formik}
              custom="true"
              custom_error={errors["connected_modifiers"]?.["max_amount"]}
            >
              <Input
                size="large"
                id="max_amount"
                type="number"
                value={values.connected_modifiers.max_amount}
                onChange={(val) =>
                  setFieldValue(
                    "connected_modifiers.max_amount",
                    val.target.value,
                  )
                }
                placeholder={t("input.max.amount")}
              />
            </Form.FieldArrayItem>
          </div>
        </div>
      </div>
      <div className="my-4">
        <div className="input-label">
          <span>{t("modifier")}</span>
        </div>
        <Form.FieldArrayItem
          formik={formik}
          custom="true"
          custom_error={errors["connected_modifiers"]?.["selectedProduct"]}
        >
          <AsyncSelect
            id="selectedProduct"
            defaultOptions
            cacheOptions
            isSearchable
            isClearable
            useZIndex={true}
            value={values.connected_modifiers.selectedProduct}
            loadOptions={loadModifiers}
            placeholder={t("choose.modifier")}
            maxMenuHeight={135}
            onChange={(val) => {
              setFieldValue("connected_modifiers.selectedProduct", val);
            }}
          />
        </Form.FieldArrayItem>
      </div>
      <div className="flex mb-4">
        <div className="flex items-baseline">
          <div>
            <Form.Item formik={formik} name="is_compulsory">
              <Checkbox
                id="is_compulsory"
                color="primary"
                checked={values.connected_modifiers.is_compulsory}
                onClick={() =>
                  setFieldValue(
                    "connected_modifiers.is_compulsory",
                    !values.connected_modifiers.is_compulsory,
                  )
                }
              />
            </Form.Item>
          </div>
          <div className=" input-label">
            <label for="is_compulsory">{t("mandatory")}</label>
          </div>
        </div>
        <div className="flex items-baseline">
          <div>
            <Form.Item formik={formik} name="add_to_price">
              <Checkbox
                id="add_to_price"
                color="primary"
                checked={values.connected_modifiers.add_to_price}
                onClick={() =>
                  setFieldValue(
                    "connected_modifiers.add_to_price",
                    !values.connected_modifiers.add_to_price,
                  )
                }
              />
            </Form.Item>
          </div>
          <div className=" input-label">
            <label for="add_to_price">{t("ignore.amount")}</label>
          </div>
        </div>
        <div className="flex items-baseline">
          <div>
            <Form.Item formik={formik} name="is_checkbox">
              <Checkbox
                id="is_checkbox"
                color="primary"
                checked={values.connected_modifiers.is_checkbox}
                onClick={() =>
                  setFieldValue(
                    "connected_modifiers.is_checkbox",
                    !values.connected_modifiers.is_checkbox,
                  )
                }
              />
            </Form.Item>
          </div>
          <div className=" input-label">
            <label for="is_checkbox">{t("checkbox.view")}</label>
          </div>
        </div>
        <div className="flex items-baseline">
          <div>
            <Form.Item formik={formik} name="send_as_product">
              <Checkbox
                id="send_as_product"
                color="primary"
                checked={values.connected_modifiers.send_as_product}
                onClick={() =>
                  setFieldValue(
                    "connected_modifiers.send_as_product",
                    !values.connected_modifiers.send_as_product,
                  )
                }
              />
            </Form.Item>
          </div>
          <div className=" input-label">
            <label for="is_checkbox">{t("send_as_product")}</label>
          </div>
        </div>
      </div>
      <Button
        size="large"
        variant="contained"
        onClick={handleSubmit}
        fullWidth={true}
      >
        {t("add")}
      </Button>
    </Modal>
  );
};

export default AddModifierModal;
