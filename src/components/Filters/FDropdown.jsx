import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";
import Card from "../Card";
import { Popover } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { PlacemarkIcon } from "../../constants/icons";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { withStyles } from "@mui/styles";

const StyledMenu = withStyles({
  paper: {
    width: "320px",
    maxHeight: "336px",
    border: "none",
    borderRadius: 6,
    filter: "drop-shadow(0px 16px 40px rgba(0, 0, 0, 0.1))",
  },
})((props) => (
  <Popover
    elevation={0}
    getcontentanchorel={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

export default function FDropdown({
  options = [],
  onClick,
  reset,
  value,
  label,
  icon,
  className = "",
  onChange = undefined,
  filter, // when noone is selected, displays "ALL"
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  let debounce = setTimeout(() => {}, 0);

  useEffect(() => {
    if (options) setItems(options);
  }, []);

  const onSearch = (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      setItems(
        options?.filter((elm) =>
          elm.label.toLowerCase().includes(e.target.value.toLowerCase()),
        ),
      );
      if (onChange) {
        onChange(e);
      }
    }, 300);
  };

  const valueLabel = options?.find((item) => item.value === value);
  return (
    <>
      <div
        className={`h-9 flex items-center gap-2 border px-3 rounded-md cursor-pointer text-sm overflow-ellipsis overflow-hidden whitespace-nowrap justify-between ${className}`}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {icon ? (
          icon
        ) : label === t("couriers") ? null : (
          <PlacemarkIcon
            color={anchorEl || valueLabel ? "var(--primary-color)" : "#aaa"}
          />
        )}
        {valueLabel ? valueLabel.label : filter ? t("all") : label}
        {valueLabel ? (
          <CloseIcon
            fontSize="small"
            onClick={reset}
            style={{ fill: "var(--primary-color)" }}
          />
        ) : (
          <KeyboardArrowDownIcon
            fontSize="medium"
            style={{ fill: anchorEl ? "var(--primary-color)" : "#ccc" }}
          />
        )}
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <Card
          style={{ backgroundColor: "#F7F9FB" }}
          headerStyle={{ padding: "10px 12px" }}
          bodyStyle={{
            padding: 0,
            overflowY: "auto",
            maxHeight: 336 - 56 * 2,
          }}
          title={
            <Input
              placeholder={t("search")}
              size="large"
              addonBefore={
                <SearchIcon
                  style={{ fill: "var(--primary-color)", marginRight: 5 }}
                />
              }
              onChange={onSearch}
            />
          }
        >
          {items?.map((elm, index) => (
            <div
              className={`px-4 py-3 cursor-pointer hover:bg-white ${
                index + 1 === items.length ? "" : "border-b"
              }`}
              onClick={() => {
                onClick(elm.value);
                setAnchorEl(null);
              }}
              key={elm.value}
            >
              {elm.label}
            </div>
          ))}
        </Card>
      </StyledMenu>
    </>
  );
}
