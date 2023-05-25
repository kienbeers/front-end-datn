import React from "react";
import "antd/dist/antd.css";
import { Tabs } from "antd";
import BatteryCharger from "./BatteryCharger";
import Origin from "./Origin";
import Processor from "./Processor";
import Storage from "./Storage";
import Screen from "./Screen";
import Ram from "./Ram";
import Color from "./Color";
import Card from "./Card";
import Win from "./Win";
import { ToastContainer } from "react-toastify";
import { MenuFoldOutlined } from "@ant-design/icons";
import Accessory from "./Accessory";

const onChange = (key) => {
  console.log(key);
};

const toastError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

function Accessories() {
  return (
    <div
      style={{
        display: "block",
       
      }}
    >
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Quản lý linh kiện, phụ kiện & thuộc tính</h4>
        </div>
      </div>
      <ToastContainer></ToastContainer>
      <div className="card-container">
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          items={[
            {
              label: "Xuất xứ",
              key: "1",
              children: <Origin />,
            },
            {
              label: "Bộ xử lý",
              key: "2",
              children: <Processor />,
            },
            {
              label: "Lưu trữ",
              key: "3",
              children: <Storage />,
            },
            {
              label: "Pin và sạc",
              key: "4",
              children: <BatteryCharger />,
            },
            {
              label: "Màn hình",
              key: "5",
              children: <Screen />,
            },
            {
              label: "Ram",
              key: "6",
              children: <Ram />,
            },
            {
              label: "Màu",
              key: "7",
              children: <Color />,
            },
            {
              label: "Hệ điều hành",
              key: "8",
              children: <Win />,
            },
            {
              label: "Card",
              key: "9",
              children: <Card />,
            },
            {
              label: "Phụ kiện",
              key: "10",
              children: <Accessory />,
            },
          ]}
        />
      </div>
    </div>
  );
}
export default Accessories;
