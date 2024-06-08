import {
  AddRounded,
  CloseRounded,
  DragHandleRounded,
  RemoveRounded,
} from "@mui/icons-material";
import ComboIcon from "../../../../assets/icons/combo-icon.svg";
import { Input } from "alisa-ui";
import Select, { customStyles } from "components/Select";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import InputWithAdornment from "components/inputWithAdornments";
import OrderFormContext from "context/OrderFormContext";
import numberToPrice from "helpers/numberToPrice";

function ComboVariant({ product, combo, handleUserLogs }) {
  const { t } = useTranslation();
  const { dispatch } = useContext(OrderFormContext);

  const loadProductVariants = useCallback(() => {
    return combo.variants?.map((el) => ({
      label: el?.title?.ru,
      value: el?.id,
      group_id: combo.id,
      quantity: combo.quantity,
    }));
  }, [combo.id, combo.variants, combo.quantity]);

  const selectVariantProduct = (val) => {
    dispatch({
      type: "SET_COMBO_VARIANTS",
      payload: {
        uuid: product?.uuid,
        variants: product?.variants?.map((el) =>
          el.group_id === val.group_id
            ? { ...el, variant_id: val.value, variant_name: val.label }
            : el,
        ),
      },
    });
  };

  // const handleRemoveVarinatProduct = (index, product_id) => {
  //   setSelectedProducts((prev) => {
  //     return prev?.map((el, idx) => {
  //       if (idx === index) {
  //         return {
  //           ...el,
  //           variants: el?.variants?.filter(
  //             (elm) => elm.product_id !== product_id,
  //           ),
  //           comboProducts: el?.comboProducts?.filter(
  //             (comboProduct) => comboProduct.id !== product_id,
  //           ),
  //         };
  //       } else {
  //         return el;
  //       }
  //     });
  //   });
  // };

  return (
    <div
      key={combo.id + product?.uuid}
      style={{ marginLeft: "-1px" }}
      className={`flex gap-2 mb-4 items-end`}
    >
      <div
        style={{
          width: "25px",
          borderBottom: "2px solid #D5DADD",
        }}
        className="mb-4"
      />
      <div style={{ width: "417px" }}>
        {combo?.variants?.length < 2 ? (
          <>
            <span className="input-label mb-1">{combo?.title?.ru}</span>
            <Input
              className="w-full"
              value={combo?.variants[0]?.title?.ru}
              prefix={<img src={ComboIcon} alt="combo" />}
              readOnly
            />
          </>
        ) : (
          <>
            <span className="input-label mb-1 w-full">
              <span style={{ color: "red" }}>*</span>
              {combo?.title?.ru}
            </span>
            <Select
              id="variantProduct"
              value={{
                label: product?.variants?.find((el) => el.group_id === combo.id)
                  ?.variant_name,
                value: product?.variants?.find((el) => el.group_id === combo.id)
                  ?.variant_id,
              }}
              placeholder={t("name")}
              isSearchable
              onChange={(val) => {
                selectVariantProduct(val);
                handleUserLogs({ name: "Продукт" });
              }}
              options={loadProductVariants()}
              styles={customStyles({
                control: (base, state) => ({
                  ...base,
                  minHeight: "2rem",
                  height: "2rem",
                  border: "1px solid #E5E9EB",
                }),
                indicatorSeparator: (base, state) => ({
                  ...base,
                  height: "1rem",
                }),
                showClearIcons: "false",
                containerValue: true,
              })}
              containerValue={ComboIcon}
              required={true}
            />
          </>
        )}
      </div>
      <div className="amount_wrap">
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
              disabled
            >
              <RemoveRounded fontSize="small" />
            </button>
          }
          suffix={
            <button
              type="button"
              className="text-primary h-full w-8 text-center border-l"
              disabled
            >
              <AddRounded fontSize="small" />
            </button>
          }
          value={combo.quantity * product.quantity}
          readOnly
        />
      </div>
      <div>
        <CloseRounded className="text-primary mb-1" />
      </div>
      <div>
        <Input value={numberToPrice(0)} style={{ width: "140px" }} readOnly />
      </div>
      <div>
        <DragHandleRounded className="text-primary mb-1" />
      </div>
      <div>
        <Input value={numberToPrice(0)} style={{ width: "140px" }} readOnly />
      </div>
      {/* <div className="w-2/12">
                    <Input
                      type="text"
                      placeholder={t("description")}
                      onChange={(e) => descriptionHandler(e, i)}
                    />
                  </div>
                  <Tag
                    color="red"
                    size="large"
                    shape="subtle"
                    className="cursor-pointer self-end"
                  >
                    <DeleteRounded
                      style={{ color: "red" }}

                      // onClick={() => handleRemoveVarinatProduct( combo.id)} // if you wanna deleting function to combo product, just uncomment this line
                    />
                  </Tag> */}
    </div>
  );
}

export default ComboVariant;
