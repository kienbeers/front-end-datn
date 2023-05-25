import { Table, Select, Input, Button, Modal, Form } from "antd";
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
import Moment from "react-moment";
import { toast } from "react-toastify";
import TextArea from "antd/lib/input/TextArea";
const { Option } = Select;
const getRandomParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
});

const toastSuccessAccessory = (message) => {
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

const Accessory = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [searchName, setSearchName] = useState();
  const [isView, setView] = useState(false);
  const [formEdit] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
    },
  });
  const [dataEdit, setDataEdit] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };

  const loadDataAccessory = () => {
    setSearchName("");
    fetch(
      `http://localhost:8080/api/auth/accessory?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
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
    loadDataAccessory();
  }, [loading, data != undefined]);

  const columns = [
    {
      title: "Mã phụ kiện",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Tên phụ kiện",
      dataIndex: "name",
      width: "36%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: "36%",
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
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "8%",
      render: (id, data) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(data);
              }}
            />
          </>
        );
      },
    }
  ];

  const clearSearchForm = () => {
    loadDataAccessory();
  };

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    fetch(
      `http://localhost:8080/api/auth/accessory?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const showModal = (data) => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (data) => {
    if (isUpdate === false) {
      data.status = "ACTIVE";
      fetch("http://localhost:8080/api/staff/accessory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((results) => {
          if (results.status === 200) {
            toastSuccessAccessory("Thêm mới phụ kiện thành công !");
            onReset();
            setLoading(false);
          }
          setOpen(false);
          loadDataAccessory();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const onEdit = (data) => {
    setDataEdit(data);
    setEditing(true);
    formEdit.setFieldsValue(data);
  };


  const handleSubmitUpdate = (data) => {
    const edit = {
      id: dataEdit.id,
      name: data.name,
      description: data.description
    };
    if (isUpdate === false) {
      fetch("http://localhost:8080/api/staff/accessory/" + edit.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
        body: JSON.stringify(edit),
      })
        .then((response) => loadDataAccessory())
        .then((data) => {
          toastSuccessAccessory("Cập nhật thông tin phụ kiện thành công!");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setEditing(false);
    }
  };

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.current = 1;
    fetch(
      `http://localhost:8080/api/auth/accessory?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  return (
    <div>
      <div
        className="row"
        style={{
          borderRadius: "10px",
          height: "80px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-12 d-flex justify-content-around align-items-center">
          <div className="col-5 d-flex align-items-center">
            <label style={{ width: "105px", marginRight: "10px" }}>Tên phụ kiện</label>
            <Input
              name="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Nhập tên phụ kiện"
            />
          </div>
          <div className="col-4">
            <Button
              type="primary-outline"
              onClick={clearSearchForm}
              shape="round"
            >
              <ReloadOutlined />
              Đặt lại
            </Button>
            <Button
              className="mx-2"
              type="primary"
              onClick={search}
              shape="round"
            >
              <SearchOutlined />
              Tìm kiếm
            </Button>
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
            id="modal"
            title="Tạo mới"
            open={open}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={550}         
            footer={null}
          >
            <Form
              form={form}
              initialValues={{}}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmit(values, isUpdate);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="name"
                label="Tên phụ kiện"
                rules={[
                  {
                    required: true,
                    message: "Tên phụ kiện không được trống!",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tên phụ kiện" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
                hasFeedback
              >
                <TextArea placeholder="Mô tả sản phẩm ..." />
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
                      style={{width: "100px"}}
                    >
                      Tạo mới
                    </Button>
                  </div>
                  <div className="col-6">
                  <Button
                      block
                      shape="round"
                      className="cancel"
                      onClick={handleCancel}
                      style={{width: "80px"}}
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
            onCancel={() => {
              setEditing(false);
            }}   
            footer={null}
            width={550}
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitUpdate(values, isUpdate);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="name"
                label="Tên phụ kiện"
                initialValue={dataEdit.name}
                rules={[
                  {
                    required: true,
                    message: "Tên phụ kiện không được trống!",
                  },
                  { whitespace: true },
                ]}
            
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
                initialValue={dataEdit.description}
               
              >
                <TextArea />
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
                      style={{width: "100px"}}
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
                      style={{width: "80px"}}
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

export default Accessory;
