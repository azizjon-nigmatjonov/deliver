import React, { useState, useContext, useEffect } from "react";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import InputWithAdornment from "components/inputWithAdornments";
import ModifierVariants from "./ModifierVariants";
import Fries from "assets/icons/fries.svg";
import {
  AddRounded,
  CloseRounded,
  DragHandleRounded,
  KeyboardArrowRight,
  RemoveRounded,
} from "@mui/icons-material";
import OrderFormContext from "context/OrderFormContext";
import numberToPrice from "helpers/numberToPrice";

const ModifiersComponent = ({
  modifier,
  parentKey,
  parentQuantity,
  handleUserLogs,
  setQuantityCheck,
}) => {
  const [isVariantsOpen, setIsVariantsOpen] = useState(false);
  const { dispatch } = useContext(OrderFormContext);

  const { t } = useTranslation();

  const decrement = () => {
    handleUserLogs({ name: "Продукт" });
    if (modifier.is_single) {
      if (
        modifier.modifier_quantity > (modifier?.min_amount || 0) ||
        (modifier.send_as_product && modifier.modifier_quantity > 0)
      ) {
        dispatch({
          type: "DECREMENT_MODIFIER",
          payload: {
            uuid: parentKey,
            modifier_id: modifier.modifier_id,
            modifier_price: modifier.modifier_price,
            add_to_price: modifier.add_to_price,
          },
        });
      }
    }
  };

  const increment = () => {
    handleUserLogs({ name: "Продукт" });
    if (modifier.is_single) {
      if (
        modifier?.modifier_quantity < modifier?.max_amount ||
        modifier.send_as_product
      ) {
        dispatch({
          type: "INCREMENT_MODIFIER",
          payload: {
            uuid: parentKey,
            modifier_id: modifier.modifier_id,
            modifier_price: modifier.modifier_price,
            add_to_price: modifier.add_to_price,
          },
        });
      }
    }
  };

  useEffect(() => {
    setQuantityCheck(
      modifier?.is_compulsory &&
        (!modifier.is_single
          ? modifier?.total_amount * parentQuantity
          : modifier?.modifier_quantity * parentQuantity) /
          parentQuantity <
          (modifier?.min_amount || 0)
        ? true
        : false,
    );
  }, [modifier]);

  return (
    <>
      <div className="flex gap-2 mb-4 items-end w-full">
        <div
          style={{
            width: "25px",
            borderBottom: "2px solid #D5DADD",
          }}
          className="mb-4"
        />
        <div style={{ width: modifier.is_single ? "417px" : "375px" }}>
          <span className="input-label mb-1">
            {modifier.is_compulsory && <span style={{ color: "red" }}>*</span>}
            {modifier?.modifier_name?.ru}{" "}
            {modifier.is_single ? `(модификатор)` : `(группа модификаторов)`}
          </span>
          <Input
            value={modifier?.modifier_name?.ru}
            prefix={<img src={Fries} alt="combo" />}
            className="w-12/14"
            required={modifier.is_compulsory}
            readOnly
          />
        </div>
        {!modifier.is_single && (
          <div
            className="border border-lightgray-1 rounded-md p-1"
            onClick={() => setIsVariantsOpen((prevState) => !prevState)}
          >
            <KeyboardArrowRight
              style={{
                color: "#B0BABF",
                transform: isVariantsOpen ? "rotate(90deg)" : "rotate(0deg)",
                cursor: "pointer",
                transition: "150ms linear",
              }}
            />
          </div>
        )}
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
            value={
              (modifier.is_single
                ? modifier?.modifier_quantity
                : modifier?.total_amount) *
              (modifier.send_as_product ? 1 : parentQuantity)
            }
            readOnly
          />
          <div
            style={{
              color: "red",
              fontSize: "12px",
              lineHeight: "13px",
            }}
          >
            {modifier?.is_compulsory &&
              (!modifier.is_single
                ? modifier?.total_amount
                : modifier?.modifier_quantity) < (modifier?.min_amount || 0) &&
              !modifier.send_as_product &&
              t("amount.must.more")}
          </div>
        </div>
        <div>
          <CloseRounded className="text-primary mb-1" />
        </div>
        <div>
          <Input
            value={numberToPrice(
              modifier.is_single ? modifier?.modifier_price : 0,
            )}
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
              !modifier.add_to_price
                ? (modifier.is_single
                    ? modifier?.modifier_price * modifier?.modifier_quantity
                    : modifier?.total_price) *
                    (modifier.send_as_product ? 1 : parentQuantity)
                : 0,
            )}
            style={{ width: "140px" }}
            readOnly
          />
        </div>
        {modifier.add_to_price && (
          <div className="text-primary text-xs">
            ({t("not_included_in_the_total_price")})
          </div>
        )}

        {/* <div className="w-2/12">
          <Input
            type="text"
            placeholder={t("description")}
            onChange={(e) => descriptionHandler(e, i)}
          />
        </div> */}
        {/* <Tag
          color={modifier.is_compulsory ? "gray" : "red"}
          size="large"
          shape="subtle"
          className="cursor-pointer"
        >
          <DeleteIcon
            style={{
              color: modifier.is_compulsory ? "gray" : "red",
            }}
            disabled={modifier.is_compulsory}
            onClick={() => handleRemoveVarinatProduct(i, modifier.modifier_id)} // if you wanna deleting function to combo product, just uncomment this line
          />
        </Tag> */}
      </div>
      {isVariantsOpen &&
        modifier?.variants?.map((variant) => (
          <ModifierVariants
            key={variant?.modifier_id + modifier.modifier_id + parentKey}
            variant={variant}
            modifier={modifier}
            parentKey={parentKey}
            parentQuantity={parentQuantity}
            handleUserLogs={handleUserLogs}
          />
        ))}
    </>
  );
};

export default ModifiersComponent;
