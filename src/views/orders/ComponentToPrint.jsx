const ComponentToPrint = ({ orderForPrint, t, componentRef }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: " 24px",
        gap: "10px",
        height: "90vh",
        paddingBottom: "60px",
        maxWidth: "390px",
        width: "100%",
      }}
      id="print_bill"
      ref={componentRef}
    >
      <img
        src={
          orderForPrint?.shipper_logo ||
          "https://test.cdn.delever.uz/delever/d39344ba-dfbd-4c5a-9668-4edccbe00931"
        }
        alt="customer"
        style={{
          width: "260px",
          height: "160px",
          objectFit: "contain",
          alignSelf: "center",
        }}
      />
      <p style={{ textAlign: "center" }}>
        <span style={{ fontWeight: "600" }}> {t("order")} №: </span>
        {orderForPrint.external_order_id}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <p style={{ fontSize: "14px" }}>
          <span style={{ fontWeight: "600" }}>{t("client")}: </span>
          {orderForPrint.client_name}
        </p>
        <p style={{ fontSize: "14px" }}>
          <span style={{ fontWeight: "600" }}>{t("phone.number")}: </span>
          {orderForPrint.client_phone_number}
        </p>

        <p style={{ fontSize: "14px" }}>
          <span style={{ fontWeight: "600" }}>{t("address")}: </span>
          {orderForPrint.to_address}
        </p>
        <p style={{ fontSize: "14px" }}>
          <span style={{ fontWeight: "600" }}>{t("operator.accepted")}: </span>
          {orderForPrint.operator_accepted_at}
        </p>
        <p style={{ fontSize: "14px" }}>
          <span style={{ fontWeight: "600" }}>{t("payment.type")}: </span>
          {t(orderForPrint.payment_type)}
        </p>
        <p style={{ fontSize: "14px" }}>
          <span style={{ fontWeight: "600" }}>{t("delivery.type")}: </span>
          {t(orderForPrint.delivery_type)}
        </p>
        {orderForPrint?.description && (
          <p style={{ fontSize: "14px" }}>
            <span style={{ fontWeight: "600" }}>Комментарии к заказу: </span>
            {orderForPrint?.description}
          </p>
        )}
      </div>
      <table
        style={{
          border: "none",
          borderCollapse: "separate",
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
          borderTopStyle: "dashed",
          borderBottomStyle: "dashed",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "none",
                textAlign: "left",
                fontSize: "13px",
                padding: "5px 0 5px 0",
              }}
            >
              Название
            </th>
            <th
              style={{
                border: "none",
                textAlign: "center",
                fontSize: "13px",
                width: '40px',
                padding: "5px 0 5px 0",
              }}
            >
              К-во
            </th>
            <th
              style={{
                border: "none",
                textAlign: "center",
                fontSize: "13px",
                width: '50px',
                padding: "5px 0 5px 0",
              }}
            >
              Цена
            </th>
            <th
              style={{
                border: "none",
                textAlign: "right",
                fontSize: "13px",
                padding: "5px 0 5px 0",
              }}
            >
              Сумма
            </th>
          </tr>
        </thead>
        <tbody>
          {orderForPrint?.steps &&
            orderForPrint?.steps[0]?.products?.map((el) => (
              <tr key={el.id}>
                <td
                  style={{
                    border: "none",
                    textAlign: "left",
                    fontSize: "13px",
                    padding: "5px 0 5px 0",
                  }}
                >
                  {el.name}
                  {el.description && (
                    <>
                      <br />({el.description})
                    </>
                  )}
                </td>
                <td
                  style={{
                    border: "none",
                    textAlign: "center",
                    fontSize: "13px",
                    padding: "5px 0 5px 0",
                  }}
                >
                  x{el.quantity}
                </td>
                <td
                  style={{
                    border: "none",
                    textAlign: "center",
                    fontSize: "13px",
                    padding: "5px 0 5px 0",
                  }}
                >
                  {el.price}
                </td>
                <td
                  style={{
                    border: "none",
                    textAlign: "right",
                    fontSize: "13px",
                    padding: "5px 0 5px 0",
                  }}
                >
                  {el.total_amount}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "14px" }}>Общее кол-во</p>
          <p style={{ fontSize: "14px" }}>
            {orderForPrint?.steps && orderForPrint?.steps[0]?.products?.length}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "14px" }}>Сумма продукта</p>{" "}
          <p style={{ fontSize: "14px" }}> {orderForPrint.order_amount}</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "14px" }}>Цена доставки</p>{" "}
          <p style={{ fontSize: "14px" }}> {orderForPrint.delivery_price}</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "14px" }}>Итого к оплате</p>
          <p style={{ fontSize: "14px" }}>
            {orderForPrint?.steps &&
              orderForPrint?.steps[0]?.step_amount +
                orderForPrint?.delivery_price}
          </p>
        </div>
      </div>
      <h4
        style={{
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Спасибо за заказ!
      </h4>
    </div>
  );
};

export default ComponentToPrint;
