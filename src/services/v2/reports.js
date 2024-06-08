import request_v2 from "utils/axios_v2";

const reportServices = {
  products: (params) =>
    request_v2({ method: "get", url: `/reports/products`, params }),
  product_predict_report: (params) =>
    request_v2({ method: "get", url: `/reports/product_predict_report`, params }),
  order_daily_report: (params) =>
    request_v2({ method: "get", url: `/reports/order-daily-report`, params }),
  products_by_branch: (params) =>
    request_v2({ method: "get", url: `/reports/products-by-branch`, params })
}

export default reportServices