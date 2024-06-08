import { useState } from "react";
import { Popover, IconButton } from "@mui/material";
import Card from "../../components/Card";
import styles from "./style.module.scss";
import { FilterFlagIcon } from "constants/icons";
import { withStyles } from "@mui/styles";

const StyledMenu = withStyles({
  paper: {
    width: "170px",
    maxHeight: "336px",
    border: "1px solid #ccc",
    borderRadius: 3,
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

export default function FilterFlagDropdown({
  options = [],
  onClick,
  value,
  className = "",
  setUser,
  filter, // when noone is selected, displays "ALL"
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <div
        className={`${styles.Wrapper} ${className}`}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <IconButton>
          <FilterFlagIcon />
        </IconButton>
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <Card
          style={{ backgroundColor: "#F7F9FB", padding: "8px" }}
          headerStyle={{ padding: "10px 12px" }}
          bodyStyle={{
            padding: 0,
            overflowY: "auto",
            maxHeight: 336 - 56 * 2,
          }}
        >
          {options &&
            options?.map((elm, index) => (
              <div
                className={`${styles.Items} ${
                  index + 1 === options.length ? "" : styles.bordered
                } ${value[0]?.value === elm?.value ? styles.selected : ""}`}
                onClick={() => {
                  onClick([elm]);
                  setAnchorEl(null);
                }}
                key={elm.id}
              >
                {elm.label}
              </div>
            ))}
        </Card>
      </StyledMenu>
    </>
  );
}
