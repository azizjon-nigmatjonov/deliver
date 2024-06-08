import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "../Button/IconButton";
import clickIcon from "assets/icons/image 5.png";
import apelsinIcon from "assets/icons/apelsin.png";
import paymeIcon from "assets/icons/image 4.png";
import "./style.scss";
import { changePayment } from "services/payment";
import { sendSms } from "services/send-sms";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    list: {
      padding: "0",
    },
  }),
);

export default function ActionMenu({
  record,
  isInOrders = false,
  actions = [],
  id,
  paymentType,
  children,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClick = (event, id) => {
    event.stopPropagation();
    setAnchorEl({
      element: event.currentTarget,
      id,
    });
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const payments = [
    {
      type: "apelsin",
      img: apelsinIcon,
    },
    {
      type: "payme",
      img: paymeIcon,
    },
    {
      type: "click",
      img: clickIcon,
    },
  ];
  function changePaymentTypeHandler(type) {
    dispatch(showAlert("successfully_updated", "success"));
    const body = {
      payment_type: type,
    };
    changePayment(body, id).then((res) => {
      console.log(res);
    });
    sendSms({
      order_id: record.id,
      payment_type: type,
      phone: record.client_phone_number,
    });
  }

  return (
    <div className="ActionMenu">
      {children ? (
        <div onClick={(event) => handleClick(event, id)}>{children}</div>
      ) : (
        <Button
          className="btn__action"
          color="primary"
          aria-controls="simple-menu"
          disabled={!actions?.length}
          onClick={(event) => handleClick(event, id)}
        >
          <MoreHorizIcon />
        </Button>
      )}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl?.element}
        open={anchorEl?.id === id}
        onClose={handleClose}
        classes={{ list: classes.list }}
        // style={{ padding: 0 }}
      >
        {isInOrders && paymentType !== "cash" && (
          <div
            style={{
              borderBottom: "1px solid #E5E9EB",
              padding: "8px 16px 8px 8px",
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            {payments.map((item) => (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  changePaymentTypeHandler(item.type);
                }}
                key={item.type}
                classNameForIcon="w-16 px-2"
                icon={<img src={item.img} alt="click" />}
              />
            ))}
          </div>
        )}
        {actions?.length > 0 &&
          actions?.map((elm) => (
            <MenuItem
              key={elm.title}
              style={{
                borderBottom: "1px solid #E5E9EB",
                padding: "8px 16px 8px 8px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                elm?.action(id, e);
                handleClose(e);
              }}
            >
              <IconButton color={elm.color} icon={elm.icon} />
              <span className="ml-2">{elm.title}</span>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
