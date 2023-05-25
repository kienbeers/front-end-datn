import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Radio,
  Drawer,
  Alert,
  Image,
  Checkbox,
  AutoComplete,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import Moment from "react-moment";
import { useParams } from "react-router-dom";
import { render } from "@testing-library/react";
const { Option } = Select;

const getRandomProductParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchStatus: params.pagination?.searchStatus,
  searchProductKey: params.pagination?.searchProductKey,
  searchImei: params.pagination?.searchImei,
  searchPrice: params.pagination?.searchPrice,
});

const ExchangeUser = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [dataProduct, setDataProduct] = useState([]);
  const [reason, setReason] = useState();
  const [note, setNote] = useState();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [values, setValues] = useState();
  const [dataCart, setDataCart] = useState([]);
  const [valueInputNumber, setValueInputNumber] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [item, setItem] = useState();
  const [dataOD, setDataOD] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
      searchStatus: "ACTIVE",
      searchImei: "",
      searchPrice: "",
      searchProductKey: "",
    },
  });

  const [tableParamPro, setTableParamPro] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      search1: "",
      search2: "",
      searchStatus: "ACTIVE",
      searchImei: "",
      searchProductKey: "",
      searchPrice: "",
    },
  });
  const showModal = (item) => {
    setItem(item);
    setIsModalOpen(true);
  };

  const onChangeReason = (value, id) => {
    let check = false;
    console.log(value);
    if (!isNaN(value)) {
      dataCart?.forEach((element, index) => {
        if (element.index == id) {
          element.reason = "null";
        }
      });
      check = true;
    }
    let count = 0;
    dataCart?.forEach((element, index) => {
      if (element.index == id && isNaN(value)) {
        console.log("rỗng: ", check);
        console.log("vào đếm count");
        count++;
        element.reason = value;
        // setReason(count);
      }
    });
  };

  const onCancel = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CloseCircleOutlined className="text-danger" />,
      title: "Huỷ yêu cầu đổi hàng",
      content: `Bạn có muốn huỷ yêu cầu đổi hàng ${record.id} không ?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        cancelOrderDetail(record);
      },
    });
  };

  const cancelOrderDetail = (data) => {
    const orderDetail = [];
    orderDetail.push({
      id: data.id,
      isCheck: data.id,
      productId: data.product.id,
      quantity: data.quantity,
      total: 0,
      isBoolean: false,
      status: "0",
    });
    fetch(
      `http://localhost:8080/api/auth/orders/update/exchange/${data.id}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(orderDetail),
      }
    ).then((res) => {
      loadDataOrder(id);
    });
    toastSuccess("Huỷ yêu cầu đổi hàng thành công !");
  };

  const handleOk = () => {
    if (dataCart.length == 0) {
      toastError("Bạn chưa chọn sản phẩm để đổi hàng");
    } else {
      const data = [];
      dataCart?.forEach((element, index) => {
        data.push({
          index: index,
          orderId: id,
          productId: element.id,
          total: element.price,
          quantity: 1,
          isCheck: item?.id,
        });
      });

      let count = 0;
      dataCart.forEach((item) => {
        if (item.reason != undefined && item.reason != "null") {
          count++;
        }
      });

      if (dataCart.length == count) {
        fetch("http://localhost:8080/api/auth/orders/exchanges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((results) => {
            console.log(results);
            handleSubmitReturn(results.data, item);
          })
          .then((data) => {
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        setIsModalOpen(false);
      } else {
        toastError("Bạn chưa nhập đầy đủ lý do !");
      }
    }
  };

  const onChangeChecked = (value, id) => {
    console.log("value checked");
    console.log(value);
    setChecked(value);
    dataCart?.forEach((element, index) => {
      if (element.index == id) {
        element.checked = value;
      }
    });
    console.log("data checked");
    console.log(dataCart);
  };

  const handleSubmitReturn = (data, dataOrderDetail) => {
    const ExchangeDetail = [];
    data?.forEach((element, index) => {
      ExchangeDetail.push({
        productId: element.product.id,
        orderDetailId: item.id,
        quantity: 1,
        reason: dataCart[index].reason,
        orderChange: element.id,
        status: "YEU_CAU",
        isCheck: dataCart[index].checked == true ? "1" : "",
        id: null,
      });
    });

    // console.log("data exchange");
    // console.log(ExchangeDetail);

    // var date = new Date().getDate();
    // var month = new Date().getMonth() + 1;
    // var year = new Date().getFullYear();
    // var hours = new Date().getHours();
    // var min = new Date().getMinutes();
    // var sec = new Date().getSeconds();
    // setCurrentDate(date + "-" + month + "-" + year + " ");
    // const event = new Date(order?.updatedAt);
    // const event1 = new Date("2022-11-11 18:56:26");
    // console.log(
    //   moment(event.setDate(event.getDate() + 2)).format("DD-MM-YYYY")
    // );
    // if (reason != undefined) {
    ///tạo đơn đổi
    // try {
    fetch("http://localhost:8080/api/auth/returns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        orderId: order.id,
        description: "Ghi chú",
        status: "CHUA_XU_LY",
        returnDetailEntities: ExchangeDetail,
      }),
    }).then((res) => {});
    fetch(
      `http://localhost:8080/api/auth/orders/${dataOrderDetail.id}/updateOrderDetail`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          productId: dataOrderDetail.product.id,
          total: dataOrderDetail.total,
          quantity: dataOrderDetail.quantity,
          status: dataOrderDetail.status,
          isCheck: dataOrderDetail.id,
          isUpdate: 1,
        }),
      }
    ).then((res) => loadDataOrder(id));
    toastSuccess("Gửi yêu cầu thành công!");
    setReason("");
    setChecked(false);
    setIsModalOpen(false);
    setNote("");
    setLoading(false);

    setChecked(false);
    setDataCart([]);
    loadDataOrder(id);
  };
  const handleCancel = () => {
    setDataCart([]);
    setIsModalOpen(false);
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
    // loadDataProduct();
    loadDataProduct2();
  }, []);

  const loadDataProduct2 = () => {
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomProductParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataProduct(results.data.data);
        const dataResult = [];
        results.data.data.forEach((item) => {
          if(item.quantity > 0) {
            dataResult.push(
              renderItem(
                item.id,
                item.name,
                item?.images[0]?.name,
                item.price,
                item.debut
              )
            );
          }    
          setData(dataResult);
        });
      });
  };

  const renderItem = (id, title, count, price, debut) => ({
    value: id,
    label: (
      <div
        style={{
          display: "flex",
        }}
      >
        <span>
          <Image width={85} src={count} />
        </span>
        {" " + title + " (" + debut + ") "}{" "}
        {price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}
      </div>
    ),
    price: price,
  });

  // const loadDataProduct = () => {
  //   setLoading(true);
  //   fetch(
  //     `http://localhost:8080/api/products?${qs.stringify(
  //       getRandomProductParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataProduct(results.data.data);
  //       setLoading(false);
  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  const onConfirm = (record) => {
    const isPut = true;

    Modal.confirm({
      title: "Yêu cầu trả hàng hoàn tiền",
      icon: <CheckCircleOutlined />,
      content: render(
        <h1>
          <h1>{record.id}</h1>
        </h1>
      ),
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
    fetch(`http://localhost:8080/api/auth/orders/get/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setOrder(res);
      });
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setValueInputNumber(value);
  };

  const onChangeProduct = (value) => {
    // loadDataProduct();
    const dataPro = [];
    let productValue;
    setValueProduct(value);
    console.log(dataProduct);
    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item) => item.id === value)
        .map((product) => {
          console.log("vào push");
          dataPro.push({
            id: product.id,
            images: product?.images[0].name,
            name: product?.name,
            price: product?.price,
            debut: product?.debut,
          });
          productValue = product;
        });
    }
    if (dataCart === undefined) {
      dataPro.forEach((element, index) => {
        if (element.price < item.product.price) {
          dataPro.splice(index, 1);
          toastError(
            "Sản phẩm phải có giá tiền lớn hơn hoặc bằng sản phẩm trước đó"
          );
        } else {
          setDataCart(dataPro);
        }
      });
    } else {
      if (dataCart.length + 1 > item.quantity) {
        toastError("Sản phẩm không được vượt quá số lượng mua ban đầu !");
      } else {
        dataPro.forEach((element, index) => {
          if (element.price < item.product.price) {
            dataPro.splice(index, 1);
            toastError(
              "Sản phẩm phải có giá tiền lớn hơn hoặc bằng sản phẩm trước đó"
            );
          } else {
            setDataCart((t) => [...t, productValue]);
          }
        });
      }
    }

    let total = dataPro[0]?.price;
    if (dataCart?.length === undefined) {
      setTotalProduct(total);
    }
    if (dataCart?.length + 1 <= item.quantity) {
      dataCart?.forEach((item) => {
        total += item.price;
      });
      if (total > 0) {
        setTotalProduct(total);
      } else {
        setTotalProduct(0);
      }
    }
  };

  const onSearchProduct = (searchItem) => {
    console.log("value product click" + searchItem);
  };
  const deleteProduct = (item) => {
    let total = 0;
    dataCart.forEach((element, index) => {
      if (element.id === item.id) {
        dataCart.splice(index, 1);
      }
    });

    dataCart.forEach((element) => {
      total += element.price;
    });
    setTotalProduct(total);

    // loadDataProduct();
  };

  const onChangeSearch = (event) => {
    setValues(event);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onSelectAuto = (value) => {
    setValueProduct(value);
    setValues("");
    const dataPro = [];
    let productValue;

    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item, index) => item.id === value)
        .map((product, index) => {
          dataPro.push({
            index: index,
            id: product.id,
            images: product?.images[0]?.name,
            name: product?.name,
            price: product?.price,
            debut: product?.debut,
          });
        });
      console.log(dataPro);
    }
    if (dataCart === undefined || dataCart === [] || dataCart.length == 0) {
      dataPro.forEach((element, index) => {
        if (Number(element.price) < Number(item.product.price)) {
          dataPro.splice(index, 1);
          toastError(
            "Sản phẩm phải có giá tiền lớn hơn hoặc bằng sản phẩm trước đó"
          );
        } else {
          setDataCart(dataPro);
        }
      });
    } else {
      if (dataCart.length + 1 > item.quantity) {
        toastError("Sản phẩm không được vượt quá số lượng mua ban đầu !");
      } else {
        dataPro.forEach((element, index) => {
          if (Number(element.price) < Number(item.product.price)) {
            dataPro.splice(index, 1);
            toastError(
              "Sản phẩm phải có giá tiền lớn hơn hoặc bằng sản phẩm trước đó"
            );
          } else {
            console.log("vào else cuối cùng");
            console.log(dataCart[dataCart.length - 1].index);
            console.log(dataPro[0]);
            const pro = {
              index: Number(dataCart[dataCart.length - 1].index) + 1,
              id: dataPro[0].id,
              images: dataPro[0].images,
              name: dataPro[0].name,
              price: dataPro[0].price,
              debut: dataPro[0].debut,
            };
            // console.log((t) => [...t, dataPro[0]]);
            setDataCart((t) => [...t, pro]);
            console.log(dataCart);
          }
        });
      }
    }

    let total = dataPro[0]?.price;
    if (dataCart?.length === undefined) {
      setTotalProduct(total);
    }
    if (dataCart?.length + 1 <= item.quantity) {
      dataCart?.forEach((item) => {
        total += item.price;
      });
      if (total > 0) {
        setTotalProduct(total);
      } else {
        setTotalProduct(0);
      }
    }
  };
  return (
    <div className="container mt-4">
      <ToastContainer></ToastContainer>
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
        <h4 className="text-danger fw-bold mt-4 text-center">Đổi hàng</h4>
        <div className="col-12">
          <div className="row">
            <div className="col-6 mt-4 ps-4">
              <div className="mt-2 ms-5">
                Mã hoá đơn: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5">
                Khách hàng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5">
                Số điện thoại: <b>{order?.phone}</b>{" "}
              </div>
              <div className="mt-2 ms-5">Ghi chú: {order?.note}</div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2">
                Ngày mua:{" "}
                <b>
                  {" "}
                  <Moment format="DD-MM-YYYY HH:mm:ss">
                    {order?.createdAt}
                  </Moment>
                </b>
              </div>
              <div className="mt-2">
                Tổng tiền:
                <b>
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2">
                Địa chỉ nhận hàng: <b>{order?.address}</b>
              </div>
              <div className="mt-2">
                Trạng thái: <b>Đã nhận hàng</b>{" "}
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
                <th scope="col">Giá tiền</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col"></th>
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
                      {item?.product.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      {item?.total.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      {item.isCheck === null ? (
                        <Button
                          shape="round"
                          type="primary"
                          onClick={() => showModal(item)}
                        >
                          Chọn sản phẩm
                        </Button>
                      ) : (
                        ""
                      )}
                      {item.isCheck === 1 ? (
                        item.total > 0 ? (
                          <Alert
                            message="Hoá đơn chính"
                            type="success"
                            showIcon
                          />
                        ) : (
                          <Alert
                            message="Hoá đơn trước khi đổi"
                            type="info"
                            showIcon
                          />
                        )
                      ) : item.isCheck != 1 &&
                        item.isCheck !== null &&
                        item.isCheck != 3 ? (
                        <>
                          <Button
                            type="primary"
                            onClick={() => onCancel(item)}
                            danger
                          >
                            Huỷ
                          </Button>
                          <i className="text-primary mx-2">
                            Đơn yêu cầu đổi hoá đơn {item.isCheck}
                          </i>
                        </>
                      ) : item.isCheck == 3 ? (
                        <i className="text-danger fw-bold">
                          Đơn yêu cầu đổi hoá đơn {item.isCheck} bị huỷ
                        </i>
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
        <Modal
          title="Chọn sản phẩm muốn đổi hàng"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1400}
          cancelText={"Đóng"}
          okText={"Gửi yêu cầu"}
        >
          <div className="search-inner mb-2">
            <div className="row">
              <div className="col-7">
                <p>
                  Sản phẩm trước đó:{" "}
                  <i className="text-danger">{item?.product.name}</i>
                </p>
                <p>
                  Số lượng: <i className="text-danger">{item?.quantity}</i>
                </p>
                <p>
                  Tổng tiền trước đó:{" "}
                  <i className="text-danger">
                    {item?.total.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </i>
                </p>
                <div className="mt-2 mb-3">
                  <TextArea
                    onChange={(e) => setNote(e.target.value)}
                    className=""
                    value={note}
                    style={{ width: "100%" }}
                    placeholder="Ghi chú đơn đổi"
                    rows={3}
                    cols={4}
                  />
                </div>
              </div>
              <div className="col-5">
                <p>
                  Tổng tiền hiện tại:{" "}
                  <i className="text-danger">
                    {totalProduct > 0
                      ? totalProduct?.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "0 VND "}
                  </i>
                </p>
                <p>
                  Số tiền khách hàng phải trả thêm:{" "}
                  <i className="text-danger">
                    {totalProduct > item?.total
                      ? (totalProduct - item?.total).toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })
                      : (item?.total - totalProduct).toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </i>
                </p>
              </div>
            </div>
            <AutoComplete
              style={{
                width: 760,
              }}
              value={values}
              options={data}
              onChange={(event) => onChangeSearch(event)}
              onSelect={onSelectAuto}
              placeholder="Tên sản phẩm"
              filterOption={(inputValue, option) =>
                option.label.props.children[1]
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th className="text-center" cols="1">
                  STT
                </th>
                <th className="text-center" cols="2">
                  Hình ảnh
                </th>
                <th className="text-center">Tên sản phẩm</th>
                <th className="text-center">Lý do đổi hàng</th>
                <th className="text-center">Sản phẩm lỗi ?</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dataCart?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>
                      {item.images[0].name === undefined ? (
                        <Image width={90} src={item.images} />
                      ) : (
                        <Image width={90} src={item.images[0].name} />
                      )}
                    </td>
                    <td>
                      {item.name}{" "}
                      {item?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>

                    <td>
                      <TextArea
                        rows={4}
                        style={{ width: "300px" }}
                        onChange={(event) =>
                          onChangeReason(event.target.value, index)
                        }
                        cols={4}
                        placeholder="Nhập lý do"
                      />
                    </td>
                    <td>
                      <Checkbox
                        onChange={(e) =>
                          onChangeChecked(e.target.checked, index)
                        }
                      />
                    </td>
                    <td>
                      <CloseCircleOutlined
                        onClick={() => deleteProduct(item)}
                        style={{ fontSize: "20px", color: "red" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Modal>
      </div>
    </div>
  );
};

export default ExchangeUser;
