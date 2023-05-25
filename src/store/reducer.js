import { ADD_TO_CART, CHECK_OUT_CART, CHANGE_CART_QTY, REMOVE_CART, VIEW_PRODUCT, ADD_TO_CART_BY_VIEW, REMOVE_CART_AFTER_CHECKOUT, REMOVE_CART_CHECKOUT, CHANGE_CART_CHECKOUT_QTY, SELECT_PRODUCT_TO_CART_ADMIN, ADD_TO_PRODUCT, REMOVE_CART_PRODUCT, CHANGE_QTY } from './constants'
const initState = {
    cartCheckout: JSON.parse(localStorage.getItem('cartCheckout')) ? JSON.parse(localStorage.getItem('cartCheckout')) : [],
    cart: JSON.parse(localStorage.getItem('carts')) ? JSON.parse(localStorage.getItem('carts')) : [],
    product_view: {},
    cartAdmin: [],
}
function reducer(state, action) {

    switch (action.type) {
        case CHECK_OUT_CART: {
            let data_add_cart = action.payload
            let add_cart = JSON.parse(localStorage.getItem('cartCheckout')) ? JSON.parse(localStorage.getItem('cartCheckout')) : []
            let indexCart = -1;
            if (add_cart) {
                indexCart = add_cart.findIndex(value => {
                    return value.id === data_add_cart.id
                })
            }
            //data_add_cart.quantity = 1
            if (indexCart === -1) {
                add_cart.push(data_add_cart)
                state = {
                    ...state,
                    cartCheckout: add_cart
                }
            } else {
                add_cart[indexCart].quantity += action.payload.quantity
                state = {
                    ...state,
                    cartCheckout: add_cart
                }
                console.log("Update")
            }
            state = {
                ...state,
                cart: state.cart.filter(c => c.id !== data_add_cart.id),
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            localStorage.setItem('cartCheckout', JSON.stringify(state.cartCheckout));
            return state
            // return {
            //     ...state,
            //     cartCheckout: action.payload,
            // }
        }
        case ADD_TO_CART: {
            // state = {
            //     ...state.cartCheckout,
            //     cart: [...state.cart, { ...action.payload, quantity: 1, total: 0 }],
            // }
            // localStorage.setItem('carts', JSON.stringify(state.cart));
            // return state;
            let data_add_cart = action.payload
            let add_cart = JSON.parse(localStorage.getItem('carts')) ? JSON.parse(localStorage.getItem('carts')) : []
            let indexCart = -1;
            if (add_cart) {
                indexCart = add_cart.findIndex(value => {
                    return value.id === data_add_cart.id
                })
            }
            data_add_cart.quantity = 1
            if (indexCart === -1) {
                add_cart.push(data_add_cart)
                state = {
                    ...state.cartCheckout,
                    cart: add_cart
                }
            } else {
                add_cart[indexCart].quantity += 1
                state = {
                    ...state.cartCheckout,
                    cart: add_cart
                }
                console.log("Update")
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state

        }

        case ADD_TO_PRODUCT: {
            // state = {
            //     ...state.cartCheckout,
            //     cart: [...state.cart, { ...action.payload, quantity: 1, total: 0 }],
            // }
            // localStorage.setItem('carts', JSON.stringify(state.cart));
            // return state;
            let data_add_cart = action.payload
            let add_cart = JSON.parse(localStorage.getItem('cartProduct')) ? JSON.parse(localStorage.getItem('cartProduct')) : []
            let indexCart = -1;
            if (add_cart) {
                indexCart = add_cart.findIndex(value => {
                    return value.id === data_add_cart.id
                })
            }
            data_add_cart.quantity = 1
            if (indexCart === -1) {
                add_cart.push(data_add_cart)
                state = {
                    ...state.cartCheckout,
                    cart: add_cart
                }
            } else {
                add_cart[indexCart].quantity += 1
                state = {
                    ...state.cartCheckout,
                    cart: add_cart
                }
                console.log("Update")
            }
            localStorage.setItem('cartProduct', JSON.stringify(state.cart));
            return state

        }

        case ADD_TO_CART_BY_VIEW: {
            let data_add_cart1 = action.payload.product
            let data_quantity = Number(action.payload.quantity);
            localStorage.setItem('quantity_cart', data_quantity);
            let add_cart1 = JSON.parse(localStorage.getItem('carts')) ? JSON.parse(localStorage.getItem('carts')) : []
            let indexCart = -1;
            if (add_cart1) {
                indexCart = add_cart1.findIndex(value => {
                    return value.id === data_add_cart1.id
                })
            }
            if (indexCart === -1) {
                data_add_cart1.quantity = data_quantity;
                add_cart1.push(data_add_cart1)
                state = {
                    ...state.cartCheckout,
                    cart: add_cart1
                }
            } else {
                add_cart1[indexCart].quantity += data_quantity
                state = {
                    ...state.cartCheckout,
                    cart: add_cart1
                }
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state
        }
        case CHANGE_CART_QTY: {
            state = {
                ...state,
                cart: state.cart.filter(c => c.id === action.payload.id ? c.quantity = action.payload.quantity : c.quantity),
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state;
        }
        case CHANGE_QTY: {
            state = {
                ...state,
                cart: state.cart.filter(c => c.id === action.payload.id ? c.quantity = action.payload.quantity : c.quantity),
            }
            localStorage.setItem('cartProduct', JSON.stringify(state.cart));
            return state;
        }
        case CHANGE_CART_CHECKOUT_QTY: {
            state = {
                ...state,
                cartCheckout: state.cartCheckout.filter(c => c.id === action.payload.id ? c.quantity = action.payload.quantity : c.quantity),
            }
            localStorage.setItem('cartCheckout', JSON.stringify(state.cartCheckout));
            return state;
        }
        case REMOVE_CART: {
            state = {
                ...state,
                cart: state.cart.filter(c => c.id !== action.payload.id),
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state;
        }
        case REMOVE_CART_PRODUCT: {
            state = {
                ...state,
                cart: state.cart.filter(c => c.id !== action.payload.id),
            }
            localStorage.setItem('cartProduct', JSON.stringify(state.cart));
            return state;
        }
        case REMOVE_CART_CHECKOUT: {
            state = {
                ...state,
                cartCheckout: state.cartCheckout.filter(c => c.id !== action.payload.id),
            }
            localStorage.setItem('cartCheckout', JSON.stringify(state.cartCheckout));
            return state;
        }
        case REMOVE_CART_AFTER_CHECKOUT: {
            state = {
                ...state,
                cart: state.cart.filter(c => c.id !== action.payload),
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state;
        }

        case VIEW_PRODUCT: {
            state = {
                ...state,
                product_view: action.payload
            }
            localStorage.setItem('product_detail', JSON.stringify(state.product_view));
            return state;
        }

        case SELECT_PRODUCT_TO_CART_ADMIN: {
            return {
                ...state,
                cartAdmin: action.payload
            }
        }
        default:
            throw new Error('Invalid action!')
    }
}
export { initState }
export default reducer;