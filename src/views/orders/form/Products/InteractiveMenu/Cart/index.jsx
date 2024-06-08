import Button from "components/Button/Buttonv2";
import styles from "./styles.module.scss";
import CartItem from "./CartItem";
import { useContext } from "react";
import OrderFormContext from "context/OrderFormContext";
import numberToPrice from "helpers/numberToPrice";
import { useTranslation } from "react-i18next";

function Cart({ totalPrice, onSave }) {
  const { cart } = useContext(OrderFormContext);
  const { t } = useTranslation();

  return (
    <div className={styles.cart}>
      <div>
        <div className={styles.products}>
          {cart?.map((product) => (
            <CartItem key={product.uuid} product={product} />
          ))}
        </div>
        <div className="flex justify-between font-semibold my-4">
          <p>Общая сумма</p>
          <p>{numberToPrice(totalPrice, t("uzb.sum"))}</p>
        </div>
      </div>

      <Button variant="contained" onClick={onSave}>Сохранить</Button>
    </div>
  );
}

export default Cart;
