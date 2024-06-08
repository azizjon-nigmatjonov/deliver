const orderFormReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_CART':
      return {
        ...state,
        cart: payload,
      }
    case 'ADD_NEW_PRODUCT':
      return {
        ...state,
        cart: [...state.cart, payload],
      }
    case 'SELECT_PRODUCT':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...payload,
            quantity: payload.quantity ? payload.quantity : 1,
            discounts: [],
            discount_price: 0,
          } : item
        ),
      }
    case 'SET_COMPUTED_PRICE':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item,
            computed_price: payload.computed_price,
          } : item
        ),
      }
    case 'INCREMENT':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload ? { ...item, quantity: +item.quantity + 1 } : item
        ),
      }
    case 'DECREMENT':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload ? { ...item, quantity: +item.quantity === 1 ? 1 : +item.quantity - 1 } : item
        ),
      }
    case 'REMOVE':
      return {
        ...state,
        cart: state.cart?.filter((item) => item.uuid !== payload),
      }
    case 'DESCRIPTION':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? { ...item, description: payload.description } : item
        ),
      }
    case 'SET_QUANTITY':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? { ...item, quantity: payload.quantity } : item
        ),
      }
    // COMBO
    case 'SET_COMBO_&_VARIANTS':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item, variants: payload.variants,
            comboProducts: payload.comboProducts
          } : item
        ),
      }
    case 'SET_COMBO_VARIANTS':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item, variants: payload.variants,
          } : item
        ),
      }
    // MODIFIERS
    case 'SET_MODIFIERS':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item, order_modifiers: payload.modifiers,
          } : item
        ),
      }
    case 'INCREMENT_MODIFIER':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item,
            order_modifiers: item.order_modifiers.map((modifier) => modifier.modifier_id === payload.modifier_id ? {
              ...modifier, modifier_quantity: +modifier.modifier_quantity >= modifier.min_amount ? +modifier.modifier_quantity + 1 : modifier.min_amount
            } : modifier)
          } : item
        ),
      }
    case 'DECREMENT_MODIFIER':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item,
            order_modifiers: item.order_modifiers.map((modifier) => modifier.modifier_id === payload.modifier_id ? {
              ...modifier, modifier_quantity: +modifier.modifier_quantity > 0 ? +modifier.modifier_quantity - 1 : modifier.modifier_quantity,
            } : modifier)
          } : item
        ),
      }
    case 'SET_MODIFIER_VARIANTS':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item, order_modifiers: item.order_modifiers.map((modifier) => modifier.modifier_id === payload.modifier_id ? {
              ...modifier,
              total_price: payload.modifier_price,
              variants: payload.variants
            } : modifier)
          } : item
        ),
      }
    case 'INCREMENT_MODIFIER_VARIANT':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item,
            order_modifiers: item.order_modifiers.map((modifier) => modifier.modifier_id === payload.parent_id ? {
              ...modifier, total_amount: modifier.total_amount >= payload.min_amount ? +modifier.total_amount + 1 : payload.min_amount,
              total_price: !payload.add_to_price ? modifier.total_amount >= payload.min_amount ? modifier.total_price + +payload.modifier_price : +payload.min_amount * +payload.modifier_price : modifier.total_price,
              variants: modifier.variants?.map((variant) => variant.modifier_id === payload.modifier_id ? {
                ...variant, modifier_quantity: modifier.total_amount >= payload.min_amount ? +variant.modifier_quantity + 1 : payload.min_amount
              } : variant)
            } : modifier)
          } : item
        ),
      }
    case 'DECREMENT_MODIFIER_VARIANT':
      return {
        ...state,
        cart: state.cart?.map((item) =>
          item.uuid === payload.uuid ? {
            ...item,
            order_modifiers: item.order_modifiers.map((modifier) => modifier.modifier_id === payload.parent_id ? {
              ...modifier, total_amount: +modifier.total_amount - 1,
              total_price: !payload.add_to_price ? +modifier.total_price - +payload.modifier_price : modifier.total_price,
              variants: modifier.variants?.map((variant) => variant.modifier_id === payload.modifier_id ? {
                ...variant, modifier_quantity: +variant.modifier_quantity - 1
              } : variant)
            } : modifier)
          } : item
        ),
      }
    case 'SET_PRODUCT_DISCOUNTS':
      const sortable = payload.discounts?.sort(function (a, b) { return a.priority - b.priority });

      return {
        ...state,
        cart: state.cart?.map((item) => {
          if (item.uuid === payload.uuid) {
            let totalSum = item.price
            if (sortable)
              for (const item of sortable) {
                totalSum +=
                  item.type === "discount"
                    ? item.mode === "fixed"
                      ? -item.amount
                      : -(totalSum / 100) * item.amount
                    : item.mode === "fixed"
                      ? item.amount
                      : (totalSum / 100) * item.amount;
              }
            return {
              ...item,
              discounts: payload.discounts,
              discount_price: totalSum - item.price
            }
          } else return item
        }
        ),
      }
    default:
      return state
  }
}

export default orderFormReducer