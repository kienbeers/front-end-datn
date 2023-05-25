import { Table, Slider, Select, Input, Button, Modal, Form } from "antd";
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
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [data, setData] = useState([
    {
      id: "",
      size: "",
      screenTechnology: "",
      resolution: "",
      screenType: "",
      scanFrequency: "",
      backgroundPanel: "",
      brightness: "",
      colorCoverage: "",
      screenRatio: "",
      touchScreen: "",
      contrast: "",
      status: "ACTIVE",
    },
  ]);
  const [formDefault, setValuesDefault] = useState({
    id: "",
    size: "",
    screenTechnology: "",
    resolution: "",
    screenType: "",
    scanFrequency: "",
    backgroundPanel: "",
    brightness: "",
    colorCoverage: "",
    screenRatio: "",
    touchScreen: "",
    contrast: "",
    status: "ACTIVE",
  });
  const [form, setValues] = useState({
    id: "",
    size: "",
    screenTechnology: "",
    resolution: "",
    screenType: "",
    scanFrequency: "",
    backgroundPanel: "",
    brightness: "",
    colorCoverage: "",
    screenRatio: "",
    touchScreen: "",
    contrast: "",
    status: "ACTIVE",
  });

  const [searchScreenType, setSearchScreenType] = useState();
  const [searchSize, setSearchSize] = useState();
  const [isDraft, setIsDraft] = useState();
  const [searchScreenTechnology, setSearchScreenTechnology] = useState();
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchScreenType: params.pagination?.searchScreenType,
    searchSize: params.pagination?.searchSize,
    searchScreenTechnology: params.pagination?.searchScreenTechnology,
  });
  //phân trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchScreenType: "",
      searchSize: "",
      searchScreenTechnology: "",
    },
  });

  const columns = [
    {
      title: "Loại màn hình",
      dataIndex: "screenType",
      width: "10%",
    },
    {
      title: "Công nghệ",
      dataIndex: "screenTechnology",
      width: "17%",
    },
    {
      title: "Độ phân giải",
      dataIndex: "resolution",
      width: "13.5%",
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      width: "8.5%",
    },
    {
      title: "Tần số quét",
      dataIndex: "scanFrequency",
      width: "10%",
    },
    {
      title: "Tấm nền",
      dataIndex: "backgroundPanel",
      width: "7%",
    },
    {
      title: "Độ sáng",
      dataIndex: "brightness",
      width: "8%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "10%",
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
                style={{
                  width: "100px",
                  borderRadius: "5px",
                  padding: "5px",
                  padding: "5px",
                }}
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
      width: "7%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/screens/close/${data.id}`,
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
                    `http://localhost:8080/api/admin/screens/open/${data.id}`,
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
                    `http://localhost:8080/api/admin/screens/open/${data.id}`,
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
      width: "9%",
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
        url + `/auth/screens?${qs.stringify(getRandomuserParams(tableParams))}`,
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
      size: value.size,
      screenTechnology: value.screenTechnology,
      resolution: value.resolution,
      screenType: value.screenType,
      scanFrequency: value.scanFrequency,
      backgroundPanel: value.backgroundPanel,
      brightness: value.brightness,
      colorCoverage: value.colorCoverage,
      screenRatio: value.screenRatio,
      touchScreen: value.touchScreen,
      contrast: value.contrast,
      status: isDraft == true ? "ACTIVE" : "DRAFT",
    };
    axios
      .post(url + "/staff/screens", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        notifySuccess("Thêm bản ghi màn hình thành công");
        // setAdd(false);
        setOpen(false);
        getData();
        setValues(formDefault);
        formE.setFieldsValue(formDefault);
      })
      .catch((error) => {
        notifyError("Thêm bản ghi màn hình thất bại!");
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
    const dataEdit = {
      id: form.id,
      size: value.size,
      screenTechnology: value.screenTechnology,
      resolution: value.resolution,
      screenType: value.screenType,
      scanFrequency: value.scanFrequency,
      backgroundPanel: value.backgroundPanel,
      brightness: value.brightness,
      colorCoverage: value.colorCoverage,
      screenRatio: value.screenRatio,
      touchScreen: value.touchScreen,
      contrast: value.contrast,
      status: form.status,
    };
    axios
      .put(url + "/staff/screens/" + dataEdit.id, dataEdit, {
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
          .delete(url + "/admin/screens/" + id, {
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
    formE.setFieldsValue(formDefault);
  };
  const search = () => {
    setTableParams(
      (tableParams.pagination.current = 1),
      (tableParams.pagination.pageSize = 10),
      (tableParams.pagination.searchScreenType = searchScreenType),
      (tableParams.pagination.searchSize = searchSize),
      (tableParams.pagination.searchScreenTechnology = searchScreenTechnology)
    );
    getData();
  };

  const clearSearchForm = () => {
    setSearchSize("");
    setSearchScreenType("");
    setSearchScreenTechnology("");
    setTableParams({
      ...tableParams,
      pagination: {
        ...(tableParams.pagination.current = 1),
        ...(tableParams.pagination.pageSize = 10),
        ...(tableParams.pagination.searchSize = ""),
        ...(tableParams.pagination.searchScreenType = ""),
        ...(tableParams.pagination.searchScreenTechnology = ""),
      },
    });
    getData();
  };
  const checkPrice = (_, value) => {
    if (value >= 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Giá phải lớn hơn hoặc bằng 0!"));
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
        <div className="col-10 mt-3">
          <label>Từ khoá</label>
          <div className="row">
            <div className="col-4 mt-4">
              <label>Loại màn hình</label>
              <Input
                placeholder="Nhập loại màn hình"
                value={searchScreenType}
                onChange={(e) => setSearchScreenType(e.target.value)}
              />
            </div>
            <div className="col-4 mt-4">
              <label>Kích thước màn hình</label>
              <Input
                placeholder="Nhập thước màn hình"
                value={searchSize}
                onChange={(e) => setSearchSize(e.target.value)}
              />
            </div>
            <div className="col-4 mt-4">
              <label>Công nghệ màn hình</label>
              <Input
                placeholder="Nhập công nghệ màn hình"
                value={searchScreenTechnology}
                onChange={(e) => setSearchScreenTechnology(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-12 mb-4 text-center ">
          <Button
            className="mx-2  mt-2 "
            type="primary"
            onClick={search}
            shape="round"
          >
            <SearchOutlined />
            Tìm kiếm
          </Button>
          <Button
            className="mt-2"
            type="primary-outline"
            onClick={clearSearchForm}
            shape="round"
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
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
            // onOk={handleAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={900}
          >
            <Form
              form={formE}
              autoComplete="off"
              layout="vertical"
              onFinish={(values) => {
                handleAdd(values);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <div className="row">
                <div className="col-6">
                  <Form.Item
                    className="mt-2"
                    name="size"
                    label="Kích thước màn hình"
                    rules={[
                      {
                        required: true,
                        message: "Kích thước màn hình không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập kích thước màn hình" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenTechnology"
                    label="Công nghệ màn hình"
                    rules={[
                      {
                        required: true,
                        message: "Công nghệ màn hình không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập công nghệ màn hình" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="resolution"
                    label="Độ phân giải"
                    rules={[
                      {
                        required: true,
                        message: "Độ phân giải không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập độ phân giải" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenType"
                    label="Loại màn hình"
                    rules={[
                      {
                        required: true,
                        message: "Loại màn hình không được để trống",
                      },
                      { whitespace: true },
                      { min: 3 },
                    ]}
                  >
                    <Input placeholder="Nhập loại màn hình" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="scanFrequency"
                    label="Tần số quét"
                    rules={[
                      {
                        required: true,
                        message: "Tần số quét không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập tần số quét" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="contrast"
                    label="Độ tương phản"
                    rules={[
                      {
                        required: true,
                        message: "Độ tương phản không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập độ tương phản" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item
                    className="mt-2"
                    name="backgroundPanel"
                    label="Tấm nền"
                    rules={[
                      {
                        required: true,
                        message: "Tấm nền không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập tấm nền" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="brightness"
                    label="Độ sáng"
                    rules={[
                      {
                        required: true,
                        message: "Độ sáng không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập độ sáng" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="colorCoverage"
                    label="Độ phủ màu"
                    rules={[
                      {
                        required: true,
                        message: "Độ phủ màu không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập độ phủ màu" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenRatio"
                    label="Tỷ lệ màn hình"
                    rules={[
                      {
                        required: true,
                        message: "Tỷ lệ màn hình không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập tỷ lệ màn hình" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="touchScreen"
                    label="Màn hình cảm ứng"
                    rules={[
                      {
                        required: true,
                        message: "Màn hình cảm ứng không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập màn hình cảm ứng" />
                  </Form.Item>
                </div>
              </div>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      style={{ width: "100px", marginLeft: "230px" }}
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
                      onClick={() => onChangeIsDraft(false)}
                      danger
                      style={{ width: "100px", marginLeft: "-60px" }}
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
                      style={{ width: "80px", marginLeft: "-430px" }}
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
            width={900}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={formE}
              autoComplete="off"
              layout="vertical"
              onFinish={(values) => {
                handleEdit(values);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <div className="row">
                <div className="col-6">
                  <Form.Item
                    className="mt-2"
                    name="size"
                    label="Kích thước màn hình"
                    rules={[
                      {
                        required: true,
                        message: "Kích thước màn hình không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập kích thước màn hình" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenTechnology"
                    label="Công nghệ màn hình"
                    rules={[
                      {
                        required: true,
                        message: "Công nghệ màn hình không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập công nghệ màn hình" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="resolution"
                    label="Độ phân giải"
                    rules={[
                      {
                        required: true,
                        message: "Độ phân giải không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập độ phân giải" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenType"
                    label="Loại màn hình"
                    rules={[
                      {
                        required: true,
                        message: "Loại màn hình không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập loại màn hình" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="touchScreen"
                    label="Màn hình cảm ứng"
                    rules={[
                      {
                        required: true,
                        message: "Màn hình cảm ứng không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập màn hình cảm ứng" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="contrast"
                    label="Độ tương phản"
                    rules={[
                      {
                        required: true,
                        message: "Độ tương phản không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập độ tương phản" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item
                    className="mt-2"
                    name="scanFrequency"
                    label="Tần số quét"
                    rules={[
                      {
                        required: true,
                        message: "Tần số quét không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập tần số quét" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="backgroundPanel"
                    label="Tấm nền"
                    rules={[
                      {
                        required: true,
                        message: "Tấm nền không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập tấm nền" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="brightness"
                    label="Độ sáng"
                    rules={[
                      {
                        required: true,
                        message: "Độ sáng không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập độ sáng" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="colorCoverage"
                    label="Độ phủ màu"
                    rules={[
                      {
                        required: true,
                        message: "Độ phủ màu không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập độ phủ màu" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenRatio"
                    label="Tỷ lệ màn hình"
                    rules={[
                      {
                        required: true,
                        message: "Tỷ lệ màn hình không được để trống",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nhập tỷ lệ màn hình" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      style={{ width: "100px", marginLeft: "230px" }}
                    >
                      Cập nhật
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button
                      block
                      className="cancel"
                      shape="round"
                      onClick={handleCancel}
                      style={{ width: "80px", marginLeft: "-440px" }}
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
