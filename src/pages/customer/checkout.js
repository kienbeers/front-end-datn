import { EyeOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { render } from "@testing-library/react";
import {
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Button,
  message,
  Upload,
  Image,
  AutoComplete,
} from "antd";
import { Option } from "antd/lib/mentions";
import axios from "axios";
import qs from "qs";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreContext from "../../store/Context";
import "./css/checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(StoreContext);
  //const [carts, setCarts] = useState(state.cartCheckout);
  const carts= JSON.parse(localStorage.getItem("cartCheckout"))?JSON.parse(localStorage.getItem("cartCheckout")):[];
  const [valueDistrict, setValueDistrict] = useState("");
  const [array, setArray] = useState([{}]);
  const [district, setDistrict] = useState([{}]);
  const [ProvinceID, setProvinceID] = useState(localStorage.getItem("ProvinceID")?localStorage.getItem("ProvinceID"):null);
  const [value, setValue] = useState("");
  const [districtId, setDistrictId] = useState(localStorage.getItem("districtId")?parseInt(localStorage.getItem("districtId")):null);
  const [serviceId, setServiceId] = useState(localStorage.getItem("serviceId")?parseInt(localStorage.getItem("serviceId")):null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [Ward, setWard] = useState([{}]);
  const [valueWard, setValueWard] = useState("");
  const [shipping, setShipping] = useState(0);
  const [address, setAddRess] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [type, setType] = useState();
  const [payment, setPayment] = useState();
  const [total, setTotal] = useState();
  const [status, setStatus] = useState();
  const [user, setUser] = useState();
  const [totalHeight, setTotalHeight] = useState();
  const [totalLength, setTotalLength] = useState();
  const [totalWeight, setTotalWeight] = useState();
  const [totalWith, setTotalWidth] = useState();
  const [disableCountry, setDisableCountry] = useState(false);
  //const [valueProvince, setValueProvince] = useState("");
  const [wardCode, setWardCode] = useState(localStorage.getItem("wardCode")?localStorage.getItem("wardCode"):null);
  const information = JSON.parse(localStorage.getItem("information"));
  const renderItem = (id, title, count, price) => ({
    value: id,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
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
  const [values, setValues] = useState();
  const onChangeSearch = (event) => {
    setValues(event);
  };
  const onSelectAuto = (value) => {
    //setValueProduct(value);
    const a = products.filter((item) => value == item.id)[0];
    a.quantity = 1;
    if (a != undefined) {
      setProductAdd([...productAdd, a]);
    }
    setValues("");
  };

  //const [wardCode, setWardCode] = useState();

  const onChangeInputNumber = (value, event) => {
    value.quantity = event;
    dispatch({
      type: "CHANGE_CART_CHECKOUT_QTY",
      payload: {
          id: value.id,
          quantity: event,
      }
  })

  if (type == 1) {
    console.log("vào submit 2");
    value.quantity = event;
    loadInfo(JSON.parse(localStorage.getItem("cartCheckout"))?JSON.parse(localStorage.getItem("cartCheckout")):[]);
    //SubmitShipping2(wardCode);
    loadDataProvince();
  }
  value.quantity = event;
  loadInfo(JSON.parse(localStorage.getItem("cartCheckout"))?JSON.parse(localStorage.getItem("cartCheckout")):[]);
  };

  const onclickDeleteCart = (pro) => {
      dispatch({
          type: "REMOVE_CART_CHECKOUT",
          payload: pro
      });
      if (type == 1) {
        //SubmitShipping2(wardCode);
        loadInfo(carts);
        loadDataProvince();
      }
  };
  // modal
  // const onClickShow = (value) => {
  //   console.log(value.images[0]);
  // };
  const onclickDelete = (value) => {
    setProductAdd(productAdd.filter((item) => item != value));
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    // setIsModalOpen(false);
    // setProductAdd([]);
    // setCarts(carts.concat(productAdd));
    // console.log("s", carts);
    // console.log("carts", carts);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // add product
  const [productAdd, setProductAdd] = useState([]);
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: "25%",
      render: (id, data) => {
        return (
          <>
            <img width={150} src={data?.images[0]?.name} />
          </>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: "45%",
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: "15%",
    },
    {
      title: "Thao tác",
      dataIndex: "",
      render: (id, data) => {
        return (
          <>
            {/* <EyeOutlined
              style={{ fontSize: "18px", marginLeft: "20%" }}
              onClick={() => {
                onClickShow(data);
              }}
            /> */}
            <DeleteOutlined
              style={{ fontSize: "18px", marginLeft: "20%", color: "red" }}
              onClick={() => {
                onclickDelete(data);
              }}
            />
          </>
        );
      },
    },
  ];

  const url = "http://localhost:8080/api/products";
  const [totalSet, setTotalSet] = useState(10);
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
    searchStatus: params.pagination?.searchStatus,
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
      searchStatus: "ACTIVE",
    },
  });
  //APILoadList Product
  const [cherang, setCherang] = useState([]);
  const getData = () => {
    axios
      .get(url + `?${qs.stringify(getRandomuserParams(tableParams))}`)
      .then((results) => {
        const dataResult = [];
        results.data.data.data.forEach((item) => {
          dataResult.push(
            renderItem(item.id, item.name, item?.images[0]?.name, item.price)
          );
          setCherang(dataResult);
        });
        setData(results.data.data.data);
        setTotal(results.data.data.total);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          },
        });
      });
  };

  

  const createOrder = () => {
    var districtName="";
    var wardName="";
    var provinceName="";
    
    console.log("create order");
    console.log("districtId",districtId);
    var regExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    var phoneTest = phone.match(regExp);
    if ((JSON.parse(localStorage.getItem("cartCheckout"))?JSON.parse(localStorage.getItem("cartCheckout")):[]).length<=0) {
      toastError("Vui lòng thêm sản phẩm!");
    } else if (name === ""||name?.trim() === ""  || name == null) {
      toastError("Vui lòng nhập đầy đủ họ tên!");
    } else if (phone === ""||phone?.trim() === ""  || phone == null) {
      toastError("Vui lòng nhập đầy đủ số điện thoại!");
    } else if(regExp.test(phone) == false){
      toastError("Vui lòng nhập đúng định dạng số điện thoại!");
    }else if (type === "" || type == null) {
      toastError("Vui lòng chọn hình thức lấy hàng!");
    } else if (payment == "" || payment == null) {
      toastError("Vui lòng chọn hình thức thanh toán!");
    } else {
      if (type == 1) {//Tai nha
        array.map((item) => (ProvinceID==item.ProvinceID?provinceName=item.ProvinceName:""));
        district.map((item) => (districtId==item.DistrictID?districtName=item.DistrictName:""));
        Ward.map((item) => ((wardCode==item.WardCode||valueWard==item.WardName)?wardName=item.WardName:""));
        if (provinceName==undefined||provinceName==null||provinceName=="") {
          toastError("Vui lòng chọn tỉnh!");
        } else if (districtName==undefined||districtName==null||districtName=="") {
          toastError("Vui lòng chọn huyện!");
        } else if (wardName==undefined||wardName==null||wardName=="") {
          toastError("Vui lòng chọn xã!");
        } else if (address==undefined||address==null||address.trim()=="") {
          toastError("Vui lòng nhập địa chỉ!");
        }else{
          if (parseInt(getTotal(carts)) > 200000000) {
            toastError("Số tiền đặt hàng không vượt quá 200 triệu");
          } else {
            if (payment === "DAT_COC") {
              localStorage.setItem(
                "total",
                parseInt(getTotal(carts)) + parseInt(shipping)
              );
              localStorage.setItem("payment", payment);
              localStorage.setItem("shipping", shipping);
              localStorage.setItem("address", address);
              localStorage.setItem("type", type);
              localStorage.setItem("phone", phone);
              localStorage.setItem("customerName", name);
              localStorage.setItem("status", status);
              localStorage.setItem(
                "orderDetails",
                JSON.stringify(getListSetListOrderDetails(carts))
              );
              localStorage.setItem("valueWard", valueWard);
              localStorage.setItem("valueDistrict", valueDistrict);
              localStorage.setItem("value", value);
              fetch(`http://localhost:8080/api/vnpay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  vnp_OrderInfo: "Đặt cọc qua VnPay cho khách hàng " + name,
                  orderType: "other",
                  amount: (parseInt(getTotal(carts)) + parseInt(shipping)) * 0.1,
                  bankCode: "NCB",
                  language: "vn",
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  window.location = data.paymentUrl;
                });
            } else if (payment === "NGAN_HANG") {
              console.log("Chuyển khoản qua ngân hàng");
              localStorage.setItem(
                "total",
                parseInt(getTotal(carts)) + parseInt(shipping)
              );
              localStorage.setItem("payment", payment);
              localStorage.setItem("shipping", shipping);
              localStorage.setItem("address", address);
              localStorage.setItem("type", type);
              localStorage.setItem("phone", phone);
              localStorage.setItem("customerName", name);
              localStorage.setItem("status", status);
              localStorage.setItem(
                "orderDetails",
                JSON.stringify(getListSetListOrderDetails(carts))
              );
              localStorage.setItem("valueWard", valueWard);
              localStorage.setItem("valueDistrict", valueDistrict);
              localStorage.setItem("value", value);
    
              let diachi;
              let tongGia;
              // if (type == 0) {
              //   diachi = "Tại cửa hàng";
              //   tongGia = parseInt(getTotal(carts));
              // } else {
                diachi =
                  address.replace(',', '-') +
                  ", " +
                  valueWard +
                  ", " +
                  valueDistrict +
                  ", " +
                  value;
                tongGia = parseInt(getTotal(carts)) + parseInt(shipping);
              // }
    
              // Tạo hóa đơn
              //kiem tra dang nhap với tài khoản
              if(localStorage.getItem("id")!=null){
                try {
                  fetch("http://localhost:8080/api/auth/orders", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                      payment: payment,
                      userId: localStorage.getItem("id")?localStorage.getItem("id"):localStorage.getItem("phone"),
                      total: parseInt(getTotal(carts)) + parseInt(shipping),
                      address: diachi,
                      note: "",
                      customerName: localStorage.getItem("customerName"),
                      phone: localStorage.getItem("phone"),
                      status: "CHUA_THANH_TOAN",
                      money: 0,
                      shippingFree: shipping,
                      orderDetails: getListSetListOrderDetails(carts),
                    }),
                  })
                    .then((res) => res.json())
                    .then((results) => {
                      if (results.status === 200) {
                        toastSuccess("Thêm hoá đơn thành công");
                        localStorage.removeItem("total");
                        localStorage.removeItem("payment");
                        localStorage.removeItem("address");
                        localStorage.removeItem("type");
                        localStorage.removeItem("phone");
                        localStorage.removeItem("customerName");
                        localStorage.removeItem("status");
                        localStorage.removeItem("orderDetails");
                        localStorage.removeItem("valueWard");
                        localStorage.removeItem("valueDistrict");
                        localStorage.removeItem("value");
                        localStorage.removeItem("cartCheckout");
                        if (
                          (localStorage.getItem("token") == null ||
                          localStorage.getItem("token") == "")&&(localStorage.getItem("phoneNumber")==null||localStorage.getItem("phoneNumber")==undefined)
                        ) {
                          navigate("/login");
                        } else {
                          navigate("/user/order");
                        }
                        // resetInputField();
                      } else {
                        toastError("Thêm hoá đơn thất bại");
                      }
                    });
                } catch (err) {
                  toastError("Thêm hoá đơn thất bại");
                }
              }else{//không đăng nhập tài khoản
              try {
                fetch("http://localhost:8080/api/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    payment: payment,
                    userId: null,
                    total: parseInt(getTotal(carts)) + parseInt(shipping),
                    address: diachi,
                    note: "",
                    customerName: localStorage.getItem("customerName"),
                    phone: localStorage.getItem("phone"),
                    status: "CHUA_THANH_TOAN",
                    money: 0,
                    shippingFree: shipping,
                    orderDetails: getListSetListOrderDetails(carts),
                  }),
                })
                  .then((res) => res.json())
                  .then((results) => {
                    if (results.status === 200) {
                      toastSuccess("Thêm hoá đơn thành công");
                      localStorage.removeItem("total");
                      localStorage.removeItem("payment");
                      localStorage.removeItem("address");
                      localStorage.removeItem("type");
                      localStorage.removeItem("phone");
                      localStorage.removeItem("customerName");
                      localStorage.removeItem("status");
                      localStorage.removeItem("orderDetails");
                      localStorage.removeItem("valueWard");
                      localStorage.removeItem("valueDistrict");
                      localStorage.removeItem("value");
                      localStorage.removeItem("cartCheckout");
                      navigate("/user/order");
                      // resetInputField();
                    } else {
                      toastError("Thêm hoá đơn thất bại");
                    }
                  });
              } catch (err) {
                toastError("Thêm hoá đơn thất bại");
              }
              }
            } else {//Thanh toán
              localStorage.setItem(
                "total",
                parseInt(getTotal(carts)) + parseInt(shipping)
              );
              localStorage.setItem("payment", payment);
              localStorage.setItem("shipping", shipping);
              localStorage.setItem("address", address);
              localStorage.setItem("type", type);
              localStorage.setItem("phone", phone);
              localStorage.setItem("customerName", name);
              localStorage.setItem("status", status);
              localStorage.setItem(
                "orderDetails",
                JSON.stringify(getListSetListOrderDetails(carts))
              );
              localStorage.setItem("valueWard", valueWard);
              localStorage.setItem("valueDistrict", valueDistrict);
              localStorage.setItem("value", value);
              fetch(`http://localhost:8080/api/vnpay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  vnp_OrderInfo: "Thanh toán qua VnPay cho khách hàng " + name,
                  orderType: "other",
                  amount: parseInt(getTotal(carts)) + parseInt(shipping),
                  bankCode: "NCB",
                  language: "vn",
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  window.location = data.paymentUrl;
                });
            }
          }
        }
        const info={
          fullName:name,
          phoneNumber:phone,
          address:(address.replace(',', '-')).trim()+", "+wardName+", "+districtName.trim()+", "+provinceName.trim()
        }
        localStorage.setItem("information",JSON.stringify([info]));
        localStorage.setItem("districtId",districtId);
        localStorage.setItem("ProvinceID",ProvinceID);
        localStorage.setItem("wardCode",wardCode);
        //SubmitShipping2(wardCode);
        loadInfo(carts);

      //Tại cửa hàng
      }else{//type=0 
        if (parseInt(getTotal(carts)) > 200000000) {
          toastError("Số tiền đặt hàng không vượt quá 200 triệu");
        } else {
          if (payment === "DAT_COC") {
            localStorage.setItem(
              "total",
              parseInt(getTotal(carts)) + parseInt(shipping)
            );
            localStorage.setItem("payment", payment);
            localStorage.setItem("address", address);
            localStorage.setItem("type", type);
            localStorage.setItem("phone", phone);
            localStorage.setItem("customerName", name);
            localStorage.setItem("status", status);
            localStorage.setItem(
              "orderDetails",
              JSON.stringify(getListSetListOrderDetails(carts))
            );
            localStorage.setItem("valueWard", valueWard);
            localStorage.setItem("valueDistrict", valueDistrict);
            localStorage.setItem("value", value);
            fetch(`http://localhost:8080/api/vnpay`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                vnp_OrderInfo: "Đặt cọc qua VnPay cho khách hàng " + name,
                orderType: "other",
                amount: (parseInt(getTotal(carts)) + parseInt(shipping)) * 0.1,
                bankCode: "NCB",
                language: "vn",
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                window.location = data.paymentUrl;
              });
          } else if (payment === "NGAN_HANG") {
            console.log("Chuyển khoản qua ngân hàng");
            localStorage.setItem(
              "total",
              parseInt(getTotal(carts)) + parseInt(shipping)
            );
            localStorage.setItem("payment", payment);
            localStorage.setItem("address", address);
            localStorage.setItem("type", type);
            localStorage.setItem("phone", phone);
            localStorage.setItem("customerName", name);
            localStorage.setItem("status", status);
            localStorage.setItem(
              "orderDetails",
              JSON.stringify(getListSetListOrderDetails(carts))
            );
            localStorage.setItem("valueWard", valueWard);
            localStorage.setItem("valueDistrict", valueDistrict);
            localStorage.setItem("value", value);

            let diachi;
            let tongGia;
            if (type == 0) {
              diachi = "Tại cửa hàng";
              tongGia = parseInt(getTotal(carts));
            } else {
              diachi =
                address.replace(',', '-') +
                ", " +
                valueWard +
                ", " +
                valueDistrict +
                ", " +
                value;
              tongGia = parseInt(getTotal(carts)) + parseInt(shipping);
            }

            // Tạo hóa đơn
            //kiem tra dang nhap
            if(localStorage.getItem("id")!=null){
              try {
                fetch("http://localhost:8080/api/auth/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    payment: payment,
                    userId: localStorage.getItem("id")?localStorage.getItem("id"):localStorage.getItem("phone"),
                    total: parseInt(getTotal(carts)) + parseInt(shipping),
                    address: diachi,
                    note: "",
                    customerName: localStorage.getItem("customerName"),
                    phone: localStorage.getItem("phone"),
                    status: "CHUA_THANH_TOAN",
                    money: 0,
                    shippingFree: shipping,
                    orderDetails: getListSetListOrderDetails(carts),
                  }),
                })
                  .then((res) => res.json())
                  .then((results) => {
                    if (results.status === 200) {
                      toastSuccess("Thêm hoá đơn thành công");
                      localStorage.removeItem("total");
                      localStorage.removeItem("payment");
                      localStorage.removeItem("address");
                      localStorage.removeItem("type");
                      localStorage.removeItem("phone");
                      localStorage.removeItem("customerName");
                      localStorage.removeItem("status");
                      localStorage.removeItem("orderDetails");
                      localStorage.removeItem("valueWard");
                      localStorage.removeItem("valueDistrict");
                      localStorage.removeItem("value");
                      localStorage.removeItem("cartCheckout");
                      navigate("/user/order");
                      // resetInputField();
                    } else {
                      toastError("Thêm hoá đơn thất bại");
                    }
                  });
              } catch (err) {
                toastError("Thêm hoá đơn thất bại");
              }
            }else{
            try {
              fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payment: payment,
                  userId: null,
                  total: parseInt(getTotal(carts)) + parseInt(shipping),
                  address: diachi,
                  note: "",
                  customerName: localStorage.getItem("customerName"),
                  phone: localStorage.getItem("phone"),
                  status: "CHUA_THANH_TOAN",
                  money: 0,
                  shippingFree: shipping,
                  orderDetails: getListSetListOrderDetails(carts),
                }),
              })
                .then((res) => res.json())
                .then((results) => {
                  if (results.status === 200) {
                    toastSuccess("Thêm hoá đơn thành công");
                    localStorage.removeItem("total");
                    localStorage.removeItem("payment");
                    localStorage.removeItem("address");
                    localStorage.removeItem("type");
                    localStorage.removeItem("phone");
                    localStorage.removeItem("customerName");
                    localStorage.removeItem("status");
                    localStorage.removeItem("orderDetails");
                    localStorage.removeItem("valueWard");
                    localStorage.removeItem("valueDistrict");
                    localStorage.removeItem("value");
                    localStorage.removeItem("cartCheckout");
                    navigate("/user/order");
                    // resetInputField();
                  } else {
                    toastError("Thêm hoá đơn thất bại");
                  }
                });
            } catch (err) {
              toastError("Thêm hoá đơn thất bại");
            }
            }
          } else {
            localStorage.setItem(
              "total",
              parseInt(getTotal(carts)) + parseInt(shipping)
            );
            localStorage.setItem("payment", payment);
            localStorage.setItem("address", address);
            localStorage.setItem("type", type);
            localStorage.setItem("phone", phone);
            localStorage.setItem("customerName", name);
            localStorage.setItem("status", status);
            localStorage.setItem(
              "orderDetails",
              JSON.stringify(getListSetListOrderDetails(carts))
            );
            localStorage.setItem("valueWard", valueWard);
            localStorage.setItem("valueDistrict", valueDistrict);
            localStorage.setItem("value", value);
            fetch(`http://localhost:8080/api/vnpay`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                vnp_OrderInfo: "Thanh toán qua VnPay cho khách hàng " + name,
                orderType: "other",
                amount: parseInt(getTotal(carts)) + parseInt(shipping),
                bankCode: "NCB",
                language: "vn",
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                window.location = data.paymentUrl;
              });
          }
        }
      }
    }
  };

  const formatCash = (str) => {
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
  };

  const getListSetListOrderDetails = (carts) => {
    let cartList = carts;
    let listItem = [];
    let item;
    for (var i = 0; i < cartList.length; i++) {
      item = {
        productId: cartList[i].id,
        total: cartList[i].price * cartList[i].quantity,
        quantity: cartList[i].quantity,
        status: status === "CHO_XAC_NHAN" ? "CHO_XAC_NHAN" : "CHO_LAY_HANG",
      };
      listItem.push(item);
    }
    return listItem;
  };

  useEffect(() => {
    setProvinceID(ProvinceID?ProvinceID:(localStorage.getItem("ProvinceID")?localStorage.getItem("ProvinceID").trim():null));
    setDistrictId(localStorage.getItem("districtId")?localStorage.getItem("districtId").trim():null);
    setWardCode(localStorage.getItem("wardCode")?localStorage.getItem("wardCode").trim():null);
    setValue(information?information[0].address?.split(",")[3]?.trim():null);
    setValueDistrict(information?information[0].address?.split(",")[2]?.trim():null);
    setValueWard(information?information[0].address?.split(",")[1]?.trim():null);
    setAddRess(information?information[0].address?.split(",")[0]?.trim():"");
    setName(information?information[0].fullName.trim():"");
    setPhone(information?information[0].phoneNumber.trim():"");
    setTotal(getTotal(carts));
    loadInfo(carts);
    getData();
  }, []);

  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setValueDistrict(e.target.value);
    }
  };

  const changePayment = (event) => {
    setPayment(event.target.value);
    console.log(event.target.value);
    if (event.target.value === "DAT_COC") {
      setStatus("CHO_XAC_NHAN");
    } else {
      setStatus("CHO_LAY_HANG");
    }
  };

  const onChangeDistricts = (value) => {
    var districtName="";
    var wardName="";
    var provinceName="";
      array.map((item) => (ProvinceID==item.ProvinceID?provinceName=item.ProvinceName:""));
      district.map((item) => (value==item.DistrictID?districtName=item.DistrictName:""));
      Ward.map((item) => ((wardCode==item.WardCode||valueWard==item.WardName)?wardName=item.WardName:""));
    const info={
      fullName:name,
      phoneNumber:phone,
      address:address?((address.replace(',', '-')).trim()):""+", "+wardName+", "+districtName.trim()+", "+provinceName.trim()
    }
    localStorage.setItem("information",JSON.stringify([info]));
    if (value != null) {
      setIsDisabled(false);
    }
    setDistrictId(value);
    loadDataWard(value);
  };

  const onSearchDistricts = (value) => {
    if (value.target.innerText !== "") {
      setValueDistrict(value.target.innerText.trim());
      ///loadDataWard();
    }
  };

  const changeType = (event) => {
    console.log(event.target.value);
    setType(event.target.value);
    if (event.target.value == 1) {
        loadDataProvince();
    } else {
      setShipping(0);
    }
  };

  const changeAddress = (event) => {
    setAddRess(event.target.value);
  };

  const changeName = (event) => {
    console.log(event.target.value);
    setName(event.target.value);
  };

  const changePhone = (event) => {
    console.log(event.target.value);
    setPhone(event.target.value);
  };

  const SubmitShipping = (value, serviceId) => {
    let cartList = JSON.parse(localStorage.getItem("cartCheckout"))?JSON.parse(localStorage.getItem("cartCheckout")):[];
    let weight = 0;
    let width = 0;
    let height = 0;
    let length = 0;
    for (let i = 0; i < cartList.length; i++) {
      weight += cartList[i].weight * cartList[i].quantity;
      width += cartList[i].width * cartList[i].quantity;
      height += cartList[i].height * cartList[i].quantity;
      length += cartList[i].length * cartList[i].quantity;
    }
    if (value != null) {
      fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            service_id: serviceId,
            token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
          },
          body: JSON.stringify({
            service_id: serviceId,
            insurance_value: parseInt(getTotal(carts)),
            coupon: null,
            from_district_id: 3440,
            to_district_id: parseInt(districtId),
            height: Math.round(height * 0.1),
            length: Math.round(length * 0.1),
            weight: Math.round(weight * 1000),
            width: Math.round(width * 0.1),
            to_ward_code: value,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("ship", data.data.total);
          setShipping(data.data.total);
        });
    }
  };

  const SubmitShipping1 = (value, serviceId, idDistrict) => {
    let cartList = JSON.parse(localStorage.getItem("cartCheckout"))?JSON.parse(localStorage.getItem("cartCheckout")):[];
    let weight = 0;
    let width = 0;
    let height = 0;
    let length = 0;
    for (let i = 0; i < cartList.length; i++) {
      weight += cartList[i].weight * cartList[i].quantity;
      width += cartList[i].width * cartList[i].quantity;
      height += cartList[i].height * cartList[i].quantity;
      length += cartList[i].length * cartList[i].quantity;
    }
    if (value != null) {
      fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            service_id: serviceId,
            token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
          },
          body: JSON.stringify({
            service_id: serviceId,
            insurance_value: parseInt(getTotal(cartList)),
            coupon: null,
            from_district_id: 3440,
            to_district_id: idDistrict,
            height: Math.round(height * 0.1),
            length: Math.round(length * 0.1),
            weight: Math.round(weight * 1000),
            width: Math.round(width * 0.1),
            to_ward_code: value,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("ship", data.data.total);
          setShipping(data.data.total);
        });
    }
  };

  //tinh ship khi thay doi so luong sp
  const SubmitShipping2 = (valueCodeWard) => {
    if (valueCodeWard != null) {
      console.log("CodeWard", valueCodeWard);
      //setWardCode(valueCodeWard);
      console.log("serviceId shipping2",serviceId);
      fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            shop_id: 3379752,
            token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
          },
          body: JSON.stringify({
            service_id: serviceId,
            insurance_value: parseInt(getTotal(JSON.parse(localStorage.getItem("cartCheckout"))?JSON.parse(localStorage.getItem("cartCheckout")):[])),
            coupon: null,
            from_district_id: 3440,
            to_district_id: parseInt(districtId),
            height: Math.round(totalHeight * 0.1),
            length: Math.round(totalLength * 0.1),
            weight: Math.round(totalWeight * 1000),
            width: Math.round(totalLength * 0.1),
            to_ward_code: valueCodeWard,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("giá ship",data.data.total);
          setShipping(data.data.total);
        });
    }
  };

  const onChangeWards = (value) => {
    var districtName="";
    var wardName="";
    var provinceName="";
      array.map((item) => (ProvinceID==item.ProvinceID?provinceName=item.ProvinceName:""));
      district.map((item) => (districtId==item.DistrictID?districtName=item.DistrictName:""));
      Ward.map((item) => ((value==item.WardCode||valueWard==item.WardName)?wardName=item.WardName:""));
    const info={
      fullName:name,
      phoneNumber:phone,
      address:address?((address.replace(',', '-')).trim()):""+", "+wardName+", "+districtName.trim()+", "+provinceName.trim()
    }
    localStorage.setItem("information",JSON.stringify([info]));
    if (value === "") {
      setIsDisabled(true);
    }
    setWardCode(value);
    serviceShip(value);
    //SubmitShipping2(value);
    //loadDataProvince();
  };

  const onSearchWards = (value) => {
    if (value.target.innerText !== "") {
      setValueWard(value.target.innerText);
      //SubmitShipping();
    }
  };
  const serviceShip=(valueWardCode)=>{
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
        body: JSON.stringify({
          shop_id: 3379752,
          from_district: 1542,
          to_district: parseInt(districtId),
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data === null) {
          console.log("không có dữ liệu giao hàng phù hợp");
          setIsDisabled(true);
        } else {
          const checkService = data.data[0].service_id;
          setServiceId(checkService);
          console.log("wardCode",valueWardCode);
          SubmitShipping(valueWardCode,checkService);
        }
      })
  }
  const loadDataWard = (valueDistrict) => {
    //setDistrictId(valueDistrict);
    if (valueDistrict != null) {
      fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
          },
          body: JSON.stringify({
            shop_id: 3379752,
            from_district: 1542,
            to_district: valueDistrict,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data === null) {
            console.log("không có dữ liệu giao hàng phù hợp");
            setIsDisabled(true);
          } else {
            const checkService = data.data[0].service_id;
            setServiceId(checkService);
            localStorage.setItem("serviceId",checkService);
            fetch(
              "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
                },
                body: JSON.stringify({
                  district_id: valueDistrict,
                }),
              }
            )
              .then((response) => response.json())
              .then((result) => {
                if (result.data === null) {
                  console.log("không có dữ liệu phù hợp");
                } else {
                  console.log("Success ward:", result.data);
                  setWard(result.data);
                  for(var h=0; h<result.data.length;h++){
                    if (result.data[h].WardCode.trim() == wardCode||result.data[h].WardName.trim()==valueWard) {
                      console.log("element.WardName"+h,result.data[h].WardName);
                      console.log("element.WardCode"+h,result.data[h].WardCode);
                      SubmitShipping1(result.data[h].WardCode, checkService, valueDistrict);
                      break;
                    }else{
                      continue;
                    }
                  }
                }
              });
          }
        });
    }
  };

  const loadDataProvince = () => {
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.status);
      })
      .then((result) => {
        console.log(result.data);
        setArray(result.data);
        if(result.data.length>0){
          for(var i=0; i<result.data.length;i++){
            if (
              result.data[i].ProvinceID == ProvinceID||result.data[i].ProvinceName.trim()==(information?(information[0].address?.split(",")[3]?.trim()):"")
            ) {
              console.log("result.data[i].ProvinceID",result.data[i].ProvinceID);
              console.log("element.ProvinceName",result.data[i].ProvinceName);
              setProvinceID(result.data[i].ProvinceID);
              loadDataDistrict(result.data[i].ProvinceID);
              break;
            }else{
              continue;
            }
          }
        }
        
      })
      .catch((error) => {
        console.log("err", error);
      });
  };


  const loadDataDistrict = (value) => {
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
        body: JSON.stringify({
          province_id: value ? value : ProvinceID != 1,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.status);
      })
      .then((result) => {
        let dataDis = [];
        // if (value === 201) {
        //   result.data.splice(0, 1);
        //   result.data.splice(0, 1);
        //   dataDis = result.data;
        //   setDistrict(dataDis);
        //   console.log("h", result.data);
        // }
        // if (value === 202) {
        //   result.data.splice(1, 1);
        //   result.data.splice(1, 1);
        //   result.data.splice(2, 1);
        //   dataDis = result.data;
        //   setDistrict(dataDis);
        // }
        if (value === 268) {
          result.data.splice(0, 1);
          dataDis = result.data;
          setDistrict(dataDis);
          console.log(dataDis);
        } else {
          setDistrict(result.data);
        }

        // setDistrict(result.data);
        for(var k=0; k<result.data.length;k++){
          if (
            result.data[k].DistrictID == districtId||result.data[k].DistrictName ==valueDistrict
          ) {
            console.log("result.data[i].DistrictID",result.data[k].DistrictID);
            console.log("element.DistrictName",result.data[k].DistrictName);
            setDistrictId(result.data[k].DistrictID);
            loadDataWard(result.data[k].DistrictID);
            break;
          }else{
            continue;
          }
        }
      });
  };

  const toastSuccess = (message) => {
    toast.success(message, {
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

  const onChange = (value) => {
    var districtName="";
    var wardName="";
    var provinceName="";
      array.map((item) => (value==item.ProvinceID?provinceName=item.ProvinceName:""));
      district.map((item) => (districtId==item.DistrictID?districtName=item.DistrictName:""));
      Ward.map((item) => ((wardCode==item.WardCode||valueWard==item.WardName)?wardName=item.WardName:""));
    const info={
      fullName:name,
      phoneNumber:phone,
      address:address?((address.replace(',', '-')).trim()):""+", "+wardName?wardName:""+", "+districtName?districtName.trim():""+", "+provinceName.trim()
    }
    localStorage.setItem("information",JSON.stringify([info]));
    setProvinceID(value);
    loadDataDistrict(value);
  };

  const onSearch = (value) => {
    if (value.target.innerText !== "") {
      setValue(value.target.innerText);
      //loadDataDistrict();
    }
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

  const loadInfo = (carts) => {
    let cartList = carts;
    let weight = 0;
    let width = 0;
    let height = 0;
    let length = 0;
    for (let i = 0; i < cartList.length; i++) {
      weight += cartList[i].weight * cartList[i].quantity;
      width += cartList[i].width * cartList[i].quantity;
      height += cartList[i].height * cartList[i].quantity;
      length += cartList[i].length * cartList[i].quantity;
    }
    setTotalWeight(weight);
    setTotal(total);
    setTotalLength(length);
    setTotalHeight(height);
    setTotalWidth(width);
  };

  const getTotal = (carts) => {
    let cartList = carts;
    let price = 0;
    let total = 0;
    for (let i = 0; i < cartList.length; i++) {
      price = price + cartList[i].price * cartList[i].quantity;
      total += cartList[i].total;
    }
    return price;
  };


  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="checkout row pt-2 pb-4">
        <div className="col-12 col-md-7 mt-2">
          <p style={{ fontWeight: "600" }}>1. Thông tin khách hàng</p>
          <div className="ck-content">
            <form className="form-info p-0 ">
              <div>
                <label>Họ tên</label>
                <input
                  type={"text"}
                  className="form-control radio-ip"
                  placeholder="Họ tên"
                  onChange={changeName}
                  defaultValue={information?information[0].fullName:null}
                ></input>
              </div>
              <div>
                <label>Số điện thoại</label>
                <input
                  type={"text"}
                  className="form-control radio-ip"
                  placeholder="Số điện thoại"
                  onChange={changePhone}
                  defaultValue={information?information[0].phoneNumber:null}
                ></input>
              </div>
            </form>
          </div>
          <div className="checkout2">
            <p style={{ fontWeight: "600" }}>2. Hình thức lấy hàng</p>
            <div className="ck-content">
              <form className="form-htgh ms-5">
                <div className=" d-flex">
                  <input
                    type={"radio"}
                    name="ip-rdo"
                    value={0}
                    onChange={changeType}
                  ></input>{" "}
                  <label>Lấy tại cửa hàng</label>
                  <input
                    type={"radio"}
                    name="ip-rdo"
                    value={1}
                    onChange={changeType}
                  ></input>{" "}
                  <label>Lấy tại nhà</label>
                </div>
              </form>
              {carts?.map((cart) => (
              <div className="row d-flex">
                <div className="col-3 img mt-2">
                  <img
                    alt="Ảnh sản phẩm"
                    src={cart?.images[0]?.name}
                    className="img-content"
                  ></img>
                </div>
                <div className="col-1 mt-5">
                  <InputNumber
                    style={{ width: "50px" }}
                    min={1}
                    max={4}
                    defaultValue={cart.quantity}
                    onChange={(event) => onChangeInputNumber(cart, event)}
                  />
                </div>
                <div className="col-4 mt-5 d-block ">
                  <div>
                    <p className="text-name1 ">{cart.name}</p>
                  </div>
                </div>
                <div className="col-3 mt-5">
                  <p className="text-name1 text-center">
                    {formatCash(cart.price * cart.quantity + "")} VND
                  </p>
                </div>
                <div className="col-1 mt-5">
                  <DeleteOutlined
                    style={{ fontSize: "18px", marginLeft: "20%", color: "red" }}
                    onClick={() => {
                      onclickDeleteCart(cart);
                    }}
                  />
                </div>
              </div>
            ))}
            </div>
          </div>
          <div>
            {type === "1" ? (
              <div>
                <div className="row ck-content">
                  <div className="col-12" style={{ paddingLeft: "20px" }}>
                    <p style={{ fontWeight: "600" }}>Địa chỉ giao hàng</p>
                    <div>
                      <div className="search-container mb-2">
                        <div className="search-inner">
                          <label>Tỉnh/ Thành Phố</label>
                          <Select
                            defaultValue={information?(information[0].address?
                              (information[0].address.split(",")[3]?information[0].address.split(",")[3]
                              .trim():null):null):null}
                            disabled={disableCountry}
                            showSearch
                            placeholder="Tỉnh/thành phố"
                            optionFilterProp="children"
                            style={{
                              width: 380,
                              marginLeft: "36px",
                            }}
                            onChange={onChange}
                            onClick={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {array.map((item) => (
                              <Option
                                key={item.ProvinceID}
                                value={item.ProvinceID}
                              >
                                {item.ProvinceName}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="search-container mb-2">
                        <div className="search-inner">
                          <label>Tên quận huyện</label>
                          <Select
                            defaultValue={information?(information[0].address?
                              (information[0].address.split(",")[2]?information[0].address.split(",")[2]
                              .trim():null):null):null}
                            showSearch
                            disabled={disableCountry}
                            placeholder="Quận/huyện"
                            optionFilterProp="children"
                            style={{
                              width: 380,
                              marginLeft: "38px",
                            }}
                            onChange={onChangeDistricts}
                            onClick={onSearchDistricts}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {district.map((item) => (
                              <Option
                                key={item.DistrictID}
                                value={item.DistrictID}
                              >
                                {item.DistrictName}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="search-container mb-2">
                        <div className="search-inner">
                          <label>Tên phường xã</label>
                          <Select
                            defaultValue={information?(information[0].address?
                              (information[0].address.split(",")[1]?information[0].address.split(",")[1]
                              .trim():null):null):null}
                            showSearch
                            placeholder="Phường/xã"
                            optionFilterProp="children"
                            style={{
                              width: 380,
                              marginLeft: "43px",
                            }}
                            onChange={onChangeWards}
                            onClick={onSearchWards}
                            disabled={disableCountry}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {Ward.map((item) => (
                              <Option key={item.WardCode} value={item.WardCode}>
                                {item.WardName}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label>Địa chỉ</label>
                      <input
                        defaultValue={information?(information[0].address?
                          (information[0].address.split(",")[0]?information[0].address.split(",")[0]
                          .trim():null):null):null}
                        style={{
                          width: 380,
                          marginLeft: "97px",
                          borderRadius: "2px",
                        }}
                        type={"text"}
                        placeholder="Nhập số nhà/Tên đường"
                        onChange={changeAddress}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="row ck-content">
                  <div className="col-12" style={{ paddingLeft: "20px" }}>
                    <p style={{ fontWeight: "600" }}>Địa chỉ nhận hàng</p>
                    <div>
                    <p>125 P. Trần Đại Nghĩa, Bách Khoa, Hai Bà Trưng, Hà Nội</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-12 col-md-5 mt-1">
          <p style={{ fontWeight: "600" }}>3. Đơn hàng</p>
          <div className="content-right ">
            <div className="row d-flex">
              {/* <div className="col-8">
                                <input type={'text'} className="form-control ip-sale mb-3 radio-ip" placeholder="Nhập mã giảm giá"></input>
                                <p>số lượng sản phẩm</p>
                                <p>tên sản phẩm</p>
                            </div> */}
              {/* <div className="col-4"><button className="btn btn-primary btn-sale">Sửa</button>
                                <button className="btn btn-danger mt-2 btn-sale">Áp dụng</button>
                            </div> */}
            </div>
            <div className="form-group">
              <label>Phí vận chuyển</label>
              {shipping ? (
                <Input
                  style={{ borderRadius: "16px" }}
                  type="text"
                  value={formatCash(shipping + "") + " VND"}
                  onChange={(e) => setShipping(e.target.value)}
                  className="form-control fw-bold text-danger"
                  placeholder="0"
                  disabled
                />
              ) : (
                <Input
                  style={{ borderRadius: "16px" }}
                  type="text"
                  value={"0" + " VND"}
                  onChange={(e) => setShipping(e.target.value)}
                  className="form-control fw-bold text-danger"
                  placeholder="0"
                  disabled
                />
              )}
              <img
                style={{ width: "200px", height: "150px", marginLeft: "130px" }}
                src="https://inkythuatso.com/uploads/images/2021/12/thiet-ke-khong-ten-04-13-29-21.jpg"
              ></img>
            </div>
            <hr></hr>
            <span style={{ color: "red", fontSize: "20px", fontWeight: "700" }}>
              Thành tiền:{" "}
              {formatCash(parseInt(getTotal(carts)) + parseInt(shipping) + "")}{" "}
              VND
            </span>
          </div>
          <p style={{ fontWeight: "600" }}>4. Hình thức thanh toán</p>
          <div className="content-right ">
            <div>
              <form className="form-htgh ms-5">
                <div>
                  <input
                    type={"radio"}
                    name="ip-ht"
                    value={"VN_PAY"}
                    onChange={changePayment}
                  ></input>{" "}
                  <label>Thanh toán qua VN PAY</label>
                </div>
                <div>
                  <input
                    type={"radio"}
                    name="ip-ht"
                    value={"DAT_COC"}
                    onChange={changePayment}
                  ></input>{" "}
                  <label>Đặt cọc qua VN PAY</label>
                </div>
                <div>
                  <input
                    type={"radio"}
                    name="ip-ht"
                    value={"NGAN_HANG"}
                    onChange={changePayment}
                  ></input>{" "}
                  <label>Thanh toán qua tài khoản ngân hàng</label>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button
                className="btn btn-danger form-control btn-ck"
                onClick={createOrder}
              >
                Đặt hàng
              </button>
            </div>
            <div className="col-12 mt-2">
              <button
                className="btn btn-primary form-control btn-ck "
                //onClick={showModal}
                onClick={()=>navigate("/user/find")}
              >
                Thêm sản phẩm
              </button>
              <Modal
                width={800}
                title="Thêm sản phẩm"
                open={isModalOpen}
                onOk={handleOk}
                okText={"Thêm sản phẩm"}
                cancelText={"Đóng"}
                onCancel={handleCancel}
              >

                <AutoComplete
                  style={{
                    width: "100%",
                  }}
                  size="large"
                  options={cherang}
                  onChange={(event) => onChangeSearch(event)}
                  onSelect={onSelectAuto}
                  placeholder="Chọn sản phẩm"
                  value={values}
                  filterOption={(inputValue, option) =>
                    option.label.props.children[1]
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                />

                <Table
                  dataSource={productAdd}
                  columns={columns}
                  pagination={{ position: ["none", "none"] }}
                />
              </Modal>
            </div>
            {/* <div className="col-6 mt-2">
              <button className="btn btn-success form-control btn-ck">
                Tải file excel
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
