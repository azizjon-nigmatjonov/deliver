import TwoMoneyIcon from "assets/icons/two-money.svg";
import ApelsinIcon from "assets/icons/apelsin-icon.svg";
import ClickIcon from "assets/icons/click.svg";
import PaymeIcon from "assets/icons/payme.svg";
import CarType from "assets/icons/car_type.svg";
import SelfPickupType from "assets/icons/self_pickup_type.svg";
import WhiteMoney from "assets/icons/white-money.svg";
import CarTypeWhite from "assets/icons/car_type_white.svg";
import SelfPickupTypeWhite from "assets/icons/self_pickup_type_white.svg";

export const showPaymentType = (type, isServerCancelled) => {
  switch (type) {
    case "apelsin":
      return ApelsinIcon;
    case "click":
      return ClickIcon;
    case "payme":
      return PaymeIcon;
    case isServerCancelled && "cash":
      return WhiteMoney;
    default:
      return TwoMoneyIcon;
  }
};

export const showOrderType = (orderType, isServerCancelled) => {
  if (orderType === "delivery" && !isServerCancelled) {
    return CarType;
  } else if (orderType === "delivery" && isServerCancelled) {
    return CarTypeWhite;
  } else if (isServerCancelled && orderType === "self-pickup") {
    return SelfPickupTypeWhite;
  } else return SelfPickupType;
};
