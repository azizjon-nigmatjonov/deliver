import { useState } from "react";
import Popover from "@mui/material/Popover";
import styles from "./Popover.module.scss";

export default function BasicPopover({ trigger, disabled, children }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    !disabled && setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div className={`${styles.boxPop} ${disabled ? styles.disabled : ""}`}>
      <div aria-describedby={id} onClick={handleClick}>
        {trigger}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "down",
          horizontal: "down",
        }}
      >
        {children}
      </Popover>
    </div>
  );
}
