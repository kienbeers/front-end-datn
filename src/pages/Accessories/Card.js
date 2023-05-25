import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Table, Slider, Select, Input, Button, Modal, Form } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Card() {
    const [data, setData] = useState();
    const columns = [
        {
            title: "Hãng",
            dataIndex: "trandemark",
            width: "22%",
        },
        {
            title: "Model",
            dataIndex: "model",
            width: "22%",
        },
        {
            title: "Bộ nhớ",
            dataIndex: "memory",
            width: "22%",
        },
        {
            title: "Thao tác",
            dataIndex: "Thao tác",
            width: "12%",
            render: (record, card) => {
                return (
                    <>
                        <EditOutlined
                            style={{ marginLeft: 12 }}
                            onClick={() => {
                                onEdit(card);
                            }}
                        />
                        <DeleteOutlined
                            onClick={
                                () => showModalCancel(card)
                            }
                            style={{ color: "red", marginLeft: 12 }}
                        />
                    </>
                );
            },
        },
    ];

    const [formEdit] = Form.useForm();
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };


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

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSubmit = (data) => {
        if (isUpdate === false) {
            data.status = "ACTIVE";
            fetch("http://localhost:8080/api/card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((response) => getData())
                .then((data) => {
                    toastSuccess("Thêm mới thành công !");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            setOpen(false);
        }
    };

    const handleSubmitUpdate = (data, form) => {
        const edit = {
            id: dataEdit.id,
            memory: data.memory,
            model: data.model,
            trandemark: data.trandemark,
        }
        if (isUpdate === false) {
            data.status = "ACTIVE";
            fetch(`http://localhost:8080/api/card/` + edit.id, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(edit)
            })
                .then((response) => getData())
                .then((data) => {
                    toastSuccess("Cập nhật thành công!");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            setEditing(false);
        }
    };

    const search = () => {
        tableParams.pagination.modelSearch = searchModel;
        tableParams.pagination.trandemarkSearch = searchTrandemark;
        tableParams.pagination.current = 1;
        setLoading(true);
        fetch(
            `http://localhost:8080/api/card?${qs.stringify(
                getRandomuserParams(tableParams)
            )}`
        )
            .then((res) => res.json())
            .then((results) => {
                setData(results.data.data);
                setLoading(false);
                setTableParams({
                    pagination: {
                        current: 1,
                        pageSize: 10,
                        total: results.data.total,
                    },
                });
            });
    };

    const getRandomuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
        searchTrandemark: params.pagination?.trandemarkSearch,
        searchModel: params.pagination?.modelSearch,
    });

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            searchTrandemark: '',
            searchModel: ''
        },
    });
    const [totalSet, setTotal] = useState(10);
    const url = "http://localhost:8080/api/card";

    const getData = () => {
        setModelSearch("");
        setTrandemarkSearch("");
        axios.get(url + `?${qs.stringify(
            getRandomuserParams(tableParams)
        )}`)
            .then((results) => {
                setData(results.data.data.data)
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: totalSet,
                    }
                });
            });
    };
    useEffect(() => {
        getData();
    }, []);

    const clearSearchForm = () => {
        getData();
      };

    const cardEdit = {
        id: '',
        trandemark: '',
        memory: '',
        model: ''
    }

    const [dataEdit, setDataEdit] = useState({});
    const onEdit = (data) => {
        setEditing(true);
        setDataEdit(data);
        formEdit.setFieldsValue(data);
    };

    const [isEditing, setEditing] = useState(false);
    const [isDelete, setDelete] = useState(false);
    const [isView, setView] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleTableChange = (pagination, filters, sorter) => {
        tableParams.pagination = pagination;
        tableParams.pagination.trandemarkSearch = searchTrandemark;
        tableParams.pagination.modelSearch = searchModel;
        fetch(
            `http://localhost:8080/api/card?${qs.stringify(
                getRandomuserParams(tableParams)
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

    const [searchModel, setModelSearch] = useState('')
    const [searchTrandemark, setTrandemarkSearch] = useState('')
    

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
    const [cardDel, setCardDel] = useState({
        id: '',
        trandemark: "",
        memory: '',
        model: ''
    })
    const showModalCancel = (card) => {
        setCardDel(card);
        setDelete(true);
    };

    const Delete = (card) => {
        axios.delete(`http://localhost:8080/api/card/` + card.id)
            .then((resualt) => {
                notifySuccess("Xóa thành công");
                getData();
            })
    }
    return (<>
        <div>
            <div
                className="row"
                style={{
                    borderRadius: "20px",
                    height: "120px",
                    border: "1px solid #d9d9d9",
                    background: "#fafafa",
                    alignItems: "center"
                }}
            >
                <div className="col-4">
                    <Input placeholder="Hãng" value={searchTrandemark} onChange={(e) => setTrandemarkSearch(e.target.value)} />
                </div>
                <div className="col-4">
                    <Input placeholder="Model" value={searchModel} onChange={(e) => setModelSearch(e.target.value)} />
                </div>
                <div className="col-4">
                    <Button
                        type="primary-outline"
                        onClick={clearSearchForm}
                       shape="round"
                    >
                        <ReloadOutlined />Đặt lại
                    </Button>
                    <Button
                        className="mx-2 "
                        type="primary"
                        onClick={search}
                       shape="round"
                    >
                        <SearchOutlined />Tìm kiếm
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
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                        width={550}
                        okButtonProps={{
                            style: {
                                display: "none",
                            },
                        }}
                        cancelText={"Đóng"}
                    >
                        <Form
                            initialValues={{
                            }}
                            autoComplete="off"
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                            onFinish={(values) => {
                                setIsUpdate(false);
                                handleSubmit(values, isUpdate);
                            }}
                            onFinishFailed={(error) => {
                                console.log({ error });
                            }}
                        >
                            <Form.Item
                                name="trandemark"
                                label="Hãng"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên hãng không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Hãng ..." />
                            </Form.Item>
                            <Form.Item
                                name="model"
                                label="Model"
                                rules={[
                                    {
                                        required: true,
                                        message: "Model không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Model ..." />
                            </Form.Item>
                            <Form.Item
                                name="memory"
                                label="Bộ nhớ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Bộ nhớ không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Bộ nhớ ..." />
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
                            }}
                            onFinishFailed={(error) => {
                                console.log({ error });
                            }}>
                            <Form.Item
                                name="trandemark"
                                label="Hãng"
                                initialValue={dataEdit.trandemark}
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên hãng không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="model"
                                label="Model"
                                initialValue={dataEdit.model}
                                rules={[
                                    {
                                        required: true,
                                        message: "Model không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="memory"
                                label="Bộ nhớ"
                                initialValue={dataEdit.memory}
                                rules={[
                                    {
                                        required: true,
                                        message: "Bộ nhớ không được để trống",
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


                    <Modal className="p-5"
                        title="Xác nhận"
                        open={isDelete}
                        onCancel={() => {
                            setDelete(false);
                        }}
                        onOk={() => {
                            Delete(cardDel);
                            setDelete(false);
                            // setLoading(true);

                        }}
                    >
                        <label className="m-3">
                            Bạn có muốn xóa???
                            <span className="text-danger"> !!!!!</span>
                        </label>
                    </Modal>
                </div>
            </div>
        </div >

    </>)
}
export default Card;