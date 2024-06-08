import websiteIcon from "assets/icons/website.svg";
import operatorIcon from "assets/icons/operator.svg";
import mobileIcon from "assets/icons/mobile.svg";
import aggregatorIcon from "assets/icons/aggregator.svg";
import telegramIcon from "assets/icons/telegram.png";
import cash from "assets/icons/cash.svg";
import payme from "assets/icons/payme_logo.svg";
import click from "assets/icons/click_logo.svg";
import apelsin from "assets/icons/apelsin.svg";
import bank from "assets/icons/transfer.svg";
import { DirectionsCarRounded as CarIcon, DirectionsWalkRounded, DeliveryDiningRounded, FoodBankRounded } from '@mui/icons-material';

export const payments = [
  {
    type: "cash",
    img: cash,
  },
  {
    type: "payme",
    img: payme,
  },
  {
    type: "click",
    img: click,
  },
  {
    type: "apelsin",
    img: apelsin,
  },
  {
    type: "transfer",
    img: bank,
  },
];
export var initialValues = {
  accommodation: "",
  address_description: '',
  aggregator_id: "",
  apartment: "",
  building: "",
  branch: "", // just for controlling branch values, optimization needed
  client_id: "",
  client_name: "",
  co_delivery_price: 0,
  courier_id: "",
  courier_type_id: "",
  courier_type: "",
  delivery_price: 0,
  destination_address: "",
  discounts: [],
  external_order_id: "",
  external_type: { value: 'yandex', label: 'Яндекс доставка' },
  fare_id: "",
  delivery_time: null,
  delivery_type: "delivery",
  distance: "",
  description: "",
  client_description: "",
  extra_phone_number: "",
  client_phone_number: "",
  floor: "",
  future_time: "", // date and time
  id: "",
  is_cancel_old_order: true,
  is_courier_call: true,
  is_preorder: true,
  is_reissued: false,
  order_amount: 0,
  payment_type: "cash",
  source: "admin_panel",
  status_id: "",
  steps: [
    {
      address: "",
      branch_id: "",
      branch_name: "",
      description: "",
      destination_address: "",
      location: "",
      phone_number: "",
      products: [
        {
          // client_id: "",
          description: "",
          price: "50000",
          product_id: "",
          quantity: 0,
        },
      ],
    },
  ],
  to_address: "",
  to_location: {
    lat: 40.123,
    long: 60.123,
  },
  user_logs: {
    description: "",
  },
  is_yandex_delivery: false,
  yandex_class: { value: "express", label: 'Express' },
  yandex_claim_id: '',
  as_order_delivery_price: true // will not be added to submit data
};
export var steps = [
  {
    id: "ccb62ffb-f0e1-472e-bf32-d130bea90617",
    title: "Оператор принял",
    completed: false,
    time: "",
  },
  {
    id: "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3",
    title: "Филиал принял",
    completed: false,
    time: "",
  },
  {
    id: "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd",
    title: "Филиал подготовил",
    completed: false,
    time: "",
  },
  {
    id: "8781af8e-f74d-4fb6-ae23-fd997f4a2ee0",
    title: "Курьер принял",
    completed: false,
    time: "",
  },
  {
    id: "84be5a2f-3a92-4469-8283-220ca34a0de4",
    title: "Курьер в пути",
    completed: false,
    time: "",
  },
  {
    id: "79413606-a56f-45ed-97c3-f3f18e645972",
    title: "Завершен",
    completed: false,
    time: "",
  },
];
export function getSourceIcon(source) {
  var map = {
    admin_panel: operatorIcon,
    "admin-panel": operatorIcon,
    bot: telegramIcon,
    telegram: telegramIcon,
    website: websiteIcon,
    aggregator: aggregatorIcon,
    android: mobileIcon,
    ios: mobileIcon,
    mobile: mobileIcon,
    app: mobileIcon,
  };

  return map[source];
}
export function deliveryIcon(source) {
  switch (source) {
    case "delivery":
      return <CarIcon color="primary" fontSize="large" />;
    case "self-pickup":
      return <DirectionsWalkRounded color="primary" fontSize="large" />;
    case "hall":
      return <FoodBankRounded color="primary" fontSize="large" />;
    case "external":
      return <DeliveryDiningRounded color="primary" fontSize="large" />;
    default:
      return <DirectionsWalkRounded color="primary" fontSize="large" />;
  }
}
export const paymentTypeIconMake = (type) => {
  switch (type) {
    case "click":
      return click;
    case "payme":
      return payme;
    case "apelsin":
      return apelsin;
    case "cash":
      return cash;
    case "transfer":
      return bank;
    default:
      return "";
  }
};

/* 
1. if aggregator is not found on getCustomer, what to do next?
3. if not to call is selected, validate additional data
4. show table of all comments
5. if (!name) base_price, tariff, disable tariff
6. get list of courier type
*/
