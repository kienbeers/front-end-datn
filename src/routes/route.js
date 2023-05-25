import Home from "../pages/Home";
import Category from "../pages/Category";
import Product from "../pages/Product/Product";
// import { Children, Component } from "react";
import CreateProduct from "../pages/Product/CreateProduct";
import EditProduct from "../pages/Product/EditProduct";
import Order from "../pages/Order/Order";
import Login from "../components/users/Login";
import CreateOrder from "../pages/Order/CreateOrder";
import ConfirmOrder from "../pages/Order/ConfirmOrder";
import OrderSuccess from "../pages/Order/OrderSuccess";
import OrderCancel from "../pages/Order/CancelOrder";
import User from "../pages/User/User";
import Staff from "../pages/Staff/Staff";
import Discount from "../pages/Discount";
import HomeUser from "../pages/customer/HomeUser";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/checkout";
import ViewProduct from "../pages/customer/view_product";
import UpdateOrder from "../pages/Order/UpdateOrder";
import OrderDelivering from "../pages/Order/OrderDelivering";
import OrderWait from "../pages/Order/OrderWait";
import Exchange from "../pages/Order/exchange";
import ViewOrder from "../pages/customer/ViewOrder";
import ExchangeSuccess from "../pages/Order/ExchangeSuccess";
import Return from "../pages/Order/Return"
// import ReturnConfirm from "../pages/Order/ReturnConfirm"
import ConfirmOrderDetail from "../pages/Order/ConfirmOrderDetail";
import Accessories from "../pages/Accessories";
import ExchangeUser from "../pages/customer/Order/Exchange";
import ReturnUser from "../pages/customer/Order/Return";
import ExchangeDetail from "../pages/Order/ExchangeDetail";
import Statistical from "../pages/statistical/Statistical";
import Compare from "../pages/customer/compareProduct/Compare";
import Inventory from "../pages/Product/Inventory";
import Test from "../pages/Home/qr";
import Policy from "../pages/Home/Policy/policy";
import Information from "../pages/customer/information/index"
import Find from "../pages/customer/find";
import CopyProduct from "../pages/Product/CopyProduct";
import CreateOrderAdmin from "../pages/Order/Table";
import ViewProductAdmin from "../pages/Product/ViewProduct";
import ConfirmPayment from "../pages/Order/ConfirmPayment/ConfirmPayment";
import Profile from "../pages/User/Profile";
import DiscountProduct from "../pages/Product/discountProduct/discountProduct";
import Role from "../pages/User/Role/Role";
import LoginOrder from "../pages/customer/LoginOrder";

const publicRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/admin/category",
    component: Category,
  },
  {
    path: "/admin/product",
    component: Product,
  },
  {
    path: "/admin/product/create",
    component: CreateProduct,
  },
  {
    path: "/admin/product/edit/:id",
    component: EditProduct,
  },
  {
    path: "/admin/order",
    component: Order,
  },
  {
    path: "/login",
    component: Login,
    Layout: null,
  },
  {
    path: "/admin/order/confirm",
    component: ConfirmOrder,
  },
  {
    path: "/admin/order/success",
    component: OrderSuccess,
  },
  {
    path: "/admin/order/cancel",
    component: OrderCancel,
  },
  {
    path: "/admin/order/create",
    component: CreateOrderAdmin,
  },
  {
    path: "/admin/user",
    component: User,
  },
  {
    path: "/admin/staff",
    component: Staff,
  },
  {
    path: "/admin/discount",
    component: Discount,
  },
  {
    path: "/user",
    component: HomeUser,
  },
  {
    path: "/user/cart",
    component: Cart,
  },
  {
    path: "/user/checkout",
    component: Checkout,
  },
  {
    path: "/user/product",
    component: ViewProduct,
  },
  {
    path: "/admin/order/:id",
    component: UpdateOrder,
  },
  {
    path: "/admin/order/delivering",
    component: OrderDelivering,
  },
  {
    path: "/admin/order/wait",
    component: OrderWait,
  },
  {
    path: "/admin/order/exchange/:id",
    component: Exchange,
  },
  {
    path: "/user/order",
    component: ViewOrder,
  },
  {
    path: "/admin/order/exchange",
    component: ExchangeSuccess,
  },
  {
    path: "/admin/return/:id",
    component: Return
  },
  // {
  //   path: "/admin/return/confirm",
  //   component: ReturnConfirm
  // },
  {
    path: "/admin/order/:id/confirm/",
    component: ConfirmOrderDetail,
  },
  {
    path: "/admin/accessories",
    component: Accessories,
  },
  {
    path: "/user/order/exchange/:id",
    component: ExchangeUser,
  },
  {
    path: "/user/order/return/:id",
    component: ReturnUser,
  },
  {
    path: "/admin/order/exchange/detail/:id",
    component: ExchangeDetail,
  }, {
    path: "/admin/statistical",
    component: Statistical
  },
  {
    path: "/user/compare/:id",
    component: Compare
  },
  {
    path: "/admin/product/inventory",
    component: Inventory
  },
  {
    path: "/admin/test",
    component: Test
  },
  {
    path: "/policy",
    component: Policy
  },
  {
    path: "/auth/information",
    component: Information
  },
  {
    path: "user/find",
    component: Find
  },
  {
    path: "/admin/product/copy/:id",
    component: CopyProduct
  },
  {
    path: "/admin/product/view/:id",
    component: ViewProductAdmin
  },
  {
    path: "/admin/order/confirm/payment",
    component: ConfirmPayment
  },
  {
    path: "/admin/user/profile",
    component: Profile
  },
  {
    path: "/admin/product/discountproduct",
    component: DiscountProduct
  },
  {
    path: "/admin/setting/role",
    component: Role
  },
  {
    path: "/loginOrder",
    component: LoginOrder
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };