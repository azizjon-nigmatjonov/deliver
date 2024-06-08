import OrderFormContext from "context/OrderFormContext";
import { useCallback, useContext, useEffect, useState } from "react";
import ModifierCheckbox from "../ModifierCheckbox";
import { FormControlLabel, Menu, Radio, RadioGroup } from "@mui/material";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

function EditPopover({ product, anchorEl, open, handleClose }) {
  const [currentVariant, setCurrentVariant] = useState([]);

  const { t } = useTranslation();
  const { cart, dispatch } = useContext(OrderFormContext);
  // Combo actions below
  useEffect(() => {
    if (!currentVariant.length && product?.type === "combo")
      setCurrentVariant(product?.variants);
  }, [product?.variants, product?.type, currentVariant?.length]);
  const onRadioChange = (group_id, variant_id, variant_name) => {
    setCurrentVariant((prevState) =>
      prevState.map((el) =>
        el.group_id === group_id ? { ...el, variant_id, variant_name } : el,
      ),
    );
  };
  const setToContext = () => {
    if (product?.type === "combo")
      dispatch({
        type: "SET_COMBO_VARIANTS",
        payload: {
          uuid: product.uuid,
          variants: currentVariant,
        },
      });
  };
  // Combo actions above

  // Modifier functions below
  const modifierQuantityHandler = (modifierId, variantId) => {
    const modifier = product?.order_modifiers?.find(
      (item) => item.modifier_id === modifierId,
    );
    if (variantId) {
      const variant = modifier?.variants?.find(
        (item) => item.modifier_id === variantId,
      );
      return variant?.modifier_quantity;
    } else {
      return modifier?.modifier_quantity;
    }
  };

  const checkModifierHandler = (modifierId, variantId) => {
    const modifier = product?.order_modifiers?.find(
      (item) => item.modifier_id === modifierId,
    );
    if (variantId) {
      const variant = modifier?.variants?.find(
        (item) => item.modifier_id === variantId,
      );
      return variant?.modifier_quantity > 0;
    } else {
      return modifier?.modifier_quantity > 0;
    }
  };

  const onModifierChange = (checked, modifier) => {
    // handleUserLogs({ name: "Продукт" });
    if (modifier.is_single && !modifier.is_compulsory) {
      let result = product.order_modifiers?.map((item) =>
        item.modifier_id === modifier.modifier_id
          ? { ...item, modifier_quantity: checked ? item.min_amount || 1 : 0 }
          : item,
      );
      dispatch({
        type: "SET_MODIFIERS",
        payload: {
          uuid: product.uuid,
          modifiers: result,
        },
      });
    }
  };

  const decrement = (modifier) => {
    // handleUserLogs({ name: "Продукт" });
    if (modifier.is_single) {
      if (
        modifier.modifier_quantity > (modifier?.min_amount || 0) ||
        (modifier.send_as_product && modifier.modifier_quantity > 0)
      ) {
        dispatch({
          type: "DECREMENT_MODIFIER",
          payload: {
            uuid: product.uuid,
            modifier_id: modifier.modifier_id,
            modifier_price: modifier.modifier_price,
            add_to_price: modifier.add_to_price,
          },
        });
      }
    }
  };

  const increment = (modifier) => {
    // handleUserLogs({ name: "Продукт" });
    if (modifier.is_single) {
      if (
        modifier.modifier_quantity < modifier?.max_amount ||
        modifier.send_as_product
      ) {
        dispatch({
          type: "INCREMENT_MODIFIER",
          payload: {
            uuid: product.uuid,
            modifier_id: modifier.modifier_id,
            modifier_price: modifier.modifier_price,
            add_to_price: modifier.add_to_price,
          },
        });
      }
    }
  };

  const onModifierMaxAmount = useCallback(
    (uuid, modifier, variant) => {
      if (modifier.total_amount === modifier.max_amount) {
        for (const product of cart) {
          if (uuid === product.uuid) {
            let calculatedPrice = modifier.total_price || 0;
            let variantResults = [];
            let isChanged = false;

            for (const modifier_variant of modifier.variants) {
              if (
                modifier_variant.parent_id === modifier.modifier_id &&
                modifier_variant.modifier_id !== variant?.modifier_id &&
                modifier_variant.modifier_quantity > 0 &&
                !isChanged
              ) {
                calculatedPrice = !modifier.add_to_price
                  ? (modifier.total_price || 0) -
                    Number(modifier_variant?.modifier_price || 0) +
                    Number(variant?.modifier_price)
                  : modifier.total_price;

                isChanged = true;
                variantResults.push({
                  ...modifier_variant,
                  modifier_quantity: modifier_variant.modifier_quantity - 1,
                });
              } else if (
                modifier_variant.parent_id === modifier.modifier_id &&
                modifier_variant.modifier_id === variant?.modifier_id
              ) {
                variantResults.push({
                  ...modifier_variant,
                  modifier_quantity:
                    modifier_variant.modifier_quantity < modifier.max_amount
                      ? modifier_variant.modifier_quantity + 1
                      : modifier_variant.modifier_quantity,
                });
              } else {
                variantResults.push(modifier_variant);
              }
            }
            dispatch({
              type: "SET_MODIFIER_VARIANTS",
              payload: {
                uuid,
                modifier_id: modifier.modifier_id,
                add_to_price: modifier.add_to_price,
                modifier_price: calculatedPrice,
                variants: variantResults,
              },
            });
          }
        }
      }
    },
    [cart, dispatch],
  );

  const onGroupModifierChange = (checked, modifier, variant) => {
    if (checked) {
      if (
        modifier.modifier_quantity < modifier.max_amount &&
        modifier.modifier_quantity !== modifier.max_amount
      ) {
        let calculatedPrice = !modifier.add_to_price
          ? (modifier.total_price || 0) + Number(variant?.modifier_price)
          : modifier.total_price;
        let variantResults = modifier.variants?.map((item) =>
          item.modifier_id === variant.modifier_id
            ? { ...item, modifier_quantity: modifier.min_amount || 1 }
            : item,
        );
        dispatch({
          type: "SET_MODIFIER_VARIANTS",
          payload: {
            uuid: product.uuid,
            modifier_id: modifier.modifier_id,
            add_to_price: modifier.add_to_price,
            modifier_price: calculatedPrice,
            variants: variantResults,
          },
        });
      } else onModifierMaxAmount(product.uuid, modifier, variant);
    } else {
      if (
        modifier.is_compulsory &&
        (modifier.modifier_quantity === modifier.min_amount ||
          modifier.modifier_quantity - variant.modifier_quantity <
            modifier.min_amount)
      ) {
        return;
      } else {
        let calculatedPrice = !modifier.add_to_price
          ? (modifier.total_price || 0) -
            Number(variant?.modifier_price) * variant?.modifier_quantity
          : modifier.total_price;
        let variantResults = modifier.variants?.map((item) =>
          item.modifier_id === variant.modifier_id
            ? { ...item, modifier_quantity: 0 }
            : item,
        );
        dispatch({
          type: "SET_MODIFIER_VARIANTS",
          payload: {
            uuid: product.uuid,
            modifier_id: modifier.modifier_id,
            add_to_price: modifier.add_to_price,
            modifier_price: calculatedPrice,
            variants: variantResults,
          },
        });
      }
    }
  };

  const decrementVariant = (modifier, variant) => {
    // handleUserLogs({ name: "Продукт" });
    if (
      (modifier.total_amount > modifier.min_amount ||
        (modifier.send_as_product && modifier.total_amount > 0)) &&
      variant.modifier_quantity > 0
    ) {
      dispatch({
        type: "DECREMENT_MODIFIER_VARIANT",
        payload: {
          parent_id: variant.parent_id,
          add_to_price: variant.add_to_price,
          modifier_price: variant.modifier_price,
          modifier_id: variant.modifier_id,
          uuid: product.uuid,
        },
      });
    }
  };

  const incrementVariant = (modifier, variant) => {
    // handleUserLogs({ name: "Продукт" });
    if (
      modifier.total_amount < modifier.max_amount ||
      modifier.send_as_product
    ) {
      dispatch({
        type: "INCREMENT_MODIFIER_VARIANT",
        payload: {
          parent_id: variant.parent_id,
          add_to_price: variant.add_to_price,
          modifier_price: variant.modifier_price,
          modifier_id: variant.modifier_id,
          min_amount: modifier.min_amount,
          uuid: product.uuid,
        },
      });
    } else {
      onModifierMaxAmount(product.uuid, modifier, variant);
    }
  };
  // Modifier functions above

  return (
    <Menu
      anchorEl={anchorEl}
      id="cart-item-edit"
      open={open}
      onClose={() => {
        setToContext();
        handleClose();
      }}
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
        {product?.comboProducts?.length > 0 &&
          currentVariant.length > 0 &&
          product?.comboProducts?.map((group, idx) => (
            <div key={group.id} className={styles.option_group}>
              <h4>{group.title?.ru}</h4>
              <RadioGroup
                aria-labelledby={group.title?.ru}
                name={group.title?.ru}
                value={currentVariant[idx].variant_id}
                onChange={(e) =>
                  onRadioChange(group.id, e.target.value, e.target.id)
                }
              >
                {group?.variants.map((variant) =>
                  group?.type === "combo_basic" ? (
                    <div key={variant.id}>
                      <FormControlLabel
                        value={variant.id}
                        control={
                          <Radio
                            color="primary"
                            size="small"
                            sx={{ color: "var(--lightgray-2)" }}
                            disableRipple
                          />
                        }
                        label={variant.title?.ru}
                        className={styles.option}
                      />
                      <span>x {group.quantity}</span>
                    </div>
                  ) : (
                    <div key={variant.id}>
                      <FormControlLabel
                        value={variant.id}
                        control={
                          <Radio
                            color="primary"
                            size="small"
                            id={variant.title?.ru}
                            sx={{ color: "var(--lightgray-2)" }}
                            disableRipple
                          />
                        }
                        label={variant.title?.ru}
                        className={styles.option}
                      />
                      <span>x {group.quantity}</span>
                    </div>
                  ),
                )}
              </RadioGroup>
            </div>
          ))}
        {product?.order_modifiers?.map((modifier) =>
          !modifier?.variants?.length ? (
            <div
              key={modifier.modifier_id + product.uuid}
              className={styles.single_modifier}
            >
              <h4>{modifier.category_name?.ru}</h4>
              <ModifierCheckbox
                checked={checkModifierHandler(modifier?.modifier_id)}
                quantity={
                  modifierQuantityHandler(modifier?.modifier_id) *
                  product?.quantity
                }
                name={modifier?.modifier_name?.ru}
                onChange={({ target }) =>
                  onModifierChange(target.checked, modifier)
                }
                label={modifier?.modifier_name?.ru}
                outPrice={modifier.modifier_price}
                isCompulsory={modifier.is_compulsory}
                decrease={() => decrement(modifier)}
                increase={() => increment(modifier)}
                single
              />
            </div>
          ) : (
            <div
              key={modifier.modifier_id + product.uuid}
              className={styles.modifier_group}
            >
              <div className={styles.modifier_group__title}>
                <h4>{modifier.modifier_name?.ru}</h4>
                {modifier?.is_compulsory && <p>{t("required")}</p>}
              </div>
              {modifier?.variants?.map((variant) => (
                <div key={variant.modifier_id}>
                  <ModifierCheckbox
                    checked={checkModifierHandler(
                      modifier.modifier_id,
                      variant?.modifier_id,
                    )}
                    quantity={
                      modifierQuantityHandler(
                        modifier.modifier_id,
                        variant?.modifier_id,
                      ) * product?.quantity
                    }
                    name={variant.modifier_name}
                    onChange={({ target }) =>
                      onGroupModifierChange(target.checked, modifier, variant)
                    }
                    label={variant.modifier_name}
                    outPrice={variant.modifier_price}
                    decrease={() => decrementVariant(modifier, variant)}
                    increase={() => incrementVariant(modifier, variant)}
                  />
                </div>
              ))}
            </div>
          ),
        )}
      </div>
    </Menu>
  );
}

export default EditPopover;
