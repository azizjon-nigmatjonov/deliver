import React, { useCallback } from "react";
import { Input } from "alisa-ui";
import AsyncSelect from "components/Select/Async";
import { getCrmDiscounts } from "services/v2/rkeeper_discounts";
import { useTranslation } from "react-i18next";

const AddAllowance = ({ data, setData, branchId }) => {
  const { t } = useTranslation();

  const loadBranches = useCallback(
    (input, cb) => {
      getCrmDiscounts({
        search: input,
        crm_type: "rkeeper",
        branch_id: branchId,
      })
        .then((response) => {
          let discounts = response?.discounts?.map((discount) => ({
            label: discount.name,
            value: discount.code,
            branch_id: discount.branch_id,
          }));
          cb(discounts);
        })
        .catch((error) => console.log(error));
    },
    [branchId],
  );

  return (
    <div className="flex items-center mb-8 gap-4">
      <Input
        placeholder={t("sum")}
        value={data.price}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            price: e.target.value,
          }))
        }
        className="w-full"
      />
      <AsyncSelect
        id="aggregator-select"
        defaultOptions
        cacheOptions
        isSearchable
        isClearable
        onChange={(val) =>
          setData((prev) => ({
            ...prev,
            rkeeper: val,
          }))
        }
        value={data.rkeeper}
        loadOptions={loadBranches}
        placeholder={t("allowances")}
        menuPortalTarget={document.body}
        className="w-full"
      />
    </div>
  );
};

export default AddAllowance;
