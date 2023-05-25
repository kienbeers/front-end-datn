import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  InputNumber,
  Modal,
  Image,
  Tag,
  Pagination,
  Card,
  Tabs,
  Form,
  Drawer,
  Tooltip,
} from "antd";
import qs from "qs";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  IssuesCloseOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { ToastContainer, toast } from "react-toastify";
import Moment from "react-moment";
const { TextArea } = Input;
import { addToCart, addProduct } from "../../store/Actions";
import Context from "../../store/Context";
import { useParams } from "react-router-dom";
import Meta from "antd/lib/card/Meta";

const { Option } = Select;

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

const getRandomProductParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchProductKey: params.pagination?.searchProductKey,
  searchStatus: params.pagination?.searchStatus,
  searchPrice: params.pagination?.searchPrice,
  searchImei: params.pagination?.searchImei,
});

const ConfirmOrderDetail = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [dataOD, setDataOD] = useState();
  const [todos, setTodos] = useState([]);
  const [quantity, setQuantity] = useState();
  const [count, setCount] = useState();
  const [array, setArray] = useState([]);
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();
  const [serviceId, setServiceId] = useState();
  const [shipping, setShipping] = useState();
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [totalWith, setTotalWidth] = useState();
  const [totalHeight, setTotalHeight] = useState();
  const [totalLength, setTotalLength] = useState();
  const [totalWeight, setTotalWeight] = useState();
  const [total, setTotal] = useState(0);
  const [totalCurrent, setTotalCurrent] = useState(0);
  const [dataProduct, setDataProduct] = useState([]);
  const [clearForm] = Form.useForm();
  const [product, setShowData] = useState();
  const [countCheck, setCountCheck] = useState(0);
  const [state, dispatch] = useContext(Context);
  const gh = JSON.parse(localStorage.getItem("cartProduct"));
  const [tableParamPro, setTableParamPro] = useState({
    pagination: {
      current: 1,
      pageSize: 200,
      searchProductKey: "",
      searchStatus: "ACTIVE",
      searchPrice: "",
      searchImei: "",
    },
  });
  const navigate = useNavigate();

  const handleOk1 = () => {
    setIsModalOpen1(false);
  };

  const getDataProductById1 = (id) => {
    fetch(`http://localhost:8080/api/products/${id}?`)
      .then((res) => res.json())
      .then((results) => {
        setShowData(results);
      });
  };

  const onClose = () => {
    setOpen1(false);
  };

  const handleSearchProduct = (values) => {
    tableParamPro.pagination.searchProductKey = values.name ? values.name : "";
    tableParamPro.pagination.searchStatus = "ACTIVE";
    tableParamPro.pagination.searchPrice = values.price ? values.price : "";
    tableParamPro.pagination.searchImei = values.imei ? values.imei : "";
    tableParamPro.pagination.current = 1;
    getData();
    //setDataProductsFind(dataProducts);
  };

  const onClickCart = (data) => {
    data.quantityProduct = data.quantity;
    dispatch(addProduct(data));
    toastSuccess("Thêm sản phẩm thành công!");
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const handleCancelConfirm = (data) => {
    const ob = {
      productId: data.product.id,
      total: data.total,
      quantity: data.quantity,
      isCheck: 1,
      status: data.status,
      isUpdate: 1,
    };
    fetch(`http://localhost:8080/api/auth/orders/${data.id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(ob),
    }).then((res) => {
      loadDataOrder(id);
      loadDataOrderHistoryById(id);
      handleUpdateOrderDetail();
      toastSuccess("Huỷ thành công !");
    });
  };

  const handleClear = () => {
    tableParamPro.pagination.searchProductKey = "";
    tableParamPro.pagination.searchStatus = "ACTIVE";
    tableParamPro.pagination.searchPrice = "";
    tableParamPro.pagination.searchPN = "";
    tableParamPro.pagination.searchImei = "";
    tableParamPro.pagination.current = 1;
    getData();
    clearForm.resetFields();
  };

  useEffect(() => {
    loadDataOrder(id);
    loadDataProvince();
    getData();
    loadDataOrderHistoryById(id);
  }, [order != undefined, checkSubmit]);

  useEffect(() => {
    getTotal();
    checkDisabled();
  }, [gh]);

  const checkDisabled = () => {
    let count = 0;
    order?.orderDetails.forEach((item) => {
      if (item.status == "DA_HUY") {
        count++;
      }
    });

    if (order?.orderDetails.length == count) {
      setCountCheck(1);
    } else {
      setCountCheck(0);
    }
  };

  const columns = [
    {
      title: "Mã lịch sử",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Mã hoá đơn",
      dataIndex: "orderId",
      width: "10%",
      render(orderId) {
        return <>{orderId.id}</>;
      },
    },
    {
      title: "Người thực hiện",
      dataIndex: "verifier",
      width: "20%",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: "20%",
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
      width: "13%",
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

  const getData = () => {
    fetch(
      `http://localhost:8080/api/products/getAllProAccess?${qs.stringify(
        getRandomProductParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        const data = [];
        results.data.data.forEach((item) => {
          if (item.quantity > 0) {
            data.push(item);
          }
        });
        setDataProduct(data);
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
        setOrder(res);
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

        setTotalWeight(weight);
        setTotal(total);
        setTotalLength(length);
        setTotalHeight(height);
        setTotalWidth(width);
      });
  };

  const loadDataOrderHistoryById = (id) => {
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrderHistory(res);
      });
  };

  const submitShipping2 = (value, checkValue, toDistrict) => {
    let total = 0;
    let weight = 0;
    let width = 0;
    let height = 0;
    let length = 0;

    let total2 = 0;
    let weight2 = 0;
    let width2 = 0;
    let height2 = 0;
    let length2 = 0;

    let MaxTotal = 0;
    let MaxWeight = 0;
    let MaxWidth = 0;
    let MaxHeight = 0;
    let MaxLength = 0;

    order.orderDetails.forEach((item) => {
      total += item.total;
      weight += item.product.weight * item.quantity;
      width += item.product.width * item.quantity;
      height += item.product.height * item.quantity;
      length += item.product.length * item.quantity;
    });

    gh?.forEach((item) => {
      total2 += item.price;
      weight2 += item.weight * item.quantity;
      width2 += item.width * item.quantity;
      height2 += item.height * item.quantity;
      length2 += item.length * item.quantity;
    });

    MaxHeight = height + height2;
    MaxLength = length + length2;
    MaxTotal = total + total2;
    MaxWeight = weight + weight2;
    MaxWidth = width + width2;

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
          insurance_value: MaxTotal,
          coupon: null,
          from_district_id: 3440,
          to_district_id: toDistrict,
          height: Math.round(MaxHeight * 0.1),
          length: Math.round(MaxLength * 0.1),
          weight: Math.round(MaxWeight * 1000),
          width: Math.round(MaxWidth * 0.1),
          to_ward_code: value,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        onConfirm(data.data.total, MaxTotal, true);
        setShipping(data.data.total + order?.shippingFree);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const SubmitShipping = (value, checkValue, toDistrict) => {
    let total = 0;
    let weight = 0;
    let width = 0;
    let height = 0;
    let length = 0;
    order.orderDetails.forEach((item) => {
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
        const dataOrder = [];
        dataOrder.push({
          id: order?.id,
          status: "DA_HUY",
        });
        fetch(`http://localhost:8080/api/staff/orders/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(dataOrder),
        }).then((res) => {
          toastSuccess("Huỷ đơn hàng thành công !");
          navigate("/admin/order/confirm");
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
          handleSubmitOrderDetail(maxTotal, record);
        } else {
          updateOrderDetail(record);
        }
      },
    });
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
        setArray(result.data);
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
                  const myArray = order?.address.split(",");
                  const ward = myArray[1];
                  data.data.forEach((item) => {
                    if (item.WardName == ward.trim()) {
                      setWard(item.WardCode);
                      if (check === true) {
                        SubmitShipping(item.WardCode, checkValue, value);
                      } else {
                        submitShipping2(item.WardCode, checkValue, value);
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

  const onChangeInputNumberCart = (value, event) => {
    value.quantity = event;
    dispatch({
      type: "CHANGE_QTY",
      payload: {
        id: value.id,
        quantity: event,
      },
    });
    getTotal();
  };

  const getTotal = () => {
    let totalSum = 0;
    gh?.forEach((item) => (totalSum += item.price * item.quantity));
    setTotal(totalSum);
    setTotalCurrent(totalSum);
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
        const myArray = order?.address.split(",");
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

  const handleSubmitOrderDetail = (maxTotal, record) => {
    const data = [];
    gh.forEach((element, index) => {
      data.push({
        index: index,
        orderId: id,
        productId: element.id,
        total: element.price * element.quantity,
        quantity: element.quantity,
        isCheck: null,
        shipping: record,
        totalOrder: maxTotal,
      });
    });
    fetch("http://localhost:8080/api/auth/orders/exchanges/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json();
      })
      .then((results) => {
        localStorage.removeItem("cartProduct");
        toastSuccess("Thêm hoá đơn chi tiết thành công!");
        loadDataOrder(id);
        loadDataOrderHistoryById(id);
        setShipping(0);
        setIsModalOpen1(false);
        setTotal(0);
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = () => {
    if (order?.address != "TẠI CỬA HÀNG") {
      const myArray = order?.address.split(",");
      const ProvinceName = myArray[3];
      array.forEach((element) => {
        if (element.ProvinceName == ProvinceName.trim()) {
          loadDataDistrict(element.ProvinceID);
        }
      });
    } else {
      handleSubmitOrderDetail();
    }
  };

  const handleUpdateOrderDetail = () => {
    setCheckSubmit(true);
    if (order?.address != "TẠI CỬA HÀNG") {
      const myArray = order?.address.split(",");
      const ProvinceName = myArray[3];
      array.forEach((element) => {
        if (element.ProvinceName == ProvinceName.trim()) {
          loadDataDistrict(element.ProvinceID, true);
        }
      });
    } else {
      updateOrderDetail();
    }
  };

  const updateOrderDetail = (record) => {
    const orderDetail = [];
    todos.forEach((item) => {
      if (item.id) {
        orderDetail.push({
          id: item.id,
          total: item.quantity,
          quantity: item.quantity,
          status: item.status,
          isCheck: item.isCheck,
          productId: item.productId,
        });
      }
    });

    const od = {
      id: order.id,
      total: Number(order.total + record),
      payment: order.payment,
      address: order.address,
      status: order.status,
      note: order.note,
      customerName: order.customerName,
      phone: order.phone,
      user: order.user,
      shippingFree: record,
      orderDetails: todos,
    };
    const total1 = order.total + record;
    fetch(`http://localhost:8080/api/auth/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        id: order.id,
        total: order.total,
        payment: order.payment,
        address: order.address,
        status: order.status,
        note: order.not,
        customerName: order.customerName,
        shippingFree: record,
        phone: order.phone,
        user: order.user,
        orderDetails: orderDetail,
      }),
    }).then((res) => {
      loadDataOrder(id);
      loadDataOrderHistoryById(id);
      toastSuccess("Cập nhật đơn hàng thành công !");
    });
  };

  const onClickEye = (data) => {
    getDataProductById1(data.id);
    showDrawer();
  };
  const [open1, setOpen1] = useState(false);
  const showDrawer = () => {
    setOpen1(true);
  };

  const confirm = () => {
    setCheckSubmit(true);
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

  const onChange = (value, id, proId, price) => {
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
    let i = -1;
    order?.orderDetails.forEach((element, index) => {
      if (element.id === id) {
        i = index;
      }
    });

    if (price != undefined) {
      order.orderDetails[i].total = Number(value * price);
    }
    let check;
    check = order?.orderDetails[i]?.quantity;
    if (value != undefined && check != undefined) {
      order.orderDetails[i].quantity = value;
    }
    setOrder(order);
    // setTodos(todos);
    // loadDataOrder(order.id);
  };

  const columnsChoose = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      width: "25%",
      render: (id, data) => {
        return (
          <>
            <img width={100} src={data?.images[0]?.name} />
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
      render: (price) => {
        return (
          <>
            {price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "",
      width: "15%",
      render: (data) => {
        return (
          <>
            <InputNumber
              style={{ width: "50px" }}
              min={1}
              max={data.quantityProduct > 10 ? 10 : data.quantityProduct}
              value={data.quantity}
              defaultValue={data.quantity}
              onChange={(event) => onChangeInputNumberCart(data, event)}
            />
          </>
        );
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "",
      width: "15%",
      render: (id, data) => {
        return (
          <>
            {(data.price * data.quantity).toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "",
      render: (id, data) => {
        return (
          <>
            <DeleteOutlined
              onClick={() =>
                dispatch({
                  type: "REMOVE_CART_PRODUCT",
                  payload: data,
                })
              }
              style={{ color: "red", marginLeft: 1, marginBottom: 5 }}
            />
          </>
        );
      },
    },
  ];

  const handleConfirm = () => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xác nhận đơn hàng ",
      content: `Bạn có muốn xác nhận đơn hàng này không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmOrder(isPut);
      },
    });
  };

  const confirmOrder = (isPut) => {
    const dataOrder = [];
    dataOrder.push({
      id: order?.id,
      status: isPut === true ? "CHO_LAY_HANG" : "DA_HUY",
    });
    fetch(`http://localhost:8080/api/staff/orders/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(dataOrder),
    }).then((res) => {
      if (isPut === true) {
        navigate("/admin/order/confirm");
        toastSuccess("Xác nhận đơn hàng thành công !");
      } else {
        toastSuccess("Huỷ đơn hàng thành công !");
        navigate("/admin/order/confirm");
      }
    });
  };

  const cancelCheckBox = () => {
    const isPut = false;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Huỷ đơn hàng ",
      content: `Bạn có muốn huỷ đơn hàng này không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmOrder(isPut);
      },
    });
  };

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Chi tiết đơn hàng</h4>
        </div>
      </div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "auto",
          paddingBottom: "40px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-12">
          <div className="row">
            <div className="col-6 mt-4 ps-4">
              <div className="mt-2 ms-5">
                Mã hoá đơn: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5">
                Khách hàng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5">
                Số điện thoại: <b>{order?.phone}</b>{" "}
              </div>
              <div className="mt-2 ms-5">
                Ngày đặt:{" "}
                <b>
                  <Moment format="DD-MM-YYYY HH:mm:ss">
                    {order?.createdAt}
                  </Moment>
                </b>
              </div>
              <div className="mt-2 ms-5">
                Ghi chú: <b>{order?.note}</b>{" "}
              </div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2">
                Tổng tiền:{" "}
                <b>
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2">
                Đã thanh toán:{" "}
                <b>
                  {order?.money.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2">
                <p>
                  Phí giao hàng:{" "}
                  <b>
                    {order?.shippingFree.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </b>
                </p>
              </div>
              <div className="mt-2">
                Trạng thái:{" "}
                <b> {order?.status == "CHO_XAC_NHAN" ? "Chờ xác nhận" : ""}</b>
              </div>
              <div className="mt-2">
                Địa chỉ nhận hàng: <b>{order?.address}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-4 row"
        style={{
          borderRadius: "20px",
          height: "auto",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-sm-6"></div>
            <div className="col-12 col-sm-4"></div>
            <div className="col-12 col-sm-2">
              {order?.status == "CHO_XAC_NHAN" &&
              order?.payment == "DAT_COC" ? (
                <Button
                  shape="round"
                  hidden={order?.status != "CHO_XAC_NHAN"}
                  className="mt-3 ms-5 mb-3"
                  style={{ background: "#22075e", color: "white" }}
                  onClick={showModal1}
                >
                  Chọn sản phẩm
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="col-12">
          <table className="table">
            <thead>
              <tr>
                <th>Mã HDCT</th>
                <th>Hình ảnh</th>
                <th scope="col-1">Tên sản phẩm</th>
                <th scope="col-2">Giá</th>
                <th scope="col-3">Số lượng</th>
                <th scope="col-2">Tổng tiền</th>
                {/* <th scope="col-2">Thao tác</th> */}
              </tr>
            </thead>
            <tbody>
              {order?.orderDetails?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>
                      <Image width={100} src={item.product?.images[0]?.name} />{" "}
                    </td>
                    <td>{item.product?.name}</td>
                    <td>
                      {item.product?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      <InputNumber
                        // style={{width: "20%"}}
                        min={0}
                        // disabled={
                        //   (order?.status != "CHO_XAC_NHAN") |
                        //   (item.status == "DA_HUY")
                        // }
                        max={item.product?.quantity}
                        value={quantity | item.quantity}
                        defaultValue={item.quantity}
                        onChange={(event) =>
                          onChange(
                            event,
                            item.id,
                            item.product.id,
                            item.product.price,
                            quantity
                          )
                        }
                      />
                    </td>
                    <td>
                      {item.total.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    {/* <td>
                      {item.status != "DA_HUY" ? (
                        <Button
                          shape="round"
                          onClick={() => handleCancelConfirm(item)}
                          danger
                        >
                          Huỷ
                        </Button>
                      ) : (
                        <Tag color="red" className="pt-1 pb-1">
                          Đã huỷ
                        </Tag>
                      )}
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="col-12 text-center mb-3 mt-2">
            {order?.status === "CHO_XAC_NHAN" && order?.payment == "DAT_COC" ? (
              <div>
                <Button
                  type="primary"
                  hidden={countCheck == 1}
                  shape="round"
                  onClick={handleConfirm}
                >
                  Xác nhận đơn hàng
                </Button>
                <Button
                  hidden={countCheck == 1}
                  type="primary"
                  shape="round"
                  onClick={cancelCheckBox}
                  className="ms-2"
                  danger
                >
                  Huỷ đơn hàng
                </Button>
                <Button
                  onClick={confirm}
                  hidden={countCheck == 1}
                  shape="round"
                  className="ms-2"
                >
                  Cập nhật đơn hàng
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
          <h6 className="text-danger mt-5 ms-2">Lịch sử đơn hàng</h6>
          <Table
            className="mb-5"
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={orderHistory}
            pagination={{ position: ["none", "none"] }}
          />
          <Modal
            width={1000}
            title="Chọn sản phẩm"
            open={isModalOpen1}
            onOk={handleOk1}
            cancelText={"Đóng"}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            onCancel={handleCancel1}
          >
            <Tabs
              defaultActiveKey="1"
              onChange={onChange}
              items={[
                {
                  label: `Sản phẩm`,
                  key: "1",
                  children: (
                    <>
                      <div className="">
                        <div className="">
                          <Form
                            form={clearForm}
                            name="nest-messages"
                            className="me-2 ms-2"
                            layout="vertical"
                            autoComplete="off"
                            onFinish={(values) => {
                              handleSearchProduct(values);
                            }}
                            onFinishFailed={(error) => {
                              console.log({ error });
                            }}
                          >
                            <div className="row">
                              <div className="col-4 ">
                                <Form.Item name="name">
                                  <Input placeholder="Tên sản phẩm" />
                                  {/* <Select
                                    allowClear={true}
                                    showSearch
                                    placeholder="Nhập tên sản phẩm"
                                    optionFilterProp="children"
                                    // value={searchName}
                                    // onChange={changeSearchName}
                                    // onSearch={onSearchName}
                                  >
                                    {dataProduct
                                      ? dataProduct.map((item) => (
                                          <Select.Option
                                            value={item.name}
                                            selected
                                          >
                                            {item.name}
                                          </Select.Option>
                                        ))
                                      : ""}
                                  </Select> */}
                                </Form.Item>
                              </div>
                              <div className="col-4 ">
                                <Form.Item name="imei">
                                  <Input placeholder="Mã sản phẩm" />
                                </Form.Item>
                              </div>
                              <div className="col-4">
                                <Form.Item name="price">
                                  <Select
                                    allowClear={true}
                                    style={{
                                      width: "400px",
                                      borderRadius: "5px",
                                    }}
                                    showSearch
                                    placeholder="Chọn mức giá"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                  >
                                    <Select.Option value="9999999">
                                      Dưới 10 triệu
                                    </Select.Option>
                                    <Select.Option value="10000000">
                                      Từ 10 - 15 triệu
                                    </Select.Option>
                                    <Select.Option value="15000000">
                                      Từ 15 - 20 triệu
                                    </Select.Option>
                                    <Select.Option value="20000000">
                                      Trên 20 triệu
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </div>
                            </div>
                            <Form.Item className="text-center mt-2">
                              <Button
                                className=""
                                type="primary-outline"
                                shape="round"
                                onClick={handleClear}
                              >
                                Đặt lại
                              </Button>
                              <Button
                                block
                                className="mx-2"
                                type="primary"
                                shape="round"
                                htmlType="submit"
                                style={{ width: "120px" }}
                              >
                                Tìm kiếm
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                      </div>
                      <div className="row">
                        {dataProduct?.map((item, index) => (
                          <div className="col-4 mt-2" key={index}>
                            <Card
                              key={index}
                              style={{ height: "470px" }}
                              cover={
                                <img
                                  style={{ height: "179px" }}
                                  alt="example"
                                  src={
                                    item?.images[0]?.name
                                      ? item.images[0].name
                                      : ""
                                  }
                                />
                              }
                              actions={[
                                <EyeOutlined
                                  key="setting"
                                  style={{
                                    fontSize: "20px",
                                    color: "#009999",
                                  }}
                                  onClick={() => onClickEye(item)}
                                />,
                                <ShoppingCartOutlined
                                  key="edit"
                                  style={{
                                    fontSize: "25px",
                                    color: "#08c",
                                  }}
                                  onClick={() => onClickCart(item)}
                                ></ShoppingCartOutlined>,
                              ]}
                            >
                              <Meta className="mb-2"
                                title={item.name}
                                description={item.price.toLocaleString(
                                  "it-IT",
                                  {
                                    style: "currency",
                                    currency: "VND",
                                  }
                                )}
                              />
                              
                              <div className="text-secondary" style={{height: "130px"}}>
                            <div>
                              <Tooltip placement="top" title={"Màn hình"}>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nM3SsQkCURCE4Q9MxcAOtAEDQ4PrxshM8ELrMDJ4mJjcVWAN1mAlsmCggrh3B+LAvGjfvzvL8g9qcOjpJgBlQPPSFbDAEqM+gAo3nLpOUOGMHWaYZgErHLHH5ENNeQdExvWjY43xl+nKMyAWc8E18TEVIaMST4t5T7cBiKxD/KJt4nw3qXA/0x0FTCzDM8S0ngAAAABJRU5ErkJggg==" />
                                {" "}{item.screen?.size.trim() + " "}
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
                                {" "}{item.processor?.cpuTechnology.trim()}
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
                                {" "}{item.ram?.ramCapacity.trim()}
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
                                {" "}{item.storage?.storageDetail.storageType.name.trim() +
                                  " " +
                                  item.storage?.storageDetail.capacity.trim()}
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
                                {" "}{item.card?.trandemark.trim() +
                                  " " +
                                  item.card?.model.trim() +
                                  " " +
                                  item.card?.memory.trim()}
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip placement="top" title={"Trọng lượng"}>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAp0lEQVR4nI3RzQpBURQF4G/AlAcwkWtAGZkoI8UTKCaS8jPGCJObdyBv5n106qR7L1dW7TqnvdbZa6/DJ6rYYoOKP3BAgjb2v4hNtHCLgiSeW7GXwwApZiWVRs4bR9R/TK8V7YUXAjrolojSb5cxdpjijCv6RUFYbpERPNHAA3NMYi9wAtcyk0IPQ6xjvHeMMikGbt5bBmHaKn5kznqZoHTxC05/1uUF3gwbVU0GVYUAAAAASUVORK5CYII=" />
                                {" "}{item.weight + " kg"}
                              </Tooltip>
                            </div>
                              </div>
                             
                            </Card>
                          </div>
                        ))}
                        <div
                          style={{ width: "100%" }}
                          className="d-flex justify-content-evenly"
                        >
                          <Pagination
                            className="mt-4"
                            // onChange={handlePagination}
                            simple
                            // defaultCurrent={tableParamPro.pagination.current}
                            total={12}
                          />
                        </div>
                      </div>

                      <Drawer
                        title={product?.name}
                        size="large"
                        placement="right"
                        onClose={onClose}
                        open={open1}
                      >
                        <div className="card">
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            Thông tin hàng hóa
                          </div>
                          <div className="card-body row">
                            <div className="col-6">
                              <li>Xuất xứ: {product?.origin.name}</li>
                              <li>Thương hiệu: {product?.manufacture.name} </li>
                            </div>
                            <div className="col-6">
                              <li>Thời điểm ra mắt:{product?.debut} </li>
                              <li>
                                Hướng dẫn bảo quản: Để nơi khô ráo, nhẹ tay
                              </li>
                            </div>
                          </div>
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            Thiết kế trọng lượng
                          </div>
                          <div className="card-body">
                            <li>
                              Kích thước: {product?.width} x {product?.height} x{" "}
                              {product?.length}
                            </li>
                            <li>Trọng lượng sản phẩm: {product?.weight}kg</li>
                            <li>Chất liệu: {product?.material}</li>
                          </div>
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            Bộ xử lí
                          </div>
                          <div className="card-body row">
                            <div className="col-6">
                              <li>
                                Hãng CPU: {product?.processor?.cpuCompany}
                              </li>
                              <li>
                                Công nghệ CPU:{" "}
                                {product?.processor?.cpuTechnology}
                              </li>
                              <li>
                                Tốc độ CPU: {product?.processor?.cpuSpeed}
                              </li>
                              <li>
                                Tốc độ tối đa CPU:{" "}
                                {product?.processor?.maxSpeed}
                              </li>
                            </div>
                            <div className="col-6">
                              <li>Loại CPU: {product?.processor?.cpuType}</li>
                              <li>Số nhân: {product?.processor?.multiplier}</li>
                              <li>
                                Số luồng: {product?.processor?.numberOfThread}
                              </li>
                              <li>Bộ nhớ đệm: {product?.processor?.caching}</li>
                            </div>
                          </div>
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            RAM
                          </div>
                          <div className="card-body row">
                            <div className="col-6">
                              <li>
                                Dung lượng RAM: {product?.ram?.ramCapacity}
                              </li>
                              <li>Loại RAM: {product?.ram?.typeOfRam}</li>
                              <li>Tốc độ RAM: {product?.ram?.ramSpeed}</li>
                              <li>Số khe cắm rời: {product?.ram?.looseSlot}</li>
                            </div>
                            <div className="col-6">
                              <li>
                                Số khe RAM còn lại:{" "}
                                {product?.ram?.remainingSlot}
                              </li>
                              <li>
                                Số RAM onboard: {product?.ram?.onboardRam}
                              </li>
                              <li>
                                Hỗ trợ RAM tối đa: {product?.ram?.maxRamSupport}
                              </li>
                            </div>
                          </div>
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            Màn Hình
                          </div>
                          <div className="card-body row">
                            <div className="col-6">
                              <li>
                                Kích thước màn hình: {product?.screen?.size}
                              </li>
                              <li>
                                Công nghệ màn hình:{" "}
                                {product?.screen?.screenTechnology}
                              </li>
                              <li>
                                Độ phân giải: {product?.screen?.resolution}
                              </li>
                              <li>
                                Tần số quét: {product?.screen?.scanFrequency}
                              </li>
                              <li>
                                Tấm nền: {product?.screen?.backgroundPanel}
                              </li>
                            </div>
                            <div className="col-6">
                              <li>Độ sáng: {product?.screen?.brightness}</li>
                              <li>
                                Độ phủ màu: {product?.screen?.colorCoverage}
                              </li>
                              <li>
                                Tỷ lệ màn hình: {product?.screen?.resolution}
                              </li>
                              <li>
                                Màn hình cảm ứng:{" "}
                                {product?.screen?.backgroundPanel}
                              </li>
                              <li>
                                Độ tương phản: {product?.screen?.contrast}
                              </li>
                            </div>
                          </div>
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            Đồ họa
                          </div>
                          <div className="card-body row">
                            <div className="col-6">
                              <li>
                                <span
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Card onboard
                                </span>
                              </li>
                              <li>Hãng: {product?.cardOnboard?.trandemark}</li>
                              <li>Model: {product?.cardOnboard?.model}</li>
                              <li>Bộ nhớ: {product?.cardOnboard?.memory}</li>
                            </div>
                            <div className="col-6">
                              <li>
                                <span
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Card rời
                                </span>
                              </li>
                              <li>Hãng: {product?.card?.trandemark}</li>
                              <li>Model: {product?.card?.model}</li>
                              <li>Bộ nhớ: {product?.card?.memory}</li>
                            </div>
                          </div>
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            Lưu trữ
                          </div>
                          <div className="card-body row">
                            <div className="col-6">
                              <li>
                                Kiểu ổ cứng:{" "}
                                {product?.storage?.storageDetail?.type}
                              </li>
                              <li>Số khe cắm: {product?.storage?.number}</li>
                              <li>
                                Loại SSD:
                                {
                                  product?.storage?.storageDetail.storageType
                                    .name
                                }
                              </li>
                              <li>
                                Dung lượng:{" "}
                                {product?.storage?.storageDetail.capacity}
                              </li>
                            </div>
                          </div>
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            Bảo mật
                          </div>
                          <div className="card-body row">
                            <li>{product?.security}</li>
                          </div>
                          <div
                            className="card-header"
                            style={{ textAlign: "left" }}
                          >
                            Hệ điều hành
                          </div>
                          <div className="card-body row">
                            <li>OS: {product?.win.name}</li>
                            <li>Version: {product?.win.version}</li>
                          </div>
                        </div>
                      </Drawer>
                    </>
                  ),
                },
                {
                  label: `Sản phẩm đã chọn`,
                  key: "2",
                  children: (
                    <>
                      <div className="offset-8 mb-2 fw-bold fs-6 text-danger">
                        Tổng tiền hiện tại:
                        {totalCurrent.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </div>
                      <div className="offset-11">
                        <Button
                          shape="round"
                          className="mb-3"
                          type="primary"
                          disabled={(gh?.length == 0) | (gh == undefined)}
                          onClick={() => handleSubmit()}
                        >
                          Hoàn tất
                        </Button>
                      </div>
                      <Table
                        key={0}
                        dataSource={gh}
                        columns={columnsChoose}
                        pagination={{ position: ["none", "none"] }}
                      />
                    </>
                  ),
                },
              ]}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderDetail;
