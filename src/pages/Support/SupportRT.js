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

const SupportRT = () => {
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
      title: "Mã đơn đặt",
      dataIndex: "name",
      render: (name) => `${name.first} ${name.last}`,
      width: "15%",
    },
    {
      title: "Người đặt",
      dataIndex: "name",
      render: (name) => `${name.first} ${name.last}`,
      width: "15%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "name",
      render: (name) => `${name.first} ${name.last}`,
      width: "15%",
    },
    {
      title: "Hình thức đặt",
      dataIndex: "name",
      render: (name) => `${name.first} ${name.last}`,
      width: "15%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "name",
      render: (name) => `${name.first} ${name.last}`,
      width: "15%",
    },
    {
      title: "Nội dung",
      dataIndex: "name",
      render: (record) => {
        return (
          <>
            <div
              className="bg-primary text-center text-light"
              style={{ width: "100px", borderRadius: "5px" }}
              onClick={() => {
                onView(record);
              }}
            >
              Chi tiết
            </div>
          </>
        );
      },
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "Trạng thái",
      width: "10%",
      render: (record) => {
        return (
          <>
            <div
              className="bg-primary text-center text-light"
              style={{ width: "100px", borderRadius: "5px" }}
            >
              Trả hàng
            </div>
          </>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "Thao tác",
      width: "15%",
      render: (record) => {
        return (
          <>
            <EyeOutlined
              onClick={() => {
                console.log('key key')
                navigate('detail');
              }}
            />
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(record);
              }}
            />
          </>
        );
      },
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
        <div className="col-6 mt-4">
          <label>Mã đơn hàng</label>
          <Input placeholder="Nhập mã đơn hàng" />
        </div>
        <div className="col-6 mt-4">
          <label>Trạng thái</label>
          <br />
          <Select
            style={{ width: "500px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="jack">Xác nhận</Option>
            <Option value="lucy">Chờ xác nhận</Option>
          </Select>
        </div>
        <div className="col-6">
          <label>Người đặt</label>
          <Input placeholder="Tên người đặt" />
        </div>
        <div className="col-6 mt-4">
          <label>Thời gian đặt: </label>
          <Space className="mx-2" direction="vertical" size={12}>
            <RangePicker size={"middle"} />
          </Space>
        </div>
        <div className="col-12 text-center ">
          <Button
            className="mt-2"
            type="primary-uotline"
            // onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            // onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            <SearchOutlined />
            Tìm kiếm
          </Button>
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

export default SupportRT;
