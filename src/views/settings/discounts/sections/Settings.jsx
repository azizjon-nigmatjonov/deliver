import { useTranslation } from "react-i18next";
// Components
import Form from "components/Form/Index";
import Select from "components/Select";
import AsyncSelect from "components/Select/Async";
import Input from "components/Input";
import Card from "components/Card";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import Tag from "components/Tag";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RangePicker from "components/DateTimePicker/RangePicker";
import moment from "moment";
import { getNonOriginModifierProducts } from "services/v2";
import { useCallback } from "react";

export default function Settings({
  formik,
  amountForOrder,
  setAmountForOrder,
}) {
  const { t } = useTranslation();
  const { values, setFieldValue, handleChange } = formik;

  const loadProducts = useCallback(
    (inputValue, callback) => {
      getNonOriginModifierProducts({
        limit: 50,
        page: 1,
        search: inputValue,
        active: true,
      })
        .then((res) => {
          let products = res?.products?.map((product) => ({
            label: `${product.title?.ru} (${product.out_price} ${t(
              "uzb.sum",
            )})`,
            value: product.id,
          }));

          callback(products);
        })
        .catch((err) => console.log(err));
    },
    [t],
  );

  return (
    <Card
      bodyClass="flex flex-col gap-4"
      style={{ height: "fit-content" }}
      title={t("details")}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Form.Item
            formik={formik}
            name="name?.ru"
            label={`${t("name")} (ru)`}
            required
          >
            <Input
              name="name.ru"
              value={values?.name?.ru}
              onChange={({ target: { value } }) =>
                setFieldValue("name.ru", value)
              }
              required
            />
          </Form.Item>
        </Grid>
        <Grid item xs={4}>
          <Form.Item
            formik={formik}
            name="name?.uz"
            label={`${t("name")} (uz)`}
            required
          >
            <Input
              name="name.uz"
              value={values?.name?.uz}
              onChange={({ target: { value } }) =>
                setFieldValue("name.uz", value)
              }
              required
            />
          </Form.Item>
        </Grid>
        <Grid item xs={4}>
          <Form.Item
            formik={formik}
            name="name?.en"
            label={`${t("name")} (en)`}
            required
          >
            <Input
              name="name.en"
              value={values?.name?.en}
              onChange={({ target: { value } }) =>
                setFieldValue("name.en", value)
              }
              required
            />
          </Form.Item>
        </Grid>
      </Grid>

      <div>
        <div className="input-label">
          <span>{t("type")}</span>
        </div>
        <RadioGroup
          aria-label="type"
          name="type"
          value={values.type}
          onChange={(e) => {
            handleChange(e);
            if (e.target.value === "promo_code") {
              setFieldValue("discount_for", {
                label: t("order"),
                value: "order",
              });
            }
          }}
          className="text-sm"
          style={{ flexDirection: "row" }}
        >
          <FormControlLabel
            value={"discount"}
            control={<Radio color="primary" />}
            label={"Скидка"}
          />
          <FormControlLabel
            value={"surcharge"}
            control={<Radio color="primary" />}
            label={"Надбавка"}
          />
          <FormControlLabel
            value={"promo_code"}
            control={<Radio color="primary" />}
            label={t("promo_code")}
          />
        </RadioGroup>
      </div>
      <Form.Item
        formik={formik}
        label={`${t(
          values.type === "surcharge" ? values.type : "discount",
        )} ${t("on")}`}
        name="discount_for"
      >
        <Select
          id="discount_for"
          options={[
            {
              label: t("product"),
              value: "product",
            },
            {
              label: t("order"),
              value: "order",
            },
            {
              label: t("delivery"),
              value: "delivery_price",
            },
          ]}
          value={values.discount_for}
          onChange={(val) => {
            setFieldValue("discount_for", val);
            if (val.value === "delivery_price")
              setFieldValue("is_amount_for_order", true);
            else setFieldValue("is_amount_for_order", false);
          }}
          disabled={values.type === "promo_code"}
        />
      </Form.Item>
      {values.type === "promo_code" && (
        <Form.Item formik={formik} name="promo_code" label={t("enter_code")}>
          <Input
            id="promo_code"
            placeholder={t("promo_code")}
            value={values.promo_code}
            onChange={({ target: { value } }) =>
              setFieldValue("promo_code", value)
            }
          />
        </Form.Item>
      )}
      {values.discount_for?.value !== "delivery_price" && (
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Form.Item
              formik={formik}
              label={`${t("type")} ${t(
                values.type === "surcharge" ? values.type : "discount",
              )}`}
              name="mode"
            >
              <Select
                id="mode"
                options={[
                  {
                    label: t("fixed"),
                    value: "fixed",
                  },
                  {
                    label: t("percent"),
                    value: "percent",
                  },
                ]}
                value={values.mode}
                onChange={(val) => setFieldValue("mode", val)}
              />
            </Form.Item>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Form.Item
              formik={formik}
              name="amount"
              label={t(values.type === "surcharge" ? values.type : "discount")}
            >
              <Input
                size="large"
                id="amount"
                value={values.amount}
                onChange={(e) => {
                  handleChange(e);
                  setAmountForOrder((prevState) =>
                    prevState.map((el, i) =>
                      i === 0 ? { ...el, amount: e.target.value } : el,
                    ),
                  );
                }}
                endAdornment={values.mode?.value === "percent" ? "%" : "UZS"}
                type="number"
                min={0}
              />
            </Form.Item>
          </Grid>
        </Grid>
      )}
      {values.discount_for?.value === "order" &&
        amountForOrder?.length > 0 &&
        amountForOrder?.map((item, idx) => (
          <Grid container spacing={2} key={item.uuid}>
            <Grid item xs={5}>
              <div className="input-label flex items-center gap-1">
                {!idx && (
                  <input
                    type="checkbox"
                    checked={values.is_amount_for_order}
                    onChange={({ target: { checked } }) =>
                      setFieldValue("is_amount_for_order", checked)
                    }
                    id="is_amount_for_order"
                    style={{ width: "auto" }}
                  />
                )}
                {(values.is_amount_for_order || !idx) && (
                  <label
                    htmlFor={
                      !idx
                        ? "is_amount_for_order"
                        : `amount_for_order[${idx}].from_price`
                    }
                  >
                    {values.type === "surcharge"
                      ? t("amount_to_surcharge")
                      : t("amount_to_discount")}
                  </label>
                )}
              </div>
              {values.is_amount_for_order && (
                <Input
                  size="large"
                  id={`amount_for_order[${idx}].from_price`}
                  placeholder={t("from")}
                  value={item.from_price}
                  onChange={({ target: { value } }) =>
                    setAmountForOrder((prevState) =>
                      prevState.map((el, i) =>
                        i === idx ? { ...el, from_price: value } : el,
                      ),
                    )
                  }
                  type="number"
                  min={0}
                />
              )}
            </Grid>
            <Grid item xs={5}>
              {values.is_amount_for_order && (
                <Form.Item
                  formik={formik}
                  name={`values.amount_for_order[${idx}].amount`}
                  label={t(
                    values.type === "surcharge" ? values.type : "discount",
                  )}
                >
                  <Input
                    size="large"
                    id={`values.amount_for_order[${idx}].amount`}
                    value={item.amount}
                    onChange={(e) => {
                      if (idx === 0) setFieldValue("amount", e.target.value);
                      setAmountForOrder((prevState) =>
                        prevState.map((el, i) =>
                          i === idx ? { ...el, amount: e.target.value } : el,
                        ),
                      );
                    }}
                    endAdornment={
                      values.mode?.value === "percent" ? "%" : "UZS"
                    }
                    type="number"
                    min={0}
                  />
                </Form.Item>
              )}
            </Grid>
            <Grid item xs={2} className="flex items-end">
              {values.is_amount_for_order && (
                <Tag
                  color={!idx ? "primary" : "error"}
                  lightMode={true}
                  size="large"
                  shape="subtle"
                  className="cursor-pointer"
                  onClick={() =>
                    setAmountForOrder((prevState) =>
                      !idx
                        ? [...prevState, { amount: 0, from_price: 0 }]
                        : prevState.filter((_, i) => i !== idx),
                    )
                  }
                >
                  {!idx ? <AddRoundedIcon /> : <DeleteRoundedIcon />}
                </Tag>
              )}
            </Grid>
          </Grid>
        ))}
      {values.discount_for?.value === "delivery_price" && (
        <>
          <Form.Item
            formik={formik}
            name="amount_for_order[0].from_price"
            label={t("discount_will_work_when_price_from")}
          >
            <Input
              size="large"
              value={amountForOrder[0].from_price}
              onChange={(e) =>
                setAmountForOrder([{ amount: 0, from_price: e.target.value }])
              }
              endAdornment="UZS"
              type="number"
              min={0}
            />
          </Form.Item>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <Form.Item formik={formik} label={t("product")} name="product">
                <AsyncSelect
                  defaultOptions
                  id="product_id"
                  loadOptions={loadProducts}
                  value={values.product_id}
                  placeholder={t("select.product")}
                  onChange={(val) => setFieldValue("product_id", val)}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Form.Item
                formik={formik}
                name="product_count"
                label={t("min.amount")}
              >
                <Input
                  size="large"
                  placeholder={t("input.min.amount")}
                  id="product_count"
                  value={values.product_count}
                  onChange={handleChange}
                  type="number"
                  min={0}
                />
              </Form.Item>
            </Grid>
          </Grid>
        </>
      )}
      {values.type !== "promo_code" && (
        <Form.Item formik={formik}>
          <RadioGroup
            aria-label="is_automatic_adding"
            name="is_automatic_adding"
            value={values.is_automatic_adding}
            onChange={({ target }) => {
              setFieldValue("is_automatic_adding", target.value);
              setFieldValue("can_add_by_hand", target.value !== "true");
            }}
            className="text-sm"
            style={{ flexDirection: "row" }}
          >
            <FormControlLabel
              value={"false"}
              control={<Radio color="primary" />}
              label={t("can_add_by_hand")}
            />
            <FormControlLabel
              value={"true"}
              control={<Radio color="primary" />}
              label={t("is_automatic_adding")}
            />
          </RadioGroup>
        </Form.Item>
      )}
      <Form.Item
        formik={formik}
        label={t("sources")}
        name="order_source"
        required
      >
        <Select
          isMulti
          id="order_source"
          options={[
            {
              label: t("website"),
              value: "website",
            },
            {
              label: t("bot"),
              value: "bot",
            },
            {
              label: t("ios"),
              value: "ios",
            },
            {
              label: t("android"),
              value: "android",
            },
            {
              label: t("admin_panel"),
              value: "admin_panel",
            },
          ]}
          value={values.order_source}
          onChange={(val) => setFieldValue("order_source", val)}
          required
        />
      </Form.Item>
      {values.discount_for.value !== "product" && (
        <Form.Item
          formik={formik}
          name="payment_type"
          label={t("payment.type")}
          required
        >
          <Select
            isMulti
            id="payment_type"
            options={[
              {
                label: t("cash"),
                value: "cash",
              },
              {
                label: t("transfer"),
                value: "transfer",
              },
              {
                label: "Payme",
                value: "payme",
              },
              {
                label: "Click",
                value: "click",
              },
              {
                label: "Apelsin",
                value: "apelsin",
              },
            ]}
            value={values.payment_type}
            onChange={(val) => setFieldValue("payment_type", val)}
            required
          />
        </Form.Item>
      )}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Form.Item
            formik={formik}
            name="client_order_count"
            label={t("client_orders")}
          >
            <Input
              type="number"
              id="client_order_count"
              value={values.client_order_count}
              onChange={({ target: { value } }) =>
                setFieldValue("client_order_count", value)
              }
              min={0}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={6}>
          <Form.Item formik={formik} name="priority" label={t("priority")}>
            <Input
              type="number"
              id="priority"
              value={values.priority}
              onChange={({ target: { value } }) =>
                setFieldValue("priority", value)
              }
            />
          </Form.Item>
        </Grid>
        <Grid item xs={6}>
          <Form.Item formik={formik} name="date" label={t("date")}>
            <RangePicker
              hideTimePicker
              placeholder={t("order.period")}
              dateValue={[
                values.from_date ? moment(values.from_date) : undefined,
                values.to_date ? moment(values.to_date) : undefined,
              ]}
              onChange={(e) => {
                if (e[0] === null) {
                  setFieldValue(
                    "from_date",
                    moment().subtract(5, "d").format("YYYY-MM-DD"),
                  );
                  setFieldValue("to_date", moment().format("YYYY-MM-DD"));
                } else {
                  setFieldValue("from_date", moment(e[0]).format("YYYY-MM-DD"));
                  setFieldValue("to_date", moment(e[1]).format("YYYY-MM-DD"));
                }
              }}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={3}>
          <Form.Item formik={formik} name="from_time" label={t("from_time")}>
            <Input
              id="from_time"
              value={values.from_time}
              onChange={({ target: { value } }) =>
                setFieldValue("from_time", value)
              }
            />
          </Form.Item>
        </Grid>
        <Grid item xs={3}>
          <Form.Item formik={formik} name="to_time" label={t("to_time")}>
            <Input
              id="to_time"
              value={values.to_time}
              onChange={({ target: { value } }) =>
                setFieldValue("to_time", value)
              }
            />
          </Form.Item>
        </Grid>
      </Grid>
      {values.discount_for?.value !== "delivery_price" && (
        <>
          <Form.Item formik={formik} name="order_type" label={t("order.type")}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={values.order_type.delivery}
                  onChange={({ target: { checked } }) =>
                    ((!checked && values.order_type.self_pickup) || checked) &&
                    setFieldValue("order_type.delivery", checked)
                  }
                  name="order_type.delivery"
                />
              }
              label={t("delivery")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={values.order_type.self_pickup}
                  onChange={({ target: { checked } }) =>
                    ((!checked && values.order_type.delivery) || checked) &&
                    setFieldValue("order_type.self_pickup", checked)
                  }
                  name="order_type.self_pickup"
                />
              }
              label={t("self_pickup")}
            />
          </Form.Item>
          <Form.Item formik={formik} name="with_delivery_price">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={values.with_delivery_price}
                  onChange={({ target: { checked } }) =>
                    setFieldValue("with_delivery_price", checked)
                  }
                  name="with_delivery_price"
                />
              }
              label={t("also_calculate_the_delivery_price")}
            />
          </Form.Item>
        </>
      )}
      <Form.Item formik={formik} name="for_only_birthday">
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={values.for_only_birthday}
              onChange={({ target: { checked } }) =>
                setFieldValue("for_only_birthday", checked)
              }
              name="for_only_birthday"
            />
          }
          label={t("only_for_birthday")}
        />
      </Form.Item>
      {values.type === "promo_code" && (
        <Form.Item formik={formik} name="is_disposable">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={values.is_disposable}
                onChange={({ target: { checked } }) =>
                  setFieldValue("is_disposable", checked)
                }
                name="is_disposable"
              />
            }
            label={t("is_disposable")}
          />
        </Form.Item>
      )}
      {values.type === "promo_code" && !values.is_disposable && (
        <Form.Item formik={formik} name="uses_count" label={t("uses_count")}>
          <Input
            type="number"
            id="uses_count"
            value={values.uses_count}
            onChange={({ target: { value } }) =>
              setFieldValue("uses_count", value)
            }
          />
        </Form.Item>
      )}
    </Card>
  );
}
