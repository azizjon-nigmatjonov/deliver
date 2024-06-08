import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ArrowBack, CalendarToday, QueryBuilder } from "@mui/icons-material";
import Button from "components/Button";
import Filter from "components/Filters";
import Header from "components/Header";
import Modal from "components/Modal";
import CustomSkeleton from "components/Skeleton";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import TagBtn from "components/Tag/TimeTag";
import { useFormik } from "formik";
import orderTimer from "helpers/orderTimer";
import parseQuery from "helpers/parseQuery";
import validate from "helpers/validateField";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { showAlert } from "redux/actions/alertActions";
import { getComputeDeliveryPrice } from "services";
import { postUserLog } from "services/userLog";
import {
  menuProductStatuses,
  postOrder,
  postYandexDelivery,
  updateOrder,
  useOrderById,
} from "services/v2";
import * as yup from "yup";
import { statusTag, isOrderEditable } from "../statuses";
import { initialValues } from "./api";
import Comments from "./Comments";
import HistoryChanges from "./HistoryChanges";
import MainContent from "./MainContent";
import Payment from "./Payment";
import Products from "./Products";
import OrderFormContext from "context/OrderFormContext";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useMutation } from "@tanstack/react-query";
import { useCrmCredentials } from "services/v2/poster";
import customerService from "services/customer";

