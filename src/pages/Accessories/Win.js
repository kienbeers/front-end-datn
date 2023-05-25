import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Radio,
  Space,
  Form,
  InputNumber,
} from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
// import Product from "../Product/index";
import moment from "moment";
import axios from "axios";
import "toastr/build/toastr.min.css";
import toastrs from "toastr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Moment from "react-moment";
const url = "http://localhost:8080/api";
const { Option } = Select;

const Screen = () => {
  const notifySuccess = (message) => {
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
  const notifyError = (message) => {
    toast.error(message, {
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
  const [formE] = Form.useForm();
  const [totalSet, setTotal] = useState(10);
  const [isDraft, setIsDraft] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [data, setData] = useState();
  const [formDefault, setValuesDefault] = useState({
    id: "",
    name: "",
    version: "",
    status: "ACTIVE",
  });
  const [form, setValues] = useState({
    id: "",
    name: "",
    version: "",
    status: "",
  });

  const [searchName, setSearchName] = useState();
  const [searchVersion, setSearchVersion] = useState();
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchName: params.pagination?.searchName,
    searchVersion: params.pagination?.searchVersion,
  });
  //phân trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchName: "",
      searchVersion: "",
    },
  });

  const columns = [
    {
      title: "Tên hệ điều hành",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Version",
      dataIndex: "version",
      width: "20%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY">{createdAt}</Moment>;
      },
      width: "10%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render(updatedAt) {
        return <Moment format="DD-MM-YYYY">{updatedAt}</Moment>;
      },
      width: "15%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      render: (status) => {
        if (status == "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100px", borderRadius: "5px", padding: "5px" }}
              >
                Nháp
              </div>
            </>
          );
        } else if (status == "ACTIVE") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100px", borderRadius: "5px", padding: "5px" }}
              >
                Hoạt động
              </div>
            </>
          );
        } else if (status == "INACTIVE") {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
                style={{ width: "100px", borderRadius: "5px", padding: "5px" }}
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
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/wins/close/${data.id}`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => getData());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  toast.success("Khóa thành công!", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }}
              />
            </>
          );
        } else if (data.status == "INACTIVE") {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/wins/open/${data.id}`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => getData());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  toast.success("Mở khóa thành công!", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }}
              />
            </>
          );
        } else if (data.status == "DRAFT") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/wins/open/${data.id}`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => getData());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  toast.success("Khóa thành công!", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
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
      width: "10%",
      render: (id, data) => {
        return (
          <>
            {data.status == "DRAFT" ? (
              <>
                <EditOutlined
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    onEdit(data);
                  }}
                />
                <DeleteOutlined
                  onClick={() => onDelete(data.id)}
                  style={{ color: "red", marginLeft: 12 }}
                />
              </>
            ) : (
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data);
                }}
              />
            )}
          </>
        );
      },
    },
  ];

  //APILoadList
  const getData = () => {
    setLoading(true);
    axios
      .get(
        url + `/auth/wins?${qs.stringify(getRandomuserParams(tableParams))}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((results) => {
        setData(results.data.data.data);
        setTotal(results.data.data.total);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          },
        });
      });
  };

  //LoadList
  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const onEdit = (data) => {
    showModalEdit(data);
    setEditing(true);
  };

  //btn Add
  const handleAdd = (value) => {
    const form = {
      name: value.name,
      version: value.version,
      status: isDraft == true ? "ACTIVE" : "DRAFT",
    };
    axios
      .post(url + "/staff/wins", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        notifySuccess("Thêm mới hệ điều hàng thành công");
        // setAdd(false);
        setOpen(false);
        getData();
        setValues(formDefault);
        formE.setFieldsValue(formDefault);
      })
      .catch((error) => {
        notifyError("Thêm mới hệ điều hàng thất bại!");
        return;
      });
  };
  //loadFormEdit
  const showModalEdit = (data) => {
    setValues(data);
    formE.setFieldsValue(data);
  };

  //btn Edit
  const handleEdit = (value) => {
    // e.preventDefault();
    const dataEdit = {
      id: form.id,
      name: value.name,
      version: value.version,
      status: form.status,
    };
    axios
      .put(url + "/staff/wins/" + dataEdit.id, dataEdit, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        notifySuccess("Sửa bản ghi thành công");
        getData();
        setEditing(false);
        setValues(formDefault);
        formE.setFieldsValue(formDefault);
      })
      .catch((error) => {
        notifyError("Sửa bản ghi thất bại!");
        return;
      });
  };

  //Delete
  const onDelete = (id) => {
    Modal.confirm({
      title: "Xoá giảm giá",
      content: "Bạn có muốn xoá bản ghi này không?",
      onOk() {
        axios
          .delete(url + "/admin/wins/" + id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            notifySuccess("Xóa bản ghi thành công!");
            getData();
          })
          .catch((errorMessage) => {
            notifyError("Xóa bản ghi không thành công!");
            return;
          });
      },
      onCancel() {},
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setEditing(false);
    setValues(formDefault);
  };
  const search = () => {
    setTableParams(
      (tableParams.pagination.current = 1),
      (tableParams.pagination.pageSize = 10),
      (tableParams.pagination.searchName = searchName),
      (tableParams.pagination.searchVersion = searchVersion)
    );
    getData();
  };

  const clearSearchForm = () => {
    setSearchName("");
    setTableParams({
      ...tableParams,
      pagination: {
        ...(tableParams.pagination.current = 1),
        ...(tableParams.pagination.pageSize = 10),
        ...(tableParams.pagination.searchName = ""),
        ...(tableParams.pagination.searchVersion = ""),
      },
    });
    getData();
  };

  const onChangeIsDraft = (value) => {
    setIsDraft(value);
  };

  return (
    <div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "auto",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-10 mt-3 mb-3">
          <label>Từ khoá</label>
          <div className="row">
            <div className="col-4 mt-3">
              <Input
                placeholder="Nhập tên hệ điều hành"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="col-4 mt-3">
              <Input
                placeholder="Nhập version"
                value={searchVersion}
                onChange={(e) => setSearchVersion(e.target.value)}
              />
            </div>
            <div className="col-4 mt-3">
              <Button
                className="mb-2 mx-2"
                type="primary"
                onClick={search}
                shape="round"
              >
                <SearchOutlined />
                Tìm kiếm
              </Button>
              <Button
                className="mb-2"
                type="primary-uotline"
                onClick={clearSearchForm}
                shape="round"
              >
                <ReloadOutlined />
                Đặt lại
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            onClick={showModal}
            shape="round"
          >
            <PlusOutlined /> Thêm mới
          </Button>
          <Modal
            title="Tạo mới"
            open={open}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={650}
            footer={null}
          >
            <Form
              form={formE}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                handleAdd(values);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="name"
                label="Tên hệ điều hành"
                rules={[
                  {
                    required: true,
                    message: "Tên hệ điều hành không được để trống",
                  },
                  { whitespace: true },
                ]}
              >
                <Input placeholder="Nhập tên hệ điều hành" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="version"
                label="Version"
                rules={[
                  {
                    required: true,
                    message: "Version không được để trống",
                  },
                  { whitespace: true },
                ]}
              >
                <Input placeholder="Nhập version" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      onClick={() => onChangeIsDraft(true)}
                      style={{ width: "100px", marginLeft: "170px" }}
                    >
                      Tạo mới
                    </Button>
                  </div>
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      onClick={() => onChangeIsDraft(false)}
                      danger
                      style={{ width: "100px", marginLeft: "160px" }}
                    >
                      Tạo nháp
                    </Button>
                  </div>
                  <div className="col-4">
                    <Button
                      block
                      className="cancel"
                      shape="round"
                      onClick={handleCancel}
                      style={{ width: "80px", marginLeft: "150px" }}
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
            dataSource={data}
            rowKey={(record) => record.id}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Cập nhật"
            open={isEditing}
            onCancel={handleCancel}
            width={550}
            footer={null}
          >
            <Form
              form={formE}
              //autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                handleEdit(values);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="name"
                label="Tên hệ điều hành"
                rules={[
                  {
                    required: true,
                    message: "Tên hệ điều hành không được để trống",
                  },
                  { whitespace: true },
                ]}
              >
                <Input placeholder="Nhập tên hệ điều hành" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="version"
                label="Version"
                rules={[
                  {
                    required: true,
                    message: "Version không được để trống",
                  },
                  { whitespace: true },
                ]}
              >
                <Input placeholder="Nhập version" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      className="create"
                      htmlType="submit"
                      shape="round"
                      style={{ width: "100px" }}
                    >
                      Cập nhật
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button
                      block
                      shape="round"
                      className="cancel"
                      onClick={handleCancel}
                      style={{ width: "80px" }}
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
    </div>
  );
};

export default Screen;
