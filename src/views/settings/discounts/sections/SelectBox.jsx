// Components
import Card from "components/Card";
import { Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Search from "components/Search";
import { useTranslation } from "react-i18next";

export default function SelectBox({
  state,
  set,
  searchFn,
  title,
  data,
  type,
  radioGroup = false,
  allValue = false,
  setAllValue,
}) {
  const { t } = useTranslation();
  return (
    <Card
      title={title}
      className="mb-4"
      bodyStyle={{ maxHeight: "460px", overflowY: "auto" }}
      extra={
        <Search
          placeholder={type === "clients" ? "search_phone_number" : "search"}
          setSearch={searchFn}
        />
      }
    >
      {setAllValue && (
        <FormControlLabel
          checked={allValue}
          control={<Checkbox color="primary" />}
          onChange={({ target: { checked } }) => setAllValue(checked)}
          style={{
            marginLeft: "0px",
            marginRight: "0px",
            width: "100%",
            justifyContent: "space-between",
            borderBottom: "1px solid #E5E9EB",
          }}
          labelPlacement="start"
          label={t("all")}
        />
      )}
      {!allValue &&
        (radioGroup ? (
          <RadioGroup
            value={state}
            onChange={({ target }) => set(target.value)}
            className="text-sm"
            style={{ flexDirection: "row" }}
          >
            {data?.map((item) => (
              <FormControlLabel
                key={item.id}
                value={item.id}
                control={<Radio color="primary" />}
                style={{
                  marginLeft: "0px",
                  marginRight: "0px",
                  width: "100%",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E5E9EB",
                }}
                labelPlacement="start"
                label={`${type === "product" ? item?.title?.ru : item.name} ${
                  type === "clients" ? `(${item?.phone})` : ""
                }`}
              />
            ))}
          </RadioGroup>
        ) : (
          data?.map((item) => (
            <FormControlLabel
              key={item.id}
              checked={state?.some((el) => el.id === item.id)}
              control={<Checkbox color="primary" />}
              onChange={({ target: { checked } }) =>
                set((prev) =>
                  checked
                    ? [...prev, { id: item.id }]
                    : prev.filter((el) => el.id !== item.id),
                )
              }
              style={{
                marginLeft: "0px",
                marginRight: "0px",
                width: "100%",
                justifyContent: "space-between",
                borderBottom: "1px solid #E5E9EB",
              }}
              labelPlacement="start"
              label={type === "product" ? item?.title?.ru : item.name}
            />
          ))
        ))}
    </Card>
  );
}
