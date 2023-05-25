import React, { useEffect, useState } from "react";
import "./css/layout.css";
import {
  Phone,
  MapPin,
  DollarSign,
  User,
  Heart,
  LogOut,
  ShoppingCart,
} from "react-feather";
import { Link } from "react-router-dom";
import logo from "../../asset/images/LOGO LAPTOP.png";
import { useNavigate } from "react-router-dom";
import qs from "qs";
import { AutoComplete, Image, Select } from "antd";
import { useContext } from "react";
import Context from "../../store/Context";
import { viewProduct } from "../../store/Actions";
import firebase from "../../pages/customer/firebase";

var isLogin = localStorage.getItem("token")?localStorage.getItem("token"):(localStorage.getItem("phoneNumber")?localStorage.getItem("phoneNumber"):undefined);

function Menu() {
  const renderItem = (id, title, count, price) => ({
    value: id,
    label: (
      <div
        style={{
          display: "flex",
        }}
      >
        <span>
          <Image width={85} src={count} />
        </span>
        {title}
      </div>
    ),
    price: price,
  });
  const [tableParamPro, setTableParamPro] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
      searchStatus: "ACTIVE",
    },
  });
  const loadDataProduct = () => {
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        const dataResult = [];
        results.data.data.forEach((item) => {
          dataResult.push(
            renderItem(item.id, item.name, item?.images[0]?.name, item.price)
          );
          setData(dataResult);
        });
      });
  };
  const [search, setSearch] = useState();
  const [values, setValues] = useState();
  const onChangeSearch = (event) => {
    setValues(event);
  };
  const onSelectAuto = (value) => {
    getProductById(value);
    setValues("");
  };
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchProductKey: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
    searchPrice: params.pagination?.search3,
    searchPn: params.pagination?.search4,
    searchImei:params.pagination?.search5,
    searchStatus: params.pagination?.searchStatus,
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });
  const url = "http://localhost:8080/api/products";
  const [data, setData] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const onChangeProduct = (value) => {
    // getProductById(value)
  };
  const [state, dispatch] = useContext(Context);
  const getProductById = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        // dispatch(viewProduct(res));
        console.log("vào");
        localStorage.removeItem("product_detail");
        localStorage.setItem("product_detail", JSON.stringify(res));
        navigate("/user/product");
      });
  };
  let navigate = useNavigate();
  const yourCart = () => {
    navigate("/user/cart");
  };

  const toAdmin = () => {
    if (
      localStorage.getItem("token") == null ||
      localStorage.getItem("token") == ""
    ) {
      navigate("/login");
    } else {
      navigate("/admin/order");
    }
  };

  const yourOrder = () => {
    if (
      (localStorage.getItem("token") == null ||
      localStorage.getItem("token") == "")&&(localStorage.getItem("phoneNumber")==null||localStorage.getItem("phoneNumber")==undefined)
    ) {
      navigate("/login");
    } else {
      navigate("/user/order");
    }
  };

  const Warranty_Policy = () => {
    navigate("/policy");
  };

  const logout = () => {
    localStorage.removeItem("phoneNumber");
    firebase.auth().signOut();
    window.location.href = "/";
    localStorage.removeItem("roles");
    localStorage.removeItem("username");
    localStorage.removeItem("information");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("carts");
    localStorage.removeItem("cartCheckout");
    localStorage.removeItem("districtId");
    localStorage.removeItem("ProvinceID");
    localStorage.removeItem("wardCode");
  };

  const login = () => {
    navigate("/login");
  };

  const chinhSachBH = () => {
    navigate("/policy");
  };

  const info = () => {
    navigate("/auth/information");
  };
  //load trang sản phẩm find.js
  const getDataProductsFind = () => {
    fetch(`http://localhost:8080/api/products/getAllProAccess` + `?${qs.stringify(
        getRandomuserParams({
          pagination: {
            current: 1,
            pageSize: 100,
            search1: "",
            search2: "",
            search3: "",
            search4: "",
            search5: "",
            searchStatus: "ACTIVE"
          }})
    )}`)
        .then((res) => res.json())
        .then((results) => {
            localStorage.setItem("productFilter",JSON.stringify(results.data.data))
        });
};

  useEffect(() => {
    // getData();
    loadDataProduct();
    getDataProductsFind();
  }, []);

  const idUser = localStorage.getItem("id");

  return (
    <>
      <header>
        <div id="top-header">
          <div className="container">
            <ul className="nav">
              <li className="nav-item">
                <a>
                  <Phone size={14} color="red"></Phone>
                  024 7106 9999
                </a>
              </li>
              <li className="nav-item">
                <a>
                  <MapPin size={12} color="red"></MapPin>
                  125 P. Trần Đại Nghĩa, Bách Khoa, Hai Bà Trưng, Hà Nội
                </a>
              </li>
            </ul>
            <ul className="nav justify-content-end">
              <li className="nav-item">
                <a style={{ color: "white" }} onClick={chinhSachBH}>
                  Chính sách
                </a>
              </li>
              {idUser == null ? (
                ""
              ) : (
                <li className="nav-item">
                  <a style={{ color: "white" }} onClick={info}>
                    Thông tin
                  </a>
                </li>
              )}
              <li className="nav-item">
                { (localStorage.getItem("roles") == "STAFF") || ( localStorage.getItem("roles") == "ADMIN")  ? (
                  <a style={{ color: "white" }} onClick={toAdmin}>
                    <DollarSign size={12} color="red"></DollarSign>
                    Quản trị
                  </a>
                ) : (
                  ""
                )}
              </li>
              <li className="nav-item">
                {localStorage.getItem("username") != undefined||localStorage.getItem("phoneNumber") != undefined ? (
                  <a style={{ color: "white" }} >
                    <User size={12} color="red"></User>
                    Xin chào, {localStorage.getItem("username")?localStorage.getItem("username"):localStorage.getItem("phoneNumber")}
                  </a>
                ) : (
                  ""
                )}
              </li>
              <li className="nav-item">
                {(localStorage.getItem("token")||localStorage.getItem("phoneNumber")) ? (
                  <a onClick={logout}>
                    <LogOut size={12} color="red"></LogOut>
                    Đăng xuất
                  </a>
                ) : (
                  <a onClick={login}>
                    <User size={12} color="red"></User>
                    Đăng nhập
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div id="header">
          <div className="container">
            <div className="row d-flex justify-conten-center">
              <div className="col-md-3">
                <div className="header-logo">
                  <Link to="/user" className="logo1">
                    <img src={logo} alt="" className="logo_content" />
                  </Link>
                </div>
              </div>

              <div className="col-md-6">
                <div className="header-search">
                  <AutoComplete
                    name={"search"}
                    style={{
                      width: 700,
                    }}
                    allowClear={true}
                    options={data}
                    onChange={(event) => onChangeSearch(event)}
                    onSelect={onSelectAuto}
                    value={values}
                    placeholder="Chọn sản phẩm"
                    filterOption={(inputValue, option) =>
                      option.label.props.children[1]
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </div>
              </div>

              <div className="col-md-3 clearfix">
                <div className="header-ctn">
                  <div>
                    <a style={{ color: "white" }} onClick={yourOrder}>
                      <Heart></Heart>
                      <span> Đơn hàng</span>
                    </a>
                  </div>

                  <div className="">
                    <a
                      style={{ color: "white" }}
                      onClick={yourCart}
                      aria-expanded="true"
                    >
                      <ShoppingCart></ShoppingCart>
                      <span> Giỏ hàng</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Menu;
