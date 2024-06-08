import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { showOrderType, showPaymentType } from "./KitchenCardUtils";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { formatPrice } from "utils/formatPrice";
import styles from "./styles.module.scss";

const KCOrderCard = ({ data, selected, onClick }) => {
  const [orderStatus, setOrderStatus] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const computedNames = useMemo(() => {
    let arr = [];
    const products = data?.steps[0].products;
    const modifiers = products?.map((item) => item.order_modifiers);
    const variants = products?.map((item) => item.variants);
    const joinedArray = variants.concat(modifiers);

    for (var i = 0; i < joinedArray?.length; ++i) {
      for (var j = 0; j < joinedArray[i]?.length; ++j) {
        arr.push(joinedArray[i][j]);
      }
    }

    return arr;
  }, [data]);

  useEffect(() => {
    if (
      data?.status_id === process.env.REACT_APP_OPERATOR_CANCELED_STATUS_ID ||
      data?.status_id === process.env.REACT_APP_SERVER_CANCELED_STATUS_ID ||
      data?.status_id === process.env.REACT_APP_VENDOR_CANCELLED
    ) {
      setOrderStatus("cancelled");
    } else if (data?.paid) {
      setOrderStatus("paid");
    } else {
      setOrderStatus("");
    }
  }, [data?.status_id, data?.paid]);

  return (
    <div
      className={`${styles.card} ${selected ? styles.active : ""} ${
        orderStatus === "cancelled"
          ? styles.cancelled
          : orderStatus === "paid"
          ? styles.paid
          : ""
      }`}
      onClick={onClick}
    >
      <Accordion expanded={expanded === true}>
        <AccordionSummary
          className={styles.card_header}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={styles.card_header_top}>
            <div>
              <p className={styles.orderId}>ID: {data?.external_order_id}</p>
              <InfoOutlinedIcon
                className={styles.icon}
                onClick={() => setExpanded((prevState) => !prevState)}
              />
            </div>
            <div>
              <p>
                {formatPrice(
                  (data?.order_amount || 0) + (data?.delivery_price || 0),
                )}{" "}
                {t("uzb.sum")}
              </p>
              <img
                src={showPaymentType(
                  orderStatus === "cancelled" && data?.payment_type === "cash"
                    ? "cash_white"
                    : data?.payment_type || "cash",
                )}
                alt="payment_type"
              />
              <img
                src={showOrderType(
                  orderStatus === "cancelled"
                    ? `${data?.delivery_type}_white`
                    : data?.delivery_type || "delivery",
                )}
                alt="home"
              />
            </div>
          </div>

          <div className={styles.card_header_bottom}>{data?.client_name}</div>
        </AccordionSummary>
        <AccordionDetails className={styles.card_body}>
          {data?.steps[0].products?.map((product) => (
            <div key={product.id + product.product_id}>
              <p className={styles.orderLabel}>
                {product?.quantity} x {product.name}
              </p>
              {product?.variants && (
                <div className={styles.variantAndModifierNames}>
                  {computedNames?.map(
                    (item) =>
                      item?.variant_name?.ru && (
                        <div key={item.variant_id}>
                          {item?.quantity} x {item?.variant_name?.ru}
                        </div>
                      ),
                  )}
                </div>
              )}
              {product?.order_modifiers && (
                <div className={styles.variantAndModifierNames}>
                  {computedNames?.map(
                    (item) =>
                      item?.modifier_name?.ru && (
                        <div key={item.modifier_id}>
                          {item?.modifier_quantity} x {item?.modifier_name?.ru}{" "}
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
      <div
        className={`${styles.card_footer} ${
          data?.courier_paid_cashier ? styles.green : styles.red
        }`}
      >
        {data?.courier_paid_cashier
          ? "Оплачено"
          : `Долг: ${data?.order_amount} сум`}
      </div>
    </div>
  );
};

export default KCOrderCard;
