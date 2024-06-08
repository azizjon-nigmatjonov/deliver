import Modal from "components/ModalV2";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { orderHistoryAction } from "redux/actions/orderHistoryAction";
import OrderHistory from "views/orders/form/Leftside/ClientOrderHistory";

export const ModalOrderHistory = ({ id, toggle }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return id ? (
    <Modal
      title={t("orders.history")}
      open={toggle}
      onClose={() => dispatch(orderHistoryAction({ id: "", toggle: false }))}
      maxWidth="lg"
      fullWidth={true}
    >
      <OrderHistory client_id={id} />
    </Modal>
  ) : null;
};
