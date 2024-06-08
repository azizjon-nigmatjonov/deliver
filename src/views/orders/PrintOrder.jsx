import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "./ComponentToPrint";

const PrintOrder = ({ orderForPrint }) => {
  const { t } = useTranslation();
  const componentRef = useRef(null);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, []);

  const reactToPrintTrigger = useCallback(() => {
    return (
      <div
        style={{
          padding: "10px 24px",
          // position: "absolute",
          // bottom: "0",
          borderTop: "1px solid #e5e5e5",
          maxWidth: "390px",
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <button
          style={{
            padding: "10px 0",
            width: "100%",
            backgroundColor: "#0d72f6",
            color: "#fff",
            fontWeight: "500",
            borderRadius: "6px",
          }}
        >
          Распечатать
        </button>
      </div>
    );
  }, []);

  return (
    <div
      style={{
        maxWidth: "390px",
        width: "100%",
        height: "100vh",
      }}
    >
      <h1 style={{ fontWeight: "600", padding: "16px" }}>{t("print")}</h1>
      <hr />
      <ComponentToPrint
        orderForPrint={orderForPrint}
        t={t}
        componentRef={componentRef}
      />
      <ReactToPrint
        content={reactToPrintContent}
        trigger={() => reactToPrintTrigger()}
        documentTitle="cheque"
      />
    </div>
  );
};

export default PrintOrder;
