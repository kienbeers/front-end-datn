import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Space,
  Image,
  Form,
  AutoComplete,
  Tag
} from "antd";
import {
  CheckCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ConfirmOrder.css";
import { ToastContainer, toast } from "react-toastify";
import TextArea from "antd/lib/input/TextArea";
const url = "http://localhost:8080/api/orders";
import Moment from "react-moment";
const { Option } = Select;
const { RangePicker } = DatePicker;

const onDelete = (record) => {
  Modal.confirm({
    title: "Xoá thể loại",
    content: "Bạn có muón xoá bản ghi này không?",
  });
};

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
  searchPayment: params.pagination?.searchPayment,
  searchPhone: params.pagination?.searchPhone,
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

const ConfirmPayment = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [note, setNote] = useState();
  const [dataO, setDataO] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [searchName, setSearchName] = useState();
  const [clearForm] = Form.useForm();
  const [optionName, setOptionName] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [dataClient, setDataClient] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "CHO_XAC_NHAN",
      searchPayment: "NGAN_HANG",
      search1: "",
      search2: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
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
  const onchangeSearch = (val, dateStrings) => {
    if (dateStrings === undefined) {
      setSearchStartDate("");
      setSearchEndDate("");
    } else {
      setSearchStartDate(dateStrings[0]);
      setSearchEndDate(dateStrings[1]);
    }
  };

  const onSelectAutoClient = (value) => {
    console.log(value);
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

  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
  };

  const onConfirm = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined className="text-success" />,
      title: "Xác nhận đơn hàng",
      content: `Bạn có muốn xác nhận đơn hàng ${record.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmOrder(record, isPut);
      },
    });
  };

  const search = () => {
    setDataOrder([]);
    setData([]);
    setSelectedRowKeys([]);
    tableParams.pagination.search1 = searchName ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "CHO_XAC_NHAN";
    tableParams.pagination.searchPayment = "NGAN_HANG";
    tableParams.pagination.current = 1;
    
    loadDataOrder();
  };

  const onCancel = (record) => {
    const isPut = false;
    Modal.error({
      title: `Bạn có muốn huỷ đơn hàng ${record.id}  không?`,
      okText: "Yes",
      okType: "primary",
      onOk: () => {
        confirmOrder(record, isPut);
      },
    });
  };

  const confirmOrder = (record) => {
    console.log("vào confirm order");
    const sdt = record.phone;
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId | undefined,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: "CHO_LAY_HANG",
        note: record.note | undefined,
        customerName: record.customerName,
        phone: sdt,
        orderDetails: [
          {
            id: record.id,
            productId: record.productId,
            total: record.total,
            quantity: record.quantity,
            status: "DA_NHAN",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
    });
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

  const loadDataOrderHistoryById = (id) => {
    console.log("id hoá đơn log ra", id);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("data order history");
        console.log(res);
        setOrderHistory(res);
      });
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
        const data = [];
        results.data.data?.forEach((item) => {
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
            images:
              item.images != undefined
                ? item?.images[0]?.name
                : "Không có hình ảnh thanh toán",
          });
        });
        console.log(results.data.data);
        console.log(data);
        setDataOrder(data);
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

  const columns = [
    {
      title: "Mã đơn đặt",
      dataIndex: "id",
      width: "10%",
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
      width: "20%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      width: "15%",
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
      width: "13%",
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
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      width: "20%",
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
      width: "35%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <Button
              shape="round"
              className="secondary"
              onClick={() => {
                showModalData(id);
              }}
            >
              Hiển thị
            </Button>
          </>
        );
      },
    },
  ];

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const OrderDelivering = (record, IsPut) => {
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
        note: record.note | undefined,
        customerName: record.customerName,
        phone: record.phone | undefined,
        orderDetails: [
          {
            id: record.orderDetails.id,
            productId: record.orderDetails.productId,
            total: record.orderDetails.total,
            quantity: record.orderDetails.quantity,
            status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
    });
  };
  const onReset = () => {
    clearForm.resetFields();
    onchangeSearch();
  };

  const clearSearchForm = () => {
    onReset();
    dataOrder?.forEach((item, index) => {
      data.splice(index, dataOrder.length);
    });
    setSelectedRowKeys([]);
    tableParams.pagination.current = 1;
    tableParams.pagination.search1 = "";
    tableParams.pagination.searchStatus = "CHO_XAC_NHAN";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "NGAN_HANG";
    setSearchName("");
    setPhoneClient("");
    loadDataOrder();
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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

  const handleConfirm = (isPut,record) => {
    const dataOrder = [];
    if (selectedRowKeys.length > 0) {
      selectedRowKeys.forEach((item) => {
        dataOrder.push({
          id: item,
          status: isPut === true ? "CHO_LAY_HANG" : "DA_HUY",
        });
      });
    }else {
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
      if(isPut == true) {
        toastSuccess("Xác nhận đơn hàng thành công!")
      }else {
        toastSuccess("Huỷ đơn hàng thành công!")
      }
      
    });
    console.log(dataOrder);
  };

  const handleOk = (record, check) => {
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
  }

  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Xác nhận thanh toán tài khoản ngân hàng</h4>
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
        <div className="col-12 mt-4 confirmDeleving">
          {selectedRowKeys.length > 0 ? (
            <div className="text-center ">
              <Button
                type="primary"
                shape="round"
                icon={<CheckCircleOutlined />}
                className="ms-3"
                onClick={confirmCheckBox}
                danger
              >
                Xác nhận
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
            rowKey={(record) => record.id}
            dataSource={dataOrder}
            pagination={tableParams.pagination}
            loading={loading}
          />
          <Modal
            id="a"
            title="Chi tiết đơn hàng"
            open={isView}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
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
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
            width={800}
          >
            <div className="row ">
              <div className="row">
               
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 text-center mb-2">
                <h6 className="text-danger fw-bold">Hình ảnh đơn thanh toán</h6>
                <Image width={250} src={dataO?.images[0]?.name} />
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

export default ConfirmPayment;
