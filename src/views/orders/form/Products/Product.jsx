import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CloseRounded,
  Delete,
  UpdateRounded,
  AddRounded,
  RemoveRounded,
  DragHandleRounded,
} from "@mui/icons-material";
import { Input } from "alisa-ui";
import AsyncSelect from "components/Select/Async";
import Select from "components/Select";
import Tag from "components/Tag";
import ModifiersComponent from "./Modifiers/ModifiersComponent";
import InputWithAdornment from "components/inputWithAdornments";
import OrderFormContext from "context/OrderFormContext";
import { getModifiers } from "services/v2/modifier";
import { getComboProduct, getNonOriginModifierProducts } from "services/v2";
import ComboVariant from "./ComboVariant";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { useDiscountsList } from "services/v2/discounts";
import numberToPrice from "helpers/numberToPrice";
import { useParams } from "react-router-dom";

function Product({
  product,
  menuId,
  handleUserLogs,
  setQuantityCheck,
  orderDetails,
  isOrderEditable,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchDiscount, setSearchDiscount] = useState("");
  const [discountOptions, setDiscountOptions] = useState(null);
  const { cart, dispatch } = useContext(OrderFormContext);
  const { t } = useTranslation();
  const { shipper_id } = useSelector((state) => state.auth);
  const params = useParams();

  const totalModifierPrice = useMemo(() => {
    let sum = 0;
    if (cart?.length > 0) {
      if (product?.order_modifiers?.length > 0) {
        for (const modifier of product?.order_modifiers) {
          if (!modifier.add_to_price) {
            sum += modifier?.is_single
              ? Number(modifier?.modifier_quantity) *
                Number(modifier?.modifier_price)
              : Number(modifier?.total_price);
          }
        }
      }
    }
    return sum;
  }, [cart, product?.order_modifiers]);

  const TOTAL_PRICE = useMemo(
    () => product?.price + (product?.discount_price || 0) + totalModifierPrice,
    [product?.discount_price, product?.price, totalModifierPrice],
  );

  useEffect(() => {
    dispatch({
      type: "SET_COMPUTED_PRICE",
      payload: {
        uuid: product.uuid,
        computed_price: TOTAL_PRICE,
      },
    });
  }, [TOTAL_PRICE, product.uuid, dispatch]);

  // This effect for menu of products.
  // When MENU changes, we re-render the select component
  useEffect(() => {
    if (menuId === null || menuId) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 200);
    }
  }, [menuId]);

  // use these to make kolichestvo divisible
  const validateCount = (event, isDivisible) => {
    // if (
    //   /!(isDivisible || /[0-9]/.test(event.key) || event.key === "Backspace")
    // ) {
    //   event.preventDefault();
    // } else if (
    //   isDivisible &&
    //   /!/[0-9]/.test(event.key) &&
    //   event.key !== "." &&
    //   event.key !== "Backspace"
    // ) {
    //   event.preventDefault();
    // }

    if (!isDivisible && (event.key === "." || event.key === ",")) {
      event.preventDefault();
    }
  };

  // Get product modifiers
  const getProductModifiers = (id) => {
    id &&
      getModifiers({ product_id: id })
        .then((res) => {
          let result = [];
          // let initialModifiersPrice = 0;
          let groupTotalPrice = 0;
          if (res?.product_modifiers?.single_modifiers) {
            for (const element of res?.product_modifiers?.single_modifiers) {
              result.push({
                add_to_price: element.add_to_price,
                category_name: element.category_name,
                is_compulsory: element.is_compulsory || false,
                is_single: true,
                modifier_id: element.id,
                modifier_name: element.name,
                modifier_quantity: element.min_amount || 0,
                modifier_price: element.price ? element.price : 0,
                max_amount: element.max_amount,
                min_amount: element.min_amount || 0,
                send_as_product: element.send_as_product,
              });
              if (
                element.is_compulsory &&
                element.price &&
                !element.add_to_price
              ) {
                // initialModifiersPrice +=
                //   element.price * (element.min_amount || 1);
              }
            }
          }
          if (res?.product_modifiers?.group_modifiers) {
            for (const element of res?.product_modifiers?.group_modifiers) {
              if (element?.variants?.length > 0 && !element?.add_to_price) {
                for (const [idx, variant] of element?.variants?.entries()) {
                  if (element?.is_compulsory && idx === 0) {
                    if (variant?.out_price) {
                      // initialModifiersPrice +=
                      //   variant.out_price * (element.min_amount || 1);
                      groupTotalPrice +=
                        variant.out_price * (element.min_amount || 1);
                    }
                  }
                }
              }

              result.push({
                modifier_id: element.id,
                modifier_name: element.name,
                max_amount: element.max_amount,
                modifier_quantity: element?.min_amount || 0,
                min_amount: element?.min_amount || 0,
                modifier_price: element.price ? element.price : 0,
                is_single: false,
                add_to_price: element.add_to_price,
                is_compulsory: element.is_compulsory || false,
                send_as_product: element.send_as_product,
                total_amount: element.is_compulsory
                  ? element.min_amount || 0
                  : 0,
                total_price: groupTotalPrice,
                variants: element?.variants?.map((el, idx) => ({
                  modifier_id: el.id,
                  modifier_name: el.title?.ru,
                  modifier_quantity:
                    element.is_compulsory && idx === 0
                      ? element?.min_amount || 0
                      : 0,
                  modifier_price: el.out_price ? el.out_price : 0,
                  parent_id: element.id,
                  add_to_price: element.add_to_price,
                })),
              });
            }
          }
          dispatch({
            type: "SET_MODIFIERS",
            payload: {
              uuid: product.uuid,
              modifiers: result,
              // extraPrice: initialModifiersPrice,
            },
          });
        })
        .catch((error) => error);
  };

  const getComboVariants = (id) => {
    getComboProduct(id)
      .then((res) => {
        let variants = [];
        res?.groups?.forEach((group) => {
          if (group.type === "combo_basic") {
            variants.push({
              group_id: group?.id,
              variant_id: group.variants[0]?.id,
              variant_name: group?.variants[0].title?.ru,
            });
          }
        });
        dispatch({
          type: "SET_COMBO_&_VARIANTS",
          payload: {
            uuid: product.uuid,
            comboProducts: res?.groups,
            variants: variants,
          },
        });
      })
      .catch((error) => console.log(error));
  };

  const loadProducts = useCallback(
    (input, cb) => {
      getNonOriginModifierProducts({
        limit: 50,
        page: 1,
        search: input,
        active: true,
        menu_id: menuId ? menuId : "",
      })
        .then((res) => {
          let products = res?.products?.map((product) => ({
            label:
              menuId && !product.active_in_menu ? (
                <>
                  <UpdateRounded style={{ color: "#F8C51B" }} />
                  {product.to_time
                    ? moment(product.to_time).format("DD/MM/YYYY HH:mm")
                    : t("in_the_stop_list")}{" "}
                  <span style={{ color: "#30394052", fontWeight: 400 }}>
                    ({product.title.ru})
                  </span>
                </>
              ) : (
                <>
                  {product.title?.ru} ({product.out_price} {t("uzb.sum")})
                </>
              ),
            value: product.id,
            product_id: product.id,
            name: product.title.ru,
            price: product.out_price,
            is_divisible: product.is_divisible,
            type: product.type,
            has_modifier: product.has_modifier,
            isDisabled: menuId && !product.active_in_menu,
            uuid: uuidv4(),
          }));

          cb(products);
        })
        .catch((err) => console.log(err));
    },
    [t, menuId],
  );

  useDiscountsList({
    shipper_id,
    params: {
      page: 1,
      limit: 10,
      search: searchDiscount,
      is_only_active: true,
      order_sources: orderDetails.source || "admin_panel",
      branch_ids: orderDetails.branch?.value
        ? orderDetails.branch?.value
        : undefined,
      only_delivery:
        orderDetails.delivery_type === "delivery" ||
        orderDetails.delivery_type === "external",
      only_self_pickup: orderDetails.delivery_type === "self-pickup",
      product_ids: product.product_id ? product.product_id : undefined,
      discount_for: "product",
      client_id: orderDetails.client_id,
      is_new_client: !orderDetails.client_id,
    },
    props: {
      enabled: isOrderEditable,
      onSuccess: (res) => {
        let discounts = res?.discounts?.map((discount) => ({
          label: discount.name?.ru,
          value: discount.id,
          amount: discount.amount,
          mode: discount.mode,
          type: discount.type,
          priority: discount.priority,
          isFixed: discount.is_automatic_adding,
        }));
        setDiscountOptions(discounts);

        const autoAddings = discounts?.filter((v) => v.isFixed) || [];
        if (params.id && product.discounts?.length > 0) {
          const uniqueIds = (
            autoAddings
              ? [...autoAddings, ...product.discounts]
              : product.discounts
          )?.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.value === value.value),
          );
          dispatch({
            type: "SET_PRODUCT_DISCOUNTS",
            payload: {
              uuid: product.uuid,
              discounts: orderOptions(uniqueIds),
            },
          });
        } else {
          dispatch({
            type: "SET_PRODUCT_DISCOUNTS",
            payload: {
              uuid: product.uuid,
              discounts: autoAddings,
            },
          });
        }
      },
    },
  });

  const orderOptions = (values) => {
    return values
      ?.filter((v) => v?.isFixed)
      .concat(values?.filter((v) => !v?.isFixed));
  };

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
    dispatch({
      type: "SET_PRODUCT_DISCOUNTS",
      payload: { uuid: product.uuid, discounts: orderOptions(newValue) },
    });
    handleUserLogs({ name: "Продукт" });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {/* {(product?.order_modifiers?.length > 0 ||
          product?.comboProducts?.length > 0) && (
          <div
            className="border border-lightgray-1 rounded-md mt-7 p-1"
            onClick={() => setIsChildrenVisible((prevState) => !prevState)}
          >
            <KeyboardArrowRight
              style={{
                color: "#B0BABF",
                transfrom: isChildrenVisible ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </div>
        )} */}
        <div className="w-1/4">
          <span className="input-label mb-1">{t("name")}</span>
          <AsyncSelect
            value={{ label: product?.name, value: product?.product_id }}
            placeholder={t("name")}
            onChange={(val) => {
              dispatch({
                type: "SELECT_PRODUCT",
                payload: {
                  ...val,
                  uuid: product.uuid,
                  computed_price: 0,
                  label: undefined,
                  value: undefined,
                },
              });
              val?.has_modifier && getProductModifiers(val?.value);
              val?.type === "combo" && getComboVariants(val?.value);
              handleUserLogs({ name: "Продукт" });
            }}
            defaultOptions={isOrderEditable}
            isDisabled={!isOrderEditable}
            isSearchable
            loadOptions={loadProducts}
            maxMenuHeight={330}
            error={product.in_stop}
            errorText={
              product.in_stop ? (
                <>
                  Товар включен в стоп-лист
                  <span style={{ float: "right" }}>03/04/2023 20:45</span>
                </>
              ) : (
                ""
              )
            }
          />
        </div>
        <div className="amount_wrap w-1/12">
          <span className="input-label mb-1">{t("amount")}</span>
          <InputWithAdornment
            className="border border-lightgray-1 rounded-md justify-between"
            style={{
              container: { height: "34px" },
              input: { flex: 1 },
            }}
            prefix={
              <button
                type="button"
                className="text-primary h-full w-8 text-center border-r"
                onClick={() => {
                  if (isOrderEditable) {
                    product?.quantity > 1 &&
                      dispatch({ type: "DECREMENT", payload: product?.uuid });
                    handleUserLogs({ name: "Продукт" });
                  }
                }}
              >
                <RemoveRounded fontSize="small" />
              </button>
            }
            suffix={
              <button
                type="button"
                className="text-primary h-full w-8 text-center border-l"
                onClick={(e) => {
                  if (isOrderEditable) {
                    dispatch({ type: "INCREMENT", payload: product?.uuid });
                    handleUserLogs({ name: "Продукт" });
                  }
                }}
              >
                <AddRounded fontSize="small" />
              </button>
            }
            min={0.00001}
            value={product?.quantity}
            onChange={({ target: { value } }) =>
              value >= 0 &&
              dispatch({
                type: "SET_QUANTITY",
                payload: { uuid: product?.uuid, quantity: value },
              })
            }
            // mask="999999999"
            type="number"
            onKeyDown={(event) => validateCount(event, product?.is_divisible)}
            onWheel={(e) => e.target.blur()}
          />
        </div>
        <div>
          <CloseRounded className="text-primary mt-8" />
        </div>
        <div>
          <span className="input-label mb-1">{t("price")}</span>
          <Input
            value={numberToPrice(product?.price + product?.discount_price)}
            style={{ width: "140px" }}
            readOnly
          />
        </div>
        <div>
          <DragHandleRounded className="text-primary mt-8" />
        </div>
        <div className="w-2/12">
          <span className="input-label mb-1">{t("total.cost")}</span>
          <Input
            value={numberToPrice(
              (product?.price + product?.discount_price + totalModifierPrice) *
                product.quantity,
            )}
            readOnly
          />
        </div>
        <div className="w-2/12">
          <span className="input-label mb-1">{t("description")}</span>
          <Input
            type="text"
            value={product?.description}
            placeholder={t("description")}
            onChange={({ target: { value } }) => {
              dispatch({
                type: "DESCRIPTION",
                payload: { uuid: product?.uuid, description: value },
              });
              handleUserLogs({ name: "Продукт" });
            }}
            disabled={!isOrderEditable}
          />
        </div>
        <div className="w-1/4">
          <span className="input-label mb-1">{t("discount")}</span>
          <Select
            value={product.discounts}
            options={discountOptions}
            isSearchable
            isMulti
            onInputChange={(val) => setSearchDiscount(val)}
            placeholder={t("discount")}
            onChange={onChange}
            dropdownIndicator={false}
            disabled={!isOrderEditable}
          />
        </div>
        {isOrderEditable && (
          <Tag
            color="error"
            lightMode={true}
            size="large"
            shape="subtle"
            className={`cursor-pointer ${
              product.in_stop ? "self-center" : "self-end"
            }`}
          >
            <Delete
              onClick={() => {
                dispatch({ type: "REMOVE", payload: product?.uuid });
                handleUserLogs({ name: "Продукт" });
              }}
              style={{ color: "red" }}
            />
          </Tag>
        )}
      </div>
      {(product?.order_modifiers?.length > 0 ||
        product?.comboProducts?.length > 0) && (
        <div className="flex">
          <div
            className="ml-4"
            style={{
              height: "100",
              borderLeft: "2px solid #D5DADD",
            }}
          />
          <div className="w-full">
            {product?.comboProducts?.map((combo) => (
              <ComboVariant
                key={combo?.id + combo?.combo_id + product?.uuid}
                combo={combo}
                handleUserLogs={handleUserLogs}
                product={product}
              />
            ))}

            {product?.order_modifiers?.map((modifier) => (
              <ModifiersComponent
                key={modifier?.modifier_id + product?.uuid}
                parentKey={product?.uuid}
                modifier={modifier}
                parentQuantity={product?.quantity}
                handleUserLogs={handleUserLogs}
                setQuantityCheck={setQuantityCheck}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
