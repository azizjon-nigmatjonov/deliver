import { createContext, useMemo, useReducer } from 'react'
import orderFormReducer from './reducer'

const OrderFormContext = createContext()

export const OrderFormProvider = ({ children }) => {
  const initialState = {
    cart: [
      {
        name: "",
        price: 0,
        quantity: 0,
        uuid: 'first_product',
        order_modifiers: [],
        variants: [],
        comboProducts: [],
        discounts: [],
        discount_price: 0,
        computed_price: 0
      },
    ],
  }

  const [state, dispatch] = useReducer(orderFormReducer, initialState)

  const value = useMemo(() => ({
    ...state,
    dispatch,
  }), [state])

  return (
    <OrderFormContext.Provider
      value={value}
    >
      {children}
    </OrderFormContext.Provider>
  )
}

export default OrderFormContext