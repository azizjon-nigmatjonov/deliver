import { memo, useCallback, useState } from "react";
import numberToPrice from "helpers/numberToPrice";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { payments } from "./api";
import discountService, { useDiscountsList } from "services/v2/discounts";
import Select from "components/Select";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import Button from "components/Button/Buttonv2";
import { Grid } from "@mui/material";
import InputV2 from "components/Input/Inputv2";

function Payment({
  formik: { setFieldValue, values },
  deliveryPrice,
  totalPrice,
  handleUserLogs,
  isOrderEditable,
  orderData,
}) {
  const { t } = useTranslation();
  const [promocode, setPromocode] = useState("");
  const [searchDiscount, setSearchDiscount] = useState("");
  const [discountOptions, setDiscountOptions] = useState([]);

  const TOTAL_PRICE = useCallback(
    (delivery_price = 0) => {
      const sortable = values.discounts?.sort(function (a, b) {
        return a.priority - b.priority;
      });

      let totalSum = totalPrice;
      let totalDeliveryPrice = delivery_price;

      const amountForOrderFn = (amountsForOrder) => {
        let amount = 0;
        if (amountsForOrder) {
          for (const element of amountsForOrder) {
            if (element.from_price <= totalSum + totalDeliveryPrice)
              amount = element.amount;
          }
        }
        return amount;
      };

      if (sortable && !isNaN(totalPrice))
        for (const item of sortable) {
          const amountForOrderValue = amountForOrderFn(item?.amount_for_order); // get initial value amount for calculation
          totalSum +=
            item?.type === "surcharge" // when type is surcharge
              ? item?.mode === "fixed" //  mode is fixed
                ? item?.amount_for_order?.length > 0 // and if there is amount for order
                  ? amountForOrderValue // add corresponding fixed surcharge amount
                  : item?.amount // or add surcharge amount
                : item?.amount_for_order?.length > 0 // or when mode is percent and if there is also amount for order
                ? (totalSum / 100) * amountForOrderValue // calculate total price with corresponding surcharge amount
                : (totalSum / 100) * item?.amount // or calculate with amount
              : item?.mode === "fixed" // when type is discount or promocode and mode is fixed
              ? item?.amount_for_order?.length > 0 // if there is amount for order
                ? -amountForOrderValue // add corresponding fixed discount amount
                : -item?.amount // or add discount amount
              : item?.amount_for_order?.length > 0 // or when mode is percent and if there is also amount for order
              ? -(totalSum / 100) * amountForOrderValue // calculate total price with corresponding discount amount
              : -(totalSum / 100) * item.amount; // or calculate with amount

          totalDeliveryPrice +=
            item?.type === "surcharge" // when type is surcharge
              ? item?.mode === "fixed" // when mode is fixed
                ? 0 // delivery price += 0
                : item?.amount_for_order?.length > 0 // or when mode is percent and if there is amount for order
                ? ((item?.with_delivery_price ? totalDeliveryPrice : 0) / 100) * // if with_delivery_price is true, calculate or zero
                  amountForOrderValue // calculate with corresponding surcharge amount
                : ((item?.with_delivery_price ? totalDeliveryPrice : 0) / 100) * // if with_delivery_price is true, calculate or zero
                  item?.amount // calculate amount
              : item?.mode === "fixed" // when type is discount or promocode and mode is fixed
              ? 0 // delivery price += 0
              : item?.amount_for_order?.length > 0 // or when mode is percent and if there is amount for order
              ? -((item?.with_delivery_price ? totalDeliveryPrice : 0) / 100) * // if with_delivery_price is true, calculate or zero
                amountForOrderValue // calculate with corresponding discount amount
              : -((item?.with_delivery_price ? totalDeliveryPrice : 0) / 100) * // if with_delivery_price is true, calculate or zero
                item?.amount; // calculate with amount
        }
      return totalSum + totalDeliveryPrice;
    },
    [totalPrice, values.discounts],
  );

  // totalDeliveryPrice += item.with_delivery_price
  //   ? item.type === "discount" // when type is discount
  //     ? item.mode === "fixed" // when mode is fixed
  //       ? 0 // delivery price += 0
  //       : item.amount_for_order?.length > 0 // or when mode is percent and if there is amount for order
  //       ? -(totalDeliveryPrice / 100) * amountForOrderValue // calculate with corresponding discount amount
  //       : -(totalDeliveryPrice / 100) * item.amount // calculate with amount
  //     : item.mode === "fixed" // when type is surcharge and mode is fixed
  //     ? 0 // delivery price += 0
  //     : item.amount_for_order?.length > 0 // or when mode is percent and if there is amount for order
  //     ? (totalDeliveryPrice / 100) * amountForOrderValue // calculate with corresponding surcharge amount
  //     : (totalDeliveryPrice / 100) * item.amount // calculate amount
  //   : 0;

  const onPaymentSelect = (params) => {
    setFieldValue("payment_type", params);
    handleUserLogs({ name: t("payment_type") });
  };

  const orderOptions = (values) => {
    return values
      ?.filter((v) => v?.isFixed)
      ?.concat(values.filter((v) => !v?.isFixed));
  };

  useDiscountsList({
    params: {
      page: 1,
      limit: 10,
      search: searchDiscount,
      is_only_active: true,
      order_sources: values.source || "admin_panel",
      branch_ids: values.branch?.value ? values.branch?.value : undefined,
      only_delivery:
        values.delivery_type === "delivery" ||
        values.delivery_type === "external",
      only_self_pickup: values.delivery_type === "self-pickup",
      discount_for: "order",
      client_id: values.client_id,
      is_new_client: !values.client_id,
      payment_types: values.payment_type,
      for_order_amount: totalPrice + deliveryPrice,
    },
    props: {
      enabled: isOrderEditable,
      onSuccess: (res) => {
        let discounts = res?.discounts?.map((discount) => ({
          label: discount.name.ru,
          value: discount.id,
          amount: discount.amount,
          mode: discount.mode,
          type: discount.type,
          priority: discount.priority,
          amount_for_order: discount.amount_for_order,
          with_delivery_price: discount?.with_delivery_price,
          isFixed: discount.is_automatic_adding,
          color: discount.type === "discount" ? "#ff9494" : "#a7f3d0",
        }));
        setDiscountOptions(discounts);

        const autoAddings = discounts?.filter((v) => v.isFixed) || [];
        if (values.discounts?.length > 0) {
          const promos =
            values.discounts?.filter((item) => {
              if (item?.type === "promo_code") {
                setPromocode(item?.promo_code);
                return true;
              }
              return false;
            }) || [];
          const comparedDiscounts =
            discounts?.filter((o1) =>
              values.discounts?.some(
                (o2) => o1.value === o2.value || o2.type !== "promo_code",
              ),
            ) || [];

          const uniqueIds = (
            autoAddings
              ? [...promos, ...autoAddings, ...comparedDiscounts]
              : comparedDiscounts
          )?.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.value === value.value),
          );
          setFieldValue("discounts", orderOptions(uniqueIds));
        } else {
          setFieldValue("discounts", autoAddings);
        }
      },
    },
  });

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      default:
        break;
    }
    setFieldValue("discounts", orderOptions(newValue));
    handleUserLogs({ name: "Скидка" });
  };

  const applyPromo = () => {
    // handleUserLogs({ name: "Промокод" });
    discountService
      .getList({
        page: 1,
        limit: 10,
        promo_code: promocode,
        is_only_active: true,
        order_sources: values.source || "admin_panel",
        branch_ids: values.branch?.value ? values.branch?.value : undefined,
        only_delivery:
          values.delivery_type === "delivery" ||
          values.delivery_type === "external",
        only_self_pickup: values.delivery_type === "self-pickup",
        discount_for: "order",
        client_id: values.client_id,
        is_new_client: !values.client_id,
        payment_types: values.payment_type,
        for_order_amount: totalPrice + deliveryPrice,
      })
      .then((res) => {
        if (res?.discounts) {
          let promoCode = res?.discounts[0];
          setFieldValue("discounts", [
            {
              label: promoCode.name.ru,
              value: promoCode.id,
              amount: promoCode.amount,
              mode: promoCode.mode,
              type: "promo_code",
              priority: promoCode.priority,
              amount_for_order: promoCode.amount_for_order,
              with_delivery_price: promoCode?.with_delivery_price,
              isFixed: false,
              color: "#FDE25D",
            },
          ]);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Card title={t("payment")} bodyStyle={{ padding: "12px 1rem" }}>
      <div className="payment_types">
        {payments?.map((item) => (
          <div
            key={item.type}
            onClick={() => onPaymentSelect(item.type)}
            className={`payment_type ${
              item.type === values.payment_type ? "active" : ""
            }`}
          >
            <img src={item.img} alt="click" />
          </div>
        ))}
      </div>
      <div className="payment_details">
        <Grid container spacing={2} mb={1.5}>
          <Grid item xs={6} className="flex item-center gap-3">
            <MonetizationOnIcon color="primary" />
            <p style={{ color: "#84919A" }}>Сумма заказа</p>
          </Grid>
          <Grid item xs={6} className="text-right">
            <p className="text-base font-semibold">
              {numberToPrice(
                isOrderEditable ? totalPrice : orderData?.steps[0]?.step_amount,
              )}
            </p>
          </Grid>
          <Grid item xs={6} className="flex item-center gap-3">
            <DriveEtaIcon color="primary" />
            <p style={{ color: "#84919A" }}>{t("delivery_amount")}</p>
          </Grid>
          <Grid item xs={6} className="text-right">
            <p className="text-base font-semibold">
              {isOrderEditable
                ? deliveryPrice &&
                  (values.delivery_type === "delivery" ||
                    values.delivery_type === "external")
                  ? numberToPrice(deliveryPrice)
                  : "0 сум"
                : numberToPrice(orderData?.delivery_price)}
            </p>
          </Grid>
          <Grid item xs={5} className="flex item-center gap-3">
            <ConfirmationNumberRoundedIcon color="primary" />
            <p style={{ color: "#84919A" }}>{t("promo_code")}</p>
          </Grid>
          <Grid item xs={7} className="flex item-center justify-end gap-3">
            <InputV2
              className="flex-1"
              name="promocode"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              placeholder={t("promo_code")}
              disabled={!isOrderEditable}
            />
            <Button
              size="small"
              variant="outlined"
              disabled={!promocode}
              onClick={applyPromo}
            >
              применить
            </Button>
          </Grid>
          <Grid item xs={5} className="flex item-center gap-3">
            <DiscountRoundedIcon color="primary" />
            <p style={{ color: "#84919A" }}>{t("discount")}</p>
          </Grid>
          <Grid item xs={7}>
            <Select
              name="discounts"
              value={values.discounts}
              options={discountOptions}
              onInputChange={(val) => setSearchDiscount(val)}
              placeholder={t("discount")}
              onChange={onChange}
              dropdownIndicator={false}
              isSearchable
              isMulti
              disabled={!isOrderEditable}
            />
          </Grid>
        </Grid>
      </div>
      <div
        className="flex justify-between item-center font-semibold text-lg mb-2"
        style={{ color: "#303940" }}
      >
        <p>Итого</p>
        <p>
          {isOrderEditable ? (
            values.delivery_type === "delivery" ||
            values.delivery_type === "external" ? (
              <>
                {values.discounts?.length > 0 && (
                  <strike className="text-gray-400 text-base">
                    {totalPrice + deliveryPrice}
                  </strike>
                )}{" "}
                {numberToPrice(TOTAL_PRICE(deliveryPrice))}
              </>
            ) : (
              <>
                {values.discounts?.length > 0 && (
                  <strike className="text-gray-400 text-base">
                    {totalPrice}
                  </strike>
                )}{" "}
                {numberToPrice(TOTAL_PRICE())}
              </>
            )
          ) : (
            <>
              {orderData?.discounts?.length > 0 && (
                <strike className="text-gray-400 text-base">
                  {orderData?.order_amount +
                    orderData?.delivery_price +
                    Math.abs(orderData?.discount_price)}
                </strike>
              )}{" "}
              {numberToPrice(
                orderData?.order_amount + (orderData?.delivery_price || 0),
              )}
            </>
          )}
        </p>
      </div>
    </Card>
  );
}

export default memo(Payment);
