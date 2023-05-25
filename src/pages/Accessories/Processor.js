import { Table, Select, Input, Button, Modal, Form, InputNumber } from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState, useRef } from "react";
import "./Processor.css";
import { toast } from "react-toastify";
const { Option } = Select;
const getRandomParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchCpuCompany: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const toastSuccessProcessor = (message) => {
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

const Processor = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [data, setData] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [processors, setProcessors] = useState();
  const [processor, setProcessor] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [searchName, setSearchName] = useState();
  const [isView, setView] = useState(false);
  const [formEdit] = Form.useForm();
  const [cpuCompany, setCpuCompany] = useState("2");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [isDraft, setIsDraft] = useState();

  const onReset = () => {
    form.resetFields();
  };

  const loadDataProcessor = () => {
    setSearchName("");
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
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
    loadDataProcessor();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [cpuCompany != undefined, loading]);

  const onDelete = (record) => {
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xoá RAM ",
      content: `Bạn có muốn xoá ram ${record.cpuCompany} ${record.cpuTechnology} không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        deleteProcessor(record);
      },
    });
  };

  const deleteProcessor = (record) => {
    fetch(`http://localhost:8080/api/staff/processors/${record.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toastSuccessProcessor("Xoá thành công !");
          loadDataProcessor();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const columns = [
    {
      title: "Hãng CPU",
      dataIndex: "cpuCompany",
      width: "10%",
    },
    {
      title: "Công nghệ CPU",
      dataIndex: "cpuTechnology",
      width: "12%",
    },
    {
      title: "Loại CPU",
      dataIndex: "cpuType",
      width: "8%",
    },
    {
      title: "Tốc độ CPU",
      dataIndex: "cpuSpeed",
      width: "9%",
    },
    {
      title: "Tốc độ tối đa",
      dataIndex: "maxSpeed",
      width: "9%",
    },
    {
      title: "Số nhân",
      dataIndex: "multiplier",
      width: "7%",
    },
    {
      title: "Số luồng",
      dataIndex: "numberOfThread",
      width: "7%",
    },
    {
      title: "Bộ nhớ đệm",
      dataIndex: "caching",
      width: "8.5%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "12%",
      render: (status) => {
        if (status === "ACTIVE") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
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
                style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
              >
                Không hoạt động
              </div>
            </>
          );
        } else if (status === "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
              >
                Nháp
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
      width: "10%",
      render: (id, data) => {
        if (data.status === "DRAFT") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  // setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/processors/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataProcessor());
                  toastSuccessProcessor("Mở khóa thành công!");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data);
                }}
              />
              <DeleteOutlined
                onClick={() => onDelete(data)}
                style={{ color: "red", marginLeft: "12px" }}
              />
            </>
          );
        }
        if (data.status == "ACTIVE") {
          return (
            <>
              <LockOutlined
                style={{}}
                onClick={() => {
                  // setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/processors/${data.id}/inactive`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataProcessor());
                  toastSuccessProcessor("Khoá thành công !");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data);
                }}
              />
            </>
          );
        } else if (data.status == "INACTIVE") {
          return (
            <>
              <UnlockOutlined
                style={{}}
                onClick={() => {
                  // setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/processors/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataProcessor());
                  toastSuccessProcessor("Mở khóa thành công!");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data);
                }}
              />
            </>
          );
        }
      },
    },
  ];

  const clearSearchForm = () => {
    loadDataProcessor();
    onClearForm();
  };

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    // setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
        // setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const onSearch = (value) => {};
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = (data) => {
    setOpen(true);
  };

  const handleOk = () => {};

  const handleCancel = () => {
    setOpen(false);
  };

  const [dataEdit, setDataEdit] = useState({});
  const onEdit = (data) => {
    setDataEdit(data);
    setEditing(true);
    formEdit.setFieldsValue(data);
  };

  const handleSubmitProcessor = (data) => {
    if (isUpdate === false) {
      data.status = isDraft == true ? "ACTIVE" : "DRAFT";
      fetch("http://localhost:8080/api/staff/processors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((results) => {
          if (results.status === 200) {
            toastSuccessProcessor("Thêm mới bộ xử lý thành công !");
            onReset();
            setLoading(false);
            loadDataProcessor();
          }
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleSubmitUpdate = (data) => {
    const edit = {
      id: dataEdit.id,
      cpuCompany: data.cpuCompany,
      cpuTechnology: data.cpuTechnology,
      cpuType: data.cpuType,
      cpuSpeed: data.cpuSpeed,
      maxSpeed: data.maxSpeed,
      multiplier: data.multiplier,
      numberOfThread: data.numberOfThread,
      caching: data.caching,
      status: dataEdit.status,
    };
    if (isUpdate === false) {
      data.status = "ACTIVE";
      fetch("http://localhost:8080/api/staff/processors/" + edit.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(edit),
      })
        .then((response) => loadDataProcessor())
        .then((data) => {
          toastSuccessProcessor("Cập nhật bộ xử lý thành công!");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setEditing(false);
    }
  };

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    // setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
        // setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  const onChangeIsDraft = (value) => {
    setIsDraft(value);
  };

  const [clearForm] = Form.useForm();

  const onClearForm = () => {
    clearForm.resetFields();
    onchangeSearch();
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
          <label>Hãng CPU</label>
          <Input
            name="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nhập hãng CPU"
          />
        </div>
        <div className="col-4 mt-4">
          <Form
            form={clearForm}
            name="nest-messages"
            className="me-2 ms-2"
            layout="vertical"
            autoComplete="off"
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
                <Option value="ACTIVE" selected>
                  Hoạt động
                </Option>
                <Option value="INACTIVE">Không hoạt động</Option>
                <Option value="DRAFT">Nháp</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className="col-12 text-center mb-4">
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
            id="modal"
            title="Tạo mới bộ xử lý"
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={700}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Form
              form={form}
              validateMessages={validateMessages}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitProcessor(values, isUpdate);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="cpuCompany"
                label="Hãng CPU"
                rules={[
                  {
                    required: true,
                    message: "Hãng CPU không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 ,
                  message:"Hãng CPU từ 3 ký tự trở lên"},
                ]}
               
              >
                <Input placeholder="Nhập hãng CPU" ref={cpuCompany} />
              </Form.Item>
              <Form.Item
                name="cpuTechnology"
                label="Công nghệ CPU"
                rules={[
                  {
                    required: true,
                    message: "Công nghệ CPU không được để trống",
                  },
                ]}
                
              >
                <Input placeholder="Nhập công nghệ CPU" />
              </Form.Item>

              <Form.Item
                name="cpuType"
                label="Loại CPU"
                rules={[
                  {
                    required: true,
                    message: "Loại CPU không được để trống",
                  },
                ]}
               
              >
                <Input placeholder="Tốc độ CPU" />
              </Form.Item>
              <Form.Item
                name="cpuSpeed"
                label="Tốc độ CPU"
                rules={[
                  {
                    required: true,
                    message: "Tốc độ CPU không được để trống",
                  },
                ]}
               
              >
                <Input placeholder="Nhập tốc độ CPU" />
              </Form.Item>
              <Form.Item
                name="maxSpeed"
                label="Tốc độ tối đa CPU"
                rules={[
                  {
                    required: true,
                    message: "Tốc độ tối đa không được để trống",
                  },
                ]}
               
              >
                <Input placeholder="Tốc độ tối đa CPU" />
              </Form.Item>
              <Form.Item
                name="multiplier"
                label="Số nhân"
                rules={[
                  {
                    type:"number",
                    min: 1,
                    max: 1000,
                    required: true,           
                  },
                ]}
               
              >
                <InputNumber style={{ width: "100%" }} placeholder="Nhập số nhân CPU" type="number" />
              </Form.Item>
              <Form.Item
                name="numberOfThread"
                label="Số luồng CPU"
                rules={[
                  {
                    type:"number",
                    min: 1,
                    max: 1000,
                    required: true,   
                  },
                ]}
               
              >
                <InputNumber style={{ width: "100%" }} placeholder="Nhập số luồng CPU" type="number" />
              </Form.Item>
              <Form.Item
                name="caching"
                label="Bộ nhớ đệm"
                rules={[
                  {
                    required: true,
                    message: "Bộ nhớ đẹm CPU không được để trống",
                  },
                ]}
                
              >
                <Input placeholder="Nhập bộ nhớ đệm CPU" />
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
                      danger
                      onClick={() => onChangeIsDraft(false)}
                      style={{ width: "100px", marginLeft: "180px" }}
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
                      style={{ width: "80px", marginLeft: "190px" }}
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
            dataSource={processors}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Cập nhật bộ xử lý"
            open={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={700}
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitUpdate(values, isUpdate);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="cpuCompany"
                label="Hãng CPU"
                initialValue={dataEdit.cpuCompany}
                rules={[
                  {
                    required: true,
                    message: "Hãng CPU không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="cpuTechnology"
                label="Công nghệ CPU"
                initialValue={dataEdit.cpuTechnology}
                rules={[
                  {
                    required: true,
                    message: "Công nghệ CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="cpuType"
                label="Loại CPU"
                initialValue={dataEdit.cpuType}
                rules={[
                  {
                    required: true,
                    message: "Loại CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="cpuSpeed"
                label="Tốc độ CPU"
                initialValue={dataEdit.cpuSpeed}
                rules={[
                  {
                    required: true,
                    message: "Tốc độ CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="maxSpeed"
                label="Tốc độ tối đa CPU"
                initialValue={dataEdit.maxSpeed}
                rules={[
                  {
                    required: true,
                    message: "Tốc độ tối đa không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="multiplier"
                label="Số nhân"
                initialValue={dataEdit.multiplier}
                rules={[
                  {
                    required: true,
                    message: "Số nhân CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="numberOfThread"
                label="Số luồng CPU"
                initialValue={dataEdit.numberOfThread}
                rules={[
                  {
                    required: true,
                    message: "Số luồng CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="caching"
                label="Bộ nhớ đệm"
                initialValue={dataEdit.caching}
                rules={[
                  {
                    required: true,
                    message: "Bộ nhớ đẹm CPU không được để trống",
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
                      style={{ width: "80px", marginLeft: "190px" }}
                    >
                      Huỷ
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            // style={{borderRadius:"10px"}}
            title="Hiển thị"
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
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

export default Processor;
