import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  InputNumber,
  Modal,
  DatePicker,
  Radio,
  Image,
} from "antd";
import { CheckCircleOutlined, MenuFoldOutlined } from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderDelivering from "./OrderDelivering";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import { useParams } from "react-router-dom";
const { Option } = Select;

const Return = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [reason, setReason] = useState();
  const [note, setNote] = useState();
  const [valueInputNumber, setValueInputNumber] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [dataOD, setDataOD] = useState();

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

  const toastError = (message) => {
    toast.error(message, {
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

  useEffect(() => {
    loadDataOrder(id);
  }, [order != undefined]);

  const showModalData = (id) => {
    axios.get(url + "/" + id).then((res) => {
      console.log(res.data);
      setDataOD(res.data);
    });
    setView(true);
  };

  const onConfirm = (record) => {
    const isPut = true;

    Modal.confirm({
      title: "Yêu cầu trả hàng hoàn tiền",
      icon: <CheckCircleOutlined />,
      content: `Bạn có muốn xác nhận yêu cầu trả hàng hoàn tiền đơn hàng ${record.orderId.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        handleSubmitReturn(record);
      },
    });
  };

  const loadDataOrder = (id) => {
    console.log(id);
    setLoading(true);
    fetch(`http://localhost:8080/api/orders/get/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        setOrder(res);
      });
  };

  const handleSubmitReturn = (item) => {
    console.log(item);

    if (reason != undefined) {
      try {
        fetch("http://localhost:8080/api/auth/returns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            reason: reason,
            description: note,
            status: "CHUA_XU_LY",
            isCheck: 2,
            returnDetailEntities: [
              {
                productId: item.product.id,
                quantity: valueInputNumber != undefined ? valueInputNumber : 1,
                orderDetailId: item.id,
              },
            ],
          }),
        }).then((res) => {});

        fetch(`http://localhost:8080/api/orders/${item.id}/updateOrderDetail`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.product.id,
            total: item.total,
            quantity: item.quantity,
            status: item.status,
            isCheck: 2,
          }),
        }).then((res) => loadDataOrder(id));
        toastSuccess("Gửi yêu cầu thành công!");
      } catch (err) {
        console.log(err);
        toastError("Gửi yêu cầu thất bại!");
      }
    } else {
      toastError("Bạn chưa nhập lý do");
    }
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setValueInputNumber(value);
  };

  const resetEditing = () => {
    setEditing(false);
  };
  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{width: "10px"}}>
          <MenuFoldOutlined style={{fontSize: "20px"}} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Yêu cầu trả hàng/hoàn tiền</h4>
        </div>
      </div>

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
        <div className="col-12">
          <div className="row">
            <div className="col-6 mt-4 ps-4 text-success">
              <div className="mt-2 ms-5">
                Mã hoá đơn: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Khách hàng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Số điện thoại: <b>{order?.phone}</b>{" "}
              </div>
              <div className="mt-2 text-success">
                <TextArea
                  onChange={(e) => setReason(e.target.value)}
                  className="ms-2 ms-5 "
                  style={{ width: "80%" }}
                  placeholder="Lý do trả hàng"
                  rows={3}
                  cols={2}
                />
              </div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2 text-success">
                Ngày mua: <b>{order?.updatedAt}</b>
              </div>
              <div className="mt-2 text-success">
                Tổng tiền:{" "}
                <b>
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2 text-success">
                Trạnh thái: <b>Đã nhận</b>{" "}
              </div>
              <div className="mt-2">
                <TextArea
                  onChange={(e) => setNote(e.target.value)}
                  className="ms-2"
                  style={{ width: "80%" }}
                  placeholder="Ghi chú"
                  rows={3}
                  cols={2}
                />
              </div>
            </div>
          </div>
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
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Mã HDCT</th>
                <th>Hình ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {order?.orderDetails.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>
                      <Image width={100} src={item.product.images[0]?.name} />{" "}
                    </td>
                    <td>{item.product.name}</td>
                    <td>
                      {item.product.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>

                    <td>
                      <InputNumber
                        // style={{width: "20%"}}
                        min={1}
                        max={item.quantity}
                        defaultValue={1}
                        onChange={onChange}
                      />
                      / {item.quantity}
                    </td>
                    <td className="pt-2">
                      {item?.total.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      {item.isCheck === null ? (
                        <Button
                          type="danger"
                          onClick={() =>
                            handleSubmitReturn(item, valueInputNumber)
                          }
                        >
                          {" "}
                          Trả hàng
                        </Button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* <div className="col-12 text-center mb-3 mt-2">
            <Button
              onClick={handleSubmitReturn}
              type="primary"
              shape="round"
              icon={<CheckCircleOutlined />}
            >
              Đổi tất cả
            </Button>
          </div> */}
      </div>
    </div>
  );
};

export default Return;
