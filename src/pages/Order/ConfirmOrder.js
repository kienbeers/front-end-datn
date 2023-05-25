import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Space,
  InputNumber,
  Image,
  AutoComplete,
  Tag,
  Form,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  IssuesCloseOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Order/ConfirmOrder.css";
import Moment from "react-moment";
import { ToastContainer, toast } from "react-toastify";
import TextArea from "antd/lib/input/TextArea";
const url = "http://localhost:8080/api/orders";
const { Option } = Select;
const { RangePicker } = DatePicker;

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchStatus: params.pagination?.searchStatusOrder,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
  searchPhone: params.pagination?.searchPhone,
  searchName: params.pagination?.searchName,
  searchPayment: params.pagination?.searchPayment,
});

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

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

const OrderConfirm = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [put, setPut] = useState();
  const [dateOrder, setDateOrder] = useState(getDateTime);
  const [orderHistory, setOrderHistory] = useState();
  const [dataO, setDataO] = useState([]);
  const [todos, setTodos] = useState([]);
  const [searchName, setSearchName] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [note, setNote] = useState();
  const [dataClient, setDataClient] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [optionName, setOptionName] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatusOrder: "CHO_XAC_NHAN",
      search2: "",
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

  useEffect(() => {
    loadDataOrder();
    loadDataClient();
  }, []);

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
      title: "Người xác nhận",
      dataIndex: "verifier",
      width: "25%",
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
      title: "Trạng thái",
      dataIndex: "status",
      with: "45%",
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

  const loadDataOrderHistoryById = (id) => {
    // setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrderHistory(res);
      });
  };

  const confirmCheckBox = () => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xác nhận đơn hàng ",
      content: `Bạn có muốn xác nhận những đơn hàng này không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        handleConfirm(isPut);
      },
    });
  };

  const cancelCheckBox = () => {
    const isPut = false;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Huỷ đơn hàng ",
      content: `Bạn có muốn huỷ những đơn hàng này không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        handleConfirm(isPut);
      },
    });
  };

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
  const handleOk = (record, check) => {
    const isPut = false;
    if (check == true) {
      Modal.confirm({
        title: "Xác nhận đơn hàng",
        content: `Bạn có muốn xác nhận đơn hàng ${record?.id} 
        của khách hàng ${record?.customerName} không?`,
        okText: "Có",
        cancelText: "Không",
        onOk: () => {
          handleConfirm(true, record);
        },
      });
    } else {
      Modal.confirm({
        title: "Huỷ đơn hàng",
        content: `Bạn có muốn huỷ đơn hàng ${record?.id} 
        của khách hàng ${record?.customerName}  không?`,
        okText: "Có",
        cancelText: "Không",
        onOk: () => {
          handleConfirm(false, record);
        },
      });
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSelectedRowKeys([]);
    tableParams.pagination = pagination;
    tableParams.pagination.searchName =
      searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatusOrder = "CHO_XAC_NHAN";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
  };

  const loadDataOrder = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomOrderParams(tableParams)
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
        console.log("dữ liệu trả ra");
        console.log(results);

        // if (results.status == 200 && results.data.data.length > 0) {
        const data = [];
        results.data.data?.forEach((item) => {
          if(results.payment != "NGAN_HANG"){
            data.push({
              key: item.id,
              id: item.id,
              payment: item.payment,
              customerName: item.customerName,
              total: item.total,
              status: item.status,
              quantity: item.quantity,
              createdAt: item.createdAt,
              money: item.money,
              phone: item.phone,
              address: item.address,
            });
          }      
        });
        setDataOrder(data);
        setLoading(false);
        // }
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const search = () => {
    setDataOrder([]);
    setData([]);
    setSelectedRowKeys([]);
    tableParams.pagination.searchName = searchName ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatusOrder = "CHO_XAC_NHAN";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.current = 1;
    setLoading(true);
    loadDataOrder();
  };

  const showModalData = (id) => {
    fetch(
      `http://localhost:8080/api/auth/orders/get/${id}?${qs.stringify(
        getRandomOrderParams(tableParams)
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
        getRandomOrderParams(tableParams)
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
    loadDataOrderHistoryById(id);
    setView(true);
  };

  const columnsTest = [
    {
      title: "Full Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Age",
      width: 100,
      dataIndex: "age",
      key: "age",
      fixed: "left",
    },
    {
      title: "Column 1",
      dataIndex: "address",
      key: "1",
    },
    {
      title: "Column 2",
      dataIndex: "address",
      key: "2",
    },
    {
      title: "Column 3",
      dataIndex: "address",
      key: "3",
    },
    {
      title: "Column 4",
      dataIndex: "address",
      key: "4",
    },
    {
      title: "Column 5",
      dataIndex: "address",
      key: "5",
    },
    {
      title: "Column 6",
      dataIndex: "address",
      key: "6",
    },
    {
      title: "Column 7",
      dataIndex: "address",
      key: "7",
    },
    {
      title: "Column 8",
      dataIndex: "address",
      key: "8",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: () => <a>action</a>,
    },
  ];
  const datatest = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
  ];

  const columns = [
    {
      title: "Mã đơn đặt",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "7%",
      fixed: "left",
    },

    {
      title: "Thời gian đặt",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "10%",
    },
    {
      title: "Người đặt",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      width: "8%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: "8%",
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
      title: "Đã thanh toán",
      dataIndex: "money",
      width: "10%",
      render(money) {
        return (
          <>
            {money.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: "15%",
    },
    {
      title: "Thanh toán",
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
      title: "Trạng thái",
      dataIndex: "status",
      with: "45%",
      render: (status) => {
        return (
          <>
            <Tag color="blue" className="pt-1 pb-1">
              Chờ xác nhận
            </Tag>
          </>
        );
      },
    },
    {
      title: "Thao tác",
      width: "5%",
      dataIndex: "id",
      dataIndex: "data",
      fixed: "right",
      render: (id, data) => {
        return (
          <>
            {data.payment == "DAT_COC" ? (
              <EditOutlined
                onClick={() => navigate(`/admin/order/${data.id}/confirm`)}
                style={{ fontSize: "20px" }}
              />
            ) : (
              ""
            )}

            <EyeOutlined
              onClick={() => {
                showModalData(data.id);
              }}
              style={{ fontSize: "20px", marginLeft: "10px" }}
            />
          </>
        );
      },
    },
  ];

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const confirmOrder = (record, IsPut) => {
    console.log(record);
    console.log(Number(record.phone));
    const sdt = record.phone;
    console.log(record.note);
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId | undefined,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
        note: record.note | undefined,
        customerName: record.customerName,
        phone: sdt,
        orderDetails: [
          {
            id: record.id,
            productId: record.orderDetails.productId,
            total: record.total,
            quantity: record.orderDetails.quantity,
            status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
          },
        ],
      }),
    }).then((res) => {
      tableParams.pagination.searchName = "";
      tableParams.pagination.searchStatusOrder = "CHO_XAC_NHAN";
      tableParams.pagination.searchEndDate = "";
      tableParams.pagination.searchPhone = "";
      tableParams.pagination.searchStartDate = "";
      tableParams.pagination.searchPayment = "";
      loadDataOrder();
    });
  };

  const handleConfirm = (isPut, record) => {
    const dataOrder = [];
    if (selectedRowKeys.length > 0) {
      selectedRowKeys.forEach((item) => {
        dataOrder.push({
          id: item,
          status: isPut === true ? "CHO_LAY_HANG" : "DA_HUY",
        });
      });
    } else {
      dataOrder.push({
        id: record.id,
        status: isPut === true ? "CHO_LAY_HANG" : "DA_HUY",
      });
      setView(false);
    }

    fetch(`http://localhost:8080/api/staff/orders/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(dataOrder),
    }).then((res) => {
      clearSearchForm();
      if (isPut == true) {
        toastSuccess("Xác nhận đơn hàng thành công !");
      } else {
        toastSuccess("Huỷ đơn hàng thành công !");
      }
    });
  };

  const onChangeInputNumber = (value, id) => {
    console.log("changed", value, id);
    const set = new Set();
    const orderDetail = {
      id: id,
      quantity: value,
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
            console.log(abc);
          }
        });
        todos[abc].quantity = value;
      } else {
        todos.push({
          id: id,
          quantity: value,
        });
      }
    }
    console.log(todos);
  };

  const onchangeSearch = (val, dateStrings) => {
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

  const clearSearchForm = () => {
    onReset();
    dataOrder?.forEach((item, index) => {
      data.splice(index, dataOrder.length);
    });
    setSelectedRowKeys([]);
    tableParams.pagination.current = 1;
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatusOrder = "CHO_XAC_NHAN";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "";
    setSearchName("");
    setPhoneClient("");
    loadDataOrder();
  };

  const handleUpdateOrderDetail = (item) => {
    console.log(item);
  };

  const resetEditing = () => {
    setEditing(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParamsUser)
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

            item.information.forEach((element) => {
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
          setTableParamsUser({
            pagination: {
              current: results.data.current_page,
              pageSize: 10,
              total: results.data.total,
            },
          });
        });
      });
  };

  const onReset = () => {
    clearForm.resetFields();
    onchangeSearch();
  };

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };
  const [clearForm] = Form.useForm();

  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Xác nhận đơn hàng</h4>
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
        <ToastContainer></ToastContainer>
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
            <div className="col-4 mt-3">
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
      </div>
      <div className="row">
        <div className="col-12 mt-4 confirm">
          {selectedRowKeys.length > 0 ? (
            <div className="text-center ">
              <Button type="primary" shape="round" onClick={confirmCheckBox}>
                Xác nhận đơn hàng
              </Button>
              <Button
                className="ms-2"
                type="primary"
                shape="round"
                danger
                onClick={cancelCheckBox}
              >
                Huỷ
              </Button>
            </div>
          ) : (
            ""
          )}
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
            rowSelection={rowSelection}
            columns={columns}
            scroll={{
              x: 1900,
            }}
            rowKey={(record) => record.id}
            dataSource={dataOrder}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            open={isView}
            title="Chi tiết đơn hàng"
            onOk={handleOk}
            onCancel={() => {
              setView(false);
            }}
            width={800}
            footer={[
              <Button key="back" shape="round" onClick={() => setView(false)}>
                Đóng
              </Button>,
              <Button
                key="submit"
                type="primary"
                shape="round"
                onClick={() => handleOk(dataO, true)}
              >
                Xác nhận đơn hàng
              </Button>,
              <Button
                key="link"
                type="danger"
                shape="round"
                onClick={() => handleOk(dataO, false)}
              >
                Huỷ đơn hàng
              </Button>,
            ]}
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
                  <div>
                    Ghi chú:
                    <div className="row mb-2">
                      <div className="col-md-9">
                        <TextArea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={3}
                          cols={9}
                        />
                      </div>
                      <div className="col-3 mt-4">
                        <Button shape="round" onClick={() => updateNote()}>
                          Cập nhật ghi chú
                        </Button>
                      </div>
                    </div>
                  </div>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <h6 className="text-danger ms-1">Lịch sử đơn hàng</h6>
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
  );
};

export default OrderConfirm;
