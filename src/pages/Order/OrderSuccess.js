import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Image,
  Space,
  Tag,
  AutoComplete,
  Form,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined,
  IssuesCloseOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import qs from "qs";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
const { Option } = Select;
const { RangePicker } = DatePicker;

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.searchName,
  searchStatus: params.pagination?.searchStatus,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
  searchPhone: params.pagination?.searchPhone,
  searchPayment: params.pagination?.searchPayment,
});

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

const OrderSuccess = () => {
  let navigate = useNavigate();
  const [dataO, setDataO] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [searchName, setSearchName] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [dataClient, setDataClient] = useState();
  const [optionName, setOptionName] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_NHAN",
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

  function compareDates(d2) {
    // console.log("thời gian truyền vào: ", d2);

    const currentDate = new Date().getTime();
    // console.log("thời gian hiện tại:", new Date());
    // console.log("current date", currentDate);
    const date = new Date(d2);
    date.setDate(date.getDate() + 10);
    let date3 = new Date(date).getTime();
    console.log(date3);
    if (date3 < currentDate) {
      // console.log(`Thời gian hiện tại nhỏ hơn`);
      return true;
    } else if (date3 > currentDate) {
      // console.log(`Thời gian hiện tại lớn hơn`);
      return false;
    } else {
      // console.log(`Bằng nhau`);
      return true;
    }
  }

  function startTimer(duration, display) {
    var timer = duration,
      minutes,
      seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        timer = duration;
      }

      if (timer === 0) {
        document.querySelector("#button").setAttribute("disabled", true);
      }
    }, 1000);
  }

  window.onload = function () {
    var tenMinutes = 60 * 10,
      display = document.querySelector("#time");
    startTimer(tenMinutes, display);
  };

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
              });
            }
          });
        });
        console.log("load data client");
        setOptionName(optionName);
        setDataClient(option);
        setLoading(false);
      });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log("pagination:", pagination);
    tableParams.pagination = pagination;
    tableParams.pagination.searchName =
      searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "DA_NHAN";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
  };

  const search = () => {
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "DA_NHAN";
    tableParams.pagination.searchName =
      searchName != undefined ? searchName : "";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.current = 1;
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
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("data order history");
        console.log(res);
        setOrderHistory(res);
      });
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
  };

  const confirmOrder = (record) => {
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
        status: "DA_NHAN",
        note: record.note | undefined,
        customerName: record.customerName | undefined,
        phone: sdt,
        orderDetails: [
          {
            id: record.orderDetails.id,
            productId: record.orderDetails.productId,
            total: record.orderDetails.total,
            quantity: record.orderDetails.quantity,
            status: "DA_NHAN",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
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
        console.log("data on init");
        console.log(results.data.data);
        setDataOrder(results.data.data);
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
  const columnOrderHistory = [
    {
      title: "Mã hoá đơn",
      dataIndex: "orderId",
      width: "10%",
      render(orderId) {
        return <>{orderId.id}</>;
      },
    },
    {
      title: "Người xác nhận",
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
      width: "25%",
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
      title: "Mã đơn đặt",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Thời gian đặt",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "15%",
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
      width: "10%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      width: "15%",
      sorter: (a, b) => a.total - b.total,
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
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      width: "16%",
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
      title: "Thao tác",
      width: "40%",
      dataIndex: "id",
      dataIndex: "data",
      render: (id, data) => {
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
            {/* {dataOD} */}
            {compareDates(data.updatedAt) == true ? (
              <Button
                shape="round"
                className="ms-2"
                danger
                onClick={() => navigate(`/admin/order/exchange/${data.id}`)}
              >
                Đổi hàng
              </Button>
            ) : (
              <Button
                shape="round"
                className="ms-2"
                danger
                onClick={() => navigate(`/admin/order/exchange/${data.id}`)}
              >
                Đổi hàng
              </Button>
            )}
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
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const OrderDelivering = (record, IsPut) => {
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
        customerName: record.customerName | undefined,
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

  const resetEditing = () => {
    setEditing(false);
  };
  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };

  const onReset = () => {
    clearForm.resetFields();
    tableParams.pagination.current = 1;
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatus = "DA_NHAN";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
    setPhoneClient("");
    setSearchName("");
    onchangeSearch();
  };

  const [clearForm] = Form.useForm();
  return (
    <div>
      
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Đơn hàng đã nhận</h4>
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
            dataSource={dataOrder}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Xác nhận đơn hàng"
            open={isEditing}
            onCancel={() => {
              resetEditing();
            }}
            onOk={() => {
              setEditing(true);
            }}
          >
            Bạn có muốn xác nhận đơn hàng không ?
          </Modal>
          <Modal
            title="Chi tiết đơn hàng"
            open={isView}
            style={{ width: "200px  !important" }}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"Đóng"}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
            width={950}
          >
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-6">
                    <p>Mã khách hàng: {dataO?.id}</p>
                    <p>Khách hàng: {dataO?.customerName}</p>
                    <p>Số điện thoại: {dataO?.phone} </p>
                    <p>
                      Tổng tiền:{" "}
                      {dataO?.total?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p>Ghi chú: {dataO?.note}</p>
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
                    <p>Địa chỉ nhận hàng: {dataO?.address}</p>

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
              <div className="col-12">
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
                            {" "}
                            <Image
                              width={100}
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
              </div>
            </div>
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
  );
};

export default OrderSuccess;
