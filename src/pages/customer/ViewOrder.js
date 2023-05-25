import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  IssuesCloseOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Image,
  InputNumber,
  Modal,
  Table,
  Tabs,
  Upload,
  message,
  Tag,
} from "antd";
import axios from "axios";
import qs from "qs";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreContext from "../../store/Context";
import qr from "../../image/QR.jpg";
import Moment from "react-moment";

import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { storage } from "../../image/firebase/firebase";
import { v4 } from "uuid";
import TextArea from "antd/lib/input/TextArea";

const onChange = (key) => {
  console.log(key);
};

const toastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

function ViewOrder() {
  const props = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status == "error") {
        info.file.status = "done";
      }
      if (info.file.status !== "removed") {
        setImage({});
      }
      if (info.file.status === "done") {
        uploadFile(info.fileList[0].originFileObj);
      }
    },
  };
  const [image, setImage] = useState();
  const uploadFile = (image) => {
    if (image == null) return;
    const imageRef = ref(storage, `images/${image.name + v4()}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImage(url);
        console.log("upload thanh cong");
      });
    });
  };

  // modal thanh toán
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [dataO, setDataO] = useState([]);
  const [array, setArray] = useState([]);
  const [serviceId, setServiceId] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();
  const showModal1 = (data) => {
    setIsModalOpen1(true);
    console.log(data);
    setOrder1(data);
  };
  const [order1, setOrder1] = useState();
  const handleOk1 = () => {
    setIsModalOpen1(false);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: image,
      exchange_id: null,
      order_id: order1.id,
      product: null,
    });
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:8080/api/auth/orders/image", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toastSuccess("Thanh toán thành công!");
        updateStatusOrder(order1);
      })
      .catch((error) => console.log("error", error));
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const updateStatusOrder = (order) => {
    order.status = "CHO_XAC_NHAN";
    order.money = order?.total;
    fetch(`http://localhost:8080/api/auth/orders/` + order.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).then((res) => {
      getData();
    });
  };

  let navigate = useNavigate();
  const [state, dispatch] = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const url = "http://localhost:8080/api/orders";
  const [totalSet, setTotal] = useState(10);
  const [todos, setTodos] = useState([]);
  const [quantity, setQuantity] = useState();
  const [dataOrder, setDataOrder] = useState();
  const [orderId, setOrderId] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderHistory, setOrderHistory] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
  });

  const getData = () => {
    let param = searchParams.get("vnp_ResponseCode");
    let userId = localStorage.getItem("username");
    console.log("vnp_ResponseCode", param);
    if (param === "00") {
      let total = localStorage.getItem("total");
      let payment = localStorage.getItem("payment");
      let address = localStorage.getItem("address");
      let type = localStorage.getItem("type");
      let phone = localStorage.getItem("phone");
      let customerName = localStorage.getItem("customerName");
      let status = localStorage.getItem("status");
      let orderDetails = localStorage.getItem("orderDetails");
      let valueWard = localStorage.getItem("valueWard");
      let valueDistrict = localStorage.getItem("valueDistrict");
      //let valueProvince = localStorage.getItem("valueProvince");
      let value = localStorage.getItem("value");

      console.log("địa chỉ khi thanh toán vnpay");
      console.log(
        total,
        payment,
        address,
        type,
        phone,
        customerName,
        status,
        orderDetails,
        valueWard,
        valueDistrict,
        value,
        //valueProvince
      );

      let dc;
      // if (localStorage.getItem("valueProvince") !== "undefined") {
      //   console.log("vào sau");
      //   dc =
      //     address +
      //     ", " +
      //     valueWard +
      //     ", " +
      //     valueDistrict +
      //     ", " +
      //     valueProvince;
      // } else {
      console.log("vào đầu");
      dc = address + ", " + valueWard + ", " + valueDistrict + ", " + value;
      //}
      const idUser = localStorage.getItem("id")
        ? localStorage.getItem("id")
        : null;
      if (idUser != null) {
        fetch(`http://localhost:8080/api/auth/orders/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            userId: localStorage.getItem("id"),
            total: total,
            money: payment === "VN_PAY" ? total : total * 0.1,
            payment: payment,
            // type: type,
            address: type == 0 ? "TẠI CỬA HÀNG" : dc,
            phone: phone,
            customerName: customerName,
            // email: email,
            status: status,
            orderDetails: JSON.parse(orderDetails),
            shippingFree: localStorage.getItem("shipping")
              ? localStorage.getItem("shipping")
              : 0,
          }),
        }).then(() => {
          // JSON.parse(localStorage.getItem("orderDetails"))
          //   ? JSON.parse(localStorage.getItem("orderDetails")).forEach((ord) => {
          //       dispatch({
          //         type: "REMOVE_CART_AFTER_CHECKOUT",
          //         payload: ord.productId,
          //       });
          //     })
          //   : console.log("null");
          localStorage.removeItem("total");
          localStorage.removeItem("payment");
          localStorage.removeItem("shipping");
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
              localStorage.getItem("token") == "") &&
            (localStorage.getItem("phoneNumber") == null ||
              localStorage.getItem("phoneNumber") == undefined)
          ) {
            navigate("/login");
          } else {
            navigate("/user/order");
          }
        });
      } else {
        fetch(`http://localhost:8080/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: null,
            total: total,
            money: payment === "VN_PAY" ? total : total * 0.1,
            payment: payment,
            // type: type,
            address: type == 0 ? "TẠI CỬA HÀNG" : dc,
            phone: phone,
            customerName: customerName,
            // email: email,
            status: status,
            shippingFree: localStorage.getItem("shipping")
              ? localStorage.getItem("shipping")
              : 0,
            orderDetails: JSON.parse(orderDetails),
          }),
        }).then(() => {
          // JSON.parse(localStorage.getItem("orderDetails"))
          //   ? JSON.parse(localStorage.getItem("orderDetails")).forEach((ord) => {
          //       dispatch({
          //         type: "REMOVE_CART_AFTER_CHECKOUT",
          //         payload: ord.productId,
          //       });
          //     })
          //   : console.log("null");
          localStorage.removeItem("total");
          localStorage.removeItem("payment");
          localStorage.removeItem("shipping");
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
              localStorage.getItem("token") == "") &&
            (localStorage.getItem("phoneNumber") == null ||
              localStorage.getItem("phoneNumber") == undefined)
          ) {
            navigate("/login");
          } else {
            navigate("/user/order");
          }
        });
      }

      //localStorage.removeItem("carts");
    }
    if (userId != null) {
      fetch(
        `http://localhost:8080/api/auth/orders/list/${userId}?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then((results) => {
          console.log(results);
          setOrders(results);
          setOrderDetails(results[0].orderDetails);
          setTotal(results.total);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: totalSet,
            },
          });
        });
    } else {
      let phoneNumber = localStorage.getItem("phoneNumber");
      fetch(
        `http://localhost:8080/api/auth/orders/listByPhone/${phoneNumber}?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then((results) => {
          console.log(results);
          setOrders(results);
          setOrderDetails(results[0].orderDetails);
          setTotal(results.total);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: totalSet,
            },
          });
        });
    }
  };

  useEffect(() => {
    getData();
    loadDataProvince();
    // loadDataOrder();
  }, [JSON.stringify(tableParams)]);
  // useEffect(() => {
  //   getData();
  //   // loadDataOrder();
  // }, []);

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
        setArray(result.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const confirm = () => {
    // setCheckSubmit(true);
    Modal.confirm({
      title: "Cập nhật đơn hàng",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có muốn cập nhật đơn hàng không?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        handleUpdateOrderDetail();
      },
    });
  };

  function compareDates(d2) {
    const currentDate = new Date().getTime();
    const date = new Date(d2);
    date.setDate(date.getDate() + 10);
    let date3 = new Date(date).getTime();
    console.log(date3);
    if (date3 < currentDate) {
      return true;
    } else if (date3 > currentDate) {
      return false;
    } else {
      return true;
    }
  }

  const columnOrderHistory = [
    {
      title: "Mã hoá đơn",
      dataIndex: "orderId",
      width: "20%",
      render(orderId) {
        return <>{orderId.id}</>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: "25%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",

      width: "20%",
      render(total) {
        return (
          <>
            {total?.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      width: "17%",
      render: (status) => {
        if (status === "CHUA_THANH_TOAN") {
          return (
            <>
              <Tag
                icon={<QuestionCircleOutlined />}
                style={{ width: "100%" }}
                className="pt-1 pb-1 text-center"
                color="default"
              >
                Chưa thanh toán
              </Tag>
            </>
          );
        }
        if (status === "CHO_XAC_NHAN") {
          return (
            <Tag
              icon={<IssuesCloseOutlined />}
              className="pt-1 pb-1 text-center"
              color="cyan"
              style={{ width: "100%" }}
            >
              Chờ xác nhận
            </Tag>
          );
        }
        if (status === "CHO_LAY_HANG") {
          return (
            <>
              <Tag
                icon={<ExclamationCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="warning"
                style={{ width: "100%" }}
              >
                Chờ lấy hàng
              </Tag>
            </>
          );
        }
        if (status === "DANG_GIAO") {
          return (
            <>
              <Tag
                icon={<SyncOutlined spin />}
                className="pt-1 pb-1 text-center"
                color="processing"
                style={{ width: "100%" }}
              >
                Đang giao hàng
              </Tag>
            </>
          );
        }
        if (status === "DA_NHAN") {
          return (
            <>
              <Tag
                icon={<CheckCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="success"
                style={{ width: "100%" }}
              >
                Đã nhận hàng
              </Tag>
            </>
          );
        }
        if (status === "DA_HUY") {
          return (
            <>
              <Tag
                icon={<CloseCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="error"
                style={{ width: "100%" }}
              >
                Đã huỷ hàng
              </Tag>
            </>
          );
        }
      },
    },
  ];

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      width: "7%",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      width: "14%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      width: "9%",
      render(total) {
        return total.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      title: "Đã thanh toán",
      dataIndex: "money",
      width: "9%",
      render(money, data) {
        return money.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      width: "15%",
      render: (payment) => {
        if (payment == "VN_PAY" && payment != "NGAN_HANG") {
          return (
            <>
              <Tag color="cyan" className="pt-1 pb-1">
                Thanh toán VNPAY
              </Tag>
            </>
          );
        }
        if (payment == "NGAN_HANG") {
          return (
            <>
              <Tag color="blue" className="pt-1 pb-1">
                Thanh toán tài khoản ngân hàng
              </Tag>
            </>
          );
        }
        if (payment == "DAT_COC") {
          return (
            <Tag color="purple" className="pt-1 pb-1">
              Thanh toán tiền mặt
            </Tag>
          );
        } else {
          return (
            <>
              <Tag color="red" className="pt-1 pb-1">
                {payment}
              </Tag>
            </>
          );
        }
      },
    },
    {
      title: "Địa chỉ nhận",
      dataIndex: "address",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      style: "",
      render: (status) => {
        if (status === "CHUA_THANH_TOAN") {
          return (
            <>
              <Tag
                icon={<QuestionCircleOutlined />}
                style={{ width: "100%" }}
                className="pt-1 pb-1 text-center"
                color="default"
              >
                Chưa thanh toán
              </Tag>
            </>
          );
        }
        if (status === "CHO_XAC_NHAN") {
          return (
            <Tag
              icon={<IssuesCloseOutlined />}
              className="pt-1 pb-1 text-center"
              color="cyan"
              style={{ width: "100%" }}
            >
              Chờ xác nhận
            </Tag>
          );
        }
        if (status === "CHO_LAY_HANG") {
          return (
            <>
              <Tag
                icon={<ExclamationCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="warning"
                style={{ width: "100%" }}
              >
                Chờ lấy hàng
              </Tag>
            </>
          );
        }
        if (status === "DANG_GIAO") {
          return (
            <>
              <Tag
                icon={<SyncOutlined spin />}
                className="pt-1 pb-1 text-center"
                color="processing"
                style={{ width: "100%" }}
              >
                Đang giao hàng
              </Tag>
            </>
          );
        }
        if (status === "DA_NHAN") {
          return (
            <>
              <Tag
                icon={<CheckCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="success"
                style={{ width: "100%" }}
              >
                Đã nhận hàng
              </Tag>
            </>
          );
        }
        if (status === "DA_HUY") {
          return (
            <>
              <Tag
                icon={<CloseCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="error"
                style={{ width: "100%" }}
              >
                Đã huỷ hàng
              </Tag>
            </>
          );
        }
      },
    },

    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "15%",
      render: (id, data) => {
        if (data.status == "CHUA_THANH_TOAN") {
          return (
            <>
              <Button
                type="primary"
                shape="round"
                style={{ height: "30px", fontSize: "12px" }}
                onClick={() => showModal1(data)}
              >
                Thanh toán
              </Button>
              <>
                <EyeOutlined
                  style={{ fontSize: "20px", marginLeft: "25%" }}
                  onClick={() => {
                    showModalData(data.id);
                  }}
                />
                <DeleteOutlined
                  className="ms-2"
                  style={{ fontSize: "20px", color: "red" }}
                  onClick={() => {
                    showModalCancel1(data.id);
                    setIDCancel(data.id);
                  }}
                />
              </>
              <Modal
                width={700}
                okText={"Hoàn thành"}
                cancelText={"Đóng"}
                title="Chuyển tiền đến tài khoản"
                open={isModalOpen1}
                onOk={() => handleOk1(data)}
                onCancel={handleCancel1}
              >
                <div className="container row">
                  <div className="col-6">
                    <img src={qr} style={{ width: "300px" }} />
                  </div>
                  <div className="col-6 mt-3">
                    <p>
                      Chuyển đến số tài khoản với nội dung là số điện thoại của
                      bạn!
                    </p>
                    <h5 className="mt-4">
                      Tổng tiền :{" "}
                      <span
                        className="text-danger"
                        style={{ fontSize: "25px", fontWeight: "600" }}
                      >
                        {order1?.total?.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </h5>
                    <h4>Hình ảnh giao dịch thành công!</h4>
                    <Upload {...props} listType="picture">
                      <Button icon={<UploadOutlined />}>
                        Tải lên hình ảnh
                      </Button>
                    </Upload>
                  </div>
                </div>
              </Modal>
            </>
          );
        }
        if (data.status === "CHO_XAC_NHAN") {
          // if(data)
          return (
            <>
              <EyeOutlined
                style={{ fontSize: "20px", marginLeft: "25%" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              <DeleteOutlined
                className="ms-2"
                style={{ fontSize: "20px", color: "red" }}
                onClick={() => {
                  showModalCancel(data.id);
                  setIDCancel(data.id);
                }}
              />
            </>
          );
        } else if (
          data.status === "DANG_GIAO" ||
          data.status === "CHO_LAY_HANG"
        ) {
          return (
            <>
              <EyeOutlined
                style={{ fontSize: "20px", marginLeft: "25%" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />

              {/* <CheckCircleOutlined
                className="ms-2"
                style={{ fontSize: "20px", color: "blue" }}
                onClick={() => {
                  showModalConfirm(data.id);
                  setIDCancel(data.id);
                }}
              /> */}
            </>
          );
        } else if (data.status === "DA_NHAN") {
          return (
            <>
              <Button
                shape="round"
                onClick={() => {
                  showModalData(data.id);
                }}
              >
                Hiển thị
              </Button>
              {compareDates(data.updatedAt) == true ? (
                ""
              ) : (
                <Button
                  className="mt-2"
                  danger
                  shape="round"
                  onClick={() => navigate(`/user/order/exchange/${data.id}`)}
                >
                  Đổi hàng
                </Button>
              )}
            </>
          );
        } else {
          return (
            <>
              <EyeOutlined
                style={{ fontSize: "20px", marginLeft: "25%" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />
            </>
          );
        }
      },
    },
  ];
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isEditing1, setEditing1] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [isView, setView] = useState(false);
  const [shipping, setShipping] = useState();
  const [order, setOrder] = useState();
  const [listOrder, setListOrder] = useState();
  const [idCancel, setIDCancel] = useState();
  const [count, setCount] = useState();
  const [note, setNote] = useState();

  const showModalCancel = () => {
    setEditing(true);
  };
  const showModalCancel1 = () => {
    setEditing1(true);
  };
  const showModalConfirm = () => {
    setConfirm(true);
  };
  const showModalData = (id) => {
    fetch(
      `http://localhost:8080/api/auth/orders/get/${id}?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setDataO(results);
        setNote(results.note);
      });

    fetch(
      `http://localhost:8080/api/auth/orders/${id}?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setOrder(results);
      });
    setOrderId(id);

    console.log("ororderID", orderId);
    setView(true);
    loadDataOrderHistoryById(id);
    loadDataOrder(id);
  };
  const loadDataOrderHistoryById = (id) => {
    console.log("id hoá đơn log ra", id);
    // setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("data order history");
        console.log(res);
        setOrderHistory(res);
      });
  };

  const load = () => {
    setLoading(true);
    // fetch(
    //   `http://localhost:8080/api/orders?${qs.stringify(
    //     getRandomuserParams(tableParams)
    //   )}`
    // )
    //   // axios.get(url + `?${qs.stringify(
    //   //   getRandomuserParams(tableParams)
    //   // )}`)
    //   .then((res) => res.json())
    //   .then((results) => {
    //     setOrders(results.data.data);
    //     setLoading(false);
    //     setTableParams({
    //       pagination: {
    //         current: results.data.current_page,
    //         pageSize: 10,
    //         total: results.data.total,
    //       },
    //     });
    //   });
    let userName = localStorage.getItem("username");
    if (userName != null) {
      fetch(
        `http://localhost:8080/api/auth/orders/list/${userName}?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then((results) => {
          console.log(results);
          setOrders(results);
          setOrderDetails(results[0].orderDetails);
          setTotal(results.total);
          setLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: totalSet,
            },
          });
        });
    } else {
      let phoneNumber = localStorage.getItem("phoneNumber");
      fetch(
        `http://localhost:8080/api/auth/orders/listByPhone/${phoneNumber}?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then((results) => {
          console.log(results);
          setOrders(results);
          setOrderDetails(results[0].orderDetails);
          setTotal(results.total);
          setLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: totalSet,
            },
          });
        });
    }
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const onChangeInput = (value, id, proId, price) => {
    const set = new Set();

    setCount(value);

    const orderDetail = {
      id: id,
      total: 1,
      quantity: value,
      status: "CHO_XAC_NHAN",
      isCheck: null,
      productId: proId,
    };
    if (todos.length === 0) {
      todos.push(orderDetail);
    } else {
      todos.forEach((item) => {
        set.add(item.id);
      });
      console.log(set);
      if (set.has(id)) {
        let abc = -1;
        todos?.forEach((item, index) => {
          if (item.id === id) {
            abc = index;
          }
        });
        todos[abc].quantity = value;
      } else {
        todos.push({
          id: id,
          total: 1,
          quantity: value,
          status: "CHO_XAC_NHAN",
          isCheck: null,
          productId: proId,
        });
      }
    }
    setTodos(todos);
    console.log(todos);
    console.log(order);
    let count = -1;
    order?.forEach((element, index) => {
      if (element.id == id) {
        count = index;
      }
    });
    console.log("quantity: ", quantity, "price: ", price);
    const total = quantity * price;
    console.log(total);
    order[count].total = Number(price * value);
    order[count].quantity = value;
    setOrder(order);
    console.log("order consolog");
    console.log(order);
    // handleUpdateOrderDetail();
  };

  const loadDataDistrict = (value, check) => {
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
          province_id: value,
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
        const myArray = dataO?.address.split(",");
        const district = myArray[2];
        result.data.forEach((item) => {
          if (item.DistrictName == district.trim()) {
            setDistrict(item.DistrictID);
            loadDataWard(item.DistrictID, check);
          }
        });
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const loadDataWard = (value, check) => {
    if (value != null) {
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
            to_district: value,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data === null) {
          } else {
            const checkValue = data.data[0].service_id;
            setServiceId(checkValue);
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
                  district_id: value,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.data === null) {
                  console.log("không có dữ liệu phù hợp");
                } else {
                  const myArray = dataO?.address.split(",");
                  const ward = myArray[1];
                  data.data.forEach((item) => {
                    if (item.WardName == ward.trim()) {
                      setWard(item.WardCode);
                      if (check === true) {
                        SubmitShipping(item.WardCode, checkValue, value);
                      } else {
                        // submitShipping2(item.WardCode, checkValue, value);
                      }
                    }
                  });
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const SubmitShipping = (value, checkValue, toDistrict) => {
    alert("vào submit shipping");

    let total = 0;
    let weight = 0;
    let width = 0;
    let height = 0;
    let length = 0;
    order?.forEach((item) => {
      total += item.total;
      weight += item.product.weight * item.quantity;
      width += item.product.width * item.quantity;
      height += item.product.height * item.quantity;
      length += item.product.length * item.quantity;
    });
    if (total > 0) {
      fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // service_id: serviceId,
            shop_id: 3379752,
            token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
          },
          body: JSON.stringify({
            service_id: checkValue,
            insurance_value: total,
            coupon: null,
            from_district_id: 3440,
            to_district_id: toDistrict,
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
          onConfirm(data.data.total);
          setShipping(data.data.total);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      onAlert(0);
      setShipping(0);
    }
  };

  const onAlert = (record) => {
    Modal.confirm({
      title: "Thông báo",
      content: `Phí giao hàng của bạn sẽ thay đổi thành ${record.toLocaleString(
        "it-IT",
        {
          style: "currency",
          currency: "VND",
        }
      )}.
      Đơn hàng này sẽ bị huỷ`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        const dataOrder = {
          id: dataO?.id,
          status: "DA_HUY",
        };
        fetch(`http://localhost:8080/api/auth/orders/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(dataOrder),
        }).then((res) => {
          toastSuccess("Huỷ đơn hàng thành công !");
          getData();
          setView(false);
        });
      },
    });
  };

  const onConfirm = (record, maxTotal, check) => {
    Modal.confirm({
      title: "Xác nhận phí vận chuyển",
      content: `Phí giao hàng của bạn sẽ thay đổi thành ${record.toLocaleString(
        "it-IT",
        {
          style: "currency",
          currency: "VND",
        }
      )}.
      Bạn có đồng ý không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        if (check == true) {
          // handleSubmitOrderDetail(maxTotal, record);
        } else {
          updateOrderDetail(record);
        }
      },
    });
  };

  const updateOrderDetail = (record) => {
    const orderDetail = [];
    order.forEach((item) => {
      if (item.id) {
        orderDetail.push({
          id: item.id,
          total: item.quantity,
          quantity: item.quantity,
          status: item.status,
          isCheck: item.isCheck,
          productId: item.product.id,
        });
      }
    });

    const od = {
      id: dataO.id,
      total: Number(dataO.total + record),
      payment: dataO.payment,
      address: dataO.address,
      status: dataO.status,
      note: dataO.note,
      customerName: dataO.customerName,
      phone: dataO.phone,
      user: dataO.user,
      shippingFree: record,
      orderDetails: orderDetail,
    };
    const total1 = order.total + record;
    fetch(`http://localhost:8080/api/auth/orders/${dataO.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        id: dataO.id,
        total: dataO.total,
        payment: dataO.payment,
        address: dataO.address,
        status: dataO.status,
        note: dataO.not,
        customerName: dataO.customerName,
        shippingFree: record,
        phone: dataO.phone,
        user: dataO.user,
        orderDetails: orderDetail,
      }),
    }).then((res) => {
      // loadDataOrder(dataO?.id);
      getData();
      setView(false);
      setShipping(0);
      // loadDataOrderHistoryById(id);
      toastSuccess("Cập nhật đơn hàng thành công !");
    });
  };

  const loadDataOrder = (id) => {
    fetch(`http://localhost:8080/api/auth/orders/get/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setListOrder(res);
        let total = 0;
        let weight = 0;
        let width = 0;
        let height = 0;
        let length = 0;
        res?.orderDetails?.forEach((item) => {
          total += item.total;
          weight += item.product.weight * item.quantity;
          width += item.product.width * item.quantity;
          height += item.product.height * item.quantity;
          length += item.product.length * item.quantity;
        });

        // setTotalWeight(weight);
        // setTotal(total);
        // setTotalLength(length);
        // setTotalHeight(height);
        // setTotalWidth(width);
      });
  };

  const handleUpdateOrderDetail = () => {
    if (order?.address != "TẠI CỬA HÀNG") {
      const myArray = dataO?.address.split(",");
      const ProvinceName = myArray[3];
      array.forEach((element) => {
        if (element.ProvinceName == ProvinceName.trim()) {
          loadDataDistrict(element.ProvinceID, true);
        }
      });
    } else {
      updateOrderDetail();
    }

    // const od = {
    //   id: dataOrder.id,
    //   total: dataOrder.total,
    //   payment: dataOrder.payment,
    //   address: dataOrder.address,
    //   status: dataOrder.status,
    //   note: dataOrder.note,
    //   customerName: dataOrder.customerName,
    //   phone: dataOrder.phone,
    //   user: dataOrder.user,
    //   orderDetails: todos,
    // };
    // console.log(od);
    // fetch(`http://localhost:8080/api/orders/${dataOrder.id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     id: dataOrder.id,
    //     total: dataOrder.total,
    //     payment: dataOrder.payment,
    //     address: dataOrder.address,
    //     status: dataOrder.status,
    //     note: dataOrder.not,
    //     customerName: dataOrder.customerName,
    //     phone: dataOrder.phone,
    //     user: dataOrder.user,
    //     orderDetails: todos,
    //   }),
    // }).then((res) => {
    //   console.log("thành công!");
    // });
  };

  const updateNote = () => {
    fetch(`http://localhost:8080/api/auth/orders/update/${dataO?.id}/note`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(note),
    }).then((res) => {
      toastSuccess("Cập nhật ghi chú thành công !");
    });
  };

  const orderCancellation = () => { };

  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <ToastContainer></ToastContainer>
          <div className="col-12">
            <Tabs
              defaultActiveKey="1"
              onChange={onChange}
              items={[
                {
                  label: `Chưa thanh toán`,
                  key: "CHUA_THANH_TOAN",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record.id}
                      dataSource={orders.filter(
                        (order) => order.status === "CHUA_THANH_TOAN"
                      )}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Chờ xác nhận`,
                  key: "CHO_XAC_NHAN",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record.id}
                      dataSource={orders.filter(
                        (order) => order.status === "CHO_XAC_NHAN"
                      )}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Chờ lấy hàng`,
                  key: "CHO_LAY_HANG",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record++}
                      dataSource={orders.filter(function (order) {
                        return order.status === "CHO_LAY_HANG";
                      })}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Đang giao hàng`,
                  key: "DANG_GIAO",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record++}
                      dataSource={orders.filter(function (order) {
                        return order.status === "DANG_GIAO";
                      })}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Đã Nhận`,
                  key: "DA_NHAN",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record++}
                      dataSource={orders.filter(function (order) {
                        return order.status === "DA_NHAN";
                      })}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Đơn đã hủy`,
                  key: "DA_HUY",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record++}
                      dataSource={orders.filter(function (order) {
                        return order.status === "DA_HUY";
                      })}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
              ]}
            />

            {/* Modal */}

            <Modal
              title="Xác nhận"
              open={isConfirm}
              onCancel={() => {
                setConfirm(false);
              }}
              onOk={() => {
                fetch(`http://localhost:8080/api/orders/received/${idCancel}`, {
                  method: "PUT",
                }).then(() => load());
                toastSuccess("Hủy thành công!");
                setConfirm(false);
                setLoading(true);
              }}
            >
              <label>
                Đã nhận hàng?
                <span className="text-danger"> !!!!!</span>
              </label>
            </Modal>

            <Modal
              title="Huỷ đơn hàng"
              open={isEditing}
              okText={"Có"}
              cancelText={"Không"}
              onCancel={() => {
                setEditing(false);
              }}
              onOk={() => {
                orderCancellation();
                fetch(
                  `http://localhost:8080/api/auth/orders/cancelled/${idCancel}`,
                  { method: "PUT" }
                ).then(() => load());
                toastSuccess("Hủy đơn hàng thành công!");
                setEditing(false);
                setLoading(true);
                setView(false);
              }}
            >
              <label>
                Bạn có muốn huỷ đơn hàng này không?
                <p className="text-danger">
                  Nếu bạn hủy đơn này bạn sẽ mất 10% số tiền đã thanh toán hoặc
                  số tiền đã đặt cọc!!
                </p>
              </label>
            </Modal>
            <Modal
              title="Huỷ đơn hàng"
              open={isEditing1}
              okText={"Có"}
              cancelText={"Không"}
              onCancel={() => {
                setEditing1(false);
              }}
              onOk={() => {
                fetch(
                  `http://localhost:8080/api/auth/orders/cancelled/${idCancel}`,
                  { method: "PUT" }
                ).then(() => load());
                toastSuccess("Hủy thành công!");
                setEditing1(false);
                setLoading(true);
              }}
            >
              <label>Bạn có muốn huỷ đơn hàng này không?</label>
            </Modal>

            <Modal
              title="Chi tiết đơn hàng"
              open={isView}
              onCancel={() => {
                setView(false);
              }}
              okButtonProps={{
                style: {
                  display: "none",
                },
              }}
              cancelText={"Đóng"}
              width={900}
              onOk={() => {
                // setView(false);
                // loadDataOrder();
                handleUpdateOrderDetail();
              }}
            >
              {/* <div className="col-12 text-center mb-2">
                <h6 className="text-danger fw-bold">Hình ảnh đơn thanh toán</h6>
                <Image width={250} src={order?.images[0]?.name} />
              </div> */}
              <div className="col-12">
                <div className="row">
                  <div className="col-6">
                    <p>Mã hoá đơn: {dataO?.id}</p>
                    <p>Khách hàng: {dataO?.customerName}</p>
                    <p>Số điện thoại: {dataO?.phone} </p>
                    <p>Địa chỉ nhận hàng: {dataO?.address}</p>
                    <p className="mt-4">
                      Ghi chú:
                      {dataO?.status == "CHO_LAY_HANG" ||
                        dataO?.status == "CHO_XAC_NHAN" ||
                        dataO?.status == "CHUA_THANH_TOAN" ? (
                        <div className="row">
                          <div className="col-9">
                            <TextArea
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              rows={3}
                              cols={9}
                            />
                          </div>
                          <div className="col-3">
                            <Button
                              shape="round"
                              danger
                              onClick={() => updateNote()}
                            >
                              Cập nhật ghi chú
                            </Button>
                          </div>
                        </div>
                      ) : (
                        dataO?.note
                      )}
                    </p>
                  </div>
                  <div className="col-6">
                    <p>
                      Ngày đặt hàng:{" "}
                      <Moment format="DD-MM-YYYY HH:mm:ss">
                        {dataO?.createdAt}
                      </Moment>
                    </p>
                    <p>
                      Phí vận chuyển:{" "}
                      {dataO?.shippingFree?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p>
                      Đã thanh toán:{" "}
                      {dataO?.money?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p>
                      Tổng tiền:{" "}
                      {dataO?.total?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Mã HDCT</th>
                    <th>Hình ảnh</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>
                          {" "}
                          <Image
                            width={90}
                            src={item.product.images[0]?.name}
                          />{" "}
                        </td>
                        <td>{item.product.name}</td>
                        <td>
                          {item.product.price.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td>
                          {dataO?.status == "CHO_XAC_NHAN" && dataO?.payment == "DAT_COC" ? (
                            <InputNumber
                              // style={{width: "20%"}}
                              disabled={
                                item.status != "CHO_XAC_NHAN" ? true : false
                              }
                              min={0}
                              max={item.product.quantity}
                              value={quantity}
                              defaultValue={item.quantity}
                              onChange={(event) =>
                                onChangeInput(
                                  event,
                                  item.id,
                                  item.product.id,
                                  item.product.price,
                                  quantity
                                )
                              }
                            />
                          ) : (
                            item.quantity
                          )}
                          {/* {item.quantity} */}
                        </td>
                        <td>
                          {item.total.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {dataO?.status == "CHO_XAC_NHAN" && dataO?.payment == "DAT_COC" ? (
                <div>
                  <Button
                    type="primary"
                    shape="round"
                    onClick={() => {
                      showModalCancel(dataO?.id);
                      setIDCancel(dataO?.id);
                    }}
                    className="offset-7 "
                    danger
                  >
                    Huỷ đơn hàng
                  </Button>
                  <Button onClick={confirm} shape="round" className="ms-2">
                    Cập nhật đơn hàng
                  </Button>
                </div>
              ) : (
                ""
              )}

              <h6 className="text-danger ms-1 mt-2">Lịch sử đơn hàng</h6>
              <Table
                columns={columnOrderHistory}
                rowKey={(record) => record.id}
                dataSource={orderHistory}
                pagination={{ position: ["none", "none"] }}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewOrder;
