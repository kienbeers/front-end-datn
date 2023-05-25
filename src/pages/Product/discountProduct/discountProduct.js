import { UploadOutlined, MenuFoldOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useContext } from "react";
import product1 from "../../../asset/images/products/product01.png";
import { Modal, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import "./discountProduct.css";

function formatCash(str) {
  if (str.length > 1) {
    return str
      .split("")
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ",") + prev;
      });
  } else {
    return "";
  }
}

function DiscountProduct() {
  const [products, setData] = useState([
    {
      id: "",
      name: "",
      price: null,
      quantity: null,
      active: 1,
      imei: null,
      weight: null,
      size: null,
      debut: null,
      categoryId: null,
      images: null,
    },
  ]);

  console.log(products);

  const allProWithDiscount = () => {
    fetch(`http://localhost:8080/api/products/allProWithDiscount`)
      .then((response) => response.json())
      .then((results) => {
        setData(results.data);
      });
  };

  useEffect(() => {
    allProWithDiscount();
  }, []);

  let navigate = useNavigate();

  const handelCLickProduct = (product) => {
    getProductById(product.id);
    console.log(product.id);
  };

  const [product, setProduct] = useState([]);

  const getProductById = (id) => {
    console.log("productId:", id);
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setProduct(res);
        localStorage.removeItem("product_detail");
        localStorage.setItem("product_detail", JSON.stringify(res));
      });
    // product = JSON.parse(localStorage.getItem("product_detail"));
    // setProduct(JSON.parse(localStorage.getItem("product_detail")));
    // setProduct == product;
  };
  // product = JSON.parse(localStorage.getItem("product_detail"));
  console.log(product);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChangePagination =(pagination) => {
    tableParamPro.pagination.limit = 12;
    tableParamPro.pagination.current = pagination;
  }

  return (
    <div className="row">
      <div className="col-1" style={{ width: "10px" }}>
        <MenuFoldOutlined style={{ fontSize: "20px" }} />
      </div>
      <div className="col-11">
        <h4 className="text-danger fw-bold">Sản phẩm giảm giá</h4>
      </div>
      <div className="col-md-12">
        <div className="row">
          {products
            ? products.map((item) => (
                <div className="col-md-3 col-xs-6 discount" key={item.id}>
                  <div
                    className="product discount"
                    onClick={() => handelCLickProduct(item)}
                  >
                    <div className="product-img discount">
                      <img
                        src={item.images ? item.images[0]?.name : product1}
                        alt=""
                      />
                      <div className="product-label discount">
                        {item.discount ? (
                          <span className="sale">{item.discount.ratio}%</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="product-body">
                      <p className="product-category">
                        {item.categoryProducts?.category?.name
                          ? item.categoryProducts.category.name
                          : ""}
                      </p>
                      <h3 className="product-name">
                        <a onClick={showModal}>{item.name}</a>
                      </h3>
                      <h4 className="product-price">
                        {formatCash(item.price + "")} VNĐ{" "}
                        {item.discount ? (
                          <del className="product-old-price">
                            {formatCash(
                              item.price / ((100 - item.discount.ratio) / 100) +
                                ""
                            )}{" "}
                            VNĐ
                          </del>
                        ) : (
                          ""
                        )}
                      </h4>
                    </div>
                  </div>
                  
                </div>
                
              ))
            : "Không có sản phẩm"}
          <Modal
            title={`Chi tiết thông số kĩ thuật ` + product?.name}
            open={isModalOpen}
            // onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"Đóng"}
          >
            <div className="card">
              <div className="card-header" style={{ textAlign: "left" }}>
                Thông tin hàng hóa
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Xuất xứ: {product?.origin?.name}</li>
                  <li>Thương hiệu: {product?.manufacture?.name} </li>
                </div>
                <div className="col-6">
                  <li>Thời điểm ra mắt:{product?.debut} </li>
                  <li>Hướng dẫn bảo quản: Để nơi khô ráo, nhẹ tay</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Thiết kế trọng lượng
              </div>
              <div className="card-body">
                <li>
                  Kích thước: {product?.width} x {product?.height} x{" "}
                  {product?.length}
                </li>
                <li>Trọng lượng sản phẩm: {product?.weight}kg</li>
                <li>Chất liệu: {product?.material}</li>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Bộ xử lí
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Hãng CPU: {product?.processor?.cpuCompany}</li>
                  <li>Công nghệ CPU: {product?.processor?.cpuTechnology}</li>
                  <li>Tốc độ CPU: {product?.processor?.cpuSpeed}</li>
                  <li>Tốc độ tối đa CPU: {product?.processor?.maxSpeed}</li>
                </div>
                <div className="col-6">
                  <li>Loại CPU: {product?.processor?.cpuType}</li>
                  <li>Số nhân: {product?.processor?.multiplier}</li>
                  <li>Số luồng: {product?.processor?.numberOfThread}</li>
                  <li>Bộ nhớ đệm: {product?.processor?.caching}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                RAM
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Dung lượng RAM: {product?.ram?.ramCapacity}</li>
                  <li>Loại RAM: {product?.ram?.typeOfRam}</li>
                  <li>Tốc độ RAM: {product?.ram?.ramSpeed}</li>
                  <li>Số khe cắm rời: {product?.ram?.looseSlot}</li>
                </div>
                <div className="col-6">
                  <li>Số khe RAM còn lại: {product?.ram?.remainingSlot}</li>
                  <li>Số RAM onboard: {product?.ram?.onboardRam}</li>
                  <li>Hỗ trợ RAM tối đa: {product?.ram?.maxRamSupport}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Màn Hình
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Kích thước màn hình: {product?.screen?.size}</li>
                  <li>
                    Công nghệ màn hình: {product?.screen?.screenTechnology}
                  </li>
                  <li>Độ phân giải: {product?.screen?.resolution}</li>
                  <li>Tần số quét: {product?.screen?.scanFrequency}</li>
                  <li>Tấm nền: {product?.screen?.backgroundPanel}</li>
                </div>
                <div className="col-6">
                  <li>Độ sáng: {product?.screen?.brightness}</li>
                  <li>Độ phủ màu: {product?.screen?.colorCoverage}</li>
                  <li>Tỷ lệ màn hình: {product?.screen?.resolution}</li>
                  <li>Màn hình cảm ứng: {product?.screen?.backgroundPanel}</li>
                  <li>Độ tương phản: {product?.screen?.contrast}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Đồ họa
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      Card onboard
                    </span>
                  </li>
                  <li>Hãng: {product?.cardOnboard?.trandemark}</li>
                  <li>Model: {product?.cardOnboard?.model}</li>
                  <li>Bộ nhớ: {product?.cardOnboard?.memory}</li>
                </div>
                <div className="col-6">
                  <li>
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      Card rời
                    </span>
                  </li>
                  <li>Hãng: {product?.card?.trandemark}</li>
                  <li>Model: {product?.card?.model}</li>
                  <li>Bộ nhớ: {product?.card?.memory}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Lưu trữ
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Kiểu ổ cứng: {product?.storage?.storageDetail?.type}</li>
                  <li>Số khe cắm: {product?.storage?.number}</li>
                  <li>
                    Loại SSD:
                    {product?.storage?.storageDetail?.storageType?.name}
                  </li>
                  <li>
                    Dung lượng: {product?.storage?.storageDetail?.capacity}
                  </li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Bảo mật
              </div>
              <div className="card-body row">
                <li>{product?.security}</li>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Hệ điều hành
              </div>
              <div className="card-body row">
                <li>OS: {product?.win?.name}</li>
                <li>Version: {product?.win?.version}</li>
              </div>
            </div>
          </Modal>
        </div>
        {/* <Pagination className="text-center"  onChange={handlePagination} simple defaultCurrent={1} total={15} /> */}
      </div>
    </div>
  );
}

export default DiscountProduct;
