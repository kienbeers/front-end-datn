import { ADD_TO_CART, ADD_TO_CART_BY_VIEW, CHECK_OUT_CART, SELECT_PRODUCT_TO_CART_ADMIN, VIEW_PRODUCT,ADD_TO_PRODUCT } from './constants';

export const addToCart = payload => ({
    type: ADD_TO_CART,
    payload
})
export const addToCartAdmin = payload => ({
    type: SELECT_PRODUCT_TO_CART_ADMIN,
    payload
})
export const addToCartByView = payload => ({
    type: ADD_TO_CART_BY_VIEW,
    payload
})
export const setCheckoutCart = payload => ({
    type: CHECK_OUT_CART,
    payload
})
export const viewProduct = payload => ({
    type: VIEW_PRODUCT,
    payload
})

export const addProduct = payload => ({
    type: ADD_TO_PRODUCT,
    payload
})