import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Input, Modal, Select, Table, Image } from "antd";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastrs from "toastr";
import "toastr/build/toastr.min.css";
import * as XLSX from "xlsx/xlsx.mjs";
const EXTENSIONS = ["xlsx", "xls", "csv"];
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchProductKey: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
  searchPrice: params.pagination?.search3,
  searchPn: params.pagination?.search4,
  searchImei: params.pagination?.search5,
});
const getRandomuserParamsColor = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
});

const Product = () => {
  const [data, setData] = useState();
  const [dataExcel, setDataExcel] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  //import

  const [fileImp, setFileImp] = useState();
  const [dataImport, setDataImport] = useState();
  const [battery, setBattery] = useState();
  const [category, setCategory] = useState([]);
  const [manufacture, setManufacture] = useState([]);
  const [dataOrigin, setDataOrigin] = useState();
  const [processors, setProcessors] = useState([]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataRam, setDataRam] = useState([]);
  const [dataCard, setDataCard] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const [dataAccessory, setDataAccessory] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  const [dataWin, setDataWin] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
    },
  });
  const [tableParamsLK, setTableParamsLK] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
    },
  });
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
  };
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  var i = 0;

  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      load();
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "id",
      dataIndex: "data",
      width: "7%",
      render: (id, data) => {
        return (
          <>
            {/* {data?.images.length} */}
            <Image width={100} src={data?.images[0]?.name} />
          </>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      width: "30%",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (data) => `${data.name} (${data.debut})`,
    },
    {
      title: "Xuất xứ",
      dataIndex: "origin",
      width: "10%",
      render: (origin) => `${origin.name}`,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      width: "10%",
      render: (price) => (
        <>
          {price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "9%",
      render: (status) => {
        if (status == "ACTIVE") {
          return (
            <>
              <div
                className="ant-tag ant-tag-green pt-1 pb-1 text-center"
                style={{ width: "120px", padding: "3px" }}
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
                className="ant-tag ant-tag-red pt-1 pb-1 text-center"
                style={{ width: "120px", padding: "3px" }}
              >
                Không hoạt động
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
      width: "7%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/products/inactive/${data.id}`,
                    { method: "PUT" }
                  ).then(() => load());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  notifySuccess("Khóa thành công!");
                }}
              />
            </>
          );
        } else {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/products/active/${data.id}`,
                    { method: "PUT" }
                  ).then(() => load());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  notifySuccess("Mở khóa thành công!");
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
      width: "12%",
      render: (id, data) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                getProductById(data.id, 1);
              }}
            />
            {/* <DeleteOutlined
              onClick={() => onDelete(data.id)}
              style={{ color: "red", marginLeft: 12 }}
            /> */}
            <CopyOutlined
              style={{ color: "red", marginLeft: 12, fontSize: "20px" }}
              onClick={() => {
                getProductById(data.id, 2);
              }}
            />
            <EyeOutlined
              onClick={() => {
                getProductById(data.id, 3);
              }}
              style={{ color: "blue", marginLeft: 12, fontSize: "20px" }}
            />
          </>
        );
      },
    },
  ];

  const getProductById = (id, check) => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("productEdit", JSON.stringify(res));
        if (check === 2) {
          navigate(`/admin/product/copy/${res.id}`);
        } else if (check === 3) {
          navigate(`/admin/product/view/${res.id}`);
        } else {
          navigate(`/admin/product/edit/${res.id}`);
        }
      });
  };

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results.data.data);
        setData(results.data.data);
        if (results.data.data.quantity <= 0) {
        }
        setLoading(false);
        setTableParams({
          pagination: {
            search1:"",
            search2:"",
            search3:"",
            search4:"",
            search5:"",
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };
  const loadExcel = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products/exportExcel`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log("dataExcel1",results);
        setDataExcel(results);
      });
  };

  //data mappro import
  useEffect(() => {
    load();
    loadExcel();
    loadDataCategory();
    loadDataManufacture();
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
  }, []);

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchProductKey ? searchProductKey: "";
    tableParams.pagination.search2 = searchStatus ? searchStatus: "";
    tableParams.pagination.search3 = searchPrice ? searchPrice : "";
    tableParams.pagination.search5 = searchPn ? searchPn : "";
    load();
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [importSuccess, setImportSuccess] = useState(true);
  const [searchProductKey, setSearchProductKey] = useState();
  const [searchPn, setSearchPn] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [searchPrice, setSearchPrice] = useState();
  const [searchImei, setSearchImei] = useState();
  const [username, setUsername] = useState();
  const [status, setStatus] = useState();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const navigate = useNavigate();

  const search = () => {
    tableParams.pagination.search1 = searchProductKey ? searchProductKey : "";
    tableParams.pagination.search2 = searchStatus ? searchStatus : "";
    tableParams.pagination.search3 = searchPrice ? searchPrice : "";
    tableParams.pagination.search5 = searchPn ? searchPn : "";
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            pagination: {
              search1:"",
              search2:"",
              search3:"",
              search4:"",
              search5:"",
              current: results.data.current_page,
              pageSize: 10,
              total: results.data.total,
            },
          },
        });
      });
  };

  const clearSearchForm = () => {
    tableParams.pagination.search1 = "";
    tableParams.pagination.search2 = "";
    tableParams.pagination.search3 = "";
    tableParams.pagination.search5 = "";
    tableParams.pagination.current = 1;
    load();
    setSearchProductKey("");
    setSearchStatus("");
    setSearchPn("");
    setSearchPrice("");
  };

  const changeSearchProductKey = (event) => {
    setSearchProductKey(event.target.value);
  };

  const changeSearchPn = (event) => {
    setSearchPn(event.target.value);
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  const changeSearchPrice = (value) => {
    setSearchPrice(value);
  };

  const changeSearchImei = (value) => {
    setSearchImei(value.target.value);
  };

  const onEdit = (id, username, status) => {
    setId(id);
    setEditing(true);
    setUsername(username);
    setStatus(status);
  };

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //xuat excel
  const downloadExcel=()=>{
    const newData=dataExcel.map(row=>{
      delete row.tableData
      return row
    })
    const workSheet=XLSX.utils.json_to_sheet(newData)
    const workBook=XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workBook,workSheet,"products")
    //Buffer
    let buf=XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})
    //Binary string
    XLSX.write(workBook,{bookType:"xlsx",type:"binary"})
    //Download
    XLSX.writeFile(workBook,"ProductsData.xlsx")
  }

  const getExention = (file) => {
    const parts = file.name.split(".");
    const extension = parts[parts.length - 1];
    return EXTENSIONS.includes(extension); // return boolean
  };

  const convertToJson = (headers, data) => {
    const rows = [];
    data.forEach((row) => {
      let rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      rows.push(rowData);
    });
    console.log("rows", rows);
    return rows;
  };

  // const loadDataManufacture = () => {
  //   fetch(
  //     `http://localhost:8080/api/auth/manufactures?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`,
  //     {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setManufacture(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  // const loadDataCategory = () => {
  //   fetch(
  //     `http://localhost:8080/api/staff/category?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`,
  //     {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setCategory(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  // const loadDataStorage = () => {
  //   fetch(
  //     `http://localhost:8080/api/storage_details?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataStorage(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  // const loadDataProcess = () => {
  //   fetch(
  //     `http://localhost:8080/api/auth/processors?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setProcessors(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };
  // const loadDataWin = () => {
  //   fetch(
  //     `http://localhost:8080/api/auth/wins?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataWin(results.data.data);
  //     });
  // };

  // const loadDataColor = () => {
  //   fetch(
  //     `http://localhost:8080/api/auth/colors?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataColor(results.data.data);
  //     });
  // };

  // const loadDataBattery = () => {
  //   fetch(
  //     `http://localhost:8080/api/auth/batteryCharger?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setBattery(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  // const loadDataAccessor = () => {
  //   fetch(
  //     `http://localhost:8080/api/auth/accessory?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataAccessory(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  // const loadDataCard = () => {
  //   fetch(
  //     `http://localhost:8080/api/card?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataCard(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  // const loadDataRam = () => {
  //   fetch(
  //     `http://localhost:8080/api/auth/rams?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataRam(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  // const loadDataOrigin = () => {
  //   fetch(
  //     `http://localhost:8080/api/staff/origin?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`,
  //     {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataOrigin(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  // const loadDataScreen = () => {
  //   fetch(
  //     `http://localhost:8080/api/auth/screens?${qs.stringify(
  //       getRandomuserParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataScreen(results.data.data);

  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };
  const loadDataManufacture = () => {
    fetch(
        `http://localhost:8080/api/manufactures/getAll`
    )
        .then((res) => res.json())
        .then((results) => {
          const re=[]
          results.data.forEach(item=>{if(item.status=="ACTIVE")re.push(item)});
            setManufacture(re);
        });
};
const loadDataCategory = () => {
    fetch(
      `http://localhost:8080/api/category/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
          results.data.forEach(item=>{if(item.status=="ACTIVE")re.push(item)});
        setCategory(re);
      });
  };

  const loadDataStorage = () => {
    fetch(
      `http://localhost:8080/api/storages/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
        results.data.forEach(item=>{re.push(item)});
        setDataStorage(re);
      });
  };

  const loadDataProcess = () => {
    fetch(
      `http://localhost:8080/api/processors/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
        results.data.forEach(item=>{if(item.status=="ACTIVE")re.push(item)});
        setProcessors(re);
      });
  };
  const loadDataWin = () => {
    fetch(
      `http://localhost:8080/api/wins/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
          results.data.forEach(item=>{if(item.status=="ACTIVE")re.push(item)});
        setDataWin(re);
      });
  };

  const loadDataColor = () => {
    fetch(
      `http://localhost:8080/api/auth/colors?${qs.stringify(
        getRandomuserParams(tableParamsLK)
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
          results.data.data.forEach(item=>{re.push(item)});
        setDataColor(re);
      });
  };

  const loadDataBattery = () => {
    fetch(
      `http://localhost:8080/api/batteryCharger/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
          results.data.forEach(item=>{if(item.status=="ACTIVE")re.push(item)});
        setBattery(re);
      });
  };

  const loadDataAccessor = () => {
    fetch(
      `http://localhost:8080/api/accessory/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
          results.data.forEach(item=>{re.push(item)});
        setDataAccessory(re);
      });
  };

  const loadDataCard = () => {
    fetch(
      `http://localhost:8080/api/card/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[];
        results.data.forEach(item=>{re.push(item)});
        setDataCard(re);
      });
  };

  const loadDataRam = () => {
    fetch(
      `http://localhost:8080/api/rams/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
          results.data.forEach(item=>{if(item.status=="ACTIVE")re.push(item)});
        setDataRam(re);
      });
  };

  const loadDataOrigin = () => {
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParams(tableParamsLK)
      )}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
          results.data.data.forEach(item=>{if(item.status=="ACTIVE")re.push(item)});
        setDataOrigin(re);
      });
  };

  const loadDataScreen = () => {
    fetch(
      `http://localhost:8080/api/screens/getAll`
    )
      .then((res) => res.json())
      .then((results) => {
        const re=[]
          results.data.forEach(item=>{if(item.status=="ACTIVE")re.push(item)});
        setDataScreen(re);
      });
  };
  
  async function addCate(cate){
      const response1= await fetch(
        `http://localhost:8080/api/staff/category`, { method: "POST", headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        }, body: JSON.stringify({ name: cate, status: "ACTIVE" }) })
    const idCate=await response1.json();
    console.log("idCate", idCate);
    return idCate.data.id;
  }
  async function addColor(color){
    const response1= await fetch(
      `http://localhost:8080/api/staff/color`, { method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }, body: JSON.stringify({ name: color}) })
    const idColor=await response1.json();
    console.log("idColor", idColor);
    return idColor.data.id;
  }
  async function addOrigin(origin){
    const response1= await fetch(
      `http://localhost:8080/api/staff/origin`, { method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }, body: JSON.stringify({ name: origin, status: "ACTIVE" }) })
    const idOrigin=await response1.json();
    console.log("idOrigin", idOrigin);
    return idOrigin.data.id;
  }
  async function addRam(looseSlot,
    maxRamSupport,
    onboardRam,
    ramCapacity,
    ramSpeed,
    remainingSlot,
    typeOfRam){
    const response1= await fetch(
      `http://localhost:8080/api/staff/ram`, { method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }, body: JSON.stringify({
        looseSlot: looseSlot,
        maxRamSupport: maxRamSupport,
        onboardRam: onboardRam,
        ramCapacity: ramCapacity,
        ramSpeed: ramSpeed,
        remainingSlot: remainingSlot,
        typeOfRam: typeOfRam, status: "ACTIVE" }) })
    const idRam=await response1.json();
    console.log("idRam", idRam);
    return idRam.data.id;
  }
  //
  async function addProcessor(
    cpuCompany,
    cpuTechnology,
    cpuType,
    cpuSpeed,
    maxSpeed,
    multiplier,
    numberOfThread,
    caching){
    const response1= await fetch(
      `http://localhost:8080/api/staff/processors`, { method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }, body: JSON.stringify({
        cpuCompany: cpuCompany,
        cpuTechnology: cpuTechnology,
        cpuType: cpuType,
        cpuSpeed: cpuSpeed,
        maxSpeed: maxSpeed,
        multiplier: multiplier,
        numberOfThread: numberOfThread,
        caching: caching, status: "ACTIVE" }) })
    const idProcessor=await response1.json();
    console.log("idProcessor", idProcessor);
    return idProcessor.data.id;
  }
  //
  async function addScreen(
        size,
        screenTechnology,
        resolution,
        screenType,
        scanFrequency,
        backgroundPanel,
        brightness,
        colorCoverage,
        screenRatio,
        touchScreen,
        contrast){
    const response1= await fetch(
      `http://localhost:8080/api/staff/screens`, { method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }, body: JSON.stringify({
        size: size,
        screenTechnology: screenTechnology,
        resolution: resolution,
        screenType: screenType,
        scanFrequency: scanFrequency,
        backgroundPanel: backgroundPanel,
        brightness: brightness,
        colorCoverage: colorCoverage,
        screenRatio: screenRatio,
        touchScreen: touchScreen,
        contrast: contrast, status: "ACTIVE" }) })
    const idCreen=await response1.json();
    console.log("idCreen", idCreen);
    return idCreen.data.id;
  }
  //
  async function addWin(
    name,
    version){
    const response1= await fetch(
      `http://localhost:8080/api/staff/wins`, { method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }, 
      body: JSON.stringify({
        name:name,
        version:version, status: "ACTIVE" }) })
    const idWin=await response1.json();
    console.log("idWin", idWin);
    return idWin.data.id;
    }
    //
    async function addCard(
      trandemark,
      model,
      memory){
    const response1= await fetch(
      `http://localhost:8080/api/card`, { method: "POST", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({
            memory: memory,
            model: model,
            trandemark: trandemark, status: "ACTIVE" }) })
    const idCard=await response1.json();
    console.log("idCard", idCard);
    return idCard.data.id;
    }
    //
    async function addCardOnboard(
      trandemark,
      model,
      memory){
    const response1= await fetch(
      `http://localhost:8080/api/card`, { method: "POST", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({
            memory: memory,
            model: model,
            trandemark: trandemark, status: "ACTIVE" }) })
    const idCard=await response1.json();
    console.log("idCard", idCard);
    return idCard.data.id;
    }
    //
    async function addStorage(
      storageDetailId,
      total,
      number){
      const response1= await fetch(
        `http://localhost:8080/api/storages`, { method: "POST", 
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({
          storageDetailId:storageDetailId,
          total:total,
          number:number, status: "ACTIVE" }) })
      const idStorage=await response1.json();
      console.log("idStorage", idStorage);
      return idStorage.data.id;
      }
      //
    async function addPin(
      battery,
      batteryType,
      charger){
      const response1= await fetch(
        `http://localhost:8080/api/staff/batteryCharger`, { method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        }, 
        body: JSON.stringify({
          battery: battery,
          batteryType: batteryType,
          charger: charger, status: "ACTIVE" }) })
      const idPin=await response1.json();
      console.log("idPin", idPin);
      return idPin.data.id;
      }
      //
      //
    async function addManu(
      name){
      const response1= await fetch(
        `http://localhost:8080/api/staff/manufactures`, { method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        }, 
        body: JSON.stringify({
          name:name, status: "ACTIVE" }) })
      const idManu=await response1.json();
      console.log("idManu", idManu);
      return idManu.data.id;
      }
      //
      async function addAccess(
        nameAccess,descriptionAccessory){
        const response1= await fetch(
          `http://localhost:8080/api/staff/accessory`, { method: "POST", 
          headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("token"),
          }, 
          body: JSON.stringify({
            name:nameAccess, description:descriptionAccessory}) })
        const idAccess=await response1.json();
        console.log("idAccess", idAccess);
        loadDataAccessor();
        return idAccess.data.id;
        }

  //import
  const handleImport = async (data, index) => {
    var impPro=false;
    console.log(data);
    const row = index + 1;
    var mess = "Import thất bại bản ghi thứ " + row;
    const quantity = Number(data.quantity);
    console.log(quantity);
    data.images = [data.images].map((item) => ({
      name: item?item:null,
      product: null,
      return_id: null,
      exchange_id: null,
    }));
  
    var index1=category.findIndex(function(item){
      return item.name===data.nameCategory;
    });
    if(index1===-1){
      const cate=await addCate(data.nameCategory);
      data.category=cate;
    }else{
      category.forEach((item) =>
      item.name.trim() == data.nameCategory ? (data.category = item.id) : ""
    );}
    //
    var index2=dataColor.findIndex(function(item){
      return item.name===data.nameColor;
    });
    if(index2===-1){
      const color=await addColor(data.nameColor);
      data.color=color;
    }else{
      dataColor.forEach((item) =>
      item.name.trim() == data.nameColor ? (data.color = item.id) : ""
    );}
    //
    var index3=dataOrigin.findIndex(function(item){
      return item.name.trim()===data.nameOrigin.trim();
    });
    if(index3===-1){
      const origin1=await addOrigin(data.nameOrigin);
      data.origin=origin1;
    }else{
      dataOrigin.forEach((item) =>
      item.name.trim() == data.nameOrigin.trim() ? (data.origin = item.id) : ""
    );
    }
    //
    var index4=dataRam.findIndex(function(item){
      return item.ramCapacity.trim() +
      " " +
      item.typeOfRam.trim() +
      " " +
      item.ramSpeed.trim() +
      " " +
      item.maxRamSupport.trim()===data.ramCapacity.trim() +
      " " +
      data.typeOfRam.trim() +
      " " +
      data.ramSpeed.trim() +
      " " +
      data.maxRamSupport.trim();
    });
    if(index4===-1){
      const ram=await addRam(
        data.looseSlot,
        data.maxRamSupport,
        data.onboardRam,
        data.ramCapacity,
        data.ramSpeed,
        data.remainingSlot,
        data.typeOfRam);
      data.ram=ram;
    }else{
      dataRam.forEach((item) =>
      item.ramCapacity.trim() +
        " " +
        item.typeOfRam.trim() +
        " " +
        item.ramSpeed.trim() +
        " " +
        item.maxRamSupport.trim() ==
        data.ramCapacity.trim() +
        " " +
        data.typeOfRam.trim() +
        " " +
        data.ramSpeed.trim() +
        " " +
        data.maxRamSupport.trim()
        ? (data.ram = item.id)
        : ""
    );
    }
    //
    var index5=processors.findIndex(function(item){
      return item.cpuCompany.trim() +
      " " +
      item.cpuTechnology.trim() +
      " " +
      item.cpuType.trim() +
      " " +
      item.cpuSpeed.trim() ===data.cpuCompany.trim() +
      " " +
      data.cpuTechnology.trim() +
      " " +
      data.cpuType.trim() +
      " " +
      data.cpuSpeed.trim();
    });
    if(index5===-1){
      const processor=await addProcessor(
        data.cpuCompany,
        data.cpuTechnology,
        data.cpuType,
        data.cpuSpeed,
        data.maxSpeed,
        data.multiplier,
        data.numberOfThread,
        data.caching);
      data.processor=processor;
    }else{
      processors.forEach((item) =>
      item.cpuCompany.trim() +
        " " +
        item.cpuTechnology.trim() +
        " " +
        item.cpuType.trim() +
        " " +
        item.cpuSpeed.trim() ==
        data.cpuCompany.trim() +
        " " +
        data.cpuTechnology.trim() +
        " " +
        data.cpuType.trim() +
        " " +
        data.cpuSpeed.trim()
        ? (data.processor = item.id)
        : ""
    );
    }

    //
    var index6=dataScreen.findIndex(function(item){
      return item.size.trim() +
      " " +
      item.screenTechnology.trim() +
      " " +
      item.resolution.trim() +
      " " +
      item.screenType.trim() ==
      data.size.trim() +
      " " +
      data.screenTechnology.trim() +
      " " +
      data.resolution.trim() +
      " " +
      data.screenType.trim();
    });
    if(index6===-1){
      const screen=await addScreen(
        data.size,
        data.screenTechnology,
        data.resolution,
        data.screenType,
        data.scanFrequency,
        data.backgroundPanel,
        data.brightness,
        data.colorCoverage,
        data.screenRatio,
        data.touchScreen,
        data.contrast);
      data.screen=screen;
    }else{
      dataScreen.forEach((item) =>
      item.size.trim() +
        " " +
        item.screenTechnology.trim() +
        " " +
        item.resolution.trim() +
        " " +
        item.screenType.trim() ==
        data.size.trim() +
        " " +
        data.screenTechnology.trim() +
        " " +
        data.resolution.trim() +
        " " +
        data.screenType.trim()
        ? (data.screen = item.id)
        : ""
    );
    }
    //
    var index7=dataCard.findIndex(function(item){
      return ((item.trandemark+"").trim() +
      " " +
      (item.model+"").trim() +
      " " +
      (item.memory+"").trim()).trim() ===
      ((data.trandemark+"").trim() +
      " " +
      (data.model+"").trim() +
      " " +
      (data.memory+"").trim()).trim()
    });
    console.log("dataCard",dataCard)
    if(index7===-1){
      const card=await addCard(
        data.trandemark.trim(),
        data.model.trim(),
        data.memory.trim());
      data.card=card;
    }else{
      dataCard.forEach((item) =>
      ((item.trandemark+"").trim() +
      " " +
      (item.model+"").trim() +
      " " +
      (item.memory+"").trim()).trim() ===
      ((data.trandemark+"").trim() +
      " " +
      (data.model+"").trim() +
      " " +
      (data.memory+"").trim()).trim()
        ? (data.card = item.id)
        : ""
    );
    }
    //
    var index8=dataCard.findIndex(function(item){
      return ((item.trandemark+"").trim() +
      " " +
      (item.model+"").trim() +
      " " +
      (item.memory+"").trim()).trim() ===
      ((data.trandemarkOnboard+"").trim() +
      " " +
      (data.modelOnboard+"").trim() +
      " " +
      (data.memoryOnboard+"").trim()).trim()
    });
    if(index8===-1){
      const cardOnb=await addCardOnboard(
        data.trandemarkOnboard.trim(),
        data.modelOnboard.trim(),
        data.memoryOnboard.trim());
      data.cardOnboard=cardOnb;
    }else{
      dataCard.forEach((item) =>
      ((item.trandemark+"").trim() +
      " " +
      (item.model+"").trim() +
      " " +
      (item.memory+"").trim()).trim() ===
      ((data.trandemarkOnboard+"").trim() +
      " " +
      (data.modelOnboard+"").trim() +
      " " +
      (data.memoryOnboard+"").trim()).trim()
        ? (data.cardOnboard = item.id)
        : ""
    );
    }
    //
    var index9=dataWin.findIndex(function(item){
      return item.name.trim() + " - " + item.version.trim()==data.nameWin.trim() + " - " + data.version.trim()
    });
    if(index9===-1){
      const win=await addWin(
        data.nameWin,
        data.version);
      data.win=win;
    }else{
      dataWin.forEach((item) =>
      item.name.trim() + " - " + item.version.trim() == data.nameWin.trim() + " - " + data.version.trim()
        ? (data.win = item.id)
        : ""
    );
    }
    //
    var index10=dataStorage.findIndex(function(item){
      return item.storageDetail.id+" "+
      item.total+" "+
      item.number ===
      data.storageDetailId+" "+
      (data.total+"")+" "+
      (data.number+"")
    });
    if(index10===-1){
      const storage=await addStorage(
        data.storageDetailId,
        (data.total+""),
        (data.number+""));
      data.storage=storage;
    }else{
      dataStorage.forEach((item) =>
      item.storageDetail.id+" "+
      item.total+" "+
      item.number ===
      data.storageDetailId+" "+
      (data.total+"")+" "+
      (data.number+"")
        ? (data.storage = item.id)
        : ""
    );
    }
    //
    var index11=battery.findIndex(function(item){
      return item.batteryType.trim() +
      " " +
      item.battery.trim() +
      " " +
      item.charger.trim() ==
      data.batteryType.trim() +
      " " +
      data.battery.trim() +
      " " +
      data.charger.trim()
    });
    if(index11===-1){
      const pin=await addPin(
        data.battery,
        data.batteryType,
        data.charger);
      data.batteryId=pin;
    }else{
      battery.forEach((item) =>
      item.batteryType.trim() +
        " " +
        item.battery.trim() +
        " " +
        item.charger.trim() ==
        data.batteryType.trim() +
        " " +
        data.battery.trim() +
        " " +
        data.charger.trim()
        ? (data.batteryId = item.id)
        : ""
    );
    }
    //
    var index11=manufacture.findIndex(function(item){
      return item.name.trim()==data.nameManufacture
    });
    if(index11===-1){
      const manu=await addManu(
        data.nameManufacture);
      data.manufactureId=manu;
    }else{
      manufacture.forEach((item) =>
      item.name.trim() == data.nameManufacture ? (data.manufactureId = item.id) : ""
    );
    }
    //
    var index12=dataAccessory.findIndex(function(item){
      return item.name.trim()===data.nameAccessory.trim()
    });
    if(index12===-1){
      const access=await addAccess(
        data.nameAccessory.trim(),
        data.descriptionAccessory);
      data.accessoryId=access;
    }else{
      dataAccessory.forEach((item) =>
      item.name.trim()=== data.nameAccessory.trim()
        ? (data.accessoryId = item.id)
        : ""
    );
    }
    //
    
    

    const product = {
      //id:data.id,
      name: data.name,
      quantity: Number(data.quantity),
      price: Number(data.price),
      imei: data.imei,
      weight: Number(data.weight),
      height: Number(data.height),
      width: Number(data.width),
      length: Number(data.length),
      debut: data.debut,
      categoryId: [data.category],
      manufactureId: data.manufactureId,
      images: data.images,
      status: data.status?data.status:"ACTIVE",
      processorId: data.processor,
      screenId: data.screen,
      cardId: data.card,
      originId: data.origin,
      colorId: [data.color],
      batteryId: data.batteryId,
      ramId: data.ram,
      winId: data.win,
      material: data.material,
      cardOnboard: data.cardOnboard,
      accessoryId: [data.accessoryId],
      security: data.security,
      description: data.description,
      storageId: data.storage,
    };
    console.log("productImp",product);
      fetch("http://localhost:8080/api/staff/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(product),
      })
      .then((response) => response.json())
      .then((response) => {
        console.log("data response");
        console.log(response.data);
        if (response.data) {
          console.log('importSuccess');
        }
        console.log(importSuccess);
        if (response.errors) {
          notifyError(mess);
        }
      })
      .catch((error) => {
        notifyError(mess);
        console.log("Error:", error);
      });
  };

  const uploadExcel = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      //parse data

      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });

      //get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      // console.log(fileData)
      const headers = fileData[0];
      const heads = headers.map((head) => ({ title: head, field: head }));
      // setColDefs(heads)

      //removing header
      fileData.splice(0, 1);

      setDataImport(convertToJson(headers, fileData));
    };

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file);
      } else {
        notifyError("Định dạng file không hợp lệ, chọn Excel, CSV file");
        //setDataImport([])
      }
    } else {
      setDataImport([]);
      // setColDefs([])
    }
  };
  const importExcel =(e) => {
    console.log("dataImport", dataImport);
    dataImport
      ? dataImport.map((pro, index) => {
         handleImport(pro, index);
        })
      : notifyError("Hãy chọn file excel cần import");
    setDataImport();
    console.log(importSuccess);
    if (importSuccess == true && dataImport != undefined) {
      notifySuccess("Import thành công !");
      load();
    } else {
      // notifyError('import thất bại !')
    }
    const file = document.querySelectorAll('input[name="file"]');
    file[0].value = null;
    load();
  };

  return (
    <div>
      <ToastContainer />
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Danh sách sản phẩm</h4>
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
        <div className="row">
          <div className="col-3 mt-1">
            <label>Tìm kiếm theo từ khóa</label>
            <Input
              type="text"
              name="searchProductKey"
              value={searchProductKey}
              placeholder="Nhập từ khóa"
              onChange={changeSearchProductKey}
            />
          </div>
          <div className="col-3 mt-1">
            <label>P/N</label>
            <br />
            <Input
              type="text"
              name="searchPn"
              value={searchPn}
              placeholder="Nhập P/N"
              onChange={changeSearchPn}
            />
          </div>
          <div className="col-3 mt-1">
            <label>Trạng thái</label>
            <br />
            <Select
              allowClear={true}
              style={{ width: "400px", borderRadius: "5px" }}
              showSearch
              placeholder="Chọn trạng thái"
              optionFilterProp="children"
              onChange={changeSearchStatus}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Không hoạt động</Option>
            </Select>
          </div>
          <div className="col-3 mt-1">
            <label>Mức giá</label>
            <br />
            <Select
              allowClear={true}
              style={{ width: "400px", borderRadius: "5px" }}
              showSearch
              placeholder="Chọn mức giá"
              optionFilterProp="children"
              onChange={changeSearchPrice}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="9999999">Dưới 10 triệu</Option>
              <Option value="10000000">Từ 10 - 15 triệu</Option>
              <Option value="15000000">Từ 15 - 20 triệu</Option>
              <Option value="20000000">Trên 20 triệu</Option>
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
      </div>
      <div className="row">
        <div className="col-12 mt-2">
          <Button
            className="offset-11 "
            type="primary"
            onClick={() => {
              navigate("/admin/product/create");
            }}
            shape="round"
          >
            <PlusOutlined />
            Thêm mới
          </Button>
          <Button
            className=" me-2"
            type="warning"
            onClick={() => {
              downloadExcel()
            }}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined />
            Download Excel
          </Button>
          <input
            type="file"
            name="file"
            value={fileImp}
            onChange={uploadExcel}
          />
          <Button
            className="mx-2"
            type="primary"
            onClick={() => {
              importExcel();
            }}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined />
            Import Excel
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
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Xóa sản phẩm"
            open={isDelete}
            onCancel={() => {
              setDelete(false);
            }}
            onOk={() => {
              fetch(`http://localhost:8080/api/users/${id}`, {
                method: "DELETE",
              }).then(() => load());
              setDelete(false);
              toastrs.options = {
                timeOut: 6000,
              };
              toastrs.clear();
              notifySuccess("Xóa thành công!");
            }}
          >
            Bạn muốn xóa người dùng này chứ?
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Product;
