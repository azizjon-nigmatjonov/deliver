import React from "react";
import { Input } from "alisa-ui";
import Select from "components/Select";
import { memo } from "react";
const AddComboForm = ({
  type,
  selectOptions,
  setType,
  setComboData,
  handleChangeQuantity,
  state,
  dispatch,
  t,
}) => {
  return (
    <>
      <div className="flex mb-4">
        <div className="w-2/6 mr-4">
          <div className="input-label">
            <span>{t("type")}</span>
          </div>
          <Select
            value={type}
            options={selectOptions}
            placeholder={t("type")}
            onChange={(val) => {
              setType(val);
              setComboData([]);
            }}
          />
        </div>
        <div className="w-1/6">
          <div className="input-label">
            <span>{t("quantity")}</span>
          </div>

          <Input
            placeholder={t("quantity")}
            value={state.quantity}
            onChange={(e) => handleChangeQuantity(e)}
          />
        </div>
      </div>
      <div className="flex w-full justify-between mb-4">
        <div className="w-4/6 mr-2">
          <div className="input-label">
            <span>Название группы</span>
          </div>
          <Input
            value={state.ru}
            onChange={(e) => dispatch({ type: "RU", payload: e.target.value })}
          />
        </div>
        <div className="w-4/6 mr-2">
          <div className="input-label">
            <span>Group name</span>
          </div>
          <Input
            value={state.en}
            onChange={(e) => dispatch({ type: "EN", payload: e.target.value })}
          />
        </div>
        <div className="w-4/6">
          <div className="input-label">
            <span>Guruh nomi</span>
          </div>
          <Input
            value={state.uz}
            onChange={(e) => dispatch({ type: "UZ", payload: e.target.value })}
          />
        </div>
      </div>
    </>
  );
};

export default memo(AddComboForm);
