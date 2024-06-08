import { useContext, useState } from "react";
import { IconButton } from "@mui/material";
import styles from "./styles.module.scss";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import numberToPrice from "helpers/numberToPrice";
import { useTranslation } from "react-i18next";
import OrderFormContext from "context/OrderFormContext";
import Counter from "../Counter";
import EditPopover from "./EditPopover";

function CartItem({ product }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { t } = useTranslation();
  const { dispatch } = useContext(OrderFormContext);

  if (!product.product_id) return <></>;

  return (
    <>
      <div className={styles.cart_item}>
        <div className={styles.header}>
          <h4>{product?.name}</h4>
          <div style={{ width: "min-content" }}>
            <IconButton onClick={handleClick}>
              <EditRounded color="primary" />
            </IconButton>
            <IconButton
              onClick={() =>
                dispatch({ type: "REMOVE", payload: product?.uuid })
              }
            >
              <DeleteRounded color="error" />
            </IconButton>
          </div>
        </div>
        {product?.variants?.length > 0 && (
          <div className={styles.details}>
            {product?.variants?.map((variant) => (
              <p key={product.uuid + variant?.variant_id}>
                {variant.variant_name} x {variant?.quantity}
              </p>
            ))}
          </div>
        )}
        {product?.order_modifiers?.length > 0 && (
          <div className={styles.details}>
            {product?.order_modifiers?.map((modifier) =>
              modifier?.variants?.length > 0
                ? modifier?.variants?.map(
                    (variant) =>
                      variant?.modifier_quantity > 0 && (
                        <p
                          key={
                            product.uuid +
                            modifier?.modifier_id +
                            variant?.modifier_id
                          }
                        >
                          {modifier.modifier_name?.ru} | {variant.modifier_name}{" "}
                          x {variant?.modifier_quantity}
                        </p>
                      ),
                  )
                : modifier?.modifier_quantity > 0 && (
                    <p key={product.uuid + modifier?.modifier_id}>
                      {modifier.category_name?.ru} |{" "}
                      {modifier.modifier_name?.ru} x{" "}
                      {modifier?.modifier_quantity}
                    </p>
                  ),
            )}
          </div>
        )}
        <div className={styles.actions}>
          <p className={styles.price}>
            {numberToPrice(product.computed_price, t("uzb.sum"))}
          </p>
          <Counter
            value={product.quantity}
            onIncrease={() => {
              dispatch({ type: "INCREMENT", payload: product?.uuid });
              // handleUserLogs({ name: "Продукт" });
            }}
            onDecrease={() => {
              product?.quantity > 1 &&
                dispatch({ type: "DECREMENT", payload: product?.uuid });
              // handleUserLogs({ name: "Продукт" });
            }}
          />
        </div>
      </div>
      <EditPopover
        product={product}
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
      />
    </>
  );
}

export default CartItem;
