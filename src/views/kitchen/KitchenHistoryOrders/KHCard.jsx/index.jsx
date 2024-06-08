import React, { useState } from "react";
import cls from "./styles.module.scss";
import {
  showOrderType,
  showPaymentType,
} from "components/KitchenCard/KitchenCardUtils";
import { InfoOutlined, WatchLater, ClearRounded } from "@mui/icons-material";
import orderTimer from "helpers/orderTimer";
import { useTranslation } from "react-i18next";
import UPhoneWrapper from "components/UPhoneWrapper";
import Modal from "components/Modal";

const KHCard = ({ order, tabIndex }) => {
  const { t } = useTranslation();
  const [courierModalStatus, setCourierModalStatus] = useState(false);

  const isOperatorCancelled = () => {
    if (tabIndex === 3) {
      return (
        order?.status_id === process.env.REACT_APP_OPERATOR_CANCELED_STATUS_ID
      );
    }
  };

  const isServerCancelled = () => {
    if (tabIndex === 3) {
      return order?.status_id === process.env.REACT_APP_VENDOR_CANCELLED;
    }
  };

  return (
    <div className={cls.kitchen}>
      <div className={cls.kitchenWrapper}>
        <div
          className={`${cls.kitchenHeader}`}
          style={{
            backgroundColor: isServerCancelled() ? "#F76659" : "",
            color: isServerCancelled() ? "#fff" : "",
          }}
        >
          <div className={cls.orderIdWrapper}>
            <p className={cls.orderId}>ID: {order.external_order_id}</p>
            <InfoOutlined
              className={cls.infoIcon}
              onClick={() => setCourierModalStatus(true)}
              style={{
                color: isServerCancelled() ? "#fff" : "",
              }}
            />
          </div>
          <div className={`${cls.priceSection}`}>
            <p
              className={`${cls.orderPrice}`}
              style={{
                color: isServerCancelled() ? "#fff" : "",
              }}
            >
              {order.order_amount + (order?.delivery_price || 0)} {t("uzb.sum")}
            </p>
            <img
              src={showPaymentType(order.payment_type, isServerCancelled())}
              alt="payment_type"
              className="mr-2"
            />
            <img
              src={showOrderType(order.delivery_type, isServerCancelled())}
              alt="home"
            />
          </div>
        </div>
        <div className={cls.line}> </div>
        <div
          className={cls.orderInfoSection}
          style={{ backgroundColor: isOperatorCancelled() ? "#FFEFEB" : "" }}
        >
          {order?.steps[0]?.products.map((product) => (
            <div key={product.id}>
              <p className={cls.orderLabel}>
                {product?.quantity} <ClearRounded style={{ fontSize: 16 }} />{" "}
                {product.name}
              </p>
              {product?.variants?.length > 0 &&
                product?.variants?.map((variant) => (
                  <p
                    className={cls.variantAndModifierNames}
                    key={variant?.variant_id}
                  >
                    {variant?.quantity}{" "}
                    <ClearRounded style={{ fontSize: 14 }} />{" "}
                    {variant?.variant_name?.ru || ""}
                  </p>
                ))}
              {product?.order_modifiers?.length > 0 && (
                <div className={cls.modifierCont}>
                  <p>Модификаторы:</p>
                  {product?.order_modifiers?.map((modifier) => (
                    <p
                      className={cls.variantAndModifierNames}
                      key={
                        modifier?.modifier_id +
                        modifier?.parent_id +
                        product?.id
                      }
                    >
                      {modifier?.modifier_quantity}{" "}
                      <ClearRounded style={{ fontSize: 14 }} />{" "}
                      {modifier?.modifier_name?.ru || ""}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          className={cls.orderTimer}
          style={{ backgroundColor: isOperatorCancelled() ? "#FFEFEB" : "" }}
        >
          <WatchLater className={cls.timeIcon} />
          <span className={cls.orderTime}>
            {orderTimer(
              order?.vendor_accepted_at,
              order?.finished_at,
              order?.future_time,
              order?.status_id,
            )}
          </span>
        </div>
      </div>

      <Modal
        key="modal"
        open={courierModalStatus}
        isWarning={false}
        close={t("cancel")}
        confirm={t("add")}
        title={t("more_about_the_order")}
        closeIcon={true}
        footer={<div></div>}
        onClose={() => setCourierModalStatus(false)}
      >
        <UPhoneWrapper
          type="user"
          name={order.client_name}
          phone={order.client_phone_number}
        />

        {order.courier && (
          <UPhoneWrapper
            className="mt-4"
            type="courier"
            name={`${order.courier.first_name} ${order.courier.last_name}`}
            phone={order.courier.phone}
            header="ФИО и телефон курьера"
          />
        )}
      </Modal>
    </div>
  );
};

export default KHCard;
