import { useState } from "react";
import { useEffect } from "react";
import qs from 'qs';
import { Card, Drawer, Input } from "antd";
import Meta from "antd/lib/card/Meta";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { click } from "@testing-library/user-event/dist/click";
import { ToastContainer, toast } from "react-toastify";

const toastSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

const Prod = () => {
    const [dataProduct, setDataProduct] = useState([]);
    const [dataSelect, setDataSelect] = useState([]);
    const getRandomuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
        searchUsername: params.pagination?.search1,
        searchStatus: params.pagination?.searchStatus,
    });
    const [tableParamPro, setTableParamPro] = useState({
        pagination: {
            current: 1,
            pageSize: 6,
            search1: "",
            search2: "",
            searchStatus: "ACTIVE",
        },
    });
    const onClickNext = () => {
        // console.log("click");
        // setTableParamPro({
        //     pagination: {
        //         current: 2,
        //         pageSize: 6,
        //         search1: "",
        //         search2: "",
        //         searchStatus: "ACTIVE",
        //     },
        // })
        // getData();
    }
    const getData = () => {
        fetch(
            `http://localhost:8080/api/products?${qs.stringify(
                getRandomuserParams(tableParamPro)
            )}`
        )
            .then((res) => res.json())
            .then((results) => {
                setDataProduct(results.data.data);
            });
    }
    const getDataProductById = (id) => {
        fetch(`http://localhost:8080/api/products/${id}?`)
            .then((res) => res.json())
            .then((results) => {
                setShowData(results)
            });
    };
    const formatCash = (str) => {
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
    };
    const onChangeInputPN = (value) => {
        console.log("input", value.target.value)

    }
    const [product, setShowData] = useState();
    const onClickEye = (data) => {
        getDataProductById(data.id);
        showDrawer();
    }
    const onClickCart = (data) => {
        console.log("data click", data)
        dataSelect.push(data);
        console.log("selected", dataSelect)
        toastSuccess("Thành công");

    }
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    useEffect(() => { getData() }, [])
    return (
        <>
            <div className="row">
                <div className="col-3">
                    <Input placeholder="Nhập mã sản phẩm" onChange={onChangeInputPN} />
                </div>
            </div>
            <div className="row">
                {dataProduct ? dataProduct.map(item => (
                    <div className="col-4 mt-2">
                        <Card
                            style={{ height: '325px' }}
                            cover={
                                <img
                                    style={{ height: '179px' }}
                                    alt="example"
                                    src={item?.images[0]?.name ? item.images[0].name : ""}
                                />
                            }
                            actions={[
                                <EyeOutlined key="setting" style={{ fontSize: '20px', color: '#009999' }} onClick={() => onClickEye(item)} />,
                                <ShoppingCartOutlined key="edit" style={{ fontSize: '25px', color: '#08c' }} onClick={() => onClickCart(item)}></ShoppingCartOutlined>,
                            ]}
                        >
                            <Meta
                                title={item.name}
                                description={item.price}
                            />
                        </Card>
                    </div>
                )) : ""}
                <div style={{ width: '100%' }} className="d-flex justify-content-evenly">
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item">
                                <a class="page-link" aria-label="Previous">
                                    <span aria-hidden="true">Previous</span>
                                </a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" aria-label="Next" onClick={onClickNext}>
                                    <span aria-hidden="true">Next</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <Drawer title={product?.name}
                size="large"
                placement="right" onClose={onClose} open={open}>
                <div className="card">
                    <div className="card-header" style={{ textAlign: "left" }}>
                        Thông tin hàng hóa
                    </div>
                    <div className="card-body row">
                        <div className="col-6">
                            <li>Xuất xứ: {product?.origin.name}</li>
                            <li>Thương hiệu: {product?.manufacture.name} </li>
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
                            <li>
                                Công nghệ CPU: {product?.processor?.cpuTechnology}
                            </li>
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
                            <li>
                                Màn hình cảm ứng: {product?.screen?.backgroundPanel}
                            </li>
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
                            <li>
                                Kiểu ổ cứng: {product?.storage?.storageDetail?.type}
                            </li>
                            <li>Số khe cắm: {product?.storage?.number}</li>
                            <li>
                                Loại SSD:
                                {product?.storage?.storageDetail.storageType.name}
                            </li>
                            <li>
                                Dung lượng: {product?.storage?.storageDetail.capacity}
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
                        <li>OS: {product?.win.name}</li>
                        <li>Version: {product?.win.version}</li>
                    </div>
                </div>
            </Drawer>
        </>
    )
}

export default Prod;