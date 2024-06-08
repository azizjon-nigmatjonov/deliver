import CardTab from "components/CardTab";
import KitchenCard from "components/KitchenCard";
import React from "react";

const KitchenProducts = ({ kitchenData, kitchenTabData }) => {
  return (
    <div className="bg-white m-4 rounded-md">
      <div className="grid grid-cols-4 gap-2 p-2">
        <div
          className="col-span-1"
          style={{
            backgroundColor: "#EEF0F2",
            height: "fit-content",
          }}
        >
          <CardTab
            count={kitchenData?.new_orders?.length}
            bgColor={kitchenTabData.new.color}
            title={kitchenTabData.new.title}
          />
          <div className="mt-4"> </div>
          <div className="w-full  overflow-hidden overflow-y-auto">
            {kitchenData?.new_orders?.map((elm) => (
              <KitchenCard
                key={elm.id}
                orderId={elm.external_order_id}
                orderAmount={elm.order_amount}
                products={elm?.steps[0]?.products}
                buttonType="new_orders"
                paymentType={elm.payment_type}
                orderType={elm.delivery_type}
                elm={elm}
              />
            ))}
          </div>
        </div>
        <div
          className="col-span-1"
          style={{
            backgroundColor: "#EEF0F2",
            height: "fit-content",
          }}
        >
          <CardTab
            count={kitchenData?.accepted_orders?.length}
            bgColor={kitchenTabData.work_process.color}
            title={kitchenTabData.work_process.title}
          />
          <div className="mt-4"> </div>
          <div className="w-full  overflow-hidden overflow-y-auto">
            {kitchenData?.accepted_orders?.map((elm) => (
              <KitchenCard
                key={elm.id}
                orderId={elm.external_order_id}
                orderAmount={elm.order_amount}
                products={elm?.steps[0]?.products}
                buttonType="work_process"
                paymentType={elm.payment_type}
                orderType={elm.delivery_type}
                elm={elm}
              />
            ))}
          </div>
        </div>
        <div
          className="col-span-1"
          style={{
            backgroundColor: "#EEF0F2",
            height: "fit-content",
          }}
        >
          <>
            <CardTab
              count={kitchenData?.ready_orders?.length}
              bgColor={kitchenTabData.ready.color}
              title={kitchenTabData.ready.title}
            />
            <div className="mt-4"> </div>
            <div className="w-full  overflow-hidden overflow-y-auto">
              {kitchenData?.ready_orders?.map((elm) => (
                <KitchenCard
                  key={elm.id}
                  orderId={elm.external_order_id}
                  orderAmount={elm.order_amount}
                  products={elm?.steps[0]?.products}
                  buttonType="ready"
                  paymentType={elm.payment_type}
                  orderType={elm.delivery_type}
                  elm={elm}
                />
              ))}
            </div>
          </>
        </div>
        <div
          className="col-span-1"
          style={{
            backgroundColor: "#EEF0F2",
            height: "fit-content",
          }}
        >
          <CardTab
            count={kitchenData?.courier_pickedup_orders?.length}
            bgColor={kitchenTabData.courierOnTheWay.color}
            title={kitchenTabData.courierOnTheWay.title}
          />
          <div className="mt-4"> </div>
          <div className="w-full overflow-hidden overflow-y-auto">
            {kitchenData?.courier_pickedup_orders?.map((elm) => (
              <KitchenCard
                key={elm.id}
                orderId={elm.external_order_id}
                orderAmount={elm.order_amount}
                products={elm?.steps[0]?.products}
                paymentType={elm.payment_type}
                orderType={elm.delivery_type}
                elm={elm}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenProducts;
