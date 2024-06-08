import { ExpandLess, ExpandMore } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import Modal from "components/Modal";
import AsyncSelect from "components/Select/Async";
import UPhoneWrapper from "components/UPhoneWrapper";
import orderTimer from "helpers/orderTimer";
import React, { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import { addCourierByOrderId, changeOrderStatus } from "services";
import { postUserLog } from "services/userLog";
import { KitchenContext } from "views/kitchen";
import CaseHandlerComponent from "./CaseHandlerComponent";
import cls from "./kitchenCard.module.scss";
import { showOrderType, showPaymentType } from "./KitchenCardUtils";
import ShowButtons from "./ShowButtons";

const KitchenCard = ({
  orderId,
  orderAmount,
  products,
  buttonType,
  paymentType,
  orderType,
  elm,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { getData, auth, loadBranchCouriers, courier, setCourier } =
    useContext(KitchenContext);

  const [msg, setMsg] = useState("");
  const [modalInfo, setModalInfo] = useState(false);
  const [commentExpand, setCommentExpand] = useState(true);
  const [courierModalStatus, setCourierModalStatus] = useState(false);

  const handleUserLog = () => {
    // Don't delete empty fields. Yes, I also think that it is weird but if you don't include them in your request, error will be occured.
    postUserLog({
      action: msg ? "Филиал отменил" : "Изменить заказ",
      operator_id: auth.shipper_user_id,
      operator_name: auth.name,
      order_id: elm?.id,
      vendor_id: elm?.steps?.[0]?.branch_id,
      vendor_name: elm?.step?.[0]?.branch_name,
      courier_id: null,
      courier_name: null,
      description: msg,
      integration_request: "",
      integration_response: "",
    });
  };

  const handleOrderAction = (type) => {
    handleUserLog();
    changeOrderStatus(elm.id, type)
      .then(() =>
        dispatch(
          showAlert(
            `${
              type.description === "Филиал принял"
                ? "Принял"
                : type.description === "Завершить"
                ? "Завершен"
                : type.description
            }!`,
            "success",
          ),
        ),
      )
      .catch((err) => console.log(err))
      .finally(() => {
        getData();
      });
  };

  const patchOrderCourierById = () => {
    handleUserLog();
    addCourierByOrderId(elm.id, { courier_id: courier.value }).finally(() => {
      getData();
      setCourier(null);
      setCourierModalStatus(false);
    });
  };

  const computedNames = useMemo(() => {
    let arr = [];
    const products = elm.steps[0].products?.map((item) => item);
    const modifiers = products?.map((item) => item.order_modifiers);
    const variants = products?.map((item) => item.variants);
    const joinedArray = variants.concat(modifiers);

    for (var i = 0; i < joinedArray?.length; ++i) {
      for (var j = 0; j < joinedArray[i]?.length; ++j) {
        arr.push(joinedArray[i][j]);
      }
    }

    return arr;
  }, [elm.steps]);

  function strToMins(t) {
    const g = t.slice(10, t.length);
    var s = g.split(":");
    return Number(s[0]) * 3600 + Number(s[1]) * 60 + Number(s[2]);
  }

  function minsToStr(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);

    return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s].join(
      ":",
    );
  }

  return (
    <>
      <div className={cls.card}>
        <div className={cls.wrapper}>
          <div className={cls.header}>
            <div className={cls.header_top}>
              <div className={cls.orderIdWrapper}>
                <p className={cls.orderId}>ID: {orderId}</p>
                <InfoOutlinedIcon
                  className={cls.infoIcon}
                  onClick={() => setCourierModalStatus(true)}
                />
              </div>
              <div className={`${cls.priceSection}`}>
                <p className={`${cls.orderPrice}`}>
                  {orderAmount} {t("uzb.sum")}
                </p>
                <img
                  src={showPaymentType(paymentType)}
                  alt="payment_type"
                  className="mr-2"
                  width={18}
                />
                <img src={showOrderType(orderType)} alt="home" width={18} />
              </div>
            </div>
            <div className={cls.header_bottom}>{elm?.client_name}</div>
          </div>
          <div className={cls.line}></div>
          <div className={cls.orderInfoSection}>
            {products?.map((product) => (
              <div key={product?.id}>
                <p className={cls.orderLabel}>
                  {product?.quantity} x {product.name}
                </p>
                {(product?.order_modifiers || product?.variants) && (
                  <>
                    {computedNames?.map(
                      (item) =>
                        item?.variant_name && (
                          <p
                            className={cls.variantAndModifierNames}
                            key={item?.variant_name?.ru + item?.quantity}
                          >
                            {item?.quantity} x{" "}
                            {item?.variant_name?.ru && item?.variant_name?.ru}
                          </p>
                        ),
                    )}
                    {computedNames?.map(
                      (item) =>
                        item?.modifier_name?.ru && (
                          <p
                            className={cls.variantAndModifierNames}
                            key={
                              item?.modifier_name?.ru + item?.modifier_quantity
                            }
                          >
                            {item?.modifier_quantity} x{" "}
                            {item?.modifier_name?.ru && item?.modifier_name?.ru}
                          </p>
                        ),
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className={cls.orderTimer}>
            {buttonType === "new_orders" ? (
              <>
                <WatchLaterIcon className={cls.timeIcon} />
                <span className={cls.orderTime}>00:00</span>
              </>
            ) : elm?.vendor_accepted_at === "" || !elm?.vendor_accepted_at ? (
              <>
                <WatchLaterIcon className={cls.timeIcon} />
                <span className={cls.orderTime}>--:--</span>
              </>
            ) : buttonType === "work_process" ? (
              <>
                <WatchLaterIcon className={cls.timeIcon} />
                <span className={cls.orderTime}>
                  {orderTimer(
                    elm?.vendor_accepted_at,
                    elm?.finished_at,
                    elm?.future_time,
                    elm?.status_id,
                  )}
                </span>
              </>
            ) : (
              elm?.status_notes?.[2].status_id ===
                "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd" &&
              elm?.status_notes?.[1].status_id ===
                "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3" && (
                <>
                  <WatchLaterIcon className={cls.timeIcon} />
                  <span className={cls.orderTime}>
                    {minsToStr(
                      strToMins(elm?.status_notes?.[2].created_at) -
                        strToMins(elm?.status_notes?.[1].created_at),
                    )}
                  </span>
                </>
              )
            )}
          </div>
          {elm?.vendor_comment && (
            <div className={cls.clientComment}>
              <div
                className={cls.commentHeadingWrapper}
                onClick={() => setCommentExpand((prev) => !prev)}
              >
                <p className={cls.commentHead}>{t("comment")}</p>
                {commentExpand ? (
                  <ExpandLess style={{ color: "#6e8bb7", cursor: "pointer" }} />
                ) : (
                  <ExpandMore style={{ color: "#6e8bb7", cursor: "pointer" }} />
                )}
              </div>
              {commentExpand && (
                <p className={cls.commentText}> {elm?.vendor_comment} </p>
              )}
            </div>
          )}
          <div className={cls.line}></div>
          <ShowButtons
            buttonType={buttonType}
            elm={elm}
            auth={auth}
            setModalInfo={setModalInfo}
            handleOrderAction={handleOrderAction}
          />
        </div>
      </div>
      <Modal
        open={modalInfo}
        isWarning
        title={t("are.you.sure.want.to.delete")}
        onClose={() => setModalInfo(false)}
        onConfirm={() => {
          handleOrderAction({
            description: msg,
            status_id: "c4227d1b-c317-46f8-b1e3-a48c2496206f",
          });
        }}
        loading={false}
      >
        {<CaseHandlerComponent msg={msg} setMsg={setMsg} />}
      </Modal>
      <Modal
        open={courierModalStatus}
        isWarning={false}
        close={t("cancel")}
        confirm={t("add")}
        title={"Добавить курьера"}
        onClose={() => {
          setCourierModalStatus(false);
          setCourier(null);
        }}
        disable={elm?.courier?.phone?.length}
        onConfirm={() => patchOrderCourierById()}
      >
        <UPhoneWrapper
          type="user"
          name={elm.client_name}
          phone={elm.client_phone_number}
          className="mb-4"
        />

        {courier && (
          <UPhoneWrapper
            type="courier"
            name={courier.label}
            phone={courier.phone}
            className="mb-4"
            header="ФИО и телефон курьера"
          />
        )}

        {elm?.courier?.phone ? (
          <UPhoneWrapper
            type="courier"
            name={`${elm.courier.first_name} ${elm.courier.last_name}`}
            phone={elm?.courier?.phone}
            className="mb-4"
            header="ФИО и телефон курьера"
          />
        ) : (
          <AsyncSelect
            placeholder={t("couriers")}
            loadOptions={loadBranchCouriers}
            className="mb-8"
            defaultOptions
            cacheOptions
            isSearchable
            value={courier}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            onChange={(val) => {
              setCourier({
                label: val.name,
                value: val.value,
                phone: val.phone,
              });
            }}
          />
        )}
      </Modal>
    </>
  );
};
export default KitchenCard;
