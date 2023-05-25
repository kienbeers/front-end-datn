import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Space,
  Image,
  AutoComplete,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  MenuFoldOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import qs from "qs";

import React, { useEffect, useState } from "react";
import Moment from "react-moment";
const url = "http://localhost:8080/api/orders";
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

const CancelOrder = () => {
  const [data, setData] = useState([]);
  const [dataO, setDataO] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [phoneClient, setPhoneClient] = useState();
  const [dataClient, setDataClient] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [dataOrder, setDataOrder] = useState();
  const [searchName, setSearchName] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_HUY",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchPayment: "",
      searchName: "",
    },
  });


  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
  };

  const onchangeSearch = (val, dateStrings) => {
    setSearchStartDate(dateStrings[0]);
    setSearchEndDate(dateStrings[1]);
  };

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
    console.log(dataOrder);
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
        results.data.data.forEach((item) => {
          item.information.forEach((element) => {
            if (element.phoneNumber != "none") {
              option.push({
                value: element.phoneNumber,
                id: element.id,
                fullName: element.fullName,
              });
            }
          });
        });
        console.log('load data client');
        // console.log(option);
        setDataClient(option);
        setLoading(false);
        setTableParamsUser({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const onCancel = (record) => {
    Modal.confirm({
      title: 'Xoá đơn hàng',
      content: `Bạn có muốn xoá đơn hàng ${record.id} của khách hàng ${record.customerName} không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        deleteOrder(record);
      },
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

    // setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {  
        setOrderHistory(res);
      });
  };

  const deleteOrder = (record) => {
    fetch(`http://localhost:8080/api/auth/orders/${record.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({}),
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
        console.log('dữ liệu trả ra');
        console.log(results.data.data);
        setDataOrder(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total
          },
        });
      });
      
  };


  const handleTableChange = (pagination, filters, sorter) => {
    tableParams.pagination = pagination;
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatus = "DA_HUY";
    tableParams.pagination.searchEndDate= "";
    tableParams.pagination.searchPhone= "";
    tableParams.pagination.searchStartDate= "";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
  };

  const columns = [
    {
      title: "Mã đơn đặt",
      dataIndex: "id",
      width: "7%",
    },
    {
      title: "Thời gian đặt",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "18%",
    },
    {
      title: "Người đặt",
      dataIndex: "customerName",
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
      width: "10%",
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
      title: "Địa chỉ",
      dataIndex: "address",
      width: "17%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "25%",
      render: (status) => {
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
      },
    },
    {
      title: "Thao tác",
      width: "30%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <EyeOutlined
              onClick={() => {
                showModalData(id);
              }}
              style={{ fontSize: "20px" }}
            />
            <DeleteOutlined
              onClick={() => onCancel(record)}
              style={{ color: "red", marginLeft: 12, fontSize: "20px" }}
            />
          </>
        );
      },
    },
  ];

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const search = () => {
    tableParams.pagination.searchName =(searchName != undefined ? searchName : "") ;
    tableParams.pagination.searchPhone =(phoneClient != undefined ? phoneClient : "") ;
    tableParams.pagination.searchStartDate = (searchStartDate != undefined ? searchStartDate : "");
    tableParams.pagination.searchEndDate = (searchEndDate != undefined ? searchEndDate : "");
    tableParams.pagination.searchStatus = "DA_HUY"
    tableParams.pagination.searchPayment = ""
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
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

  const resetEditing = () => {
    setEditing(false);
  };

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };

  const clearSearchForm = () => {
    
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatus = "DA_HUY";
    tableParams.pagination.searchEndDate= "";
    tableParams.pagination.searchPhone= "";
    tableParams.pagination.searchStartDate= "";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
    setPhoneClient("");
    setSearchName("");
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
                icon={<ExclamationCircleOutlined/>}
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
  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Đơn hàng đã huỷ</h4>
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
        <div className="col-4 mt-3">
          <label>Tên khách hàng</label>
          <Input
            type="text"
            name="searchName"
            value={searchName}
            placeholder="Nhập tên khách hàng"
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-4 mt-3">
          <label>Số điện thoại khách hàng</label>
          <br/>
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
        <div className="col-12 text-center mt-3 ">
          <Button
            className="mt-2"
            type="primary-outline"
            onClick={clearSearchForm}
           shape="round"
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            onClick={search}
            shape="round"
          >
            <SearchOutlined />
            Tìm kiếm
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
            dataSource={dataOrder}
            pagination={tableParams.pagination}
            loading={loading}
            onChange = {handleTableChange}
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
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"Đóng"}
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
            width={850}
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
                  <p>Ghi chú: {dataO?.note}</p>
                </div>
                <div className="col-6">
                  <p>
                    Ngày đặt hàng:{" "}
                    <Moment format="DD-MM-YYYY HH:mm:ss">
                      {dataO?.createdAt}
                    </Moment>
                  </p>
                  <p>Địa chỉ nhận hàng: {dataO?.address} </p>

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
            <h6 className="mt-5 ms-1 text-danger">Lịch sử đơn hàng</h6>
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

export default CancelOrder;