export default function Wrapper() {
  const { repeat, redirect, status } = parseQuery();

  const [openModal, setOpenModal] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [quantityCheck, setQuantityCheck] = useState(false);
  const [mapGeometry, setMapGeometry] = useState([41.292906, 69.24132]);
  const [placemarkGeometry, setPlacemarkGeometry] = useState([]);
  const [distance, setDistance] = useState();
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [isCourierCall, setIsCourierCall] = useState(true);
  const [courierID, setCourierID] = useState({
    isPaid: false,
    courier: "",
  });

  const [tabValue, setTabValue] = useState(
    redirect === "true" || status === "completed" ? 1 : 0,
  );

  const params = useParams();
  const interValRef = useRef();
  const productsRef = useRef();
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const processOnlyPaid = useSelector(
    (state) => state?.auth?.procces_only_paid,
  );
  const auth = useSelector((state) => state.auth);
  const ws = useSelector((state) => state.ws.websocket);
  const { cart, dispatch: contextDispatch } = useContext(OrderFormContext);
  const lazyCart = useDebounce(cart, 300);

  const onSubmit = async (values) => {
    setSaveLoading(true);
    const user_logs = {
      action: "Изменить заказ",
      courier_id: null,
      courier_name: null,
      description: !!params.id ? values.user_logs.description : "",
      integration_request: "",
      integration_response: "",
      operator_id: auth?.shipper_user_id,
      operator_name: auth?.name,
      order_id: values.id,
      vendor_id: values.branch.elm.id,
      vendor_name: values.branch.label,
    };

    const products = cart
      ?.filter((product) => +product.quantity > 0.1)
      ?.map((product) => {
        let orderModifiers = [];
        product?.order_modifiers
          ?.filter((el) => el.modifier_quantity > 0.1)
          .forEach((modifier) =>
            modifier?.variants
              ? modifier?.variants
                  ?.filter((el) => el.modifier_quantity > 0)
                  .forEach((variant) =>
                    orderModifiers.push({
                      modifier_id: variant.modifier_id,
                      modifier_price: variant.modifier_price,
                      modifier_quantity:
                        variant.modifier_quantity *
                        (modifier.send_as_product ? 1 : product.quantity),
                      parent_id: variant.parent_id ? variant.parent_id : "",
                    }),
                  )
              : orderModifiers.push({
                  modifier_id: modifier.modifier_id,
                  modifier_price: modifier.modifier_price,
                  modifier_quantity:
                    modifier.modifier_quantity *
                    (modifier.send_as_product ? 1 : product.quantity),
                  parent_id: modifier.parent_id ? modifier.parent_id : "",
                }),
          );
        return {
          description: product.description,
          discounts: product.discounts?.map((discount) => ({
            id: discount.value,
          })),
          price: product.price,
          product_id: product.product_id,
          quantity: +product.quantity,
          variants: product?.variants?.map((el) => ({
            group_id: el.group_id,
            variant_id: el.variant_id,
          })),
          type: product.type,
          order_modifiers: orderModifiers,
        };
      });

    let clientId = "";
    if (!values.client_id) {
      const { id } = await customerService.create({
        name: values.client_name,
        phone:
          values?.client_phone_number[0] === "+"
            ? values.client_phone_number
            : `+${values?.client_phone_number}`,
      });
      handleUserLogs({
        name: "Тел номер клиента",
      });
      clientId = id;
    } else {
      clientId = values.client_id;
    }

    const data = {
      aggregator_id: values?.aggregator_id?.value || null,
      accommodation: values.accommodation && String(values.accommodation),
      apartment: values.apartment && String(values.apartment),
      building: values.building && String(values.building),
      client_id: clientId,
      id: params?.id ? params?.id : "",
      yandex_claim_id: values?.yandex_claim_id,
      courier_type_id: values?.courier_type?.value,
      courier_id: values?.courier_id?.value,
      co_delivery_price: values?.co_delivery_price,
      delivery_type: values?.delivery_type,
      delivery_price: values?.delivery_price,
      description: values?.description,
      discounts: values?.discounts?.map((item) => ({ id: item.value })),
      extra_phone_number: values?.extra_phone_number,
      external_type:
        values?.delivery_type === "external" ? values.external_type?.value : "",
      fare_id: values.fare_id?.value ? values.fare_id?.value : "",
      floor: values.floor && String(values.floor),
      future_time: values?.future_time
        ? moment(values?.future_time).format("YYYY-MM-DD") +
          " " +
          moment(values?.delivery_time).format("HH:mm:ss")
        : null,
      is_courier_call: values.is_courier_call,
      is_preorder: values.is_preorder,
      is_reissued: values.is_reissued,
      is_cancel_old_order: repeat === "true" && cancelOrder ? true : false,
      payment_type: values.payment_type,
      source: values.source,
      steps: [
        {
          address: values.branch.elm.address,
          branch_id: values.branch.elm.id
            ? values.branch.elm.id
            : values.branch.value,
          branch_name: values.branch.elm.name
            ? values.branch.elm.name
            : values.branch.label,
          description: values.description,
          destination_address: values.destination_address,
          location: values.branch.elm.location,
          phone_number: values.branch.elm.phone,
          products: products,
        },
      ],
      to_address: values.to_address,
      to_location: {
        lat: placemarkGeometry[0],
        long: placemarkGeometry[1],
      },
      // yandex_class: values.yandex_class?.value,
    };
    if (
      location.search !== "?repeat=true" &&
      params.id &&
      processOnlyPaid === true &&
      data?.courier_id &&
      courierID.isPaid === false &&
      (data?.payment_type === "payme" ||
        data?.payment_type === "apelsin" ||
        data?.payment_type === "click")
    ) {
      setSaveLoading(false);
      dispatch(showAlert("Заказ не оплачен", "error"));
    } else {
      if (cart?.length === 0 || cart[0].name === "") {
        dispatch(showAlert("Добавьте продукты"));
        productsRef?.current?.scrollIntoView({ behavior: "smooth" });
        setSaveLoading(false);
        return;
      } else if (cart.some((product) => product.in_stop)) {
        dispatch(showAlert("Продукт находится в стоп-листе"));
        productsRef?.current?.scrollIntoView({ behavior: "smooth" });
        setSaveLoading(false);
        return;
      } else if (params.id && !repeat) {
        try {
          data.shipper_id = values?.shipper?.value;
          if (!quantityCheck) {
            await updateOrder(params.id, data);
          }
          await postUserLog({ ...user_logs });
          history.push("/home/orders/");
        } catch (e) {
          console.log(e);
        } finally {
          setSaveLoading(false);
        }
      } else if (!quantityCheck) {
        if (
          values?.delivery_type === "external" &&
          values?.external_type?.value === "yandex" &&
          values?.yandex_claim_id &&
          values.yandex_class?.value
        ) {
          yandexDeliveryMutation.mutate(yandexData, {
            onSuccess: () => {
              postOrder(data)
                .then((res) => history.push("/home/orders"))
                .finally(() => setSaveLoading(false));
            },
          });
        } else {
          postOrder(data)
            .then((res) => history.push("/home/orders"))
            .finally(() => setSaveLoading(false));
        }
      }
    }
  };

  const validationSchema = useMemo(() => {
    let validation = yup.object().shape({
      delivery_type: validate("mixed"),
      client_name: validate("mixed"),
      client_phone_number: validate("mixed"),
      to_address:
        deliveryType === "delivery" || deliveryType === "external"
          ? validate("mixed")
          : yup.mixed().notRequired(),
      branch: validate("resmixed"),
      apartment: isCourierCall ? yup.mixed().notRequired() : validate("mixed"),
      building: isCourierCall ? yup.mixed().notRequired() : validate("mixed"),
      floor: isCourierCall ? yup.mixed().notRequired() : validate("mixed"),
      accommodation: isCourierCall
        ? yup.mixed().notRequired()
        : validate("mixed"),
    });

    return validation;
  }, [deliveryType, isCourierCall]);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { setFieldValue, setValues, handleSubmit, values } = formik;

  function handleUserLogs({ name }) {
    if (!!params.id && !values?.user_logs?.description?.includes(name + ":")) {
      setFieldValue(
        `user_logs.description`,
        values.user_logs.description + ` \n ${name}: изменен, `,
      );
    }
  }

  const yandexDeliveryMutation = useMutation({
    mutationFn: (data) => postYandexDelivery(data),
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      setFieldValue("co_delivery_price", data?.price);
      if (!values.yandex_claim_id)
        setFieldValue("yandex_claim_id", data?.claim_id);
    },
  });

  const computePrice = useMutation({
    mutationFn: getComputeDeliveryPrice,
    onSuccess: (data) => {
      setDistance(data?.distance);
      setFieldValue("delivery_price", data?.price ? data?.price : 0);
    },
    onError: (error) => console.log(error),
  });

  const TOTAL_PRICE = useMemo(() => {
    return lazyCart?.reduce(
      (pre, cur) => pre + cur?.computed_price * cur?.quantity,
      0,
    );
  }, [lazyCart]);

  const yandexData = useMemo(
    () => ({
      address_description: values.address_description,
      adress_full_name: values.to_address,
      branch_id: values.branch?.value,
      building: values.accommodation,
      client_name: values.client_name,
      client_phone: values.client_phone_number,
      flat: values.apartment,
      floor: values.floor,
      lat: placemarkGeometry[0] ? placemarkGeometry[0] : 0,
      long: placemarkGeometry[1] ? placemarkGeometry[1] : 0,
      order_comment: values.description,
      porch: values?.building,
      products: cart?.map((product) => ({
        price: product.computed_price || 0,
        product_name: product?.name,
        quantity: product?.quantity || 1,
      })),
      yandex_claim_id: values.yandex_claim_id,
      yandex_class: values.yandex_class?.value,
    }),
    [
      cart,
      placemarkGeometry,
      values.accommodation,
      values.address_description,
      values.apartment,
      values.branch?.value,
      values?.building,
      values.client_name,
      values.client_phone_number,
      values.description,
      values.floor,
      values.to_address,
      values.yandex_claim_id,
      values.yandex_class?.value,
    ],
  );

  const { data: orderData, isFetching } = useOrderById({
    id: params.id,
    props: {
      enabled: params.id ? true : false,
      onSuccess: (data) => {
        let date2 = moment(data?.future_time)
          .add(-5, "hours")
          .format("YYYY-MM-DD HH:mm:ss");
        let date = new Date(date2);
        date.setHours(Math.abs(date.getHours()));
        const geometry =
          data?.delivery_type === "delivery" ||
          data?.delivery_type === "external"
            ? [data?.to_location?.lat, data?.to_location?.long]
            : [data?.steps[0]?.location?.lat, data?.steps[0]?.location?.long];
        const products = data?.steps[0]?.products?.map((item) => {
          let computed_price = item?.price + (item?.discount_price || 0);
          let modifiers = [];

          item?.modifiers?.single_modifiers?.forEach((elm) => {
            const inOrderModifiers = +item.order_modifiers?.find(
              (modifier) => modifier.modifier_id === elm.id,
            )?.modifier_quantity;

            modifiers.push({
              add_to_price: elm?.add_to_price || false,
              modifier_id: elm.id,
              modifier_name: elm.name,
              modifier_quantity: inOrderModifiers
                ? inOrderModifiers / (elm.send_as_product ? 1 : item.quantity)
                : 0,
              modifier_price: elm.price ? +elm.price : 0,
              max_amount: elm.max_amount,
              min_amount: elm.min_amount,
              is_single: true,
              category_name: elm.category_name,
              is_compulsory: elm.is_compulsory || false,
              send_as_product: elm.send_as_product,
            });
          });
          item?.modifiers?.group_modifiers?.forEach((groupModifier) => {
            let groupTotalPrice = 0;
            let groupTotalAmount = 0;
            const inOrderModifiers = item.order_modifiers?.filter(
              (modifier) => modifier.parent_id === groupModifier.id,
            );

            // ! Look here, i think this should be more optimized
            groupModifier?.variants?.forEach((variant) => {
              inOrderModifiers?.forEach((modifier) => {
                if (variant.id === modifier.modifier_id) {
                  groupTotalPrice += !variant.add_to_price
                    ? Number(modifier.modifier_price) *
                      (+modifier.modifier_quantity /
                        (groupModifier.send_as_product ? 1 : item.quantity))
                    : 0;
                  groupTotalAmount += !variant.add_to_price
                    ? Number(modifier.modifier_quantity) /
                      (groupModifier.send_as_product ? 1 : item.quantity)
                    : 0;
                  computed_price += !variant.add_to_price
                    ? Number(modifier.modifier_price) *
                      (+modifier.modifier_quantity /
                        (groupModifier.send_as_product ? 1 : item.quantity))
                    : 0;
                }
              });
            });

            modifiers.push({
              add_to_price: groupModifier.add_to_price,
              is_compulsory: groupModifier.is_compulsory || false,
              is_single: false,
              max_amount: groupModifier.max_amount,
              min_amount: groupModifier.min_amount,
              modifier_id: groupModifier.id,
              modifier_name: groupModifier.name,
              modifier_quantity: groupTotalAmount,
              modifier_price: groupModifier.price ? +groupModifier.price : 0,
              send_as_product: groupModifier.send_as_product,
              total_amount: groupTotalAmount,
              total_price: groupTotalPrice,
              variants: groupModifier?.variants?.map((el) => ({
                add_to_price: groupModifier.add_to_price,
                modifier_id: el.id,
                modifier_name: el.title?.ru,
                modifier_quantity:
                  +inOrderModifiers?.find(
                    (modifier) => el.id === modifier.modifier_id,
                  )?.modifier_quantity /
                    (groupModifier.send_as_product ? 1 : item.quantity) || 0,
                modifier_price: el.out_price ? el.out_price : 0,
                parent_id: groupModifier.id,
              })),
            });
          });

          return {
            uuid: item.id,
            description: item.description || "",
            computed_price,
            discounts: item.discounts?.map((discount) => ({
              label: discount.name?.ru,
              value: discount.id,
              amount: discount.price,
              priority: discount.priority,
            })),
            discount_price: item.discount_price ? item.discount_price : 0,
            product_id: item.product_id,
            quantity: item.quantity,
            type: item.type,
            comboProducts: item?.variants?.map((elm) => ({
              id: elm.group_id,
              title: elm.parent_name,
              quantity: elm.quantity,
              type: elm.group_type,
              variants: elm.options,
            })),
            variants: item?.variants?.map((elm) => ({
              group_id: elm.group_id,
              variant_id: elm.variant_id,
              variant_name: elm.variant_name.ru,
            })),
            name: item.name,
            order_modifiers: modifiers,
            price: item?.price,
          };
        });
        setPlacemarkGeometry(geometry);
        setMapGeometry(geometry);
        setCourierID((prev) => ({
          ...prev,
          courier: data?.courier_id,
          isPaid: data?.paid,
        }));

        contextDispatch({
          type: "SET_CART",
          payload: products,
        });
        setValues({
          accommodation: data?.accommodation || "",
          aggregator_id: data?.aggregator?.name
            ? {
                label: data?.aggregator?.name,
                value: data?.aggregator_id,
              }
            : "",
          apartment: data?.apartment || "",
          branch: {
            elm: {
              phone: data?.steps[0]?.phone_number,
              address: data?.steps[0]?.address,
            },
            label: data?.steps[0]?.branch_name,
            value: data?.steps[0]?.branch_id,
          },
          building: data?.building || "",
          client_id: data?.client_id,
          client_name: data?.client_name,
          client_phone_number: data?.client_phone_number,
          courier_id: {
            label: data?.courier?.first_name,
            value: data?.courier_id,
          },
          courier_type: {
            label: data?.courier_type_name,
            value: data?.courier_type_id,
          },
          co_delivery_price: data?.co_delivery_price,
          delivery_price: data?.delivery_price,
          destination_address: data?.steps[0].destination_address,
          delivery_time: data?.future_time ? moment(date) : null,
          delivery_type: data?.delivery_type,
          description: data?.description,
          discounts: data?.discounts?.map((item) => ({
            label: item.name?.ru,
            amount: +item?.price,
            value: item.id,
            priority: item.priority,
            mode: item?.mode,
            type: item.type,
            color: item.type === "promo_code" && "#FDE25D",
            promo_code: item?.promo_code,
          })),
          distance: data?.distance,
          external_order_id: data?.external_order_id,
          external_type: {
            value: data?.external_type,
            label: t(
              data?.external_type === "yandex"
                ? "yandex_delivery"
                : data?.external_type,
            ),
          },
          extra_phone_number: data?.extra_phone_number || "",
          fare_id: {
            label: data?.fare_name,
            value: data?.fare_id,
          },
          floor: data?.floor || "",
          future_time: data?.future_time
            ? moment(data?.future_time)
                .add(-5, "hours")
                .format("YYYY-MM-DD HH:mm:ss")
            : null,
          id: data?.id,
          is_courier_call: data?.is_courier_call,
          is_reissued: data?.is_reissued,
          order_amount: data?.order_amount,
          payment_type: data?.payment_type,
          source: data?.source,
          steps: data?.steps,
          status_id: data?.status_id,
          to_address: data?.to_address,
          user_logs: { description: "" },
          yandex_claim_id: data?.yandex_claim_id,
          yandex_class: {
            value: data?.yandex_class,
            label: t(data?.yandex_class),
          },
        });
      },
    },
  });

  const sendSocketMessage = useCallback(() => {
    interValRef.current = setInterval(() => {
      if (ws) {
        ws.send(
          JSON.stringify({
            action: "order-viewed",
            message: params.id,
          }),
        );
      }
    }, [2000]);
  }, [params.id, ws]);

  useCrmCredentials({
    id: "yandex",
    props: {
      enabled:
        values?.delivery_type === "external" &&
        values?.external_type?.value === "yandex",
      onSuccess: (res) => {
        setFieldValue(
          "as_order_delivery_price",
          res?.crm_data?.as_order_delivery_price,
        );
      },
      onError: (err) => console.log(err),
    },
  });

  useEffect(() => {
    if (
      values?.branch?.value &&
      placemarkGeometry?.length > 0 &&
      (values?.delivery_type === "delivery" ||
        (values?.delivery_type === "external" &&
          values?.external_type?.value === "yandex" &&
          !values.as_order_delivery_price))
    ) {
      computePrice.mutate({
        branch_id: values.branch.value,
        fare_id: values?.fare_id?.value ? values?.fare_id?.value : "",
        lat: placemarkGeometry[0],
        long: placemarkGeometry[1],
        order_price: TOTAL_PRICE,
      });
    } else if (values?.delivery_type === "self-pickup") {
      setFieldValue("delivery_price", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    TOTAL_PRICE,
    setFieldValue,
    values?.fare_id,
    placemarkGeometry,
    values.branch.value,
    values?.delivery_type,
    values.as_order_delivery_price,
    values?.external_type?.value,
  ]);

  useEffect(() => {
    if (params.id) {
      sendSocketMessage();
      return () => {
        clearInterval(interValRef.current);
      };
    }
  }, [sendSocketMessage, params.id]);

  useEffect(() => {
    if (
      values?.delivery_type === "external" &&
      values?.external_type?.value === "yandex" &&
      values.yandex_class?.value &&
      values.client_name &&
      cart.length > 0 &&
      cart[0]?.quantity > 0 &&
      placemarkGeometry[0] &&
      placemarkGeometry[1] &&
      ((params.id && repeat && isOrderEditable(values?.status_id)) ||
        !params.id)
    )
      yandexDeliveryMutation.mutate(yandexData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values?.delivery_type,
    values?.external_type?.value,
    values.yandex_class?.value,
    placemarkGeometry,
  ]);

  // When the branch changes, its menu changes also.
  // Here we check the products of previous and current menus
  useEffect(() => {
    if (values?.branch?.elm?.menu_id && cart.length > 0 && cart[0].product_id) {
      let productIds = cart?.map((product) => product.product_id);
      menuProductStatuses({
        menu_id: values?.branch?.elm?.menu_id,
        product_ids: String(productIds),
      }).then((res) => {
        let response_ids = res?.products
          ?.filter((item) => item.is_active)
          .map((item) => item.product_id);
        let result = cart.map((item) =>
          response_ids?.includes(item.product_id)
            ? { ...item, in_stop: false }
            : { ...item, in_stop: true },
        );
        contextDispatch({
          type: "SET_CART",
          payload: result,
        });
      });
    } else if (
      !values?.branch?.elm?.menu_id &&
      cart.length > 0 &&
      cart[0].product_id
    ) {
      let result = cart.map((item) => ({ ...item, in_stop: false }));
      contextDispatch({
        type: "SET_CART",
        payload: result,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.branch]);

  useEffect(() => {
    setDeliveryType(values?.delivery_type);
  }, [values?.delivery_type]);

  useEffect(() => {
    setIsCourierCall(values?.is_courier_call);
  }, [values?.is_courier_call]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleChangeIndex = (index) =>
    setTabValue(status === "completed" ? 1 : index);

  return isFetching ? (
    <CustomSkeleton />
  ) : (
    <>
      <Header
        startAdornment={
          <>
            <div
              className="flex items-center gap-3 font-semibold text-xl"
              style={{ marginRight: 20 }}
            >
              <ArrowBack
                onClick={() => history.goBack()}
                className="cursor-pointer"
              />
              <p>
                {params.id ? formik?.values?.external_order_id : t("new_order")}
              </p>
            </div>
            {params.id && (
              <div>
                <h3
                  className="text-secondary text-sm font-medium flex items-center"
                  style={{ marginLeft: 20 }}
                >
                  <CalendarToday
                    style={{ marginRight: "10px" }}
                    fontSize="small"
                  />
                  {moment(orderData?.status_notes[0]?.created_at).format(
                    "DD.MM.YYYY HH:mm:ss",
                  )}
                </h3>
              </div>
            )}
          </>
        }
        endAdornment={
          (params.id && (
            <TagBtn
              iconLeft={<QueryBuilder fontSize="small" />}
              color="#1AC19D"
              bgColor="rgba(56, 217, 185, 0.15)"
            >
              <span className="ml-3">
                {orderData?.status_notes[0]?.created_at &&
                  orderTimer(
                    orderData.created_at,
                    orderData.finished_at,
                    orderData.future_time,
                    orderData.status_id,
                  )}
              </span>
            </TagBtn>
          ),
          params.id && statusTag(orderData?.status_id, t))
        }
      />
      {status !== "completed" && params?.id && (
        <Filter>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab
              label={<TabLabel>{t("Основное")}</TabLabel>}
              {...a11yProps(0)}
            />
            <StyledTab
              label={<TabLabel>{t("История изменений")}</TabLabel>}
              {...a11yProps(1)}
            />
          </StyledTabs>
        </Filter>
      )}
      <SwipeableViews
        axis="x"
        index={tabValue}
        onChangeIndex={handleChangeIndex}
      >
        {status !== "completed" ? (
          <TabPanel value={tabValue} index={0}>
            <div
              className="p-4 w-full box-border font-body flex flex-col gap-3"
              style={{ fontSize: "14px", lineHeight: "24px" }}
            >
              <MainContent
                formik={formik}
                distance={distance}
                mapGeometry={mapGeometry}
                setMapGeometry={setMapGeometry}
                handleUserLogs={handleUserLogs}
                setIsCourierCall={setIsCourierCall}
                mapLoading={computePrice?.isLoading}
                placemarkGeometry={placemarkGeometry}
                setPlacemarkGeometry={setPlacemarkGeometry}
                isOrderEditable={isOrderEditable(values.status_id, repeat)}
              />
              <div ref={productsRef}>
                <Products
                  isOrderEditable={isOrderEditable(values.status_id, repeat)}
                  orderDetails={values}
                  menuId={values?.branch?.elm?.menu_id}
                  totalPrice={TOTAL_PRICE}
                  handleUserLogs={handleUserLogs}
                  setQuantityCheck={setQuantityCheck}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Comments formik={formik} handleUserLogs={handleUserLogs} />
                <Payment
                  formik={formik}
                  deliveryPrice={
                    values?.delivery_type === "external" &&
                    values?.external_type?.value === "yandex" &&
                    values.as_order_delivery_price
                      ? values?.co_delivery_price
                      : values?.delivery_price
                  }
                  totalPrice={TOTAL_PRICE}
                  isOrderEditable={isOrderEditable(values.status_id, repeat)}
                  handleUserLogs={handleUserLogs}
                  orderData={orderData}
                />
              </div>
            </div>
          </TabPanel>
        ) : (
          <></> // Don't delete this fragment. If you do, swipeable-views will cause warning
        )}
        {params?.id ? (
          <TabPanel value={tabValue} index={1}>
            <HistoryChanges data={orderData} />
          </TabPanel>
        ) : (
          <></> // Don't delete this fragment. If you do, swipeable-views will cause warning
        )}
      </SwipeableViews>
      {status !== "completed" && (
        <div className="flex sticky bottom-0 justify-end items-center w-full bg-white px-4 py-2">
          <Button
            color="red"
            shape="outlined"
            onClick={() => history.goBack()}
            size="large"
            borderColor="bordercolor"
            className="bg-white mr-3"
          >
            {t("cancel")}
          </Button>
          <Button
            size="large"
            onClick={() =>
              repeat === "true" ? setOpenModal(true) : handleSubmit()
            }
            disabled={
              params.id && !repeat && !isOrderEditable(values.status_id)
            }
            loading={saveLoading}
          >
            {t("save")}
          </Button>
        </div>
      )}
      <Modal
        open={openModal}
        onClose={() => {
          setCancelOrder(false);
          setOpenModal(false);
          handleSubmit();
        }}
        onConfirm={() => {
          setCancelOrder(true);
          setOpenModal(false);
          handleSubmit();
        }}
        isWarning={false}
        title="Изменение заказа"
        closeIcon
      >
        <p className="m-4">Хотите удалить старый заказ?</p>
      </Modal>
    </>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function TabLabel({ children }) {
  return <span className="px-1">{children}</span>;
}
