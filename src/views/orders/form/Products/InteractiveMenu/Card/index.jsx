import { useContext, useEffect, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import numberToPrice from "helpers/numberToPrice";
import { v4 as uuidv4 } from "uuid";
import OrderFormContext from "context/OrderFormContext";
import { useModifiers } from "services/v2/modifier";
import {
  onModifierChange,
  onGroupModifierChange,
  onIncreaseModifierQuantity,
  onIncreaseModifierVariantQuantity,
  onDecreaseModifierQuantity,
  onDecreaseModifierVariantQuantity,
} from "utils/orderModifierActions";
import ModifierCheckbox from "../ModifierCheckbox";
import Button from "components/Button/Buttonv2";
import classNames from "classnames";

function Card({ product, unavailable }) {
  const [productModifiers, setProductModifiers] = useState([]);
  const [orderModifiers, setOrderModifiers] = useState([]);
  const [modifiersPrice, setModifiersPrice] = useState(0);
  const [modifiersQuantity, setModifiersQuantity] = useState([]);
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (product.has_modifier) {
      setAnchorEl(event.currentTarget);
    } else addToCart();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { t } = useTranslation();
  const { cart, dispatch } = useContext(OrderFormContext);
  // menuId && !product.active_in_menu

  const { data: modifiers } = useModifiers({
    params: {
      product_id: product.id,
    },
    props: {
      enabled: open && product.has_modifier,
      onSuccess: (res) => {
        let compulsory_modifiers = [];
        let firstGroupItems = [];
        if (res?.product_modifiers?.single_modifiers) {
          res?.product_modifiers?.single_modifiers?.forEach((modifier) => {
            if (modifier.is_compulsory)
              compulsory_modifiers.push({
                modifier_id: modifier?.id,
                modifier_price: +modifier?.price,
                modifier_quantity: modifier?.min_amount || 1,
                parent_id: "",
              });
          });
        }
        // Select the first ones of group modifiers, save group modifiers id & min_amount to state
        if (res?.product_modifiers?.group_modifiers) {
          let modifiersQuantityMock = [];
          res?.product_modifiers?.group_modifiers?.forEach((group) => {
            modifiersQuantityMock.push({
              id: group.id,
              quantity: group.min_amount || 1,
            });
            let firstGroupItem = {};
            group?.variants?.forEach((variant, idx) => {
              if (idx === 0)
                firstGroupItem = {
                  modifier_id: variant?.id,
                  modifier_price: +variant?.out_price,
                  modifier_quantity: group?.min_amount || 1,
                  parent_id: group?.id,
                };
            });
            firstGroupItems.push(firstGroupItem);
          });
          setModifiersQuantity(modifiersQuantityMock);
        }
        setOrderModifiers([...firstGroupItems, ...compulsory_modifiers]);
        setProductModifiers(res?.product_modifiers);
      },
    },
  });

  const addToCart = () => {
    cart[0]?.uuid === "first_product" &&
      dispatch({
        type: "REMOVE",
        payload: "first_product",
      });
    let uuid = uuidv4();
    dispatch({
      type: "ADD_NEW_PRODUCT",
      payload: {
        product_id: product.id,
        name: product.title.ru,
        price: product.out_price,
        is_divisible: product.is_divisible,
        type: product.type,
        has_modifier: product.has_modifier,
        uuid,
        quantity: 1,
        order_modifiers: [],
        variants: [],
        comboProducts: [],
      },
    });
    onSetModifiers(uuid);
    handleClose();
  };
  // Modifier functions below
  // Setting modifiers to product in cart in from one to another structure
  const onSetModifiers = (uuid) => {
    let result = [];
    let modifierTotalPrice = 0;
    let groupTotalPrice = 0;
    if (productModifiers?.single_modifiers) {
      for (const modifier of productModifiers?.single_modifiers) {
        const orderModifier = checkModifierHandler(modifier.id);
        let modifier_quantity = orderModifier
          ? orderModifier.modifier_quantity
          : 0;
        modifierTotalPrice +=
          (modifier?.price ? modifier.price : 0) * modifier_quantity;
        result.push({
          add_to_price: modifier.add_to_price,
          category_name: modifier.category_name,
          is_compulsory: modifier.is_compulsory || false,
          is_single: true,
          modifier_id: modifier.id,
          modifier_name: modifier.name,
          modifier_quantity,
          modifier_price: modifier.price ? modifier.price : 0,
          max_amount: modifier.max_amount,
          min_amount: modifier.min_amount || 0,
          send_as_product: modifier.send_as_product,
        });
      }
    }
    if (productModifiers?.group_modifiers) {
      for (const modifier of productModifiers?.group_modifiers) {
        let variants = [];
        let total_amount = 0;
        if (modifier?.variants?.length > 0) {
          for (const variant of modifier?.variants) {
            const orderVariant = checkModifierHandler(variant.id);
            let modifier_quantity = orderVariant
              ? orderVariant?.modifier_quantity
              : 0;
            total_amount += modifier_quantity;
            groupTotalPrice +=
              (variant?.out_price ? variant.out_price : 0) * modifier_quantity;
            variants.push({
              modifier_id: variant.id,
              modifier_name: variant.title?.ru,
              modifier_quantity,
              modifier_price: variant.out_price ? variant.out_price : 0,
              parent_id: modifier.id,
              add_to_price: modifier.add_to_price,
            });
          }
        }

        result.push({
          modifier_id: modifier.id,
          modifier_name: modifier.name,
          max_amount: modifier.max_amount,
          modifier_quantity: total_amount,
          min_amount: modifier?.min_amount || 0,
          modifier_price: modifier.price ? modifier.price : 0,
          is_single: false,
          add_to_price: modifier.add_to_price,
          is_compulsory: modifier.is_compulsory,
          send_as_product: modifier.send_as_product,
          total_amount,
          total_price: groupTotalPrice,
          variants,
        });
      }
    }
    dispatch({
      type: "SET_MODIFIERS",
      payload: {
        uuid,
        modifiers: result,
      },
    });
    dispatch({
      type: "SET_COMPUTED_PRICE",
      payload: {
        uuid,
        computed_price:
          product?.price +
          (product?.discount_price || 0) +
          modifierTotalPrice +
          groupTotalPrice,
      },
    });
  };
  const modifierQuantityHandler = (modifierId) => {
    if (isOrderedModifierHandler(modifierId)) {
      let elementQuantity = 0;
      for (const item of product?.order_modifiers) {
        item.modifier_id === modifierId &&
          (elementQuantity = item.modifier_quantity);
      }

      return elementQuantity;
    }
    const element = orderModifiers.find(
      (item) => item.modifier_id === modifierId,
    );
    return element?.modifier_quantity ?? 0;
  };
  const checkModifierHandler = (modifierId) => {
    const element = orderModifiers.find(
      (item) => item.modifier_id === modifierId,
    );
    return element ? element : isOrderedModifierHandler(modifierId);
  };
  const isOrderedModifierHandler = (modifierId) => {
    if (product?.order_modifiers?.length > 0) {
      let isIncluded = false;
      for (const item of product?.order_modifiers) {
        item.modifier_id === modifierId && (isIncluded = true);
      }

      return isIncluded;
    }
  };

  // Get total price of modifiers
  useEffect(() => {
    if (orderModifiers) {
      let sum = 0;
      for (const modifier of orderModifiers) {
        sum += modifier.modifier_price * modifier.modifier_quantity;
      }
      setModifiersPrice(sum);
    }
  }, [orderModifiers]);
  // Filter order modifiers (modifier price == 0 && remove from state)
  useEffect(() => {
    if (orderModifiers.length > 0) {
      const filteredState = orderModifiers.filter(
        (item) => item.modifier_quantity !== 0,
      );
      setOrderModifiers(filteredState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifiersQuantity]);
  // Modifier functions above

  // Calculate discounts total price
  useEffect(() => {
    if (product?.discounts) {
      let sum = 0;
      for (const discount of product.discounts) {
        sum += discount.discount_price;
      }
      setTotalDiscountPrice(sum);
    }
  }, [product.discounts]);

  return (
    <>
      <div
        className={classNames(styles.card, {
          [styles.active]: open,
          [styles.unavailable]: unavailable,
        })}
      >
        <img
          src={`${process.env.REACT_APP_MINIO_URL}/${
            product.image || "f1bedaa2-2682-4fe1-9564-05a31aa66852"
          }`}
          alt={product?.title?.ru}
          className={styles.image}
        />
        <div className={styles.content}>
          <h3>{product?.title?.ru}</h3>
          <div className={styles.action}>
            {unavailable ? (
              <p>{t("in_the_stop_list")}</p>
            ) : (
              <>
                <div className={styles.price}>
                  {product?.discounts?.length > 0 && (
                    <span>{numberToPrice(product?.out_price, "")}</span>
                  )}
                  <p>
                    {numberToPrice(
                      product?.out_price + totalDiscountPrice,
                      t("uzb.sum"),
                    )}
                  </p>
                </div>
                <IconButton onClick={handleClick}>
                  <AddShoppingCartRoundedIcon color="primary" />
                </IconButton>
              </>
            )}
          </div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: "353px",
            padding: "8px 16px",
            overflow: "visible",
            borderRadius: "16px",
            filter: "drop-shadow(0px 12px 24px rgba(91, 104, 113, 0.24))",
            mt: 1.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className={styles.popover_body}>
          {modifiers?.product_modifiers?.single_modifiers &&
            modifiers?.product_modifiers?.single_modifiers.map((modifier) => (
              <div
                key={modifier.id + modifier.from_product_id}
                className={styles.single_modifier}
              >
                <h4>{modifier.category_name?.ru}</h4>
                <ModifierCheckbox
                  checked={checkModifierHandler(modifier?.id)}
                  quantity={modifierQuantityHandler(modifier?.id)}
                  name={modifier.name["en"]}
                  onChange={({ target }) =>
                    onModifierChange(
                      target.checked,
                      modifier,
                      setOrderModifiers,
                    )
                  }
                  label={modifier.name?.ru}
                  outPrice={modifier.price}
                  notAddtoPrice={modifier.add_to_price}
                  isCompulsory={modifier.is_compulsory}
                  decrease={() =>
                    onDecreaseModifierQuantity(
                      modifier,
                      orderModifiers,
                      setOrderModifiers,
                    )
                  }
                  increase={() =>
                    onIncreaseModifierQuantity(
                      modifier,
                      orderModifiers,
                      setOrderModifiers,
                    )
                  }
                  single
                />
              </div>
            ))}
          {modifiers?.product_modifiers?.group_modifiers &&
            modifiers?.product_modifiers?.group_modifiers.map((modifier) => (
              <div
                key={modifier.id + modifier.from_product_id}
                className={styles.modifier_group}
              >
                <div className={styles.modifier_group__title}>
                  <h4>{modifier.name?.ru}</h4>
                  {modifier?.is_compulsory && <p>{t("required")}</p>}
                </div>
                {modifier?.variants?.map((variant) => (
                  <div key={variant.id}>
                    <ModifierCheckbox
                      checked={checkModifierHandler(variant?.id)}
                      quantity={modifierQuantityHandler(variant?.id)}
                      name={variant.title["en"]}
                      onChange={({ target }) =>
                        onGroupModifierChange(
                          target.checked,
                          variant,
                          modifier,
                          orderModifiers,
                          setOrderModifiers,
                          modifiersQuantity,
                          setModifiersQuantity,
                        )
                      }
                      label={variant.title?.ru}
                      outPrice={variant.out_price}
                      notAddtoPrice={modifier.add_to_price}
                      decrease={() =>
                        onDecreaseModifierVariantQuantity(
                          variant,
                          modifier,
                          orderModifiers,
                          setOrderModifiers,
                          modifiersQuantity,
                          setModifiersQuantity,
                        )
                      }
                      increase={() =>
                        onIncreaseModifierVariantQuantity(
                          variant,
                          modifier,
                          orderModifiers,
                          setOrderModifiers,
                          modifiersQuantity,
                          setModifiersQuantity,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>
        <Button
          variant="contained"
          onClick={() => addToCart()}
          fullWidth={true}
          style={{ justifyContent: "space-between", mt: 2 }}
        >
          {product?.discounts?.length > 0 && (
            <small>
              <strike>
                {numberToPrice(product?.out_price + modifiersPrice, t("sum"))}
              </strike>
            </small>
          )}{" "}
          <span>{t("add")}</span>
          {numberToPrice(
            product?.out_price + modifiersPrice + totalDiscountPrice,
            t("uzb.sum"),
          )}
        </Button>
      </Menu>
    </>
  );
}

export default Card;
