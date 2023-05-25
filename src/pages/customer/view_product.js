import React, { useContext, useEffect, useState } from "react";
import product1 from "../../asset/images/products/product01.png";
import product2 from "../../asset/images/products/product02.png";
import product3 from "../../asset/images/products/product03.png";
import "./css/view.css";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Tabs, Input, Modal, Tooltip, Button, InputNumber } from "antd";
import Context from "../../store/Context";
import {
  addToCart,
  addToCartByView,
  setCheckoutCart,
  viewProduct,
} from "../../store/Actions";
import { json, Link, useNavigate } from "react-router-dom";
import { Eye, Heart, Repeat, ShoppingCart } from "react-feather";
import axios from "axios";
import qs from "qs";

function ViewProduct() {
  let navigate = useNavigate();
  const handelCLickProduct = (product) => {
    dispatch(viewProduct(product));
    console.log("state", state);
  };
  const url = "http://localhost:8080/api/products";
  const [totalSet, setTotal] = useState(10);
  const [productCate, setProductCate] = useState([]);
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
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
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

  //LoadList
  useEffect(() => {
    getData();
    DataConfigProductById();
    loadProductByCategory();
  }, [JSON.stringify(tableParams)]);

  const loadProductByCategory = () => {
    fetch(
      `http://localhost:8080/api/auth/product/${
        product.categoryProducts[0].category.id
      }/category?${qs.stringify(getRandomuserParams(tableParams))}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        console.log("sản phẩm cùng loại");
        console.log(results);
        results.forEach((element) => {
          if (element.id != product.id) {
            setProductCate(results);
          }
        });
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

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [quantity, setQuantity] = useState(1);
  const onChangeInputQuantity = (event) => {
    if (event <= 0) {
      setQuantity(1);
    }
    setQuantity(event);
  };
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
  console.log("state", state.cartCheckout);
  const product = JSON.parse(localStorage.getItem("product_detail"));
  console.log(product);
  const handleAddToCart = (product, quantity) => {
    const findCart = (
      JSON.parse(localStorage.getItem("carts"))
        ? JSON.parse(localStorage.getItem("carts"))
        : []
    ).find((value) => {
      return value.id === product.id;
    });
    console.log("findCart", findCart);
    if (findCart != null) {
      let totalQuantity = parseInt(findCart.quantity) + parseInt(quantity);
      if (totalQuantity <= 4) {
        dispatch(addToCartByView({ product, quantity }));
        notifySuccess("Thêm vào giỏ hàng thành công!");
      } else {
        notifyError(
          "Đã tồn tại " +
            findCart.quantity +
            " sản phẩm đã chọn trong giỏ hàng! Không được mua quá 4 sản phẩm cùng loại. Liên hệ cửa hàng để đặt mua số lượng lớn"
        );
      }
    } else {
      let totalProductInCart = (
        JSON.parse(localStorage.getItem("carts"))
          ? JSON.parse(localStorage.getItem("carts"))
          : []
      ).length;
      console.log("totalProductInCart", totalProductInCart);
      if (totalProductInCart < 10) {
        dispatch(addToCartByView({ product, quantity }));
        notifySuccess("Thêm vào giỏ hàng thành công!");
      } else {
        notifyError(
          "Đã tồn tại 10 sản phẩm khác nhau trong giỏ hàng! Liên hệ cửa hàng để đặt mua số lượng lớn"
        );
      }
    }
  };

  const handleClickAddToCart = (product, quantity) => {
    if (quantity > 4 || quantity < 1) {
      toastError(
        "Số lượng sản phẩm ít nhất là 1 và không được vượt quá 4 sản phẩm"
      );
    } else {
      handleAddToCart(product, quantity);
    }
  };

  // const handleBuyNow = (product, quantity) => {
  //   dispatch(addToCartByView({ product, quantity }));
  // };

  // const handleClickBuy = (product, quantity) => {
  //   if (quantity > 4 || quantity < 1) {
  //     toastError(
  //       "Số lượng sản phẩm ít nhất là 1 và không được vượt quá 4 sản phẩm"
  //     );
  //   } else {
  //     handleBuyNow(product, quantity);
  //   }
  // };

  const handleClickBuyNow = (product, quantity) => {
    console.log("product khi mua ngay");
    console.log(product);
    //product.quantity = quantity;
    // dispatch(setCheckoutCart([product]));
    const findCart = (
      JSON.parse(localStorage.getItem("carts"))
        ? JSON.parse(localStorage.getItem("carts"))
        : []
    ).find((value) => {
      return value.id === product.id;
    });
    console.log("findCart", findCart);
    if (findCart != null) {
      let totalQuantity = parseInt(findCart.quantity) + parseInt(quantity);
      if (totalQuantity <= 4) {
        dispatch(addToCartByView({ product, quantity }));
        notifySuccess("Thêm vào giỏ hàng thành công!");
        navigate("/user/cart");
      } else {
        notifyError(
          "Đã tồn tại " +
            findCart.quantity +
            " sản phẩm đã chọn trong giỏ hàng! Không được mua quá 4 sản phẩm cùng loại. Liên hệ cửa hàng để đặt mua số lượng lớn"
        );
      }
    } else {
      let totalProductInCart = (
        JSON.parse(localStorage.getItem("carts"))
          ? JSON.parse(localStorage.getItem("carts"))
          : []
      ).length;
      console.log("totalProductInCart", totalProductInCart);
      if (totalProductInCart < 10) {
        dispatch(addToCartByView({ product, quantity }));
        notifySuccess("Thêm vào giỏ hàng thành công!");
        navigate("/user/cart");
      } else {
        notifyError(
          "Đã tồn tại 10 sản phẩm khác nhau trong giỏ hàng! Liên hệ cửa hàng để đặt mua số lượng lớn"
        );
      }
    }
  };

  const productInfo = JSON.parse(localStorage.getItem("product_detail"));

  const DataConfigProductById = () => {
    fetch(`http://localhost:8080/api/products/` + productInfo.id)
      .then((res) => res.json())
      .then((res) => {
        localStorage.removeItem("product_detail");
        localStorage.setItem("product_detail", JSON.stringify(res));
      });
  };

  const toastError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-2">
        <div className="row">
          <div className="col-5 img-content">
            <div
              id="carouselExampleCaptions"
              className="carousel carousel-dark slide"
              data-bs-ride="false"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="3"
                  aria-label="Slide 4"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="4"
                  aria-label="Slide 5"
                ></button>
              </div>
              <div className="carousel-inner">
                {JSON.parse(localStorage.getItem("product_detail")).images.map(
                  (image) => (
                    <div className="carousel-item active">
                      <img className="d-block w-100" src={image.name} alt="" />
                    </div>
                  )
                )}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            {/* <div
              id="carouselExampleIndicators"
              class="carousel slide"
              data-bs-ride="carousel"
            >
              <div class="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  class="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/fir-react-storage-96f9d.appspot.com/o/images%2F091d4f1bebc76ea61eec0b9d8af26e5f%20-%20Copy.jpg086dcb2b-0731-4650-89d3-45bf7095181a?alt=media&token=233930b5-4de5-4e96-a252-a2e184904222"
                    class="d-block w-100"
                    alt="..."
                  />
                </div>
                <div class="carousel-item">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/fir-react-storage-96f9d.appspot.com/o/images%2F091d4f1bebc76ea61eec0b9d8af26e5f%20-%20Copy.jpg086dcb2b-0731-4650-89d3-45bf7095181a?alt=media&token=233930b5-4de5-4e96-a252-a2e184904222"
                    class="d-block w-100"
                    alt="..."
                  />
                </div>
                <div class="carousel-item">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/fir-react-storage-96f9d.appspot.com/o/images%2F091d4f1bebc76ea61eec0b9d8af26e5f%20-%20Copy.jpg086dcb2b-0731-4650-89d3-45bf7095181a?alt=media&token=233930b5-4de5-4e96-a252-a2e184904222"
                    class="d-block w-100"
                    alt="..."
                  />
                </div>
              </div>
              <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span
                  class="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span
                  class="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div> */}
          </div>
          <div className="col-7 info">
            <div className="product-details">
              <p
                className="product-name"
                style={{
                  fontWeight: "600",
                  fontSize: "25px",
                  wordWrap: "break-word",
                }}
              >
                {productInfo.name}
              </p>
              <div>
                <h3 className="product-price">
                  {formatCash(Math.ceil(productInfo.price) + "")} VNĐ
                </h3>
                <Link to={"/user/compare/" + productInfo.id}>
                  <Tooltip title="So sánh sản phẩm">
                    <Button
                      className="ms-5"
                      type="primary"
                      shape="circle"
                      icon={<PlusCircleOutlined />}
                    />{" "}
                    So sánh
                  </Tooltip>
                </Link>
              </div>
              <p className="text-danger fs-6">
                Số lượng còn lại:{" "}
                {productInfo.quantity - quantity > 0
                  ? productInfo.quantity - quantity
                  : 0 + " (Sản phẩm hết hàng)"}
              </p>

              {productInfo.quantity - quantity > 0 ? (
                <div>
                  <InputNumber
                    value={quantity}
                    className="m-2"
                    type="number"
                    onChange={onChangeInputQuantity}
                    style={{ width: "30%" }}
                    placeholder="Số lượng"
                    min={1}
                    max={4}
                  />
                  <div className="add-to-cart">
                    <button
                      className="btn-add-to-cart"
                      onClick={() =>
                        handleClickAddToCart(productInfo, quantity)
                      }
                    >
                      {" "}
                      Thêm vào giỏ hàng
                    </button>
                    {/* <Link> */}
                    <button
                      className="btn-add-to-cart ms-2"
                      onClick={() => handleClickBuyNow(productInfo, quantity)}
                      // onClick={() => handleClickBuy(productInfo, quantity)}
                    >
                      Mua ngay
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              ) : (
                ""
              )}

              <div>
                <p style={{ fontSize: "20px", fontWeight: "600" }}>
                  Thông số kĩ thuật
                </p>
                <table className="table table-bordered table-hover table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Màn hình</th>
                      <td>{product?.screen?.size}</td>
                    </tr>
                    <tr>
                      <th scope="row">CPU</th>
                      <td>{product?.processor?.cpuTechnology}</td>
                    </tr>
                    <tr>
                      <th scope="row">RAM</th>
                      <td>{product?.ram?.ramCapacity}</td>
                    </tr>
                    <tr>
                      <th scope="row">Ổ cứng</th>
                      <td>{product?.storage?.storageDetail.type}</td>
                    </tr>
                    <tr>
                      <th scope="row">Đồ họa</th>
                      <td>{product?.card?.model}</td>
                    </tr>
                    <tr>
                      <th scope="row">Hệ điều hành</th>
                      <td>{product?.win?.version}</td>
                    </tr>
                  </tbody>
                </table>
                <a
                  className="text-center"
                  style={{ fontSize: "16px", textDecoration: "none" }}
                  onClick={showModal}
                >
                  {" "}
                  Xem chi tiết
                </a>

                <Modal
                  title={`Chi tiết thông số kĩ thuật ` + product.name}
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  style={{ padding: "0 !impotant" }}
                  width={800}
                  okButtonProps={{
                    style: {
                      display: "none",
                    },
                  }}
                  cancelText={"Đóng"}
                >
                  <div className="card">
                    <div className="card-header" style={{ textAlign: "left" }}>
                      Thông tin hàng hóa
                    </div>
                    <div className="card-body row">
                      <div className="col-6">
                        <li>Xuất xứ: {product.origin.name}</li>
                        <li>Thương hiệu: {product.manufacture.name} </li>
                      </div>
                      <div className="col-6">
                        <li>Thời điểm ra mắt:{product.debut} </li>
                        <li>Hướng dẫn bảo quản: Để nơi khô ráo, nhẹ tay</li>
                      </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                      Thiết kế trọng lượng
                    </div>
                    <div className="card-body">
                      <li>
                        Kích thước: {product.width} x {product.height} x{" "}
                        {product.length}
                      </li>
                      <li>Trọng lượng sản phẩm: {product.weight}kg</li>
                      <li>Chất liệu: {product.material}</li>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                      Bộ xử lí
                    </div>
                    <div className="card-body row">
                      <div className="col-6">
                        <li>Hãng CPU: {product.processor.cpuCompany}</li>
                        <li>
                          Công nghệ CPU: {product.processor.cpuTechnology}
                        </li>
                        <li>Tốc độ CPU: {product.processor.cpuSpeed}</li>
                        <li>Tốc độ tối đa CPU: {product.processor.maxSpeed}</li>
                      </div>
                      <div className="col-6">
                        <li>Loại CPU: {product.processor.cpuType}</li>
                        <li>Số nhân: {product.processor.multiplier}</li>
                        <li>Số luồng: {product.processor.numberOfThread}</li>
                        <li>Bộ nhớ đệm: {product.processor.caching}</li>
                      </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                      RAM
                    </div>
                    <div className="card-body row">
                      <div className="col-6">
                        <li>Dung lượng RAM: {product.ram.ramCapacity}</li>
                        <li>Loại RAM: {product.ram.typeOfRam}</li>
                        <li>Tốc độ RAM: {product.ram.ramSpeed}</li>
                        <li>Số khe cắm rời: {product.ram.looseSlot}</li>
                      </div>
                      <div className="col-6">
                        <li>Số khe RAM còn lại: {product.ram.remainingSlot}</li>
                        <li>Số RAM onboard: {product.ram.onboardRam}</li>
                        <li>Hỗ trợ RAM tối đa: {product.ram.maxRamSupport}</li>
                      </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                      Màn Hình
                    </div>
                    <div className="card-body row">
                      <div className="col-6">
                        <li>Kích thước màn hình: {product.screen.size}</li>
                        <li>
                          Công nghệ màn hình: {product.screen.screenTechnology}
                        </li>
                        <li>Độ phân giải: {product.screen.resolution}</li>
                        <li>Tần số quét: {product.screen.scanFrequency}</li>
                        <li>Tấm nền: {product.screen.backgroundPanel}</li>
                      </div>
                      <div className="col-6">
                        <li>Độ sáng: {product.screen.brightness}</li>
                        <li>Độ phủ màu: {product.screen.colorCoverage}</li>
                        <li>Tỷ lệ màn hình: {product.screen.resolution}</li>
                        <li>
                          Màn hình cảm ứng: {product.screen.backgroundPanel}
                        </li>
                        <li>Độ tương phản: {product.screen.contrast}</li>
                      </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                      Đồ họa
                    </div>
                    <div className="card-body row">
                      <div className="col-6">
                        <li>
                          <span style={{ fontSize: "20px", fontWeight: "600" }}>
                            Card onboard
                          </span>
                        </li>
                        <li>Hãng: {product.cardOnboard.trandemark}</li>
                        <li>Model: {product.cardOnboard.model}</li>
                        <li>Bộ nhớ: {product.cardOnboard.memory}</li>
                      </div>
                      <div className="col-6">
                        <li>
                          <span style={{ fontSize: "20px", fontWeight: "600" }}>
                            Card rời
                          </span>
                        </li>
                        <li>Hãng: {product.card.trandemark}</li>
                        <li>Model: {product.card.model}</li>
                        <li>Bộ nhớ: {product.card.memory}</li>
                      </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                      Lưu trữ
                    </div>
                    <div className="card-body row">
                      <div className="col-6">
                        <li>
                          Kiểu ổ cứng: {product.storage.storageDetail.type}
                        </li>
                        <li>Số khe cắm: {product.storage.number}</li>
                        <li>
                          Loại SSD:
                          {product.storage.storageDetail.storageType.name}
                        </li>
                        <li>
                          Dung lượng: {product.storage.storageDetail.capacity}
                        </li>
                      </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                      Bảo mật
                    </div>
                    <div className="card-body row">
                      <li>{product.security}</li>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                      Hệ điều hành
                    </div>
                    <div className="card-body row">
                      <li>OS: {product.win.name}</li>
                      <li>Version: {product.win.version}</li>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          <div className="mb-5 mt-5">
            <div className="col-12 text-center mb-4">
              <p style={{ fontSize: "30px", fontWeight: "600" }}>
                NHỮNG SẢN PHẨM TƯƠNG TỰ
              </p>
            </div>
            {productCate.length != 0 ? (
              <div className="row">
                <div className="col-md-12">
                  <div className="row list-product">
                    {productCate.map((pro) => (
                      <div className="product col-2" key={pro.id}>
                        <div className="product-img">
                          <img
                            src={pro.images ? pro.images[0]?.name : product1}
                            alt=""
                          />
                          <div className="product-label">
                            <span className="new">NEW</span>
                          </div>
                        </div>
                        <div className="product-body">
                          <h3
                            className="product-name"
                            onClick={() => handelCLickProduct(pro)}
                            style={{ wordWrap: "break-word" }}
                          >
                            <a href="/user/product">{pro.name}</a>
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
                        <div className="add-to-cart">
                          <button className="add-to-cart-btn">
                            <ShoppingCart size={18}></ShoppingCart> thêm vào giỏ
                            hàng
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-danger fs-6 fw-bold">
                Không có sản phẩm nào
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewProduct;
