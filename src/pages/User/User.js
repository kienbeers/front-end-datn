import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Modal, Select, Table, Form } from "antd";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const toastSuccess = (message) => {
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

const User = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  const [form] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });

  var i = 0;

  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Họ tên",
      dataIndex: "",
      width: "20%",
      render: (data) => {
        return <>{data.information[0]?.fullName}</>;
      },
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      width: "15%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "",
      width: "17%",
      render: (data) => {
        return <>{data.information[0]?.phoneNumber}</>;
      },
    },
    {
      title: "Email",
      dataIndex: "",
      width: "20%",
      render: (data) => {
        return <>{data.information[0]?.email}</>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "30%",
      render: (status) => {
        if (status == 1) {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "120px", borderRadius: "8px", padding: "5px" }}
              >
                Hoạt động
              </div>
            </>
          );
        }
        if (status == 0) {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "120px", borderRadius: "8px", padding: "5px" }}
              >
                Không hoạt động
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Kích hoạt",
      dataIndex: "id",
      dataIndex: "data",
      width: "10%",
      render: (id, data) => {
        if (data.status == 1) {
          return (
            <>
              <ToastContainer></ToastContainer>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(`http://localhost:8080/api/staffs/close/${data.id}`, {
                    method: "PUT",
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  }).then(() => load());
                  toastSuccess("Khóa thành công!");
                }}
              />
            </>
          );
        } else {
          return (
            <>
              <ToastContainer></ToastContainer>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(`http://localhost:8080/api/staffs/open/${data.id}`, {
                    method: "PUT",
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  }).then(() => load());
                  toastSuccess("Mở khóa thành công!");
                }}
              />
            </>
          );
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "20%",
      render: (id, data) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(data.id, data.username, data.status);
              }}
            />
            {/* <DeleteOutlined
              onClick={() => onDelete(data.id)}
              style={{ color: "red", marginLeft: 12 }}
            /> */}
          </>
        );
      },
    },
  ];

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
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
  }, []);

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchUsername;
    tableParams.pagination.search2 = searchStatus;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
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

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [searchUsername, setSearchUsername] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [username, setUsername] = useState();
  const [status, setStatus] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [password3, setPassword3] = useState();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const search = () => {
    tableParams.pagination.search1 = searchUsername;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
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

  const clearSearchForm = () => {
    setSearchUsername("");
    setSearchStatus("");
    tableParams.pagination.search2 = "";
    clearForm.resetFields();
    load();
  };

  const showModal = () => {
    setOpen(true);
  };
  const onReset = () => {
    form.resetFields();
  }

  const handleCreateUser = (value) => {
    console.log('vào handle create user');
    if (password2 === password1) {
      fetch(`http://localhost:8080/api/staff/orders/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username: value.username,
          newPassword: value.password,
          fullName: value.fullName,
          email: value.email,
          phoneNumber: value.phoneNumber,
          address: "none",
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          if (results.data == null) {
            toastError(results.message);
          } else {
            toastSuccess("Thêm mới người dùng thành công!");
            load();
            onReset();
            setOpen(false);
            setUsername("");   
            setPassword1("");
            setPassword2("");
          }
        });
    } else {
      toastError("Xác nhận tài khoản không chính xác!");
    }
  };

  const changeSearchUserName = (event) => {
    setSearchUsername(event.target.value);
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changePassword1 = (event) => {
    setPassword1(event.target.value);
  };

  const changePassword2 = (event) => {
    setPassword2(event.target.value);
  };

  const changePassword3 = (event) => {
    setPassword3(event.target.value);
  };

  const onEdit = (id, username, status) => {
    setId(id);
    setEditing(true);
    setUsername(username);
    setStatus(status);
  };

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const [clearForm] = Form.useForm();

  // const handleOk = (value) => {
  //   if (password2 === password1) {
  //     fetch(`http://localhost:8080/api/staff/orders/createUser`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //       body: JSON.stringify({
  //         username: value.username,
  //         newPassword: value.password,
  //         fullName: value.fullName,
  //         email: value.email,
  //         phoneNumber: value.phoneNumber,
  //         address: "none",
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((results) => {
  //         if (results.data == null) {
  //           toastError(results.message);
  //         } else {
  //           load();
           
  //           toastSuccess("Tạo người dùng thành công!");
           
  //         }
  //       });
  //   } else {
  //     toastError("Xác nhận tài khoản không chính xác!");
  //   }
  // };


  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Quản lý người dùng</h4>
        </div>
      </div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "150px",
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
              <label>Từ khoá</label>
              <Input
                type="text"
                name="searchUsername"
                value={searchUsername}
                placeholder="Nhập tên tài khoản người dùng"
                onChange={changeSearchUserName}
              />
            </div>
            <div className="col-4 mt-3">
              <Form.Item name="status">
                <label>Trạng thái</label>
                <br />
                <Select
                  allowClear={true}
                  style={{ width: "400px", borderRadius: "5px" }}
                  showSearch
                  placeholder="Chọn trạng thái"
                  optionFilterProp="children"
                  onChange={changeSearchStatus}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="0">Không hoạt động</Option>
                  <Option value="1">Hoạt động</Option>
                </Select>
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
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            onClick={showModal}
            shape="round"
          >
            <a href="/product/create"></a>
            <PlusOutlined />
            Thêm mới
          </Button>
          <Modal
            title="Tạo mới"
            footer={null}
            open={open}
            width={700}  
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >

            <Form
              form={form}
              autoComplete="off"
              layout="vertical"
              onFinish={(values) => {
                handleCreateUser(values);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <div className="row">
                <div className="col-6">
                  <Form.Item
                    className=""
                    name="username"
                    label="Tài khoản"
                    rules={[
                      {
                        required: true,
                        message: "Tài khoản khách hàng không được để trống",
                      },
                      { whitespace: true },
                      { min: 3, message: "Tài khoản từ 3 ký tự trở lên" },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Nhập tài khoản khách hàng" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                      {
                        required: true,
                        message: "Mật khẩu khách hàng không được để trống",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Nhập mật khẩu" type="password" />
                  </Form.Item>
                  <Form.Item
                    name="password2"
                    label="Xác nhận mật khẩu"
                    rules={[
                      {
                        required: true,
                        message: "Xác nhận mật khẩu không được để trống",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Xác nhận mật khẩu" type="password" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item
                    name="fullName"
                    label="Nhập họ và tên"
                    rules={[
                      {
                        required: true,
                        message: "Họ tên khách hàng không được để trống",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập họ tên khách hàng" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Email không được để trống",
                      },
                      {
                        type: "email",
                        message: "Email không đúng định dạng",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập email" type="email" />
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Số điện thoại khách hàng không được để trống",
                      },
                      {
                        pattern: `^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$`,
                        message:
                          "Số điện thoại khách hàng không đúng định dạng",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </div>
              </div>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      htmlType="submit"
                      shape="round"
                      danger
                      style={{ width: "100px", marginLeft: "250px" }}
                    >
                      Tạo mới
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button
                      shape="round"
                      onClick={handleCancel}
                      style={{ width: "80px", marginLeft: "-200px" }}
                    >
                      Huỷ
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>
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
            title="Cập nhật"
            open={isEditing}
            okText={"Cập nhật"}
            cancelText={"Đóng"}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={() => {
              if (password1 == null || password2 == null || password3 == null) {
                toastError("Vui lòng nhập đầy đủ thông tin!");
              } else {
                if (password2 != password1) {
                  toastError("Nhập lại mật khẩu không chính xác!");
                } else {
                  setLoading(true);
                  fetch(`http://localhost:8080/api/users/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      username: username,
                      password: password3,
                      newPassword: password1,
                      status: status,
                    }),
                  })
                    .then((res) => res.json())
                    .then((results) => {
                      if (results.data == null) {
                        toastError(results.message);
                      } else {
                        toastSuccess("Cập nhật thành công!");
                        load();
                        setUsername("");
                        setPassword3("");
                        setPassword1("");
                        setPassword2("");
                        setEditing(false);
                      }
                    });
                }
              }
            }}
          >
            <label>Tài khoản</label>
            <Input
              type="text"
              name="username"
              value={username}
              placeholder="Nhập tài khoản"
              onChange={changeUsername}
              disabled={true}
            />
            <label>
              Mật khẩu cũ
              <span className="text-danger"> *</span>
            </label>
            <Input
              type="password"
              name="password3"
              value={password3}
              placeholder="Nhập mật khẩu cũ"
              onChange={changePassword3}
            />
            <label>
              Mật khẩu mới
              <span className="text-danger"> *</span>
            </label>
            <Input
              type="password"
              name="password1"
              value={password1}
              placeholder="Nhập mật khẩu mới"
              onChange={changePassword1}
            />
            <label>
              Xác nhận mật khẩu
              <span className="text-danger"> *</span>
            </label>
            <Input
              type="password"
              name="password2"
              value={password2}
              placeholder="Nhập lại mật khẩu"
              onChange={changePassword2}
            />
          </Modal>
          <Modal
            title="Xóa người dùng"
            open={isDelete}
            onCancel={() => {
              setDelete(false);
            }}
            onOk={() => {
              fetch(`http://localhost:8080/api/users/${id}`, {
                method: "DELETE",
              }).then(() => load());
              setDelete(false);
              toastSuccess("Xóa thành công!");
            }}
          >
            Bạn muốn xóa người dùng này chứ?
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default User;
