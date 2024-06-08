import { Input } from "alisa-ui";
import InputWithAdornment from "components/inputWithAdornments";
import { useCallback, useContext } from "react";
import OrderFormContext from "context/OrderFormContext";
import Fries from "assets/icons/fries.svg";
import {
  CloseRounded,
  AddRounded,
  RemoveRounded,
  DragHandleRounded,
} from "@mui/icons-material";
import numberToPrice from "helpers/numberToPrice";

const ModifierVariants = ({
  variant,
  modifier,
  parentKey,
  parentQuantity,
  handleUserLogs,
}) => {
  const { cart, dispatch } = useContext(OrderFormContext);

  const onModifierMaxAmount = useCallback(
    (uuid, variant_id) => {
      if (modifier.total_amount === modifier.max_amount) {
        for (const product of cart) {
          if (uuid === product.uuid) {
            let calculatedPrice = modifier.total_price || 0;
            let variantResults = [];
            let isChanged = false;

            for (const item of modifier.variants) {
              if (
                item.parent_id === modifier.modifier_id &&
                item.modifier_id !== variant_id &&
                item.modifier_quantity > 0 &&
                !isChanged
              ) {
                calculatedPrice = !modifier.add_to_price
                  ? (modifier.total_price || 0) -
                    Number(item?.modifier_price || 0) +
                    Number(variant?.modifier_price)
                  : modifier.total_price;

                isChanged = true;
                variantResults.push({
                  ...item,
                  modifier_quantity: item.modifier_quantity - 1,
                });
              } else if (
                item.parent_id === modifier.modifier_id &&
                item.modifier_id === variant_id
              ) {
                variantResults.push({
                  ...item,
                  modifier_quantity:
                    item.modifier_quantity < modifier.max_amount
                      ? item.modifier_quantity + 1
                      : item.modifier_quantity,
                });
              } else {
                variantResults.push(item);
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
    [
      cart,
      dispatch,
      modifier.total_price,
      modifier.variants,
      modifier.add_to_price,
      modifier.max_amount,
      modifier.modifier_id,
      modifier.total_amount,
      variant?.modifier_price,
    ],
  );

  const decrement = () => {
    handleUserLogs({ name: "Продукт" });
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
          uuid: parentKey,
        },
      });
    }
  };

  const increment = () => {
    handleUserLogs({ name: "Продукт" });
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
          uuid: parentKey,
        },
      });
    } else {
      onModifierMaxAmount(parentKey, variant.modifier_id);
    }
  };

  return (
    <div style={{ marginLeft: "82px" }} className="flex gap-2 mb-4 items-end">
      <div style={{ width: "368px" }}>
        <Input
          value={variant.modifier_name}
          prefix={<img src={Fries} alt="modifier" />}
          readOnly
        />
      </div>
      <div className="amount_wrap">
        <InputWithAdornment
          className="border border-lightgray-1 rounded-md justify-between"
          style={{
            container: { height: "34px" },
            input: { width: "40px" },
          }}
          prefix={
            <button
              type="button"
              className="text-primary h-full w-8 text-center border-r"
              onClick={decrement}
            >
              <RemoveRounded fontSize="small" />
            </button>
          }
          suffix={
            <button
              type="button"
              className="text-primary h-full w-8 text-center border-l"
              onClick={increment}
            >
              <AddRounded fontSize="small" />
            </button>
          }
          min={1}
          value={
            variant.modifier_quantity *
            (modifier.send_as_product ? 1 : parentQuantity)
          }
          type="number"
          readOnly
        />
      </div>
      <div>
        <CloseRounded className="text-primary mb-1" />
      </div>
      <div>
        <Input
          value={numberToPrice(variant.modifier_price)}
          style={{ width: "140px" }}
          readOnly
        />
      </div>
      <div>
        <DragHandleRounded className="text-primary mb-1" />
      </div>
      <div>
        <Input
          value={numberToPrice(
            variant.modifier_price *
              variant.modifier_quantity *
              (modifier.send_as_product ? 1 : parentQuantity),
          )}
          style={{ width: "140px" }}
          readOnly
        />
      </div>
      {/* <div className="w-2/12">
          <Input
            type="text"
            placeholder={t("description")}
            onChange={(e) => descriptionHandler(e, i)}
          />
        </div>
        <Tag
          color={modifier.is_compulsory ? "gray" : "red"}
          size="large"
          shape="subtle"
          className="cursor-pointer self-end"
        >
          <DeleteIcon
            style={{
              color: modifier.is_compulsory ? "gray" : "red",
            }}
            disabled={modifier.is_compulsory}
            onClick={() => handleRemoveVarinatProduct(i, modifier.modifier_id)}
          />
        </Tag> */}
    </div>
  );
};

export default ModifierVariants;
