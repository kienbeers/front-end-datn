import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Image,
  Space,
  AutoComplete,
  Tag,
  Form,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  PrinterOutlined,
  MenuFoldOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  QuestionCircleOutlined,
  IssuesCloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../Order/order.css";
import Moment from "react-moment";
import qs from "qs";
import axios from "axios";
import toastrs from "toastr";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../image/firebase/firebase";
import { v4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import QRCode from "qrcode";

const { Option } = Select;
const url = "http://localhost:8080/api/orders";
const url_pro = "http://localhost:8080/api/products";

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
  searchPhone: params.pagination?.searchPhone,
  searchPayment: params.pagination?.searchPayment,
});

const getRandomUserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});
//date
const { RangePicker } = DatePicker;

const Order = () => {
  const id = "ok";
  const [data, setData] = useState([]);
  const [dataSuccess, setDataSuccess] = useState([]);
  const [dataDelivering, setDataDelivering] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [dataO, setDataO] = useState();
  const [dataO1, setDataO1] = useState();
  const [dataOD1, setDataOD1] = useState();
  const [dateOrder, setDateOrder] = useState(getDateTime);
  const [searchStatus, setSearchStatus] = useState();
  const [searchName, setSearchName] = useState();
  const [imageUrls, setImageUrls] = useState([]);
  const [phoneClient, setPhoneClient] = useState();
  const [images, setImages] = useState([]);
  const [orderHistory, setOrderHistory] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [isOrder, setOrder] = useState(false);
  const componentRef = useRef();
  const [dataCancel, setDataCancel] = useState([]);
  const [dataWait, setDataWait] = useState([]);
  const [dataPending, setDataPedning] = useState([]);
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [checkId, setCheckId] = useState();
  const [qrImageUrl, setQRImageUrl] = useState();
  const [dataClient, setDataClient] = useState();
  const [optionName, setOptionName] = useState();
  const imagesListRef = ref(storage, "images/"); //all url
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });
  const [tableParamsPending, setTableParamsPending] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      searchStatus: "CHO_XAC_NHAN",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchPayment: "",
    },
  });

  const [tableParamsWait, setTableParamsWait] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "CHO_LAY_HANG",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });

  const [tableParamsCancel, setTableParamsCancel] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_HUY",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });

  const onchangeSearch = (val, dateStrings) => {
    console.log("dữ liệu onChange search:" + dateStrings);
    if (dateStrings === undefined) {
      setSearchStartDate("");
      setSearchEndDate("");
    } else {
      setSearchStartDate(dateStrings[0]);
      setSearchEndDate(dateStrings[1]);
    }
  };

  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
  };

  const [tableParamsDelivering, setTableParamsDelivering] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DANG_GIAO",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });
  const [tableParamsSuccess, setTableParamsSuccess] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_NHAN",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });

  const [tableParamsUser, setTableParamsUser] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [idCancel, setIDCancel] = useState();

  const qrCodeData = [
    { id: 1234, value: "TEST1" },
    { id: 1235, value: "TEST2" },
  ];
  const qrCodeIds = qrCodeData.map((data) => data.id);

  const loadDataOrderWait = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsWait)
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
        setDataWait(results.data.data);
        setLoading(false);
        setTableParamsWait({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderCancel = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsCancel)
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
        setDataCancel(results.data.data);
        setLoading(false);
        setTableParamsCancel({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderDelivering = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsDelivering)
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
        console.log("orderDelivering");
        console.log(results);
        setDataDelivering(results.data.data);
        setLoading(false);
        setTableParamsDelivering({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderStatusPending = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsPending)
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
        if (results.status) console.log(results);
        if (results.status === 200) {
          setDataPedning(results.data.data);
          setLoading(false);
          setTableParamsPending({
            pagination: {
              current: results.data.current_page,
              pageSize: 10,
              total: results.data.total,
            },
          });
        }
      });
  };

  const loadDataOrderStatusSuccess = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsSuccess)
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
        console.log(results);
        setDataSuccess(results.data.data);
        setLoading(false);
        setTableParamsSuccess({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
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
        setData(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  useEffect(() => {
    load();
    loadDataClient();
    loadDataOrderStatusPending();
    loadDataOrderStatusSuccess();
    loadDataOrderDelivering();
    loadDataOrderCancel();
    loadDataOrderWait();
  }, []);

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomUserParams(tableParamsUser)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log("data client");
        console.log(results.data.data);
        const option = [];
        const optionName = [];
        results.data.data.forEach((item) => {
          item.information.forEach((element) => {
            if (element.phoneNumber != "none") {
              option.push({
                value: element.phoneNumber,
                id: element.id,
                fullName: element.fullName,
              });
            }
            if (element.fullName != "none") {
              optionName.push({
                value: element.fullName,
                id: element.id,
              });
            }
          });
        });
        console.log("load data client");
        // console.log(option);
        setDataClient(option);
        setOptionName(optionName);
        setLoading(false);
      });
  };

  const search = () => {
    tableParams.pagination.search1 = searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus =
      searchStatus != undefined ? searchStatus : "";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.current = 1;
    load();
  };

  const searchDate = () => {
    setLoading(true);
    console.log(dateOrder);
    fetch(`http://localhost:8080/api/orders/list/date/` + dateOrder)
      .then((res) => res.json())
      .then((results) => {
        setData(results);
        setLoading(false);
        setTableParams({});
      });
  };

  const changeSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  //date
  function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    if (second.toString().length == 1) {
      second = "0" + second;
    }
    var dateTime =
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return dateTime;
  }

  const changeSearchDate = (val, dateStrings) => {
    setDateOrder(dateStrings);
  };

  const [clearForm] = Form.useForm();

  const onReset = () => {
    clearForm.resetFields();
    setSearchStatus("");
    setSearchName("");
    onchangeSearch();
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
        setDataOD(results);
      });
    console.log("tên khách hàng trong modal: ", dataO?.name);
    // createQRCode();
    setCheckId(
      `SỐ ĐIỆN THOẠI: 0338861522` +
        `\nEMAIL: ptung539@gmail.com` +
        `\nĐỊA CHỈ: Lạng Giang - Bắc Giang` +
        `\nNGÂN HÀNG: NCB - Số tài khoản: 899983869999` +
        `\nCHỦ TÀI KHOẢN: NGUYỄN VĂN A` +
        `\nHOÁ ĐƠN MUA HÀNG` +
        `\nMÃ HOÁ ĐƠN: ${id}` +
        `\nCHỦ TÀI KHOẢN: NGUYỄN VĂN A`
    );
    loadDataOrderHistoryById(id);
    setView(true);
  };

  const loadDataOrderHistoryById = (id) => {
    console.log("id hoá đơn log ra", id);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrderHistory(res);
      });
  };

  const showModalOrder = (id) => {
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
        console.log(results);
        setDataO1(results);
        createQRCode(results);
      });

    let dataOrder = "";
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
        setDataOD1(results);
      });
    // axios.get(url + "/" + id).then((res) => {
    //   setDataOD1(res.data);
    // });
    setOrder(true);
  };

  const showModalCancel = () => {
    setEditing(true);
  };

  const columns = [
    {
      title: "Mã HD",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "5%",
    },
    {
      title: "Thời gian đặt",
      dataIndex: "createdAt",

      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "20%",
    },
    {
      title: "Người đặt",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      width: "15%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: "15%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
      width: "10%",
      render(total) {
        return (
          <>
            {total.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "payment",
      width: "13%",
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
      title: "Địa chỉ nhận hàng",
      dataIndex: "address",
      width: "25%",
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
    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "8%",
      render: (id, data) => {
        if (data.status != "DA_HUY") {
          return (
            <div className="thao_tac">
              <EyeOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              {/* <EditOutlined
                onClick={() => {
                  console.log("key key");
                  navigate("update");
                }}
              />
              <DeleteOutlined
                onClick={() => {
                  showModalCancel(data.id);
                  console.log(data.id);
                  setIDCancel(data.id);
                }}
              /> */}
              <PrinterOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  showModalOrder(data.id);
                }}
              />
            </div>
          );
        } else {
          return (
            <div className="thao_tac">
              <EyeOutlined
                onClick={() => {
                  showModalData(data.id);
                }}
              />
            </div>
          );
        }
      },
    },
  ];

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
      title: "Người thực hiện",
      dataIndex: "verifier",
      width: "15%",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
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
      width: "30%",
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

  const handleTableChange = (pagination, filters, sorter) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus =
      searchStatus != undefined ? searchStatus : "";
    tableParams.pagination.searchPayment = "";
    load();
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const clearSearchForm = () => {
    onReset();
    tableParams.pagination.current = 1;
    tableParams.pagination.search1 = "";
    tableParams.pagination.searchStatus = "";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "";
    load();
    setPhoneClient("");
    setSearchName("");
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleUploadFile = () => {
    const check = "1";
    const imageRef = ref(storage, `images/${check + v4()}`);
    // console.log("imageRef",imageRef)//_service: {…}, _location: {…}
    uploadBytes(imageRef, check).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImages((prev) => [...prev, url]);
        console.log("snapshot.ref", snapshot.ref); //_service: {…}, _location: {…}
        setImageUrls((prev) => [...prev, url]); //set url ->all url
      });
      // toastSuccess("upload ảnh thành công !");
    });
  };

  async function createQRCode(data) {
    const b =
      `\nMÃ HOÁ ĐƠN: ${data?.id}` +
      `\nNGÀY MUA HÀNG: ${data?.createdAt}` +
      `\nTÊN KHÁCH HÀNG: ${data?.customerName}` +
      `\nĐỊA CHỈ: ${data?.address}` +
      `\nSỐ ĐIỆN THOẠI: ${data?.phone}` +
      data?.orderDetails.map((item) => {
        return (
          `\nTên sản phẩm: ${item?.product.name}` +
          ` - Số lượng: ${item.quantity}` +
          ` - Đơn giá: ${item.product.price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}` +
          ` - Tổng tiền: ${item.total.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}`
        );
      }) +
      `\nĐÃ ĐẶT CỌC: ${data?.money}` +
      `\nĐÃ THANH TOÁN: ${data?.total}` +
      `\nTRẠNG THÁI ĐƠN HÀNG: ${data?.status}`;
    const response = await QRCode.toDataURL(b);
    setQRImageUrl(response);
  }

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };

  const navigate = useNavigate();
  const [keyOrder, setKey] = useState("/order/create");
  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Danh sách đơn hàng</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="row mb-3">
            <div className="col-2 ">
              <div className="card ">
                <div className="card-body ">
                  <h3 className="text-center text-warning">
                    {tableParamsPending.pagination.total > 0
                      ? tableParamsPending.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-success text-center text-warning">
                    Chờ xác nhận
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body ">
                  <h3 className="text-center text-success">
                    {tableParamsSuccess.pagination.total > 0
                      ? tableParamsSuccess.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-success text-center">Đã nhận</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-primary">
                    {tableParamsDelivering.pagination.total > 0
                      ? tableParamsDelivering.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-primary text-center">Đang giao</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-danger">
                    {tableParamsCancel.pagination.total > 0
                      ? tableParamsCancel.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-danger">Đã huỷ</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body text-secondary">
                  <h3 className="text-center text-secondary">
                    {tableParamsWait.pagination.total > 0
                      ? tableParamsWait.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-secondary">Chờ lấy hàng</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-info">
                    {tableParams.pagination.total > 0
                      ? tableParams.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-info">Tổng đơn hàng</h6>
                </div>
              </div>
            </div>
          </div>
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
        <Form
          form={clearForm}
          name="nest-messages"
          className="me-2 ms-2"
          layout="vertical"
          autoComplete="off"
          onFinish={(values) => {
            search();
          }}
          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <div className="row">
            <div className="col-4 mt-3">
              <label>Tên khách hàng</label>
              <AutoComplete
                placeholder="Tên khách hàng"
                style={{ width: 400 }}
                onChange={(event) => setSearchName(event)}
                options={optionName}
                value={searchName}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
            <div className="col-4 mt-3">
              <label>Số điện thoại khách hàng</label>
              <br />
              <AutoComplete
                placeholder="Số điện thoại khách hàng"
                style={{ width: 400 }}
                onChange={(event) => setPhoneClient(event)}
                options={dataClient}
                value={phoneClient}
                onSelect={(event) => onSelectAutoClient(event)}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
            <div className="col-md-4 mt-3 pe-5">
              <Form.Item name="status">
                <label>Trạng thái</label>
                <br />
                <Select
                  width={200}
                  allowClear={true}
                  showSearch
                  placeholder="Chọn trạng thái"
                  optionFilterProp="children"
                  onChange={changeSearchStatus}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="CHUA_THANH_TOAN" selected>
                    Chưa thanh toán
                  </Option>
                  <Option value="CHO_XAC_NHAN">Chờ xác nhận</Option>
                  <Option value="CHO_LAY_HANG">Chờ lấy hàng</Option>
                  <Option value="DANG_GIAO">Đang giao</Option>
                  <Option value="DA_NHAN">Đã nhận</Option>
                  <Option value="DA_HUY">Đã hủy</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="range-time-picker">
                <label>Thời gian đặt: </label>
                <br />
                <Space
                  direction="vertical"
                  size={12}
                  style={{ width: "97%", borderRadius: "5px" }}
                >
                  <RangePicker
                    showTime={{ format: "HH:mm:ss" }}
                    format={"yyyy-MM-DD HH:mm:ss"}
                    onChange={onchangeSearch}
                    onCalendarChange={handleChangeDateSearch}
                    type="datetime"
                  />
                </Space>
              </Form.Item>
            </div>
          </div>
          <Form.Item className="text-center mt-2">
            <Button
              className=""
              type="primary-outline"
              onClick={clearSearchForm}
              shape="round"
            >
              <ReloadOutlined />
              Đặt lại
            </Button>
            <Button
              block
              className="mx-2"
              type="primary"
              shape="round"
              htmlType="submit"
              icon={<SearchOutlined />}
              style={{ width: "120px" }}
            >
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
        {/* <div className="col-4 mt-3">
          <label>Tên khách hàng</label>
          <AutoComplete
            style={{ width: 400 }}
            onChange={(event) => setSearchName(event)}
            options={optionName}
            value={searchName}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </div>
        <div className="col-4 mt-3">
          <label>Số điện thoại khách hàng</label>
          <br />
          <AutoComplete
            style={{ width: 400 }}
            onChange={(event) => setPhoneClient(event)}
            options={dataClient}
            value={phoneClient}
            onSelect={(event) => onSelectAutoClient(event)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </div>
        <div className="col-4 mt-3">
          <label>Trạng thái</label>
          <br />
          <Select
            allowClear={true}
            style={{ width: "300px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            onChange={changeSearchStatus}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="CHUA_THANH_TOAN" selected>
              Chưa thanh toán
            </Option>
            <Option value="CHO_XAC_NHAN">Chờ xác nhận</Option>
            <Option value="CHO_LAY_HANG">Chờ lấy hàng</Option>
            <Option value="DANG_GIAO">Đang giao</Option>
            <Option value="DA_NHAN">Đã nhận</Option>
            <Option value="DA_HUY">Đã hủy</Option>
          </Select>
        </div>
        <div className="col-4 mt-3">
          <label>Thời gian đặt: </label>
          <br />
          <Space
            direction="vertical"
            size={12}
            style={{ width: "100%", borderRadius: "5px" }}
          >
            <RangePicker
              showTime={{ format: "HH:mm:ss" }}
              format={"yyyy-MM-DD HH:mm:ss"}
              onChange={onchangeSearch}
              onCalendarChange={handleChangeDateSearch}
              type="datetime"
            />
          </Space>
        </div>
        <div className="col-12 text-center mt-4">
          <Button
            className="mt-2"
            shape="round"
            type="primary-uotline"
            onClick={clearSearchForm}
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
          <Button
            shape="round"
            className="mx-2  mt-2"
            type="primary"
            onClick={search}
          >
            <SearchOutlined />
            Tìm kiếm
          </Button>
        </div> */}
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            shape="round"
            onClick={() => {
              navigate("create");
            }}
          >
            <PlusOutlined /> Thêm mới
            <ToastContainer />
          </Button>
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
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Huỷ đơn hàng"
            open={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={() => {
              fetch(`http://localhost:8080/api/orders/cancelled/${idCancel}`, {
                method: "PUT",
              }).then(() => load());
              toastrs.options = {
                timeOut: 6000,
              };
              toast.success("Hủy thành công!", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setEditing(false);
              setLoading(true);
            }}
          >
            <label>Bạn có muốn huỷ đơn hàng này không ?</label>
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
            onOk={() => {
              setView(false);
            }}
            width={800}
          >
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                  <p>Mã hoá đơn: {dataO?.id}</p>
                  <p>Khách hàng: {dataO?.customerName}</p>
                  <p>Số điện thoại: {dataO?.phone} </p>
                  <p>
                    Tổng tiền:{" "}
                    {dataO?.total?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p>
                    Ghi chú:
                    <div className="row">
                      <p>{dataO?.note}</p>
                    </div>
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
                    Đặt cọc:{" "}
                    {dataO?.money?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p>Địa chỉ nhận hàng: {dataO?.address}</p>
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
                {dataOD?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>
                        <Image width={100} src={item.product.images[0]?.name} />{" "}
                      </td>
                      <td>{item.product.name}</td>
                      <td>
                        {item.product.price.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        {item.total.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      {/* <td>{item.status}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <h6 className="text-danger mt-5">Lịch sử đơn hàng</h6>
            <Table
              columns={columnOrderHistory}
              rowKey={(record) => record.id}
              dataSource={orderHistory}
              pagination={{ position: ["none", "none"] }}
            />
          </Modal>

          <Modal
            title="Hiển thị hóa đơn"
            footer={null}
            open={isOrder}
            onCancel={() => {
              setOrder(false);
            }}
            width={850}
          >
            <div>
              <div className="order" ref={componentRef}>
                <div className="qrcode ">
                  {qrImageUrl && (
                    <div className="mt-4">
                      <a
                        href={qrImageUrl}
                        download={`HoaDon` + dataO?.id + ".png"}
                      >
                        <img
                          src={qrImageUrl}
                          style={{ width: "140px", height: "140px" }}
                          alt="QR CODE"
                        />
                      </a>
                    </div>
                  )}
                </div>
                <div className="title">
                  <p className="fs-6">Số điện thoại: 0338861522</p>
                  <p className="fs-6">Email: ptung539@gmail.com</p>
                  <p className="fs-6">Địa chỉ: Lạng Giang - Bắc Giang</p>
                  <p className="fs-6">
                    Ngân hàng: NCB - Số tài khoản: 899983869999{" "}
                  </p>
                  <p className="fs-6">Chủ tài khoản: Nguyễn Văn A</p>
                  <h2 className="fw-bold">HOÁ ĐƠN MUA HÀNG</h2>
                </div>
                <div className="">
                  <p className="fw-bold">Mã hóa đơn: {dataO1?.id}</p>
                  <p className="fw-bold">
                    Ngày mua hàng:{" "}
                    <Moment format="DD-MM-YYYY">{dataO1?.createdAt}</Moment>
                  </p>
                  <p className="fw-bold">
                    Tên khách hàng: {dataO1?.customerName}
                  </p>
                  <p className="fw-bold">Địa chỉ: {dataO1?.address}</p>
                  <p className="fw-bold">Số điện thoại: {dataO1?.phone}</p>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Mã HDCT</th>
                        <th scope="col">Tên sản phẩm</th>
                        <th scope="col">Giá(VNĐ)</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col" className="fw-bold">
                          Tổng tiền(VNĐ)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataOD1?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.product?.name}</td>
                            <td>
                              {item.product?.price.toLocaleString("it-IT", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </td>
                            <td>{item.quantity}</td>
                            <td>
                              {item.total.toLocaleString("it-IT", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={4}>Tổng tiền</td>
                        <td>
                          {dataO1?.total.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="fw-bold">
                    Phí ship :{" "}
                    <i className="text-danger fw-bold">
                      {" "}
                      {dataO1?.shippingFree.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </p>
                  <p className="fw-bold">
                    Đã đặt cọc :{" "}
                    <i className="text-danger fw-bold">
                      {" "}
                      {dataO1?.money.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </p>
                  <p className="fw-bold">
                    Tổng số tiền phải thanh toán:{" "}
                    <i className="text-danger">
                      {(dataO1?.total - dataO1?.money).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </p>
                  <p className="fw-bold">
                    Trạng thái đơn hàng:
                    {dataO1?.status == "CHO_XAC_NHAN" ? (
                      <i className="text-danger">Chờ xác nhận</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "CHUA_THANH_TOAN" ? (
                      <i className="text-danger">Chưa thanh toán</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "DANG_GIAO" ? (
                      <i className="text-danger">Đang giao</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "DA_NHAN" ? (
                      <i className="text-danger">Đã nhận</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "DA_HUY" ? (
                      <i className="text-danger">Đã huỷ</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "CHO_LAY_HANG" ? (
                      <i className="text-danger">Chờ lấy hàng</i>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </div>
              <ReactToPrint
                className="text-center"
                trigger={() => {
                  return (
                    <Button
                      onClick={handleUploadFile}
                      className="text-center print"
                    >
                      Xuất hóa đơn
                    </Button>
                  );
                }}
                content={() => componentRef.current}
                documentTitle={"Order" + dataO?.id}
                pageStyle="print"
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Order;
