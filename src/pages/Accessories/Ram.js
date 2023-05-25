import { Table, Select, Input, Button, Modal, Form, InputNumber } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState, useRef } from "react";
import "./Processor.css";
import { ToastContainer, toast } from "react-toastify";
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchRamCapacity: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const toastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const Ram = () => {
  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);
  const [category, setCategory] = useState([]);
  const [data, setData] = useState();
  const [rams, setRams] = useState();
  const [processor, setProcessor] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [searchName, setSearchName] = useState();
  const [cpuTechnology, setCpuTechnology] = useState();
  const [cpuCompany, setCpuCompany] = useState("2");
  const [searchStatus, setSearchStatus] = useState();
  const [formEdit] = Form.useForm();
  const [isDraft, setIsDraft] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const inputRef = useRef(null);

  const onReset = () => {
    form.resetFields();
  };

  const [clearForm] = Form.useForm();

  const onClearForm = () => {
    clearForm.resetFields();
    onchangeSearch();
  };
  const columns = [
    {
      title: "Loại Ram",
      dataIndex: "typeOfRam",
      width: "7%",
    },
    {
      title: "Dung lượng Ram",
      dataIndex: "ramCapacity",
      width: "14%",
    },
    {
      title: "Tốc độ ram",
      dataIndex: "ramSpeed",
      width: "8%",
    },
    {
      title: "Hỗ trợ RAM tối đa",
      dataIndex: "maxRamSupport",
      width: "11.5%",
    },
    {
      title: "Số Ram onboard",
      dataIndex: "onboardRam",
      width: "10.7%",
    },
    {
      title: "Số khe cắm rời",
      dataIndex: "looseSlot",
      width: "10%",
    },
    {
      title: "Số khe RAM còn lại",
      dataIndex: "remainingSlot",
      width: "12.5%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "12%",
      render: (status) => {
        if (status === "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
              >
                Nháp
              </div>
            </>
          );
        }
        if (status === "ACTIVE") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
              >
                Hoạt động
              </div>
            </>
          );
        } else if (status === "INACTIVE") {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
              >
                Không hoạt động
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "11%",
      render: (id, data) => {
        if (data.status === "DRAFT") {
          return (
            <>
              <DeleteOutlined
                onClick={() => onDelete(data)}
                style={{ color: "red" }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalE(data);
                }}
              />
              <UnlockOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataRam());
                  toastSuccess("Mở khóa thành công!");
                }}
              />
            </>
          );
        }
        if (data.status == "ACTIVE") {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/inactive`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataRam());
                  toastSuccess("Khoá thành công !");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalE(data);
                }}
              />
            </>
          );
        } else if (data.status == "INACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataRam());
                  toastSuccess("Mở khóa thành công!");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalE(data);
                }}
              />
            </>
          );
        }
        return (
          <>
            <EyeOutlined
              onClick={() => {
                onView(data);
              }}
            />
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                showModalE(data);
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(data)}
              style={{ color: "red", fontSize: "20px", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const loadDataRam = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setRams(results.data.data);
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

  const onDelete = (record) => {
    Modal.confirm({
      icon: <CloseCircleOutlined />,
      title: "Xoá RAM ",
      content: `Bạn có muốn xoá ram ${record.ramCapacity} ${record.ramSpeed} không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        fetch(`http://localhost:8080/api/staff/rams/${record.id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }).then((res) => loadDataRam());
      },
    });
  };

  useEffect(() => {
    loadDataRam();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [cpuCompany != undefined]);

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    loadDataRam();
  };

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    loadDataRam();
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [open, setOpen] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = (data) => {
    setOpen(true);
  };

  const [dataEdit, setDataEdit] = useState({});
  const showModalE = (data) => {
    setDataEdit(data);
    setOpenE(true);
    formEdit.setFieldsValue(data);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const onView = (record) => {
    setView(true);
  };

  const handleCancel = () => {
    setOpenE(false);
    setOpen(false);
  };

  const handleSubmit = (data) => {
    if (isUpdate === false) {
      console.log("giá trị draft khi submit" + isDraft);
      if (isDraft == true) {
        data.status = "ACTIVE";
      } else {
        data.status = "DRAFT";
      }
      fetch("http://localhost:8080/api/staff/rams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      })
        .then((response) => loadDataRam())
        .then((data) => {
          toastSuccess("Thêm mới thành công !");
          onReset();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setOpen(false);
    }
  };
  const handleSubmitE = (data) => {
    const edit = {
      id: dataEdit.id,
      categoryId: data.categoryId,
      looseSlot: data.looseSlot,
      maxRamSupport: data.maxRamSupport,
      onboardRam: data.onboardRam,
      ramCapacity: data.ramCapacity,
      ramSpeed: data.ramSpeed,
      remainingSlot: data.remainingSlot,
      status: dataEdit.status,
      typeOfRam: data.typeOfRam,
    };
    fetch(`http://localhost:8080/api/staff/rams/` + edit.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(edit),
    })
      .then((response) => loadDataRam())
      .then((data) => {
        toastSuccess("Cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setOpenE(false);
  };

  const clearSearchForm = () => {
    loadDataRam();
    setSearchName("");
    setSearchStatus();
    onClearForm();
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  const onChangeIsDraft = (value) => {
    setIsDraft(value);
  };

  const validateMessages = {
    required: "${label} không được để trống!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} phải là kiểu số!",
    },
    number: {
      range: "${label} phải từ ${min} đến ${max}",
    },
  };

  return (
    <div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "170px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-4 mt-4">
          <label>Nhập dung lượng ram</label>
          <Input
            placeholder="Nhập dung lượng ram"
            name="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-4 mt-4">
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
            <Form.Item name="select">
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
                <Select.Option value="ACTIVE" selected>
                  Hoạt động
                </Select.Option>
                <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
                <Select.Option value="DRAFT">Nháp</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className="col-12 text-center mb-4">
          <Button
            className="mt-2"
            type="primary-uotline"
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
            onOk={handleOk}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={650}
          >
            <Form
             form={form}
              validateMessages={validateMessages}
              initialValues={{
                cpuCompany,
              }}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmit(values);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="ramCapacity"
                label="Dung lượng RAM"
                rules={[
                  {
                    required: true,
                    message: "Dung lượng ram không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
              >
                <Input placeholder="Nhập dung lượng RAM" ref={cpuCompany} />
              </Form.Item>
              <Form.Item
                name="typeOfRam"
                label="Loại RAM"
                rules={[
                  {
                    required: true,
                    message: "Loại ram không được để trống",
                  },
                ]}
              >
                <Input placeholder="Nhập loại ram" />
              </Form.Item>
              <Form.Item
                name="ramSpeed"
                label="Tốc độ RAM"
                rules={[
                  {
                    required: true,
                    message: "Tốc độ RAM không được để trống",
                  },
                ]}
              >
                <Input placeholder="Nhập tốc độ RAM" />
              </Form.Item>

              <Form.Item
                name="looseSlot"
                label="Số khe cắm rời"
                rules={[
                  {
                    type:"number",
                    min: 1,
                    max: 1000,
                    required: true,   
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Số khe cắm rời" />
              </Form.Item>
              <Form.Item
                name="remainingSlot"
                label="Số khe còn lại"
                rules={[
                  {
                    
                    type:"number",
                    min: 1,
                    max: 100,
                    required: true,
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Nhập số khe còn lại" />
              </Form.Item>
              <Form.Item
                name="onboardRam"
                label="Số RAM onboard"
                rules={[
                  {
                    type: "number",
                      required: true,
                      min: 1,
                      max: 1000,      
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Số RAM onboard" />
              </Form.Item>
              <Form.Item
                name="maxRamSupport"
                label="Hỗ trợ RAM tối đa "
                rules={[
                  {
                    required: true,
                    message: "Hỗ trợ RAM tối đa không được để trống",
                  },
                ]}
              >
                <Input placeholder="Nhập hỗ trợ RAM tối đa" />
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
                      style={{ width: "100px", marginLeft: "150px" }}
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
                      style={{ width: "80px", marginLeft: "130px" }}
                    >
                      Huỷ
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          {/* modal edit */}
          <Modal
            title="Cập nhật"
            open={openE}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={650}
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitE(values, isUpdate);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="ramCapacity"
                label="Dung lượng RAM"
                initialValue={dataEdit.ramCapacity}
                rules={[
                  {
                    required: true,
                    message: "Dung lượng ram không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input ref={cpuCompany} />
              </Form.Item>
              <Form.Item
                name="typeOfRam"
                label="Loại RAM"
                initialValue={dataEdit.typeOfRam}
                rules={[
                  {
                    required: true,
                    message: "Loại ram không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ramSpeed"
                label="Tốc độ RAM"
                initialValue={dataEdit.ramSpeed}
                rules={[
                  {
                    required: true,
                    message: "Tốc độ RAM không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="looseSlot"
                label="Số khe cắm rời"
                initialValue={dataEdit.looseSlot}
                rules={[
                  {
                    required: true,
                    message: "Số khe cẳm rời không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="remainingSlot"
                initialValue={dataEdit.remainingSlot}
                label="Số khe còn lại"
                rules={[
                  {
                    required: true,
                    message: "Số khe còn lại không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="onboardRam"
                label="Số RAM onboard"
                initialValue={dataEdit.onboardRam}
                rules={[
                  {
                    required: true,
                    message: "Số RAM onboard được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="maxRamSupport"
                initialValue={dataEdit.maxRamSupport}
                label="Hỗ trợ RAM tối đa "
                rules={[
                  {
                    required: true,
                    message: "Hỗ trợ RAM tối đa không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
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
                      style={{ width: "80px", marginLeft: "170px" }}
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
            dataSource={rams}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Cập nhật"
            open={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={() => {
              setEditing(false);
            }}
          >
            <label>
              Tên thể loại
              <span className="text-danger"> *</span>
            </label>
            <Input placeholder="Tên thể loại" />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Ram;
