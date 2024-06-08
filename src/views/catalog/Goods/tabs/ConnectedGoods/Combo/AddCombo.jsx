import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncSelect from "components/Select/Async";
import { useCallback } from "react";
import { addComboProduct } from "services/v2";
import Modal from "components/Modal";
import { useReducer } from "react";
import { getVariantSimpleProducts, updateCombo } from "services/v2/product";
import AddComboTable from "./AddComboTable";
import AddComboForm from "./AddComboForm";

let initialStates = {
  ru: "",
  uz: "",
  en: "",
  quantity: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "RU":
      return { ...state, ru: action.payload };
    case "EN":
      return { ...state, en: action.payload };
    case "UZ":
      return { ...state, uz: action.payload };
    case "quantity":
      return { ...state, quantity: action.payload };
    case "SET_ALL":
      return { ...action.payload };
    case "RESET":
      return { initialStates };
    default:
      return state;
  }
};

const AddCombo = ({
  params,
  setConnectProductLoading,
  connectProductsModal,
  setConnectProductsModal,
  connectProductLoading,
  closeModal,
  getItems,
  comboExtras,
  setComboExtras,
  comboData,
  setComboData,
}) => {
  const { t } = useTranslation();
  const selectOptions = [
    {
      label: t("simple.combo"),
      value: "combo_basic",
    },
    {
      label: t("group.combo"),
      value: "combo_choose",
    },
  ];
  const [type, setType] = useState(selectOptions[0]);
  const [state, dispatch] = useReducer(reducer, initialStates);
  const IS_TYPE_BASIC = type?.value === "combo_basic";
  const loadProducts = useCallback((input, callback) => {
    getVariantSimpleProducts({
      limit: 20,
      page: 1,
      search: input,
    })
      .then((res) => {
        var products = res?.products?.map((elm) => ({
          label: elm?.title.ru,
          value: elm?.id,
          title: elm.title,
          code: elm.code,
          type: elm.type,
          out_price: elm.out_price,
          description: elm.description,
        }));
        callback(products);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleComboData = (val) => {
    setComboData(val);
  };

  useEffect(() => {
    if (comboExtras) {
      dispatch({ type: "SET_ALL", payload: comboExtras });
      setType(selectOptions.find((el) => el?.value === comboExtras?.type));
    }
  }, [comboExtras]);

  const onModalConfirm = () => {
    setConnectProductLoading(true);
    setComboData([]);

    const data = {
      combo_id: params.id,
      groups: [
        {
          title: {
            ru: state.ru,
            uz: state.uz,
            en: state.en,
          },
          quantity: Number(state.quantity),
          variants: comboData.map((el) => el?.value),
        },
      ],
    };

    const requst =
      comboExtras !== null
        ? updateCombo(params.id, {
            title: {
              ru: state.ru,
              uz: state.uz,
              en: state.en,
            },
            id: state.group_id,
            quantity: state.quantity,
            variants: comboData.map((el) => el.id),
          })
        : addComboProduct(data);
    requst
      .then(() => {
        setConnectProductsModal(false);
        getItems();
      })
      .finally(() => {
        setConnectProductLoading(false);
        setComboExtras(null);
        dispatch({ type: "RESET" });
        setType(selectOptions[0]);
      });
  };

  const handleChangeQuantity = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    dispatch({ type: "quantity", payload: value });
  };

  return (
    <div>
      <Modal
        open={connectProductsModal}
        onConfirm={() => {
          onModalConfirm();
        }}
        onClose={() => {
          setComboData([]);
          closeModal();
          setComboExtras(null);
          dispatch({ type: "RESET" });
          setType(selectOptions[0]);
        }}
        width={1000}
        title={t("add.goods")}
        isWarning={false}
        loading={connectProductLoading}
        confirm={t("save")}
        close={t("cancel")}
      >
        <AddComboForm
          type={type}
          selectOptions={selectOptions}
          setType={setType}
          setComboData={setComboData}
          handleChangeQuantity={handleChangeQuantity}
          state={state}
          dispatch={dispatch}
          t={t}
        />
        <AddComboTable comboData={comboData} t={t} />

        <AsyncSelect
          id="products"
          placeholder={t("products")}
          loadOptions={loadProducts}
          className="mb-8"
          defaultOptions
          isMulti={IS_TYPE_BASIC ? false : true}
          isClearable={IS_TYPE_BASIC ? true : false}
          cacheOptions
          isSearchable
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          onChange={(val) => {
            if (val) {
              handleComboData(IS_TYPE_BASIC ? [{ ...val }] : val);
            } else {
              handleComboData([]);
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default AddCombo;
