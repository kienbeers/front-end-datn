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
} from "antd";
import logo from '../../asset/images/logo_kinglap.png';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
//date
const { RangePicker } = DatePicker;

const onDelete = (record) => {
    Modal.confirm({
        title: "Xoá thể loại",
        content: "Bạn có muón xoá bản ghi này không?",
    });
};

const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

const SupportRT_detail = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [isView, setView] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const columns = [
        {
            title: "Số thứ tự",
            dataIndex: "name",
            render: (name) => `${name.first} ${name.last}`,
            width: "10%",
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            render: (name) => `${name.first} ${name.last}`,
            width: "18%",
        },
        {
            title: "Ảnh sản phẩm",
            dataIndex: "name",
            render: (name) => `${name.first} ${name.last}`,
            width: "18%",
        },
        {
            title: "Số lượng",
            dataIndex: "name",
            render: (name) => `${name.first} ${name.last}`,
            width: "18%",
        },
        {
            title: "Đơn giá",
            dataIndex: "name",
            render: (name) => `${name.first} ${name.last}`,
            width: "18%",
        },
        {
            title: "Tổng tiền",
            dataIndex: "name",
            render: (name) => `${name.first} ${name.last}`,
            width: "18%",
        },
    ];

    const fetchData = () => {
        setLoading(true);
        fetch(
            `https://randomuser.me/api?${qs.stringify(
                getRandomuserParams(tableParams)
            )}`
        )
            .then((res) => res.json())
            .then(({ results }) => {
                setData(results);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200, // 200 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        console.log("search:", value);
    };
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState("Content of the modal");

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText("The modal will be closed after two seconds");
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const onEdit = (record) => {
        setEditing(true);
    };

    const onView = (record) => {
        setView(true);
    };

    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };

    //xử lý date
    const [size, setSize] = useState("middle");

    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const navigate = useNavigate();
    const [keyOrder, setKey] = useState("/order/create")
    return (

        <div>
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
                <div className="col-4 mt-4">
                    <label>Mã đơn hàng: </label>
                    <br />
                    <br />
                    <label>Người đặt: </label>
                </div>
                <div className="col-4 mt-4">
                    <label>Hình thức nhận hàng: </label>
                    <br />
                    <br />
                    <label>Ngày đặt: </label>
                </div>
                <div className="col-4 mt-4">
                    <label>Tổng tiền: </label>
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


                <div className="col-12 mt-2">
                    <h6>Các sản phẩm đã chọn</h6>
                    <hr></hr>
                    <Table
                        columns={columns}
                        rowKey={(record) => record.login.uuid}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                    />
                    <Modal
                        title="Thông báo!!!"
                        visible={isEditing}
                        onCancel={() => {
                            setEditing(false);
                        }}
                        onOk={() => {
                            setEditing(false);
                        }}
                    >
                        <label>
                            Bạn có chắc chắn muốn chuyển trạng thái đơn hàng
                            <span className="text-danger"> ???</span>
                        </label>
                    </Modal>

                    <Modal
                        // style={{borderRadius:"10px"}}
                        title="Hiển thị"
                        visible={isView}
                        onCancel={() => {
                            setView(false);
                        }}
                        onOk={() => {
                            setView(false);
                        }}
                    >
                        <div>
                            <img src={logo} width="70%" />
                            <br />
                            <img src={logo} width="70%" />
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default SupportRT_detail;
