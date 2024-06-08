import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { formatPrice } from "utils/formatPrice";
import { getKitchenData } from "services/v2/kitchen";
import { useEffect, useState } from "react";
import { AccountCircleRounded } from "@mui/icons-material";
import KCOrderCard from "../KCOrderCard";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/Button";
import numberToPrice from "helpers/numberToPrice";
import { courierPaidToCashier } from "services/v2";
import { showAlert } from "redux/actions/alertActions";
import Modal from "components/ModalV2";

const KCCard = ({ data, date, animationDelay }) => {
  const [loading, setLoading] = useState(true);
  const [courierOrders, setCourierOrders] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedOrdersPrice, setSelectedOrdersPrice] = useState(0);

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      getKitchenData({
        page: 1,
        branch_id: auth.branch_id,
        courier_id: data?.id,
        status_ids: String([
          process.env.REACT_APP_OPERATOR_ACCEPTED_STATUS_ID,
          process.env.REACT_APP_VENDOR_ACCEPTED_STATUS_ID,
          process.env.REACT_APP_VENDOR_READY_STATUS_ID,
          process.env.REACT_APP_COURIER_ACCEPTED_STATUS_ID,
          process.env.REACT_APP_COURIER_PICKUP_STATUS_ID,
          process.env.REACT_APP_FINISHED_STATUS_ID,
          process.env.REACT_APP_OPERATOR_CANCELED_STATUS_ID,
          process.env.REACT_APP_SERVER_CANCELED_STATUS_ID,
          process.env.REACT_APP_VENDOR_CANCELLED,
        ]),
        start_date: date.start_date,
        end_date: date.end_date,
      })
        .then((res) => {
          let arr = [];
          if (res?.accepted_orders) arr.push(...res?.accepted_orders);
          if (res?.cancelled_orders) arr.push(...res?.cancelled_orders);
          if (res?.ready_orders) arr.push(...res?.ready_orders);
          if (res?.courier_pickedup_orders)
            arr.push(...res?.courier_pickedup_orders);
          if (res?.finished_orders) arr.push(...res?.finished_orders);
          let total_price = 0;
          let left = [];
          let right = [];
          for (let i = 0; i < arr?.length; i++) {
            const element = arr[i];
            total_price +=
              (!element.courier_paid_cashier &&
              element.payment_type === "cash" &&
              element.delivery_price
                ? element.delivery_price
                : 0) +
              (!element.courier_paid_cashier &&
              element.payment_type === "cash" &&
              element.order_amount
                ? element.order_amount
                : 0);
            if (Math.ceil(arr?.length / 2) > i) left.unshift(element);
            else if (Math.ceil(arr?.length / 2) <= i) right.unshift(element);
          }
          setCourierOrders({ left, right });
          setTotalPrice(total_price);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [auth.branch_id, data?.id, date, auth.shipper_id, isModalOpen]);

  const onOrderClick = (item) => {
    if (!item.courier_paid_cashier && item.payment_type === "cash") {
      if (selectedOrders.some((el) => el?.id === item.id)) {
        setSelectedOrdersPrice(
          (prev) =>
            prev - ((item.delivery_price || 0) + (item.order_amount || 0)),
        );
        setSelectedOrders((prev) => prev.filter((el) => el.id !== item.id));
      } else {
        setSelectedOrdersPrice(
          (prev) =>
            prev + ((item.delivery_price || 0) + (item.order_amount || 0)),
        );
        setSelectedOrders((prev) => [...prev, item]);
      }
    }
  };

  const onPaid = () => {
    if (selectedOrders?.length > 0) {
      const data = { order_ids: selectedOrders.map((order) => order?.id) };
      courierPaidToCashier(data)
        .then(() => {
          setModalOpen(false);
          setTotalPrice(0);
          setSelectedOrders([]);
          setSelectedOrdersPrice(0);
        })
        .catch((err) => console.log(err));
    } else dispatch(showAlert(t("nothing_selected")));
  };

  return (
    <>
      <div
        className={styles.card}
        style={{ animationDelay }}
        onClick={() => setModalOpen(true)}
      >
        <div className={styles.card_header}>
          <div className="flex items-center gap-2">
            <AccountCircleRounded
              style={{
                width: "40px",
                height: "40px",
              }}
            />
            <div>
              <h3>{data?.first_name}</h3>
              <h4>{data?.last_name}</h4>
            </div>
          </div>
          <p>
            {data?.total_orders_sum ? formatPrice(data?.total_orders_sum) : 0}{" "}
            {t("uzb.sum")}
          </p>
        </div>
        <div className={styles.card_body}>
          <div>
            <p>Количество заказов</p>
            <span>{data?.total_orders_count} шт</span>
          </div>
          <div>
            <p>Тип курьера</p>
            <span>{data?.courier_type?.name || t("unknown")}</span>
          </div>

          <div>
            <p>Номер телефона</p>
            <span>{data?.phone || t("unknown")}</span>
          </div>
        </div>

        {/* Don't delete this bro. this feature is not ready in backend. 
        if now it is ready you can do anything
        <div
          className={`${styles.card_footer} ${
            data?.first_name === "Shohruh" ? styles.green : styles.red
          }`}
          onClick={() => setModalOpen(true)}
        >
          <p>Задолженность</p>
          <span>
            {data?.first_name !== "Shohruh" ? (
              <>
                {formatPrice(0)} {t("uzb.sum")}
              </>
            ) : (
              "Оплачено"
            )}
          </span>
        </div> */}
      </div>
      <Modal
        open={isModalOpen}
        title={`Количество заказов: ${
          courierOrders?.left?.length + courierOrders?.right?.length
        }`}
        fullWidth={true}
        maxWidth="md"
        onClose={() => setModalOpen(false)}
      >
        <div className={styles.modal_body}>
          {loading ? (
            <h1>loading...</h1>
          ) : courierOrders?.left?.length > 0 ? (
            <>
              <div className={styles.col}>
                {courierOrders?.left?.map((item) => (
                  <KCOrderCard
                    data={item}
                    key={item.id}
                    onClick={() => onOrderClick(item)}
                    selected={selectedOrders.some((el) => el?.id === item.id)}
                  />
                ))}
              </div>
              <div className={styles.col}>
                {courierOrders?.right?.map((item) => (
                  <KCOrderCard
                    data={item}
                    key={item.id}
                    onClick={() => onOrderClick(item)}
                    selected={selectedOrders.some((el) => el?.id === item.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <h3>{t("no_orders")}</h3>
          )}
        </div>
        <div className={styles.modal_footer}>
          <p>
            Сумма долгов:{" "}
            <span>
              {formatPrice(totalPrice)} {t("uzb.sum")}
            </span>
          </p>
          {selectedOrders.length > 0 && (
            <p>Отмечено: {selectedOrders.length}</p>
          )}
          <Button
            size="large"
            style={{ width: "fit-content" }}
            onClick={onPaid}
          >
            Оплатить {numberToPrice(selectedOrdersPrice, t("uzb.sum"))}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default KCCard;
