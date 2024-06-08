import TwoMoneyIcon from "assets/icons/two-money.svg";
import TwoMoneyIconWhite from "assets/icons/white-money.svg";
import ApelsinIcon from "assets/icons/apelsin-icon.svg";
import ClickIcon from "assets/icons/click.svg";
import PaymeIcon from "assets/icons/payme.svg";
import CarType from "assets/icons/car_type.svg";
import CarTypeWhite from "assets/icons/car_type_white.svg";
import SelfPickupType from "assets/icons/self_pickup_type.svg";
import SelfPickupTypeWhite from "assets/icons/self_pickup_type_white.svg";

export const showPaymentType = (type) => {
  switch (type) {
    case "apelsin":
      return ApelsinIcon;
    case "click":
      return ClickIcon;
    case "payme":
      return PaymeIcon;
    case "cash_white":
      return TwoMoneyIconWhite;
    default:
      return TwoMoneyIcon;
  }
};

export const showOrderType = (orderType) => {
  if (orderType === "delivery") {
    return CarType;
  } else if (orderType === "delivery_white") { return CarTypeWhite; } else if (orderType === "self-pickup_white") { return SelfPickupTypeWhite; } else return SelfPickupType;
};
