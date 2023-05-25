import { MenuFoldOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Image,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  Space,
  InputNumber,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import moment from "moment";
import qs from "qs";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 } from "uuid";
import { storage } from "../../image/firebase/firebase";

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
});

const toastError = (message) => {
  toast.error(message, {
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

function CopyProduct() {
  const [dataProduct, setDataProduct] = useState([]);
  const [imageUpload, setImageUpload] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [length, setLength] = useState();
  const [width, setWidth] = useState();
  const [imei, setImei] = useState();
  const [win, setWin] = useState();
  const [battery, setBattery] = useState();
  const [dataOrigin, setDataOrigin] = useState();
  const [processors, setProcessors] = useState([]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataRam, setDataRam] = useState([]);
  const [dataCard, setDataCard] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const [dataAccessory, setDataAccessory] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  const [warrantyPeriod, setWarrantyPeriod] = useState();
  const navigate = useNavigate();
  const set = new Set();
  const props = {
    name: "file",
    multiple: true,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status == "error") {
        info.file.status = "done";
      }
      if (info.file.status == "removed") {
        console.log("removed");
      }
      if (info.file.status === "done") {
        info.fileList.forEach((item) => {
          set.add(item.originFileObj);
        });
      }
    },
  };

  const [clearForm] = Form.useForm();

  const onReset = () => {
    clearForm.setFieldValue();
  };

  const uploadFile = (image) => {
    if (image == null) return;
    const imageRef = ref(storage, `images/${image.name + v4()}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImages((prev) => [...prev, url]);
        setImageUrls((prev) => [...prev, url]); //set url ->all url
      });
      setImageUpload((prev) => [...prev, image]);
    });
  };

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [manufacture, setManufacture] = useState([]);
  const productEdit = JSON.parse(localStorage.getItem("productEdit"));
  const [data, setData] = useState({
    name: productEdit?.name,
    quantity: productEdit?.quantity,
    price: productEdit?.price,
    imei: productEdit?.imei,
    weight: productEdit?.weight,
    size: productEdit?.size,
    debut: productEdit?.debut,
    material: productEdit?.material,
    p_n: productEdit?.p_n,
    origin: productEdit?.origin,
    categoryProducts: productEdit?.categoryProducts,
    manufacture: productEdit?.manufacture,
    description: productEdit?.description,
    accessoryProducts: productEdit?.accessoryProducts,
    productColors: productEdit?.productColors,
    storage: productEdit?.storage,
    length: productEdit?.length,
    warrantyPeriod: productEdit.warrantyPeriod,
    width: productEdit?.width,
    height: productEdit?.height,
    images: productEdit?.images.map((item) => ({
      name: item.name,
      product: null,
      exchange_id: null,
    })),
    configuration: {
      processor: productEdit?.processor,
      ram: productEdit?.ram,
      slot: productEdit?.slot,
      battery: productEdit?.battery,
      security: productEdit?.security,
      screen: productEdit?.screen,
      card: productEdit?.card,
      cardOnboard: productEdit?.cardOnboard,
      hard_drive: productEdit?.hard_drive,
      win: productEdit?.win,
      capacity: productEdit?.capacity,
    },
  });

  const [form, setValues] = useState({
    name: data?.name,
    quantity: data?.quantity,
    price: data?.price,
    imei: data?.imei,
    weight: data?.weight,
    size: data?.size,
    debut: data?.debut,
    p_n: data?.p_n,
    origin: data?.origin,
    categoryProducts: data?.categoryProducts,
    manufacture: data?.manufacture,
    material: data?.material,
    length: data?.length,
    width: data?.width,
    height: data?.height,
    images: data?.images
      ? data.images.map((item) => ({
          name: item.name,
          product: null,
          return_id: null,
          exchange_id: null,
        }))
      : null,
    processor: data?.configuration.processor,
    ram: data?.configuration.ram,
    slot: data?.configuration.slot,
    battery: data?.configuration.battery,
    security: data?.configuration.security,
    screen: data?.configuration.screen,
    storage: data?.storage,
    card: data?.configuration.card,
    description: data?.description,
    accessoryProducts: data?.accessoryProducts,
    productColors: data?.productColors,
    cardOnboard: data?.configuration.cardOnboard,
    hard_drive: data?.configuration.hard_drive,
    win: data?.configuration.win,
    capacity: data?.configuration.capacity,
    warrantyPeriod: data.warrantyPeriod
  });

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      search1: "",
      search2: "",
    },
  });

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

  const getRandomMuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
  });

  const loadDataWin = () => {
    fetch(
      `http://localhost:8080/api/auth/wins?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setWin(results.data.data);
      });
  };

  const loadDataManufacture = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/manufactures?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setManufacture(results.data.data);
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

  const loadDataColor = () => {
    fetch(
      `http://localhost:8080/api/auth/colors?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataColor(results.data.data);
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

  const loadDataCategory = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/category?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setCategory(results.data.data);
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

  const loadDataRam = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataRam(results.data.data);
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

  const loadDataScreen = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/screens?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataScreen(results.data.data);
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

  const loadDataProcess = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
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

  const loadDataOrigin = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setDataOrigin(results.data.data);
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

  const loadDataCard = () => {
    fetch(
      `http://localhost:8080/api/card?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCard(results.data.data);
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

  const loadDataBattery = () => {
    fetch(
      `http://localhost:8080/api/auth/batteryCharger?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setBattery(results.data.data);
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

  const loadDataAccessor = () => {
    fetch(
      `http://localhost:8080/api/auth/accessory?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataAccessory(results.data.data);
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

  const dateFormat = "YYYY";

  const handleSubmit = (data) => {
    console.log("image url");
    console.log(imageUrls);
    data.images = imageUrls;
    data.status = "ACTIVE";
    data.debut = moment(data.debut).format("yyyy");
    const quantity = Number(data.quantity);
    data.images = imageUrls.map((item) => ({
      name: item,
      product: null,
      return_id: null,
      exchange_id: null,
    }));
    const product = {
      name: data.name,
      quantity: Number(data.quantity),
      price: Number(data.price),
      imei: data.imei,
      weight: Number(data.weight),
      height: Number(data.height),
      width: Number(data.width),
      length: Number(data.length),
      debut: data.debut,
      categoryId: data.categoryId,
      manufactureId: data.manufactureId,
      images: data.images,
      status: "ACTIVE",
      processorId: data.processorId,
      screenId: data.screenId,
      cardId: data.cardId,
      originId: data.originId,
      colorId: data.colorId,
      batteryId: data.batteryId,
      ramId: data.ramId,
      winId: data.win,
      material: data.material,
      cardOnboard: data.cardOnboard,
      accessoryId: data.accessoryId,
      security: data.security,
      description: data.description,
      storageId: data.storageId,
      warrantyPeriod: data.warrantyPeriod,
    };
    console.log(product);
    const yearCurrent = new Date().getFullYear();
    if (Number(product.debut > yearCurrent)) {
      toastError("Năm ra mắt lớn năm hiện tại!");
    } else if (Number(product.debut) < yearCurrent - 4) {
      toastError("Năm ra mắt nhỏ hơn năm hiện tại không quá 4 năm!");
    } else {
      fetch(`http://localhost:8080/api/staff/products/copy/${productEdit.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(product),
      })
        .then((response) => response.json())
        .then((results) => {
          if (results.status === 200) {
            console.log(results);
            onReset();
            toastSuccess("Thêm mới sản phẩm thành công !");
            navigate("/admin/product");
          } else {
            toastError("Thêm mới sản phẩm thất bại !");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    
  };

  const loadDataStorage = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/storage_details?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataStorage(results.data.data);
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
    // listAll(imageUpload).then((response) => {
    //   response.items.forEach((item) => {
    //     getDownloadURL(item).then((url) => {
    //       setImageUrls((prev) => [...prev, url]);
    //       setImages((prev) => [...prev, url]);
    //     });
    //   });
    // });
    loadDataOrigin();
    loadDataProcess();
    loadDataScreen();
    loadDataRam();
    loadDataCard();
    loadDataBattery();
    loadDataManufacture();
    loadDataAccessor();
    loadDataStorage();
    loadDataColor();
    loadDataWin();
    loadDataCategory();
    loadDataProductById(id);
  }, [images]);

  let { id } = useParams();
  const loadDataProductById = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("data product get by id");
        console.log(res);
        setDataProduct(res);
      });
  };

  const validateMessages = {
    required: "${label} không được để trống!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} phải là kiểu số!",
    },
    number: {
      range: "${label} phải từ ${min} đến ${max}",
    },
  };

  return (
    <div className="row">
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Tạo sản phẩm</h4>
        </div>
      </div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "100%",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <ToastContainer></ToastContainer>
        <div>
          <Form
            form={clearForm}
            name="nest-messages"
            validateMessages={validateMessages}
            className="me-2 ms-2"
            initialValues={{
              cpuCompany: name,
            }}
            layout="vertical"
            autoComplete="off"
            onFinish={(values) => {
              handleSubmit(values);
            }}
            onFinishFailed={(error) => {
              console.log({ error });
            }}
          >
            <div className="row">
              <div className=" mt-4 col-4">
                <Form.Item
                  className="mt-2"
                  name="name"
                  label="Tên sản phẩm"
                  initialValue={form.name}
                  rules={[
                    {
                      required: true,
                      message: "Tên sản phẩm không được để trống",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Nhập tên sản phẩm"
                    value={name}
                     readOnly
                  />
                </Form.Item>
              </div>
              <div className=" mt-4 col-4">
                <Form.Item
                  className="mt-2"
                  name="imei"
                  label="Mã máy"
                  initialValue={form.imei}
                  rules={[
                    {
                      required: true,
                      message: "Mã máy không được để trống",
                    },
                    { whitespace: true, message: "Giá trị lớn hơn 3 ký tự" },
                    { min: 3, message: "Giá trị lớn hơn 3 ký tự" },
                  ]}
                  hasFeedback
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Nhập mã máy"
                    value={imei}
                  />
                </Form.Item>
              </div>
              <div className="col-4 mt-4">
                <Form.Item
                  className="mt-2"
                  name="categoryId"
                  label="Thể loại sản phẩm"
                  requiredMark="optional"
                  initialValue={form.categoryProducts?.map(
                    (item) => item.category.id
                  )}
                  rules={[
                    {
                      required: true,
                      message: "Thể loại sản phẩm không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn thể loại" mode="multiple">
                    {category.map((cate, index) => (
                      <Select.Option value={cate.id} key={index}>{cate.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="  col-4">
                <Form.Item
                  className="mt-2"
                  name="price"
                  label="Giá tiền"
                  initialValue={form.price}
                  rules={[
                    {
                      type: "number",
                      min: 10000000,
                      max: 100000000,
                      required: true,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    placeholder="Nhập giá tiền"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className=" col-4">
                <Form.Item
                  className="mt-2"
                  name="quantity"
                  label="Số lượng"
                  initialValue={form.quantity}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 1,
                      max: 1000,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    placeholder="Nhập số lượng"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className="col-4 ">
                <Form.Item
                  className="mt-2"
                  name="colorId"
                  label="Màu sắc"
                  requiredMark="optional"
                  initialValue={form.productColors?.map(
                    (item) => item.color.id
                  )}
                  rules={[
                    {
                      required: true,
                      message: "Màu sắc không được để trống",
                    },
                  ]}
                >
                  <Select mode="multiple" placeholder="Chọn màu">
                    {dataColor?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-2">
                <Form.Item
                  name="length"
                  label="Chiều dài"
                  initialValue={form.length}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                  hasFeedback
                >
                   <InputNumber readOnly
                    placeholder="Nhập chiều dài"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className=" col-2">
                <Form.Item
                  name="width"
                  label="Chiều rộng"
                  initialValue={form.width}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                  hasFeedback
                >
                 <InputNumber
                   readOnly
                    placeholder="Nhập chiểu rộng"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className=" col-2">
                <Form.Item
                  name="height"
                  label="Chiều cao"
                  initialValue={form.height}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                  hasFeedback
                >
                   <InputNumber readOnly
                    placeholder="Nhập chiều cao"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className=" col-2">
                <Form.Item
                  name="weight"
                  label="Cân nặng"
                  initialValue={form.weight}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 1,
                      max: 10,
                    },
                  ]}
                  hasFeedback
                >
                   <InputNumber
                    placeholder="Nhập cân nặng"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className="col-2">
                <Form.Item
                  label="Năm sản xuất"
                  name="debut"
                  initialValue={moment(form.debut)}
                  rules={[
                    {
                      required: true,
                      message: "Năm sản xuất không được để trống!",
                    },
                  ]}
                >
                  <DatePicker picker="year" format={dateFormat} />
                </Form.Item>
              </div>
              <div className="col-2">
                <Form.Item
                  className=""
                  name="originId"
                  label="Xuất xứ"
                  requiredMark="optional"
                  initialValue={form.origin?.id}
                  rules={[
                    {
                      required: true,
                      message: "Xuất xứ không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn xuất xứ" disabled={true}>
                    {dataOrigin?.map((cate, index) => (
                      <Select.Option value={cate.id} key={index}>{cate.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Form.Item
                  name="material"
                  label="Chất liệu"
                  initialValue={form.material}
                  rules={[
                    {
                      required: true,
                      message: "Chất liệu không được để trống",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Nhập chất liệu"
                    readOnly={true}
                  />
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="ramId"
                  label="Ram"
                  requiredMark="optional"
                  initialValue={form.ram?.id}
                  rules={[
                    {
                      required: true,
                      message: "Ram không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn ram">
                    {dataRam?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.ramCapacity +
                          " " +
                          item.typeOfRam +
                          " " +
                          item.ramSpeed +
                          " " +
                          item.maxRamSupport}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="processorId"
                  label="CPU"
                  requiredMark="optional"
                  initialValue={form.processor?.id}
                  rules={[
                    {
                      required: true,
                      message: "CPU không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn CPU">
                    {processors?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.cpuCompany +
                          " " +
                          item.cpuTechnology +
                          " " +
                          item.cpuType +
                          " " +
                          item.cpuSpeed}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Form.Item
                  name="screenId"
                  label="Màn hình"
                  requiredMark="optional"
                  initialValue={form.screen?.id}
                  rules={[
                    {
                      required: true,
                      message: "Màn hình không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn màn hình">
                    {dataScreen?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.size +
                          " " +
                          item.screenTechnology +
                          " " +
                          item.resolution +
                          " " +
                          item.screenType}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="cardId"
                  label="Card rời"
                  initialValue={form.card?.id}
                  rules={[
                    {
                      required: true,
                      message: "Card rời không được để trống",
                    },
                  ]}
                  requiredMark="optional"
                >
                  <Select placeholder="Chọn card rời">
                    {dataCard?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.trandemark + " " + item.model + " " + item.memory}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="win"
                  label="Hệ điều hành"
                  requiredMark="optional"
                  initialValue={form.win?.id}
                  rules={[
                    {
                      required: true,
                      message: "Hệ điều hành không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn hệ điều hành">
                    {win?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.name + " - " + item.version}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="cardOnboard"
                  label="Card onboard"
                  requiredMark="optional"
                  initialValue={form.cardOnboard?.id}
                  rules={[
                    {
                      required: true,
                      message: "Card rời không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn card onboard">
                    {dataCard?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.trandemark + " " + item.model + " " + item.memory}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="storageId"
                  label="Lưu trữ"
                  initialValue={form.storage?.id}
                  rules={[
                    {
                      required: true,
                      message: "Lưu trữ không được để trống",
                    },
                  ]}
                  requiredMark="optional"
                >
                  <Select placeholder="Chọn ổ cứng">
                    {dataStorage?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.storageType.name +
                          " " +
                          item.type +
                          " " +
                          item.capacity}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="batteryId"
                  label="Pin"
                  requiredMark="optional"
                  initialValue={form.battery?.id}
                  rules={[
                    {
                      required: true,
                      message: "Pin không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn loại pin">
                    {battery?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.batteryType +
                          " " +
                          item.battery +
                          " " +
                          item.charger}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Form.Item
                  name="manufactureId"
                  label="Hãng sản xuất"
                  requiredMark="optional"
                  initialValue={form.manufacture?.id}
                  rules={[
                    {
                      required: true,
                      message: "Hãng sản xuất không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn hãng sản xuất" disabled={true}>
                    {manufacture?.map((item, index) => (
                      <Select.Option value={item.id} key={index} >{item.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  className=""
                  name="security"
                  label="Bảo mật"
                  initialValue={form.security}
                  rules={[
                    {
                      required: true,
                      message: "Bảo mật không được để trống",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input style={{ width: "100%" }} placeholder="Bảo mật" />
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="accessoryId"
                  label="Phụ kiện trong hộp"
                  requiredMark="optional"
                  initialValue={form.accessoryProducts?.map(
                    (item) => item.accessory.id
                  )}
                  rules={[
                    {
                      required: true,
                      message: "Phụ kiện không được để trống",
                    },
                  ]}
                >
                  <Select mode="multiple" placeholder="Chọn các phụ kiện">
                    {dataAccessory?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <Form.Item
                  label="Mô tả sản phẩm"
                  name="description"
                  initialValue={form.description}
                  onChange={(e) => setDescription(e.target.value)}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </div>
              <div className="col-3">
              <Form.Item
                  name="warrantyPeriod"
                  label="Thời gian bảo hành"
          
                  initialValue={form.warrantyPeriod}
                  rules={[
                    {
                      required: true,
                      message: "Thời gian bảo hành không được để trống",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} readOnly value={warrantyPeriod}  placeholder="Thời gian bảo hành" />
              </Form.Item>
              </div>
              <div className="col-4 mt-4">
                <Image.PreviewGroup>
                  <Image width={100} src={productEdit?.images[0]?.name} />
                  {productEdit.length > 2 ? (
                    <Image width={100} src={productEdit?.images[1]?.name} />
                  ) : (
                    ""
                  )}
                  {productEdit.length > 3 ? (
                    <Image width={100} src={productEdit?.images[2]?.name} />
                  ) : (
                    ""
                  )}
                  {productEdit.length > 4 ? (
                    <Image width={100} src={productEdit?.images[3]?.name} />
                  ) : (
                    ""
                  )}
                  {productEdit.length > 4 ? (
                    <Image width={100} src={productEdit?.images[4]?.name} />
                  ) : (
                    ""
                  )}
                </Image.PreviewGroup>
              </div>
              <div></div>
            </div>
            <Form.Item className="text-center mt-4">
              <Button
                block
                type="primary"
                htmlType="submit"
                shape="round"
                style={{ width: "100px" }}
              >
                Tạo mới
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default CopyProduct;
