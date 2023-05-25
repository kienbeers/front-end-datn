import React, { useEffect, useState, useContext } from "react";
import Context from "../../store/Context";
import { addToCart, setCheckoutCart, viewProduct } from "../../store/Actions";
import "./css/home.css";
import anh1 from "../../asset/images/products/shop01.png";
import anh2 from "../../asset/images/products/shop04.png";
import anh3 from "../../asset/images/products/shop03.png";

import product1 from "../../asset/images/products/product01.png";

import { Heart, Repeat, Eye, ShoppingCart } from "react-feather";
import qs from "qs";

import axios from "axios";
import "toastr/build/toastr.min.css";
import toastrs from "toastr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Col, Row, Tooltip } from "antd";

function HomeUser() {
  const handelCLickProduct = (product) => {
    getProductById(product.id);
  };

  const getProductById = (id) => {
    console.log("productId:", id);
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("product_detail", JSON.stringify(res));
        navigate("/user/product");
        // dispatch(viewProduct(res));
        // console.log("state", state);
      });
  };

  let navigate = useNavigate();
  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const [state, dispatch] = useContext(Context);
  const handleAddToCart = (product) => {
    const findCart = (
      JSON.parse(localStorage.getItem("carts"))
        ? JSON.parse(localStorage.getItem("carts"))
        : []
    ).find((value) => {
      return value.id === product.id;
    });
    console.log("findCart", findCart);
    if (findCart != null) {
      if (findCart.quantity < 10) {
        console.log("product add vao gio hang");
        console.log(product);
        dispatch(addToCart(product));
        notifySuccess("Thêm vào giỏ hàng thành công!");
      } else {
        notifyError(
          "Đã tồn tại 10 sản phẩm trong giỏ hàng! Liên hệ cửa hàng để đặt mua số lượng lớn"
        );
      }
    } else {
      dispatch(addToCart(product));
      notifySuccess("Thêm vào giỏ hàng thành công!");
    }
  };
  const handleClickAddToCart = (product) => {
    handleAddToCart(product);
  };
  const handleClickRemoveFromCart = (product) => {
    dispatch({
      type: "REMOVE_CART",
      payload: product,
    });
  };
  function formatCash(str) {
    if (str.length > 1) {
      return str
        .split("")
        .reverse()
        .reduce((prev, next, index) => {
          return (index % 3 ? next : next + ",") + prev;
        });
    } else {
      return "";
    }
  }

  const url = "http://localhost:8080/api/products/getAll";
  const [totalSet, setTotal] = useState(10);
  const [product_discount, setDataProduct_Discount] = useState([
    {
      id: "",
      name: "",
      price: null,
      quantity: null,
      active: 1,
      imei: null,
      weight: null,
      size: null,
      debut: null,
      categoryId: null,
      images: null,
    },
  ]);
  const [products, setData] = useState([
    {
      id: "",
      name: "",
      price: null,
      quantity: null,
      active: 1,
      imei: null,
      weight: null,
      size: null,
      debut: null,
      categoryId: null,
      images: null,
    },
  ]);
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchProductKey: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
    searchPrice: params.pagination?.search3,
    searchPn: params.pagination?.search4,
    searchImei: params.pagination?.search5,
    searchStatus: params.pagination?.searchStatus,
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
      searchStatus: "ACTIVE",
    },
  });
  //APILoadList
  const getData = () => {
    axios
      .get(url + `?${qs.stringify(getRandomuserParams(tableParams))}`)
      // .then((res) => res.json())
      .then((results) => {
        setData(results.data.data.data);
        //console.log(products[0].images[0].name)
        setTotal(results.data.data.total);
        //localStorage.setItem("products",JSON.stringify(products))
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          },
        });
      });
  };

  const allProWithDiscount = () => {
    fetch(`http://localhost:8080/api/products/allProWithDiscount`)
      .then((response) => response.json())
      .then((results) => {
        setDataProduct_Discount(results.data);
      });
  };

  //LoadList
  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams)]);
  const carts = JSON.parse(localStorage.getItem("carts"));
  // console.log("c:", carts);
  useEffect(() => {
    allProWithDiscount();
  }, []);

  console.log(product_discount);

  // const products = useSelector(state => state.productReducer);
  // const showProducts = (products) => {
  //     let result = null;
  //     if (products.length > 0) {
  //         result = products.map((product, index) => {
  //             return <ProductIndex key={product.id} product={product}/>
  //         });
  //     }
  //     return result;
  // }
  return (
    <div>
      <ToastContainer />
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src={anh1} alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Laptop
                    <br />
                    Bộ sưu tập
                  </h3>
                  <a href="#" className="cta-btn">
                    Mua ngay <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src={anh3} alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Phụ kiện
                    <br />
                    Bộ sưu tập
                  </h3>
                  <a href="#" className="cta-btn">
                    Mua ngay <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src={anh2} alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Laptop Gaming
                    <br />
                    Bộ sưu tập
                  </h3>
                  <a href="#" className="cta-btn">
                    Mua ngay <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Sản phẩm mới</h3>
                <div className="section-nav">
                  <ul className="section-tab-nav tab-nav">
                    <li className="active">
                      <a data-toggle="tab" href="#tab1">
                        Laptop
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  <div id="tab2" className="tab-pane fade in active">
                    <div className="products-slick" data-nav="#slick-nav-2">
                      {products
                        ? products.map((pro, index) => (
                            <div className="product" key={index}>
                              <div className="product-img sp">
                                <img
                                  src={
                                    pro.images ? pro.images[0]?.name : product1
                                  }
                                  alt=""
                                />
                                <div className="product-label">
                                  {pro.discount ? (
                                    <span className="sale">
                                      {pro.discount.ratio}%
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  <span className="new">NEW</span>
                                </div>
                              </div>
                              <div className="product-body">
                                <h3
                                  className="product-name"
                                  onClick={() => handelCLickProduct(pro)}
                                >
                                  <a>{pro.name}</a>
                                  <div className="text-secondary">
                                    <div>
                                      <Tooltip
                                        placement="top"
                                        title={"Màn hình"}
                                      >
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nM3SsQkCURCE4Q9MxcAOtAEDQ4PrxshM8ELrMDJ4mJjcVWAN1mAlsmCggrh3B+LAvGjfvzvL8g9qcOjpJgBlQPPSFbDAEqM+gAo3nLpOUOGMHWaYZgErHLHH5ENNeQdExvWjY43xl+nKMyAWc8E18TEVIaMST4t5T7cBiKxD/KJt4nw3qXA/0x0FTCzDM8S0ngAAAABJRU5ErkJggg==" />
                                        {" " +pro?.screen?.size.trim() + " "}
                                      </Tooltip>
                                      <Tooltip placement="top" title={"CPU"}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-cpu-fill"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                                          <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z" />
                                        </svg>
                                        {" " +pro?.processor?.cpuTechnology.trim()}
                                      </Tooltip>
                                    </div>
                                    <div>
                                      <Tooltip placement="top" title={"Ram"}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-memory"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M1 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707-.293l.353-.353a.5.5 0 0 1 .708 0l.353.353a1 1 0 0 0 .707.293H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1Zm.5 1h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm5 0h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm4.5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4ZM2 10v2H1v-2h1Zm2 0v2H3v-2h1Zm2 0v2H5v-2h1Zm3 0v2H8v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Z" />
                                        </svg>
                                        {" " +pro?.ram?.ramCapacity.trim()}
                                      </Tooltip>
                                    </div>
                                    <div>
                                      <Tooltip placement="top" title={"Ổ cứng"}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-hdd-fill"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z" />
                                        </svg>
                                        {" " +pro.storage?.storageDetail.storageType.name.trim() +
                                          " " +
                                          pro.storage?.storageDetail.capacity.trim()}
                                      </Tooltip>
                                    </div>
                                    <div>
                                      <Tooltip placement="top" title={"Đồ họa"}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-gpu-card"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                                          <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .5.5V4h13.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2v2.5a.5.5 0 0 1-1 0V2H.5a.5.5 0 0 1-.5-.5Zm5.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
                                          <path d="M3 12.5h3.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-1Zm4 1v-1h4v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5Z" />
                                        </svg>
                                        {" " +pro.card?.trandemark.trim() +
                                          " " +
                                          pro.card?.model.trim() +
                                          " " +
                                          pro.card?.memory.trim()}
                                      </Tooltip>
                                    </div>
                                    <div>
                                      <Tooltip
                                        placement="top"
                                        title={"Trọng lượng"}
                                      >
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAp0lEQVR4nI3RzQpBURQF4G/AlAcwkWtAGZkoI8UTKCaS8jPGCJObdyBv5n106qR7L1dW7TqnvdbZa6/DJ6rYYoOKP3BAgjb2v4hNtHCLgiSeW7GXwwApZiWVRs4bR9R/TK8V7YUXAjrolojSb5cxdpjijCv6RUFYbpERPNHAA3NMYi9wAtcyk0IPQ6xjvHeMMikGbt5bBmHaKn5kznqZoHTxC05/1uUF3gwbVU0GVYUAAAAASUVORK5CYII=" />
                                        {" " +pro?.weight + " kg"}
                                      </Tooltip>
                                    </div>
                                  </div>
                                </h3>
                                <h4 className="product-price">
                                  {formatCash(Math.ceil(pro.price) + "")} VNĐ{" "}
                                  {pro.discount ? (
                                    <del className="product-old-price">
                                      {formatCash(
                                        Math.ceil(
                                          pro.price /
                                            ((100 - pro.discount.ratio) / 100)
                                        ) + ""
                                      )}{" "}
                                      VNĐ
                                    </del>
                                  ) : (
                                    ""
                                  )}
                                </h4>
                              </div>
                              {
                                // carts?carts.some(p=>p.id===pro.id)?
                                // (<div className="add-to-cart">
                                // <button className="add-to-cart-btn" onClick={() => handleClickRemoveFromCart(pro)} ><DeleteOutlined size={18}></DeleteOutlined> remove from cart</button>
                                //  </div>):
                                // (<div className="add-to-cart">
                                // <button className="add-to-cart-btn" onClick={() => handleClickAddToCart(pro)} ><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                //  </div>):
                                <div className="add-to-cart">
                                  {pro.quantity > 0 ? (
                                    <button
                                      className="add-to-cart-btn"
                                      onClick={() => handleClickAddToCart(pro)}
                                    >
                                      <ShoppingCart size={18}></ShoppingCart>{" "}
                                      Thêm vào giỏ hàng
                                    </button>
                                  ) : (
                                    <h6 className="text-white fw-bold">
                                      SẢN PHẨM HẾT HÀNG
                                    </h6>
                                  )}
                                </div>
                              }
                            </div>
                          ))
                        : ""}
                    </div>
                    <div id="slick-nav-2" className="products-slick-nav"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="hot-deal" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="hot-deal">
                <ul className="hot-deal-countdown">
                  <li>
                    <div>
                      <h3>02</h3>
                      <span>Ngày</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>10</h3>
                      <span>Giờ</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>34</h3>
                      <span>Phút</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>60</h3>
                      <span>Giây</span>
                    </div>
                  </li>
                </ul>
                <h2 className="text-uppercase">HOT DEAL TUẦN NÀY</h2>
                <p>Bộ sưu tập mới GIẢM GIÁ tới 50%</p>
                <a className="primary-btn cta-btn" href="#">
                  Mua ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Sản phẩm</h3>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  <div id="tab1" className="tab-pane active">
                    <div className="products-slick" data-nav="#slick-nav-1">
                      <Row gutter={10}>
                        {products
                          ? products.map((pro, index) => (
                              <Col
                                key={index}
                                xs={{ span: 24 }}
                                lg={{ span: 6 }}
                                md={{ span: 8 }}
                                sm={{ span: 12 }}
                              >
                                <div
                                  className="product"
                                  style={{ marginBottom: "20%" }}
                                  key={pro.id}
                                >
                                  <div className="product-img">
                                    <img
                                      src={
                                        pro.images
                                          ? pro.images[0]?.name
                                          : product1
                                      }
                                      alt=""
                                    />
                                    <div className="product-label">
                                      {pro.discount ? (
                                        <span className="sale">
                                          {pro.discount.ratio}%
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      <span className="new">NEW</span>
                                    </div>
                                  </div>
                                  <div className="product-body">
                                    <h3
                                      className="product-name"
                                      onClick={() => handelCLickProduct(pro)}
                                    >
                                      <a>{pro.name}</a>
                                      <div className="text-secondary">
                                    <div>
                                      <Tooltip
                                        placement="top"
                                        title={"Màn hình"}
                                      >
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nM3SsQkCURCE4Q9MxcAOtAEDQ4PrxshM8ELrMDJ4mJjcVWAN1mAlsmCggrh3B+LAvGjfvzvL8g9qcOjpJgBlQPPSFbDAEqM+gAo3nLpOUOGMHWaYZgErHLHH5ENNeQdExvWjY43xl+nKMyAWc8E18TEVIaMST4t5T7cBiKxD/KJt4nw3qXA/0x0FTCzDM8S0ngAAAABJRU5ErkJggg==" />
                                        {" " +pro?.screen?.size.trim() + " "}
                                      </Tooltip>
                                      <Tooltip placement="top" title={"CPU"}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-cpu-fill"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                                          <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z" />
                                        </svg>
                                        {" " +pro?.processor?.cpuTechnology.trim()}
                                      </Tooltip>
                                    </div>
                                    <div>
                                      <Tooltip placement="top" title={"Ram"}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-memory"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M1 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707-.293l.353-.353a.5.5 0 0 1 .708 0l.353.353a1 1 0 0 0 .707.293H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1Zm.5 1h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm5 0h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm4.5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4ZM2 10v2H1v-2h1Zm2 0v2H3v-2h1Zm2 0v2H5v-2h1Zm3 0v2H8v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Z" />
                                        </svg>
                                        {" " +pro?.ram?.ramCapacity.trim()}
                                      </Tooltip>
                                    </div>
                                    <div>
                                      <Tooltip placement="top" title={"Ổ cứng"}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-hdd-fill"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z" />
                                        </svg>
                                        {" " +pro.storage?.storageDetail.storageType.name.trim() +
                                          " " +
                                          pro.storage?.storageDetail.capacity.trim()}
                                      </Tooltip>
                                    </div>
                                    <div>
                                      <Tooltip placement="top" title={"Đồ họa"}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-gpu-card"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                                          <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .5.5V4h13.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2v2.5a.5.5 0 0 1-1 0V2H.5a.5.5 0 0 1-.5-.5Zm5.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
                                          <path d="M3 12.5h3.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-1Zm4 1v-1h4v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5Z" />
                                        </svg>
                                        {" " +pro.card?.trandemark.trim() +
                                          " " +
                                          pro.card?.model.trim() +
                                          " " +
                                          pro.card?.memory.trim()}
                                      </Tooltip>
                                    </div>
                                    <div>
                                      <Tooltip
                                        placement="top"
                                        title={"Trọng lượng"}
                                      >
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAp0lEQVR4nI3RzQpBURQF4G/AlAcwkWtAGZkoI8UTKCaS8jPGCJObdyBv5n106qR7L1dW7TqnvdbZa6/DJ6rYYoOKP3BAgjb2v4hNtHCLgiSeW7GXwwApZiWVRs4bR9R/TK8V7YUXAjrolojSb5cxdpjijCv6RUFYbpERPNHAA3NMYi9wAtcyk0IPQ6xjvHeMMikGbt5bBmHaKn5kznqZoHTxC05/1uUF3gwbVU0GVYUAAAAASUVORK5CYII=" />
                                        {" " +pro?.weight + " kg"}
                                      </Tooltip>
                                    </div>
                                  </div>
                                    </h3>
                                    <h4 className="product-price">
                                      {formatCash(Math.ceil(pro.price) + "")}{" "}
                                      VNĐ{" "}
                                      {pro.discount ? (
                                        <del className="product-old-price">
                                          {formatCash(
                                            Math.ceil(
                                              pro.price /
                                                ((100 - pro.discount.ratio) /
                                                  100)
                                            ) + ""
                                          )}{" "}
                                          VNĐ
                                        </del>
                                      ) : (
                                        ""
                                      )}
                                    </h4>
                                  </div>
                                  {
                                    // carts?carts.some(p=>p.id===pro.id)?
                                    // (<div className="add-to-cart">
                                    // <button className="add-to-cart-btn" onClick={() => handleClickRemoveFromCart(pro)} ><DeleteOutlined size={18}></DeleteOutlined> remove from cart</button>
                                    //  </div>):
                                    // (<div className="add-to-cart">
                                    // <button className="add-to-cart-btn" onClick={() => handleClickAddToCart(pro)} ><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                    //  </div>):
                                    <div className="add-to-cart">
                                      {pro.quantity > 0 ? (
                                        <button
                                          className="add-to-cart-btn"
                                          onClick={() =>
                                            handleClickAddToCart(pro)
                                          }
                                        >
                                          <ShoppingCart
                                            size={18}
                                          ></ShoppingCart>{" "}
                                          Thêm vào giỏ hàng
                                        </button>
                                      ) : (
                                        <h6 className="text-white fw-bold">
                                          SẢN PHẨM HẾT HÀNG
                                        </h6>
                                      )}
                                    </div>
                                  }
                                </div>
                              </Col>
                            ))
                          : ""}
                      </Row>
                    </div>
                    <div id="slick-nav-1" className="products-slick-nav"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Sản phẩm giảm giá</h3>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  <div id="tab1" className="tab-pane active">
                    <div className="products-slick" data-nav="#slick-nav-1">
                      <Row gutter={10}>
                        {product_discount
                          ? product_discount.map((pro, index) => (
                              <Col
                                key={index}
                                xs={{ span: 24 }}
                                lg={{ span: 6 }}
                                md={{ span: 8 }}
                                sm={{ span: 12 }}
                              >
                                <div
                                  className="product"
                                  style={{ marginBottom: "20%" }}
                                  key={pro.id}
                                >
                                  <div className="product-img">
                                    <img
                                      src={
                                        pro.images
                                          ? pro.images[0]?.name
                                          : product1
                                      }
                                      alt=""
                                    />
                                    <div className="product-label">
                                      {pro.discount ? (
                                        <span className="sale">
                                          {pro.discount.ratio}%
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      <span className="new">NEW</span>
                                    </div>
                                  </div>
                                  <div className="product-body">
                                    <h3
                                      className="product-name"
                                      onClick={() => handelCLickProduct(pro)}
                                    >
                                      <a>{pro.name}</a>
                                      <div
                                        className="text-secondary"
                                        style={{ height: "130px" }}
                                      >
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"Màn hình"}
                                          >
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nM3SsQkCURCE4Q9MxcAOtAEDQ4PrxshM8ELrMDJ4mJjcVWAN1mAlsmCggrh3B+LAvGjfvzvL8g9qcOjpJgBlQPPSFbDAEqM+gAo3nLpOUOGMHWaYZgErHLHH5ENNeQdExvWjY43xl+nKMyAWc8E18TEVIaMST4t5T7cBiKxD/KJt4nw3qXA/0x0FTCzDM8S0ngAAAABJRU5ErkJggg==" />{" "}
                                            {pro.screen?.size.trim() + " "}
                                          </Tooltip>
                                          <Tooltip
                                            placement="top"
                                            title={"CPU"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-cpu-fill"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                                              <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z" />
                                            </svg>{" "}
                                            {pro.processor?.cpuTechnology.trim()}
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"Ram"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-memory"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M1 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707-.293l.353-.353a.5.5 0 0 1 .708 0l.353.353a1 1 0 0 0 .707.293H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1Zm.5 1h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm5 0h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm4.5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4ZM2 10v2H1v-2h1Zm2 0v2H3v-2h1Zm2 0v2H5v-2h1Zm3 0v2H8v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Z" />
                                            </svg>{" "}
                                            {pro.ram?.ramCapacity.trim()}
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"Ổ cứng"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-hdd-fill"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z" />
                                            </svg>{" "}
                                            {pro.storage?.storageDetail.storageType.name.trim() +
                                              " " +
                                              pro.storage?.storageDetail.capacity.trim()}
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"Đồ họa"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-gpu-card"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                                              <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .5.5V4h13.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2v2.5a.5.5 0 0 1-1 0V2H.5a.5.5 0 0 1-.5-.5Zm5.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
                                              <path d="M3 12.5h3.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-1Zm4 1v-1h4v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5Z" />
                                            </svg>{" "}
                                            {pro.card?.trandemark.trim() +
                                              " " +
                                              pro.card?.model.trim() +
                                              " " +
                                              pro.card?.memory.trim()}
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"Trọng lượng"}
                                          >
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAp0lEQVR4nI3RzQpBURQF4G/AlAcwkWtAGZkoI8UTKCaS8jPGCJObdyBv5n106qR7L1dW7TqnvdbZa6/DJ6rYYoOKP3BAgjb2v4hNtHCLgiSeW7GXwwApZiWVRs4bR9R/TK8V7YUXAjrolojSb5cxdpjijCv6RUFYbpERPNHAA3NMYi9wAtcyk0IPQ6xjvHeMMikGbt5bBmHaKn5kznqZoHTxC05/1uUF3gwbVU0GVYUAAAAASUVORK5CYII=" />{" "}
                                            {pro.weight + " kg"}
                                          </Tooltip>
                                        </div>
                                      </div>
                                    </h3>
                                    <h4 className="product-price">
                                      {formatCash(Math.ceil(pro.price) + "")}{" "}
                                      VNĐ{" "}
                                      {pro.discount ? (
                                        <del className="product-old-price">
                                          {formatCash(
                                            Math.ceil(
                                              pro.price /
                                                ((100 - pro.discount.ratio) /
                                                  100)
                                            ) + ""
                                          )}{" "}
                                          VNĐ
                                        </del>
                                      ) : (
                                        ""
                                      )}
                                    </h4>
                                  </div>
                                  {
                                    // carts?carts.some(p=>p.id===pro.id)?
                                    // (<div className="add-to-cart">
                                    // <button className="add-to-cart-btn" onClick={() => handleClickRemoveFromCart(pro)} ><DeleteOutlined size={18}></DeleteOutlined> remove from cart</button>
                                    //  </div>):
                                    // (<div className="add-to-cart">
                                    // <button className="add-to-cart-btn" onClick={() => handleClickAddToCart(pro)} ><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                    //  </div>):
                                    <div className="add-to-cart">
                                      {pro?.quantity > 0 ? (
                                        <button
                                          className="add-to-cart-btn"
                                          onClick={() =>
                                            handleClickAddToCart(pro)
                                          }
                                        >
                                          <ShoppingCart
                                            size={18}
                                          ></ShoppingCart>{" "}
                                          Thêm vào giỏ hàng
                                        </button>
                                      ) : (
                                        <h6 className="text-white fw-bold">
                                          SẢN PHẨM HẾT HÀNG
                                        </h6>
                                      )}
                                    </div>
                                  }
                                </div>
                              </Col>
                            ))
                          : ""}
                      </Row>
                    </div>
                    <div id="slick-nav-1" className="products-slick-nav"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeUser;
