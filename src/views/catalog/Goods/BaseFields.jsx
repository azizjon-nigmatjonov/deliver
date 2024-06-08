import React, { useEffect, memo } from "react";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Select from "components/Select";
import { divisibility, currencies } from "./api";
import genSelectOption from "helpers/genSelectOption";
import { useTranslation } from "react-i18next";
import genArticul from "helpers/genArticul";
import { types } from "./api";
import Switch from "components/Switch";
import { useParams } from "react-router-dom";
import { customStyles } from "components/Select";
import AsyncSelect from "components/Select/Async";
import { Tooltip } from "@mui/material";

function BaseFields({
  formik,
  tags,
  lang,
  brandsData,
  measurementsData,
  loadAllCategories,
}) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;
  const { id } = useParams();
  // const [brandsData, setBrandsData] = useState([]);

  const genCode = (e) => {
    var output = genArticul(3);
    setFieldValue("code", output);
  };

  useEffect(() => {
    if (!id) {
      genCode();
      setFieldValue("is_divisible", {
        label: "Делимый",
        value: true,
      });
      setFieldValue("currency", {
        label: "UZS",
        value: "UZS",
      });

      let unit = measurementsData?.find((el) => el.label === "Штука");
      if (unit?.length) {
        setFieldValue("unit", {
          label: unit?.label,
          value: unit?.id,
        });
        setFieldValue("unit_short", {
          label: unit?.short_name,
          value: "",
        });
        setFieldValue("accuracy", unit?.accuracy);
      }
    }
  }, [id]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      {React.cloneElement(lang, {
        formik: formik,
      })}
      <div className="flex justify-between w-full">
        <div className="w-2/3">
          <div className="input-label col-span-1">
            <span>{t("status")}</span>
          </div>
          <div className="col-span-3">
            <Switch
              checked={values.active}
              onChange={(e) => setFieldValue("active", e)}
            />
          </div>
        </div>
        <div className="w-4/5">
          <Form.Item
            formik={formik}
            name="order"
            label={t("order.number")}
            required
          >
            <Input
              type="number"
              id="order"
              value={values.order}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
      </div>

      <div>
        <Form.Item formik={formik} name="code" label={t("vendor_code")}>
          <Input
            size="large"
            id="code"
            value={values.code}
            onChange={handleChange}
            suffix={
              <button type="button" onClick={genCode}>
                {t("generate")}
              </button>
            }
          />
        </Form.Item>
      </div>
      <div>
        <Form.Item formik={formik} name="type" label={t("type")} required>
          <Select
            height={40}
            id="type"
            options={genSelectOption(types)}
            value={values.type}
            onChange={(val) => {
              setFieldValue("type", val);
              if (val.value === "origin") {
                formik.validateField("property_ids");
                // property_ids: validate("multiple_select"),
              }
            }}
          />
        </Form.Item>
      </div>

      {/* Selects */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div>
            <Form.Item
              formik={formik}
              name="category_ids"
              label={t("categories")}
              required
            >
              <AsyncSelect
                loadOptions={loadAllCategories}
                defaultOptions
                isMulti
                id="category_ids"
                styles={customStyles({
                  control: (base, state) => ({
                    ...base,
                    minHeight: "2rem",
                    height: "2rem",
                    border: "1px solid #E5E9EB",
                  }),
                  indicatorSeparator: (base, state) => ({
                    ...base,
                    height: "1rem",
                  }),
                  showClearIcons: "false",
                })}
                value={values.category_ids}
                placeholder={t("categories")}
                onChange={(val) => {
                  setFieldValue("category_ids", val);
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <div className="input-label">
            <span>{t("brand")}</span>
          </div>
          <div>
            <Form.Item formik={formik} name="brand">
              <Select
                height={40}
                id="brand"
                options={brandsData}
                value={values.brand}
                onChange={(val) => {
                  setFieldValue("brand", val);
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <div className="input-label">
            <span>{t("divisible.indivisible")}</span>
          </div>
          <div>
            <Form.Item formik={formik} name="is_divisible">
              <Select
                height={40}
                id="is_divisible"
                options={genSelectOption(divisibility)}
                value={values.is_divisible}
                onChange={(val) => {
                  var bool = val.value === "divisible" ? true : false;
                  setFieldValue("is_divisible", {
                    label: val.label,
                    value: bool,
                  });
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <div className="input-label">
            <span>{t("tags")}</span>
          </div>
          <div>
            <Form.Item formik={formik} name="tag_ids">
              <Select
                isMulti
                height={40}
                id="tag_ids"
                options={tags}
                value={values.tag_ids}
                onChange={(val) => {
                  setFieldValue("tag_ids", val);
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <div>
            <Form.Item formik={formik} name="unit" label={t("unit")} required>
              <Select
                height={40}
                id="unit"
                options={measurementsData}
                value={values.unit}
                onChange={(val) => {
                  var unit = measurementsData?.find(
                    (el) => el.id === val.value,
                  );
                  setFieldValue("unit", val);
                  setFieldValue("unit_short", {
                    label: unit.short_name,
                    value: "",
                  });
                  setFieldValue("accuracy", unit.accuracy);
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <span className="input-label">{t("currency")}</span>
          <div>
            <Form.Item formik={formik} name="currency">
              <Select
                height={40}
                id="currency"
                options={genSelectOption(currencies)}
                value={values.currency}
                onChange={(val) => {
                  setFieldValue("currency", val);
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <div className="input-label">
            <Tooltip
              title="Обязательно к заполнению для использования онлайн платежей."
              placement="top"
              className="input-label"
            >
              <span>{t("IKPU")}</span>
            </Tooltip>
          </div>
          <div>
            <Form.Item formik={formik} name="ikpu">
              <Input
                type="number"
                size="large"
                id="ikpu"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                value={values.ikpu}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <div className="input-label">
            <Tooltip
              title="Обязательно к заполнению для использования онлайн платежей."
              placement="top"
              className="input-label"
            >
              <span>{t("package.code")}</span>
            </Tooltip>
          </div>
          <div>
            <Form.Item formik={formik} name="package_code">
              <Input
                type="number"
                size="large"
                id="package_code"
                value={values.package_code}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <div>
            <Form.Item
              formik={formik}
              name="in_price"
              label={t("income.price")}
              required
            >
              <Input
                type="number"
                size="large"
                id="in_price"
                value={values.in_price}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <div>
            <Form.Item
              formik={formik}
              name="out_price"
              label={t("sales.price")}
              required
            >
              <Input
                type="number"
                size="large"
                id="out_price"
                value={values.out_price}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(BaseFields);
