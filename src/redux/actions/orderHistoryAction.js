import { SET_ORDER_DATA } from "redux/constants/table"


export const orderHistoryAction = (data) => {
  return {
    type: SET_ORDER_DATA,
    payload: data
  }
}