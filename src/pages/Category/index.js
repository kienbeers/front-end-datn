import {
  DeleteOutlined,
  EditOutlined, LockOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined
} from "@ant-design/icons";
import { Button, Input, Modal, Select, Table } from "antd";
import qs from "qs";
import React, { useEffect, useState } from "react";
import 'toastr/build/toastr.min.css';
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'react-moment';
const { Option } = Select;


const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const Category = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: '',
      search2: '',
    },
  });

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Danh mục",
      dataIndex: "name",
      width: "25%",
      sorter: (a, b) => a.name.length - b.name.length,
 
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render(createdAt) {
        return (
          <Moment format="DD-MM-YYYY HH:mm:ss">
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
          <Moment format="DD-MM-YYYY HH:mm:ss">
            {updatedAt}
          </Moment>
        );
      },
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "35%",
      render: (status) => {
        if (status == "ACTIVE") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Hoạt động
              </div>
            </>
          );
        }
        if (status == "INACTIVE") {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Không hoạt động
              </div>
            </>
          );
        }
        if (status == "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Nháp
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
      width: "5%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/category/close/${data.id}`, {
                      method: "PUT",
                      headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("token"),
                      },
                    }).then(() => load());
                  toastrs.options = {
                    timeOut: 6000,
                  }
                  toast.success('Khóa thành công!', {
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
                    `http://localhost:8080/api/staff/category/open/${data.id}`, {
                      method: "PUT",
                      headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("token"),
                      },
                    }).then(() => load());
                  toastrs.options = {
                    timeOut: 6000
                  }
                  toast.success('Mở khóa thành công!', {
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
        else if (data.status == "DRAFT") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/category/open/${data.id}`, {
                      method: "PUT",
                      headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("token"),
                      },
                    }).then(() => load());
                  toastrs.options = {
                    timeOut: 6000,
                  }
                  toast.success('Khóa thành công!', {
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
        if (data.status == "DRAFT") {
          return (
            <>
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data.id, data.name);
                }}
              />
              <DeleteOutlined
                onClick={() => onDelete(data.id)}
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          );
        }
        else if (data.status == "ACTIVE" || data.status == "INACTIVE") {
          return (
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(data.id, data.name);
              }}
            />
          )
        }
      }
    },
  ];

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/category?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      }
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
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/category?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      }
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
  const [searchName, setSearchName] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [name, setName] = useState();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/category?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setData(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          }
        })
      });
  }

  const clearSearchForm = () => {
    load();
    setSearchName("");
    setSearchStatus();
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    fetch(
      `http://localhost:8080/api/staff/category`, { method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }, body: JSON.stringify({ name: name, status: "ACTIVE" }) }).then((res) => res.json())
      .then((results) => {
        toastrs.options = {
          timeOut: 6000
        }
        toastrs.clear();
        if (results.data == null) {
          toast.error(results.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success('Thêm mới thành công!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          load();
          setName("");
          setEditing(false);
          setOpen(false);
        }
      });
  };

  const handleNhap = () => {
    fetch(
      `http://localhost:8080/api/staff/category/draft`, { method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }, body: JSON.stringify({ name: name }) }).then((res) => res.json())
      .then((results) => {
        toastrs.options = {
          timeOut: 6000
        }
        toastrs.clear();
        if (results.data == null) {
          toast.error(results.message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success('Thêm mới bản nháp thành công!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          load();
          setName("");
          setEditing(false);
          setOpen(false);
        }
      });
  };

  const changeSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  const changeName = (event) => {
    setName(event.target.value);
  };

  const onEdit = (id, name) => {
    setId(id);
    setEditing(true);
    setName(name);
  };

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Quản lý thể loại</h4>
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
        <div className="col-4 mt-3">
          <label>Tên thể loại</label>
          <Input type="text" name="searchName" value={searchName} placeholder="Nhập tên thể loại" onChange={changeSearchName} />
        </div>
        <div className="col-4 mt-3">
          <label>Trạng thái</label>
          <br />
          <Select allowClear={true}
            style={{ width: "400px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            defaultValue={"ACTIVE"}
            optionFilterProp="children"
            onChange={changeSearchStatus}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="ACTIVE" selected >Hoạt động</Option>
            <Option value="INACTIVE">Không hoạt động</Option>
            <Option value="DRAFT">Nháp</Option>
          </Select>
        </div>
        <div className="col-12 text-center ">
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
            <a href="/product/create"></a>
            <PlusOutlined />
            Thêm mới
            <ToastContainer />
          </Button>
          <Modal
            title="Tạo mới"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Hủy
              </Button>,
              <Button type="danger" onClick={handleNhap}>
                Nháp
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                Thêm mới
              </Button>,
            ]}
          >
            <label>
              Danh mục
              <span className="text-danger"> *</span>
            </label>
            <Input type="text" name="name" value={name} placeholder="Nhập danh mục" onChange={changeName} />
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
            onOk={() => {
              setLoading(true);
              fetch(
                `http://localhost:8080/api/staff/category/${id}`, { method: "PUT", headers: {
                  "Content-Type": "application/json",
                  Authorization: 'Bearer ' + localStorage.getItem("token"),
                }, body: JSON.stringify({ name: name }) }).then((res) => res.json())
                .then((results) => {
                  toastrs.options = {
                    timeOut: 6000
                  }
                  toastrs.clear();
                  if (results.data == null) {
                    toast.error(results.message, {
                      position: "top-right",
                      autoClose: 1000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                  } else {
                    toast.success('Cập nhật thành công!', {
                      position: "top-right",
                      autoClose: 1000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    load();
                    setName("");
                    setEditing(false);
                  }
                });
            }
            }
            okText="Cập nhật"
            cancelText="Hủy"
          >
            <label>
              Danh mục
            </label>
            <Input type="text" name="name" value={name} placeholder="Nhập danh mục" onChange={changeName} />
          </Modal>
          <Modal
            title="Xóa danh mục"
            open={isDelete}
            onCancel={() => {
              setDelete(false);
            }}
            onOk={() => {
              fetch(
                `http://localhost:8080/api/staff/category/${id}`, { method: 'DELETE', headers: {
                  Authorization: 'Bearer ' + localStorage.getItem("token"),
                }, }).then(() => load());
              setDelete(false);
              toastrs.options = {
                timeOut: 6000
              }
              toastrs.clear();
              toast.success('Xóa danh mục thành công!', {
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
            okText="Xóa"
            cancelText="Hủy"
          >
            Bạn muốn xóa danh mục này chứ?
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Category;

