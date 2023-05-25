import { Table, Slider, Select, Input, Button, Modal, DatePicker, Radio, Space, Form, InputNumber } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  LockOutlined,
  UnlockOutlined
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
// import Product from "../Product/index";
import moment from "moment";
import axios from "axios";
import 'toastr/build/toastr.min.css';
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'react-moment';
const url = 'http://localhost:8080/api';
const { Option } = Select;

const Color = () => {
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
  }
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
  }
  const [formE] = Form.useForm();
  const [totalSet, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [data, setData] = useState();
  const [formDefault, setValuesDefault] = useState({
    id: "",
    name: "",
  }
  );
  const [form, setValues] = useState({
    id: "",
    name: "",
  }
  );

  const [searchName, setSearchName] = useState();
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchName: params.pagination?.searchName,
  });
  //phân trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchName: "",
    },
  });

  const columns = [
    {
      title: "Tên màu",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render(createdAt) {
        return (
          <Moment format="DD-MM-YYYY">
            {createdAt}
          </Moment>
        );
      },
      width: "20%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render(updatedAt) {
        return (
          <Moment format="DD-MM-YYYY">
            {updatedAt}
          </Moment>
        );
      },
      width: "20%",
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
                onEdit(data);
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(data.id)}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  //APILoadList
  const getData = () => {
    setLoading(true);
    axios.get(url + `/auth/colors?${qs.stringify(
      getRandomuserParams(tableParams)
    )}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((results) => {
        setData(results.data.data.data);
        setTotal(results.data.data.total);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          }
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
      status: "ACTIVE"
    }
    axios.post(url + "/staff/color", form, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => {
        notifySuccess('Thêm bản ghi thành công')
        // setAdd(false);
        setOpen(false);
        getData();
        setValues(formDefault);
        formE.setFieldsValue(formDefault);
      }).catch((error) => {
        notifyError('Thêm bản ghi thất bại!');
        return;
      })

  }
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
      status: form.status,
    }
    axios.put(url + "/staff/color/" + dataEdit.id, dataEdit, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => {
        notifySuccess('Sửa bản ghi thành công')
        getData();
        setEditing(false);
        setValues(formDefault);
        formE.setFieldsValue(formDefault);
      }).catch((error) => {
        notifyError('Sửa bản ghi thất bại!');
        return;
      })
  }


  //Delete
  const onDelete = (id) => {
    Modal.confirm({
      title: "Xoá",
      okText:"Có",
      cancelText:"Không",
      content: "Bạn có muốn xoá bản ghi này không?",
      onOk() {
        axios.delete(url + "/staff/color/" + id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then(res => {
            notifySuccess('Xóa bản ghi thành công!')
            getData();
          }).catch((errorMessage) => {
            notifyError('Xóa bản ghi không thành công!');
            return;
          })
      },
      onCancel() {
      },
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
      tableParams.pagination.current = 1,
      tableParams.pagination.pageSize = 10,
      tableParams.pagination.searchName = searchName,
    );
    getData();
  }

  const clearSearchForm = () => {
    setSearchName("")
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination.current = 1,
        ...tableParams.pagination.pageSize = 10,
        ...tableParams.pagination.searchName = "",
      }
    });
    getData();
  }


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
              <Input placeholder="Nhập tên màu" value={searchName}
                onChange={(e) => setSearchName(e.target.value)} />
            </div>
            <div className="col-8 mt-3">
              <Button
                className="mb-2 mx-2"
                type="primary"
                onClick={search}
                style={{ borderRadius: "10px" }}
              >
                <SearchOutlined />
                Tìm kiếm
              </Button>
              <Button
                className="mb-2"
                type="primary-uotline"
                onClick={clearSearchForm}
                style={{ borderRadius: "10px" }}
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
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined /> Thêm mới
          </Button>
          <Modal
            title="Tạo mới"
            open={open}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={550}
            footer={null}
          >
            <Form
              form={formE}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                handleAdd(values)
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="name"
                label="Tên màu"
                rules={[
                  {
                    required: true,
                    message: "Tên màu không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tên màu" />
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
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Cập nhật"
            open={isEditing}
            onCancel={handleCancel}
            width={550}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
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
                label="Tên màu"
                rules={[
                  {
                    required: true,
                    message: "Tên màu không được để trống",
                  },
                  { whitespace: true },
                ]}
              
              >
                <Input placeholder="Nhập tên màu" />
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

export default Color;