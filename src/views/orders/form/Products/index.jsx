import Card from "components/Card";
import { memo, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import Product from "./Product";
import OrderFormContext from "context/OrderFormContext";
import { AddRounded, AutoAwesomeMotionRounded } from "@mui/icons-material";
import InteractiveMenu from "./InteractiveMenu";
import Button from "components/Button/Buttonv2";

function Products({
  menuId,
  totalPrice,
  orderDetails,
  handleUserLogs,
  setQuantityCheck,
  isOrderEditable,
}) {
  const [isMenu, setMenu] = useState(false);
  const { t } = useTranslation();

  const { cart, dispatch } = useContext(OrderFormContext);

  return (
    <>
      <Card title={t("products")}>
        {cart?.map((product) => (
          <Product
            key={product?.uuid}
            orderDetails={orderDetails}
            menuId={menuId}
            product={product}
            handleUserLogs={handleUserLogs}
            setQuantityCheck={setQuantityCheck}
            isOrderEditable={isOrderEditable}
          />
        ))}
        <div className="mt-4 flex gap-4">
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => {
              dispatch({
                type: "ADD_NEW_PRODUCT",
                payload: {
                  name: "",
                  price: 0,
                  uuid: uuidv4(),
                  quantity: 0,
                  order_modifiers: [],
                  variants: [],
                  comboProducts: [],
                },
              });
            }}
            disabled={!isOrderEditable}
          >
            {t("add.product")}
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeMotionRounded />}
            onClick={() => setMenu(true)}
            disabled={!isOrderEditable}
          >
            {t("interactive_menu")}
          </Button>
        </div>
      </Card>
      <InteractiveMenu
        open={isMenu}
        menuId={menuId}
        fullScreen={true}
        isOrderEditable={isOrderEditable}
        totalPrice={totalPrice}
        orderDetails={orderDetails}
        onClose={() => setMenu(false)}
      />
    </>
  );
}

export default memo(Products);
