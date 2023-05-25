import {
  Select,
  Input,
  Button,
  InputNumber,
  Image,
  AutoComplete,
  Form,
  Table,
  Tabs,
  Drawer,
  Card,
  Checkbox,
  Col,
  Pagination,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import qs from "qs";
import "./table.css";
import "../Order/table.css";
import { Modal } from "antd";
import {
  DeleteOutlined,
  MenuFoldOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { addToCart } from "../../store/Actions";
import { ToastContainer, toast } from "react-toastify";
import Meta from "antd/lib/card/Meta";
import Context from "../../store/Context";
import Prod from "../../components/layout/prod";
const { Option } = Select;
const { TextArea } = Input;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

const getRandomProductParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchProductKey: params.pagination?.searchProductKey,
  searchStatus: params.pagination?.searchStatus,
  searchPrice: params.pagination?.searchPrice,
  searchImei: params.pagination?.searchImei,
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

function CreateOrderAdmin() {
  const getDataProductById1 = (id) => {
    fetch(`http://localhost:8080/api/products/${id}?`)
      .then((res) => res.json())
      .then((results) => {
        setShowData(results);
      });
  };
  const [state, dispatch] = useContext(Context);
  const [test, setTest] = useState([]);
  const [checkConfirm, setCheckConfirm] = useState(false);
  const [dataProducts, setDataProduct] = useState(
    JSON.parse(localStorage.getItem("productFilter"))
      ? JSON.parse(localStorage.getItem("productFilter"))
      : []
  );
  const [dataProductsFind, setDataProductsFind] = useState(dataProducts);
  const [dataManufacture, setDataManufacture] = useState([]);
  const [battery, setBattery] = useState();
  const [category, setCategory] = useState([]);
  const [manufacture, setManufacture] = useState([]);
  const [dataOrigin, setDataOrigin] = useState();
  const [processors, setProcessors] = useState([]);
  const [processorsFilter, setProcessorsFilter] = useState([]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataRam, setDataRam] = useState([]);
  const [dataCard, setDataCard] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const [dataAccessory, setDataAccessory] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  const [dataWin, setDataWin] = useState();
  const [dataSelect, setDataSelect] = useState([]);
  const [checkValueUser, setCheckValueUser] = useState(false);
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.searchStatus,
  });

  const getData = () => {
    fetch(
      `http://localhost:8080/api/products/getAllProAccess?${qs.stringify(
        getRandomProductParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        const data = [];
        results.data.data.forEach((item) => {
          if (item.quantity > 0) {
            data.push(item);
          }
        });
        setDataProduct(data);
        setDataProductsFind(data);
        chonLaptop();
      });
  };

  const handleCheckConfirm = (value) => {
   setCheckConfirm(value);
  }

  const loadDataManufacture = () => {
    fetch(`http://localhost:8080/api/manufactures/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataManufacture(re);
      });
  };
  const loadDataCategory = () => {
    fetch(`http://localhost:8080/api/category/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setCategory(re);
      });
  };

  const loadDataStorage = () => {
    fetch(`http://localhost:8080/api/storage_details/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataStorage(re);
      });
  };
  const loadDataProcess = () => {
    fetch(`http://localhost:8080/api/processors/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setProcessors(re);
        let indexProcess = -1;
        let processor1 = [];
        re.forEach((item) => {
          if (processor1) {
            indexProcess = processor1.findIndex((value) => {
              return (
                value.cpuCompany.trim() + " " + value.cpuTechnology.trim() ===
                item.cpuCompany.trim() + " " + item.cpuTechnology.trim()
              );
            });
          }
          if (indexProcess === -1) {
            processor1.push(item);
          }
        });
        setProcessorsFilter(processor1);
      });
  };
  const loadDataCard = () => {
    fetch(`http://localhost:8080/api/card/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataCard(re);
      });
  };

  const loadDataRam = () => {
    fetch(`http://localhost:8080/api/rams/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataRam(re);
      });
  };
  const loadDataScreen = () => {
    fetch(`http://localhost:8080/api/screens/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataScreen(re);
      });
  };

  //option Thương hiệu
  const thuonghieuOptions = [];
  dataManufacture?.map((item) => {
    thuonghieuOptions.push({ label: item.name, value: item.id });
  });
  const [checkedListTH, setCheckedListTH] = useState([]);
  const [checkAllTH, setCheckAllTH] = useState(true);
  var thuonghieuAll = document.getElementsByClassName("thuonghieuAll");
  const onChangeThuongHieu = (list) => {
    console.log("thuonghieu", list);
    setCheckedListTH(list);
    setCheckAllTH(list.length === thuonghieuOptions.length || list.length == 0);
    thuonghieuAll = document.getElementsByClassName("thuonghieuAll");
    if (list.length !== thuonghieuOptions.length || list.length > 0) {
      thuonghieuAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === thuonghieuOptions.length) {
      setCheckedListTH([]);
    }
    chonLaptop();
  };
  const onCheckAllChangeThuongHieu = (e) => {
    setCheckedListTH(e.target.checked ? thuonghieuOptions : []);
    setCheckAllTH(e.target.checked);
    if (e.target.checked == false) {
      thuonghieuAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //onClick img hãng
  var thuonghieuImg = [];
  const onClickThuongHieuImg = (nameTH) => {
    if (nameTH != null) {
      dataManufacture?.map((item) => {
        if (item.name.toLowerCase() == nameTH.toLowerCase())
          thuonghieuImg = [item.id];
      });
      console.log("thuonghieuImg", thuonghieuImg);
      if (thuonghieuImg.length > 0) {
        var arrTH1 = document.getElementsByClassName("thuonghieu")[0]?.children;
        for (var i = 0; i < arrTH1.length; i++) {
          if (arrTH1[i].control.value == thuonghieuImg[0]) {
            // checkbox
            arrTH1[i].control.checked = true; //set checked cho checkbox
          } else {
            arrTH1[i].control.checked = false;
          }
        }
        onChangeThuongHieu(thuonghieuImg);
      }
    }
  };
  //onClick img nhu cầu
  var categoryImg = [];
  const onClickCategoryImg = (nameNC) => {
    if (nameNC != null) {
      category?.map((item) => {
        if (item.name.toLowerCase() == nameNC.toLowerCase())
          categoryImg = [item.name];
      });
      console.log("categoryImg", categoryImg);
      if (categoryImg.length > 0) {
        var arrNC = document.getElementsByClassName("category")[0]?.children;
        for (var i = 0; i < arrNC.length; i++) {
          if (arrNC[i].control.value == categoryImg[0]) {
            // checkbox
            arrNC[i].control.checked = true; //set checked cho checkbox
          } else {
            arrNC[i].control.checked = false;
          }
        }
        onChangecategory(categoryImg);
      }
    }
  };

  //option Giá bán
  const giabanOptions = [
    { label: "Dưới 10 triệu", value: 1 },
    { label: "Từ 10-15 Triệu", value: 2 },
    { label: "Từ 15-20 triệu", value: 3 },
    { label: "Trên 20 triệu", value: 4 },
  ];
  const [checkedListGB, setCheckedListGB] = useState([]);
  const [checkAllGB, setCheckAllGB] = useState(true);
  var giabanAll = document.getElementsByClassName("giabanAll");
  const onChangegiaban = (list) => {
    setCheckedListGB(list);
    setCheckAllGB(list.length === giabanOptions.length || list.length == 0);
    if (list.length !== giabanOptions.length || list.length > 0) {
      giabanAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === giabanOptions.length) {
      setCheckedListGB([]);
    }
    chonLaptop();
  };
  const onCheckAllChangegiaban = (e) => {
    setCheckedListGB(e.target.checked ? giabanOptions : []);
    setCheckAllGB(e.target.checked);
    if (e.target.checked == false) {
      giabanAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option Màn hình
  const manhinhOptions = [
    { label: "Khoảng 13 inch", value: 1 },
    { label: "Khoảng 14 inch", value: 2 },
    { label: "Khoảng trên 15 inch", value: 3 },
  ];
  const [checkedListMH, setCheckedListMH] = useState([]);
  const [checkAllMH, setCheckAllMH] = useState(true);
  var manhinhAll = document.getElementsByClassName("manhinhAll");
  const onChangemanhinh = (list) => {
    setCheckedListMH(list);
    setCheckAllMH(list.length === manhinhOptions.length || list.length == 0);
    if (list.length !== manhinhOptions.length || list.length > 0) {
      manhinhAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === manhinhOptions.length) {
      setCheckedListMH([]);
    }
    chonLaptop();
  };
  const onCheckAllChangemanhinh = (e) => {
    setCheckedListMH(e.target.checked ? manhinhOptions : []);
    setCheckAllMH(e.target.checked);
    if (e.target.checked == false) {
      manhinhAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option CPU
  const cpuOptions = [];
  processorsFilter?.map((item) => {
    cpuOptions.push({
      label: item.cpuCompany.trim() + " " + item.cpuTechnology.trim(),
      value: item.cpuCompany.trim() + " " + item.cpuTechnology.trim(),
    });
  });
  const [checkedListCPU, setCheckedListCPU] = useState([]);
  const [checkAllCPU, setCheckAllCPU] = useState(true);
  var cpuAll = document.getElementsByClassName("cpuAll");
  const onChangecpu = (list) => {
    setCheckedListCPU(list);
    setCheckAllCPU(list.length === cpuOptions.length || list.length == 0);
    if (list.length !== cpuOptions.length || list.length > 0) {
      cpuAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === cpuOptions.length) {
      setCheckedListCPU([]);
    }
    chonLaptop();
  };
  const onCheckAllChangecpu = (e) => {
    setCheckedListCPU(e.target.checked ? cpuOptions : []);
    setCheckAllCPU(e.target.checked);
    if (e.target.checked == false) {
      cpuAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option Ram
  const ramOptions = [
    { label: "4 gb", value: 1 },
    { label: "8 gb", value: 2 },
    { label: "16 gb", value: 3 },
    { label: "32 gb", value: 4 },
  ];
  const [checkedListRam, setCheckedListRam] = useState([]);
  const [checkAllRam, setCheckAllRam] = useState(true);
  var ramAll = document.getElementsByClassName("ramAll");
  const onChangeram = (list) => {
    setCheckedListRam(list);
    setCheckAllRam(list.length === ramOptions.length || list.length == 0);
    if (list.length !== ramOptions.length || list.length > 0) {
      ramAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === ramOptions.length) {
      setCheckedListRam([]);
    }
    chonLaptop();
  };
  const onCheckAllChangeram = (e) => {
    setCheckedListRam(e.target.checked ? ramOptions : []);
    setCheckAllRam(e.target.checked);
    if (e.target.checked == false) {
      ramAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option card do hoa
  const cardOptions = [
    { label: "Nvidia geforce series", value: 1 },
    { label: "Amd radeon series", value: 2 },
    { label: "Intel series", value: 3 },
    { label: "Apple series", value: 4 },
  ];
  const [checkedListcard, setCheckedListcard] = useState([]);
  const [checkAllcard, setCheckAllcard] = useState(true);
  var cardAll = document.getElementsByClassName("cardAll");
  const onChangecard = (list) => {
    setCheckedListcard(list);
    setCheckAllcard(list.length === cardOptions.length || list.length == 0);
    if (list.length !== cardOptions.length || list.length > 0) {
      cardAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === cardOptions.length) {
      setCheckedListcard([]);
    }
    chonLaptop();
  };
  const onCheckAllChangecard = (e) => {
    setCheckedListcard(e.target.checked ? cardOptions : []);
    setCheckAllcard(e.target.checked);
    if (e.target.checked == false) {
      cardAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option ocung
  const ocungOptions = [
    { label: "Ssd 1 tb", value: 1 },
    { label: "Ssd 512 gb", value: 2 },
    { label: "Ssd 256 gb", value: 3 },
    { label: "Ssd 128 gb", value: 4 },
  ];
  const [checkedListocung, setCheckedListocung] = useState([]);
  const [checkAllocung, setCheckAllocung] = useState(true);
  var ocungAll = document.getElementsByClassName("ocungAll");
  const onChangeocung = (list) => {
    setCheckedListocung(list);
    setCheckAllocung(list.length === ocungOptions.length || list.length == 0);
    if (list.length !== ocungOptions.length || list.length > 0) {
      ocungAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === ocungOptions.length) {
      setCheckedListocung([]);
    }
    chonLaptop();
  };
  const onCheckAllChangeocung = (e) => {
    setCheckedListocung(e.target.checked ? ocungOptions : []);
    setCheckAllocung(e.target.checked);
    if (e.target.checked == false) {
      ocungAll[0].control.checked = false;
    }
    chonLaptop();
  };
  //option category
  const categoryOptions = [];
  category?.map((item) => {
    categoryOptions.push({ label: item.name.trim(), value: item.name.trim() });
  });
  const [checkedListcategory, setCheckedListcategory] = useState([]);
  const [checkAllcategory, setCheckAllcategory] = useState(true);
  var categoryAll = document.getElementsByClassName("categoryAll");
  const onChangecategory = (list) => {
    setCheckedListcategory(list);
    setCheckAllcategory(
      list.length === categoryOptions.length || list.length == 0
    );
    if (list.length !== categoryOptions.length || list.length > 0) {
      categoryAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === categoryOptions.length) {
      setCheckedListcategory([]);
    }
    chonLaptop();
  };
  const onCheckAllChangecategory = (e) => {
    setCheckedListcategory(e.target.checked ? categoryOptions : []);
    setCheckAllcategory(e.target.checked);
    if (e.target.checked == false) {
      categoryAll[0].control.checked = false;
    }
    chonLaptop();
  };

  const chonLaptop = () => {
    //chon cac thuong hieu nao => thuonghieuchon_arr
    var arr1 = document.getElementsByClassName("thuonghieu")[0]?.children;
    var thuonghieuchon_arr = [];
    for (var i = 0; i < arr1?.length; i++) {
      if (thuonghieuAll[0]?.control.checked == true) {
        arr1[i].control.checked = false;
        console.log("checkallTrue");
      } else {
        console.log("checkallFalse", arr1[i].control);
        if (arr1[i].control.checked == true)
          thuonghieuchon_arr.push(arr1[i].control.value);
      }
    }

    //chon cac khoang gia nao => giaban_arr
    var arr2 = document.getElementsByClassName("giaban")[0]?.children;
    var giaban_arr = [];
    for (var i = 0; i < arr2?.length; i++) {
      if (giabanAll[0]?.control.checked == true) {
        arr2[i].control.checked = false;
      } else {
        if (arr2[i].control.checked == true)
          giaban_arr.push(arr2[i].control.value);
      }
    }
    //chon cac man hinh nao => manhinh_arr
    var arr3 = document.getElementsByClassName("manhinh")[0]?.children;
    var manhinh_arr = [];
    for (var i = 0; i < arr3?.length; i++) {
      if (manhinhAll[0]?.control.checked == true) {
        arr3[i].control.checked = false;
      } else {
        if (arr3[i].control.checked == true)
          manhinh_arr.push(arr3[i].control.value);
      }
    }
    //chon cac cpu nao => cpu_arr
    var arr4 = document.getElementsByClassName("cpu")[0]?.children;
    var cpu_arr = [];
    for (var i = 0; i < arr4?.length; i++) {
      if (cpuAll[0]?.control.checked == true) {
        arr4[i].control.checked = false;
      } else {
        if (arr4[i].control.checked == true)
          cpu_arr.push(arr4[i].control.value);
      }
    }
    //chon cac ram nao => ram_arr
    var arr5 = document.getElementsByClassName("ram")[0]?.children;
    var ram_arr = [];
    for (var i = 0; i < arr5?.length; i++) {
      if (ramAll[0]?.control.checked == true) {
        arr5[i].control.checked = false;
      } else {
        if (arr5[i].control.checked == true)
          ram_arr.push(arr5[i].control.value);
      }
    }
    //chon cac card nao => card_arr
    var arr6 = document.getElementsByClassName("cardDohoa")[0]?.children;
    var card_arr = [];
    for (var i = 0; i < arr6?.length; i++) {
      if (cardAll[0]?.control.checked == true) {
        arr6[i].control.checked = false;
      } else {
        if (arr6[i].control.checked == true)
          card_arr.push(arr6[i].control.value);
      }
    }
    //chon cac o cung nao => storage_arr
    var arr7 = document.getElementsByClassName("ocung")[0]?.children;
    var storage_arr = [];
    for (var i = 0; i < arr7?.length; i++) {
      if (ocungAll[0]?.control.checked == true) {
        arr7[i].control.checked = false;
      } else {
        if (arr7[i].control.checked == true)
          storage_arr.push(arr7[i].control.value);
      }
    }
    //chon cac nhu cau nao => category_arr
    var arr8 = document.getElementsByClassName("category")[0]?.children;
    var category_arr = [];
    for (var i = 0; i < arr8?.length; i++) {
      if (categoryAll[0]?.control.checked == true) {
        arr8[i].control.checked = false;
      } else {
        if (arr8[i].control.checked == true)
          category_arr.push(arr8[i].control.value);
      }
    }
    hienLT(
      thuonghieuchon_arr,
      giaban_arr,
      manhinh_arr,
      cpu_arr,
      ram_arr,
      card_arr,
      storage_arr,
      category_arr
    );
  };
  function hienLT(
    thuonghieuchon_arr,
    giaban_arr,
    manhinh_arr,
    cpu_arr,
    ram_arr,
    card_arr,
    storage_arr,
    category_arr
  ) {
    console.log("thuonghieuchon_arr", thuonghieuchon_arr);
    const list = [];
    var ktThuonghieu = false;
    var ktGiaban = false;
    var ktManhinh = false;
    var ktCPU = false;
    var ktRam = false;
    var ktCard = false;
    var ktOcung = false;
    var ktCategory = false;
    for (var i = 0; i < dataProducts?.length; i++) {
      var thuonghieuLT = dataProducts[i].manufacture.id + "";
      var manhinhLT = dataProducts[i].screen.size.split(" ")[0].trim();
      var giaLT = dataProducts[i].price;
      var cpuLT =
        dataProducts[i].processor.cpuCompany.trim() +
        " " +
        dataProducts[i].processor.cpuTechnology.trim();
      var ramLT = dataProducts[i].ram.ramCapacity.split(" ")[0].trim();
      var cardLT = dataProducts[i].card.trandemark.trim();
      var storageLT = dataProducts[i].storage.storageDetail.capacity
        .split(" ")[0]
        .trim();
      var categoryLT = dataProducts[i].categoryProducts;
      if (thuonghieuchon_arr?.length > 0) {
        if (thuonghieuchon_arr.includes(thuonghieuLT) == true) {
          ktThuonghieu = true;
        }
        if (thuonghieuchon_arr.includes(thuonghieuLT) == false) continue;
      }
      if (giaban_arr?.length > 0) {
        if (
          (giaLT < 10000000 && giaban_arr.includes("1") == true) ||
          (giaLT >= 10000000 &&
            giaLT < 15000000 &&
            giaban_arr.includes("2") == true) ||
          (giaLT >= 15000000 &&
            giaLT < 20000000 &&
            giaban_arr.includes("3") == true) ||
          (giaLT >= 20000000 && giaban_arr.includes("4") == true)
        ) {
          ktGiaban = true;
        }
        if (giaLT < 10000000 && giaban_arr.includes("1") == false) continue;
        if (
          giaLT >= 10000000 &&
          giaLT < 15000000 &&
          giaban_arr.includes("2") == false
        )
          continue;
        if (
          giaLT >= 15000000 &&
          giaLT < 20000000 &&
          giaban_arr.includes("3") == false
        )
          continue;
        if (giaLT >= 20000000 && giaban_arr.includes("4") == false) continue;
      }
      if (manhinh_arr?.length > 0) {
        if (
          (manhinhLT >= 13 &&
            manhinhLT < 14 &&
            manhinh_arr.includes("1") == true) ||
          (manhinhLT >= 14 &&
            manhinhLT < 15 &&
            manhinh_arr.includes("2") == true) ||
          (manhinhLT >= 15 && manhinh_arr.includes("3") == true)
        ) {
          ktManhinh = true;
        }
        if (
          manhinhLT >= 13 &&
          manhinhLT < 14 &&
          manhinh_arr.includes("1") == false
        )
          continue;
        if (
          manhinhLT >= 14 &&
          manhinhLT < 15 &&
          manhinh_arr.includes("2") == false
        )
          continue;
        if (manhinhLT >= 15 && manhinh_arr.includes("3") == false) continue;
      }
      if (cpu_arr?.length > 0) {
        if (cpu_arr.includes(cpuLT) == true) {
          ktCPU = true;
        }
        if (cpu_arr.includes(cpuLT) == false) continue;
      }
      if (ram_arr?.length > 0) {
        if (
          (ramLT == 4 && ram_arr.includes("1") == true) ||
          (ramLT == 8 && ram_arr.includes("2") == true) ||
          (ramLT == 16 && ram_arr.includes("3") == true) ||
          (ramLT == 32 && ram_arr.includes("4") == true)
        ) {
          ktRam = true;
        }
        if (ramLT == 4 && ram_arr.includes("1") == false) continue;
        if (ramLT == 8 && ram_arr.includes("2") == false) continue;
        if (ramLT == 16 && ram_arr.includes("3") == false) continue;
        if (ramLT == 32 && ram_arr.includes("4") == false) continue;
      }
      if (card_arr?.length > 0) {
        if (
          (cardLT == "NVIDIA" && card_arr.includes("1") == true) ||
          (cardLT == "AMD" && card_arr.includes("2") == true) ||
          (cardLT == "Intel" && card_arr.includes("3") == true) ||
          (cardLT == "Apple" && card_arr.includes("4") == true)
        ) {
          ktCard = true;
        }
        if (cardLT == "NVIDIA" && card_arr.includes("1") == false) continue;
        if (cardLT == "AMD" && card_arr.includes("2") == false) continue;
        if (cardLT == "Intel" && card_arr.includes("3") == false) continue;
        if (cardLT == "Apple" && card_arr.includes("4") == false) continue;
      }
      if (storage_arr?.length > 0) {
        if (
          (storageLT == 1 && storage_arr.includes("1") == true) ||
          (storageLT == 512 && storage_arr.includes("2") == true) ||
          (storageLT == 256 && storage_arr.includes("3") == true) ||
          (storageLT == 128 && storage_arr.includes("4") == true)
        ) {
          ktOcung = true;
        }
        if (storageLT == 1 && storage_arr.includes("1") == false) continue;
        if (storageLT == 512 && storage_arr.includes("2") == false) continue;
        if (storageLT == 256 && storage_arr.includes("3") == false) continue;
        if (storageLT == 128 && storage_arr.includes("4") == false) continue;
      }
      if (category_arr?.length > 0) {
        var cate = [];
        categoryLT.forEach((item) => {
          cate.push(item.category.name.trim());
        }); //lay cate trong categoryProduct
        console.log("cate", cate.toString());
        for (var j = 0; j < cate.length; j++) {
          var stop = false;
          //console.log("cate"+[j], cate[j]);
          if (!category_arr.includes(cate[j]) == true) {
            stop = true;
          } else {
            stop = false;
            ktCategory = true;
            break;
          }
        }
        if (stop) {
          continue;
        }
      }
      console.log("dataProducts[i]", dataProducts[i]);
      list.push(dataProducts[i]);
      console.log("list", list);
      setDataProductsFind(list);
    }
    if (ktThuonghieu == false && thuonghieuchon_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktGiaban == false && giaban_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktManhinh == false && manhinh_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktCPU == false && cpu_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktRam == false && ram_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktCard == false && card_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktOcung == false && storage_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktCategory == false && category_arr?.length > 0) {
      setDataProductsFind(null);
    }
  }
  useEffect(() => {
    loadDataManufacture();
    loadDataCategory();
    //loadDataOrigin();
    loadDataProcess();
    loadDataScreen();
    loadDataRam();
    loadDataCard();
    //loadDataBattery();
    //loadDataAccessor();
    loadDataStorage();
    //loadDataColor();
    //loadDataWin();
  }, []);

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
  const [product, setShowData] = useState();
  const onClickEye = (data) => {
    getDataProductById1(data.id);
    showDrawer();
  };

  const onClickCart = (data) => {
    data.quantityProduct = data.quantity;
    dispatch(addToCart(data));
    toastSuccess("Thêm sản phẩm thành công!");
  };
  const [open1, setOpen1] = useState(false);

  const showDrawer = () => {
    setOpen1(true);
  };

  const onClose = () => {
    setOpen1(false);
  };

  const onChangeInputNumberCart = (value, event) => {
    value.quantity = event;
    dispatch({
      type: "CHANGE_CART_QTY",
      payload: {
        id: value.id,
        quantity: event,
      },
    });
    getTotal();
    if (typeOrder == "TAI_NHA") {
      SubmitShipping();
    }
  };

  const onclickDelete = (value) => {
    setProductAdd(productAdd.filter((item) => item != value));
  };
  const gh = JSON.parse(localStorage.getItem("carts"));
  const [productAdd, setProductAdd] = useState([]);
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      width: "25%",
      render: (id, data) => {
        return (
          <>
            <img width={100} src={data?.images[0]?.name} />
          </>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: "45%",
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: "15%",
      render: (price) => {
        return (
          <>
            {price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "",
      width: "15%",
      render: (data) => {
        return (
          <>
            <InputNumber
              style={{ width: "50px" }}
              min={1}
              max={data.quantityProduct}
              value={data.quantity}
              defaultValue={data.quantity}
              onChange={(event) => onChangeInputNumberCart(data, event)}
            />
          </>
        );
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "",
      width: "15%",
      render: (id, data) => {
        return (
          <>
            {(data.price * data.quantity).toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "",
      render: (id, data) => {
        return (
          <>
            {/* <EyeOutlined
              style={{ fontSize: "18px", marginLeft: "20%" }}
              onClick={() => {
                onClickShow(data);
              }}
            /> */}
            <DeleteOutlined
              onClick={() =>
                dispatch({
                  type: "REMOVE_CART",
                  payload: data,
                })
              }
              style={{ color: "red", marginLeft: 1, marginBottom: 5 }}
            />
          </>
        );
      },
    },
  ];
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const handleOk1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [values, setValues] = useState();
  const [users, setUsers] = useState();
  const [getFullName, setFullNameClient] = useState();
  const [valueUser, setValueUser] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneClient, setPhoneClient] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddRess] = useState();
  const [fullNameForm, setFullNameForm] = useState();
  const [phoneNumberForm, setPhoneNumberForm] = useState();
  const [addressForm, setAddRessForm] = useState();
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const [addressDetail, setAddressDetail] = useState();
  const [quantity, setQuantity] = useState();
  const [array, setArray] = useState([{}]);
  const [district, setDistrict] = useState([{}]);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  const [Ward, setWard] = useState([{}]);
  const [disableCountry, setDisableCountry] = useState(false);
  const [districtId, setDistrictId] = useState(1);
  const [wardCode, setWardCode] = useState(1);
  const [shipping, setShipping] = useState(0);
  const [serviceId, setServiceId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [ProvinceID, setProvinceID] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [dataCart, setDataCart] = useState([]);
  const [dataClient, setDataClient] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [valueClient, setValueClient] = useState("");
  const [total, setTotal] = useState(0);
  const [valueProvince, setValueProvince] = useState();
  const [valueDistrict, setValueDistrict] = useState();
  const [payment, setPayment] = useState();
  const [valueWard, setValueWard] = useState();
  const [valueQuantity, setValueQuantity] = useState();
  const [totalWith, setTotalWidth] = useState();
  const [totalHeight, setTotalHeight] = useState();
  const [totalLength, setTotalLength] = useState();
  const [totalWeight, setTotalWeight] = useState();
  const [note, setNote] = useState();
  const [userId, setUserId] = useState();
  const [dataLogin, setDataLogin] = useState();
  const [discounts, setDiscounts] = useState();
  const [userNameLogin, setUserNameLogin] = useState();
  const [typeOrder, setTypeOrder] = useState();
  const [form] = Form.useForm();
  const [formOrder] = Form.useForm();
  const [resetSelect, SetRestSelect] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [tableParamPro, setTableParamPro] = useState({
    pagination: {
      current: 1,
      pageSize: 200,
      searchProductKey: "",
      searchStatus: "ACTIVE",
      searchPrice: "",
      searchImei: "",
    },
  });
  const [tableParamDiscount, setTableParamDiscount] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      searchStatus: 1,
    },
  });

  const loadInfo = () => {
    fetch(
      `http://localhost:8080/api/information?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        if (results.status === 200) {
          setUsers(results.data.data);
          setLoading(false);
          setTableParams({
            pagination: {
              current: results.data.current_page,
              pageSize: 10,
              total: results.data.total,
            },
          });
        }
      });
  };

  const onReset = () => {
    formOrder.resetFields();
    loadDataClient();
    setShipping(0);
    setValueUser("");
    setShow(false);
    setTotal(total);
    setCheckValueUser(false);
  };

  const handleOk = (value) => {
    if (password2 === password1) {
      fetch(`http://localhost:8080/api/staff/orders/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username: value.username,
          newPassword: value.password,
          fullName: value.fullName,
          email: value.email,
          phoneNumber: value.phoneNumber,
          address: "none",
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          if (results.data == null) {
            toastError(results.message);
          } else {
            toastSuccess("Thêm mới khách hàng thành công!");
            onReset();
            setUsername("");
            setPhoneNumberForm("");
            setPassword1("");
            setPassword2("");
            setFullName("");
            setEmail("");
            setPhoneNumber("");
            setAddRess("");
            setOpen(false);
          }
        });
    } else {
      toastError("Xác nhận tài khoản không chính xác!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleChangePayment = (value) => {
    if (value === "TẠI CỬA HÀNG") {
      setDisableCountry(true);
      setShow(false);
    } else {
      setShow(true);
      setDisableCountry(false);
    }
    setTypeOrder(value);
  };

  const handleSubmitOrder = (form) => {
    if (valueUser === undefined | valueUser == '' | valueUser == null) {
      toastError("Bạn chưa nhập tên khách hàng !");
    }
    if (form.address == "") {
      toastError("Địa chỉ chi tiết không hợp lệ!");
    } else {
      const order = {
        payment: form.payment,
        total: total + shipping,
        userId: userId === undefined ? null : userId,
        address:
          valueProvince !== undefined
            ? (addressDetail === undefined ? "" : addressDetail + ",") +
              valueWard +
              ", " +
              valueDistrict +
              ", " +
              valueProvince
            : "TẠI CỬA HÀNG",
        note: note,
        customerName: valueUser === undefined ? fullNameForm.trim() : valueUser,
        phone: phoneClient === undefined ? phoneNumberForm : phoneClient,
        money: 0,
        status: "CHO_XAC_NHAN",
      };
      console.log("order đặt hàng: ");
      console.log(order);
      const orderDetails = [];
      gh?.forEach((item, index) => {
        orderDetails.push({
          quantity: item.quantity,
          status: "CHO_XAC_NHAN",
          total: Number(item.quantity * item.price),
          productId: item.id,
          isCheck: null,
        });
      });
      let totalOrder = 0;
      orderDetails.forEach((element) => {
        totalOrder += element.total;
      });

      if (Number(order.total) + Number(shipping) > 200000000) {
        toastError("Giá trị đơn hàng không vượt quá 200 triệu !");
      } else {
        try {
          fetch("http://localhost:8080/api/auth/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
              payment: form.payment,
              userId: order.userId | null,
              total: shipping > 0 ? Number(totalOrder + shipping) : totalOrder,
              address: form.address
                ? form.address.trim() + ", " + order.address
                : "Tại cửa hàng",
              note: form.note ? form.note.trim() : "",
              customerName:
                order.customerName == ""
                  ? fullNameForm.trim()
                  : order.customerName,
              phone: order.phone,
              status: typeOrder === "TẠI CỬA HÀNG" && checkConfirm == true ? "DA_NHAN" : (checkConfirm == true ? "CHO_LAY_HANG": "CHO_XAC_NHAN") ,
              money: checkConfirm == true ? (shipping > 0 ? Number(totalOrder + shipping) : totalOrder) : 0,
              shippingFree: shipping,
              orderDetails: orderDetails,
            }),
          })
            .then((res) => res.json())
            .then((results) => {
              if (results.status === 200) {
                toastSuccess("Tạo hoá đơn thành công");
                onReset();
                loadDataCart();
                localStorage.removeItem("carts");
              } else {
                toastError("Tạo hoá đơn thất bại");
              }
            });
        } catch (err) {
          console.log(err);
          toastError("Tạo hoá đơn thất bại");
        }
      }
    }
  };

  const onRest = () => {
    setPhoneClient("");
    setValueUser("");
    setShipping("0 VND");
    setAddressDetail("");
    setTypeOrder("");
    // SetRestSelect("");
  };

  const updateCart = (cart, id, quantity) => {
    let tong =
      cart.total === cart.price * quantity ? cart.total : cart.price * quantity;
    fetch(`http://localhost:8080/api/carts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: cart.productId,
        userId: cart.useId | 1,
        quantity: quantity !== undefined ? quantity + 1 : cart.quantity,
        total: cart.total,
      }),
    }).then((res) => {
      loadDataCart();
    });
  };

  const getDataProductById = (productId, cart, id) => {
    fetch(`http://localhost:8080/api/products/${productId}?`)
      .then((res) => res.json())
      .then((results) => {
        cart.price = results.price;
        updateCart(cart, id);
      });
  };

  const SubmitCartData = (value, price, quantity) => {
    fetch("http://localhost:8080/api/carts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: value,
        userId: 1,
        quantity: quantity === 1 ? 1 : quantity + 1,
        total: price,
      }),
    }).then((res) => {
      // res.json();
      loadDataCart();
    });
  };

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };

  const onChange = (value) => {
    setProvinceID(value);
    loadDataDistrict(value);
  };
  const onSearch = (value) => {
    if (value.target.innerText !== "") {
      setValueProvince(value.target.innerText);
    }
  };

  const onChangeDistricts = (value) => {
    if (value != null) {
      setIsDisabled(false);
    }
    setDistrictId(value);
    loadDataWard(value);
  };

  const onSearchDistricts = (value) => {
    if (value.target.innerText !== "") {
      setValueDistrict(value.target.innerText);
      loadDataWard();
    }
  };

  const onChangeWards = (value) => {
    if (value === "") {
      setIsDisabled(true);
    }
    setWardCode(value);
    SubmitShipping(value);
  };

  const onSearchWards = (value) => {
    if (value.target.innerText !== "") {
      setValueWard(value.target.innerText);
      SubmitShipping();
    }
  };

  const onSearchClient = (searchItem) => {
    setValueClient(searchItem);
  };

  const loadDataProvince = () => {
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.status);
      })
      .then((result) => {
        setArray(result.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const loadDataDistrict = (value) => {
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
        body: JSON.stringify({
          province_id: value ? value : ProvinceID != 1,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.status);
      })
      .then((result) => {
        setDistrict(result.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const loadDataWard = (value) => {
    if (value != null) {
      fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
          },
          body: JSON.stringify({
            shop_id: 3379752,
            from_district: 1542,
            to_district: value ? value : districtId != 1,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data === null) {
            console.log("không có dữ liệu giao hàng phù hợp");
            setIsDisabled(true);
          } else {
            const checkValue = data.data[0].service_id;
            setServiceId(checkValue);
            fetch(
              "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
                },
                body: JSON.stringify({
                  district_id: value ? value : districtId != 1,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.data === null) {
                  console.log("không có dữ liệu phù hợp");
                } else {
                  setWard(data.data);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changePassword1 = (event) => {
    setPassword1(event.target.value);
  };

  const changePassword2 = (event) => {
    setPassword2(event.target.value);
  };

  const changeFullname = (event) => {
    setFullName(event.target.value);
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };

  const changeAddRess = (event) => {
    setAddRess(event.target.value);
  };

  const onChangeProvince = (event) => {
    setValue(event.target.value);
  };

  const onChangeValueUser = (event) => {
    console.log(event.target.value);
    const ob = event.target.value;
    const pattern = "[wa-zA-Z0-9]";
    const re = new RegExp(pattern);
    if (re.test(ob)) {
      setValueUser(event.target.value);   
    }else{
      setValueUser(null);
    }
   
    // setValueUser(event.target.value);
  };

  const url = "http://localhost:8080/api/orders";

  const getValueShipping = (totalProduct, weight, width, height, length) => {
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          shop_id: 3379752,
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
        body: JSON.stringify({
          service_id: serviceId,
          insurance_value: totalProduct,
          coupon: null,
          from_district_id: 3440,
          to_district_id: districtId,
          height: Math.round(height * 0.1),
          length: Math.round(length * 0.1),
          weight: Math.round(weight * 1000),
          width: Math.round(width * 0.1),
          to_ward_code: value === undefined ? wardCode : value,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setShipping(data.data.total);
        setIsDisabled(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const SubmitShipping = () => {
    let totalProduct = 0;
    let weight = 0;
    let width = 0;
    let height = 0;
    let length = 0;
    gh?.forEach((item) => {
      totalProduct += item.price * item.quantity;
      weight += item.weight * item.quantity;
      width += item.width * item.quantity;
      height += item.height * item.quantity;
      length += item.length * item.quantity;
    });
    getValueShipping(totalProduct, weight, width, height, length);
  };

  const getTotal = () => {
    let totalSum = 0;
    gh?.forEach((item) => (totalSum += item.price * item.quantity));
    setTotal(totalSum);
  };
  useEffect(() => {
    loadDataProvince();
    loadDataClient();
    loadInfo();
    setDisableCountry(true);
    loadDataUseLogin();
    getData();
    if (localStorage.getItem("username")) {
      setUserNameLogin(localStorage.getItem("username"));
    }
  }, []);

  useEffect(() => {
    getTotal();
  }, [gh]);

  const loadDataUseLogin = () => {
    const id = localStorage.getItem("id");
    fetch(
      `http://localhost:8080/api/users/find/${id}?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataLogin(results.data.data);
        setLoading(false);
      });
  };

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        const option = [];
        results.data.data.forEach((item) => {
          item.information.forEach((element) => {
            if (element.phoneNumber != "none") {
              option.push({
                value: element.phoneNumber,
                id: element.id,
                fullName: element.fullName,
              });
            }
          });
        });
        setDataClient(option);
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
  const loadDataCart = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/carts?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCart(results.data.data);
        let total = 0;
        let weight = 0;
        let width = 0;
        let height = 0;
        let length = 0;
        results.data.data?.forEach((item) => {
          total += item.total;
          weight += item.product.weight * item.quantity;
          width += item.product.width * item.quantity;
          height += item.product.height * item.quantity;
          length += item.product.length * item.quantity;
        });
        setTotalWeight(weight);
        setTotal(total);
        setTotalLength(length);
        setTotalHeight(height);
        setTotalWidth(width);
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

  const loadDataProduct = () => {
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        const dataResult = [];
        results.data.data.forEach((item) => {
          dataResult.push(
            renderItem(item.id, item.name, item?.images[0]?.name, item.price)
          );
          setData(dataResult);
        });
      });
  };

  const onSearchUser = (searchItem) => {
    setValueUser(searchItem);
  };

  const onSearchAndFillUser = (item) => {
    if (item != null) {
      setFullNameClient(item.fullName);
    }
    onSearchUser("");
    setFullNameForm(item.fullName);
    setPhoneNumberForm(item.phoneNumber);
    setAddRessForm(item.address);
    setUserId(item.userId);
  };

  const renderItem = (id, title, count, price) => ({
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
        {title}{" "}
        {price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}
      </div>
    ),
    price: price,
  });

  const onSelectAutoClient = (value) => {
    dataClient.forEach((element) => {
      if (element.value === value) {
        setValueUser(element.fullName);
        setCheckValueUser(true);
        setUserId(element.id);
      }
    });
  };

  const onSelectAuto = (value) => {
    setValueProduct(value);
    setValues("");
    let isUpdate = false;
    if (value !== undefined) {
      let quantity = 0;
      dataCart
        ?.filter((item) => item.product.id === value)
        .map((cart) => {
          quantity += cart.quantity;
          updateCart(cart, cart.id, quantity);
          isUpdate = true;
        });
      let priceProduct;
      getDataProductById(value);
      data
        ?.filter((item) => item.value === value)
        .map((product) => {
          priceProduct = product.price;
        });
      if (isUpdate === false) {
        SubmitCartData(value, priceProduct, quantity);
      }
      let total = 0;
      dataCart?.forEach((item) => (total += item.total));
      setTotal(total);
    }
  };

  const onChangeSearchClient = (event) => {
    console.log("event: " + event);
    setPhoneClient(event);
    setValueUser("");
    if (event == "") {
      setCheckValueUser(false);
    }
  };

  const [clearForm] = Form.useForm();
  const [clearFormSearch] = Form.useForm();

  const handleSearchProduct = (values) => {
    tableParamPro.pagination.searchProductKey = values.name ? values.name : "";
    tableParamPro.pagination.searchStatus = "ACTIVE";
    tableParamPro.pagination.searchPrice = values.price ? values.price : "";
    tableParamPro.pagination.searchImei = values.imei ? values.imei : "";
    tableParamPro.pagination.current = 1;
    getData();
    //setDataProductsFind(dataProducts);
  };
  useEffect(() => {
    setDataProductsFind(dataProducts);
    chonLaptop();
  }, [dataProducts]);

  const handlePagination = (pagination) => {
    console.log("pagination: " + pagination);
    tableParamPro.pagination.limit = 12;
    tableParamPro.pagination.current = pagination;
    // tableParamPro.pagination.searchStatus = "";
    // tableParamPro.pagination.searchPrice = "";
    // tableParamPro.pagination.searchPN = "";
    getData();
  };

  const handleClear = () => {
    tableParamPro.pagination.searchProductKey = "";
    tableParamPro.pagination.searchStatus = "ACTIVE";
    tableParamPro.pagination.searchPrice = "";
    tableParamPro.pagination.searchPN = "";
    tableParamPro.pagination.searchImei = "";
    tableParamPro.pagination.current = 1;
    // setDataProduct(
    //   JSON.parse(localStorage.getItem("productFilter"))
    //     ? JSON.parse(localStorage.getItem("productFilter"))
    //     : []
    // );
    // setDataProductsFind(
    //   JSON.parse(localStorage.getItem("productFilter"))
    //     ? JSON.parse(localStorage.getItem("productFilter"))
    //     : []
    // );
    getData();
    clearForm.resetFields();
    var thuonghieuAll = document.getElementsByClassName("thuonghieuAll");
    setCheckedListTH([]);
    setCheckAllTH(true);
    thuonghieuAll[0].control.checked = true;
    //
    var giabanAll = document.getElementsByClassName("giabanAll");
    setCheckedListGB([]);
    setCheckAllGB(true);
    giabanAll[0].control.checked = true;
    //
    var manhinhAll = document.getElementsByClassName("manhinhAll");
    setCheckedListMH([]);
    setCheckAllMH(true);
    manhinhAll[0].control.checked = true;
    //
    var cpuAll = document.getElementsByClassName("cpuAll");
    setCheckedListCPU([]);
    setCheckAllCPU(true);
    cpuAll[0].control.checked = true;
    //
    var ramAll = document.getElementsByClassName("ramAll");
    setCheckedListRam([]);
    setCheckAllRam(true);
    ramAll[0].control.checked = true;
    //
    var cardAll = document.getElementsByClassName("cardAll");
    setCheckedListcard([]);
    setCheckAllcard(true);
    cardAll[0].control.checked = true;
    //
    var ocungAll = document.getElementsByClassName("ocungAll");
    setCheckedListocung([]);
    setCheckAllocung(true);
    ocungAll[0].control.checked = true;
    //
    var categoryAll = document.getElementsByClassName("categoryAll");
    setCheckedListcategory([]);
    setCheckAllcategory(true);
    categoryAll[0].control.checked = true;
  };

  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Đặt hàng</h4>
        </div>
      </div>
      <ToastContainer></ToastContainer>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="btn-search col-12 mt-3 mb-4 d-flex float-end">
          <div className="timk col-4 ">
            <div className="search-container">
              <div className="search-inner mb-2">
                <Button type="primary" shape="round" onClick={showModal1}>
                  Chọn sản phẩm
                </Button>
                <Modal
                  width={1000}
                  title="Chọn sản phẩm"
                  open={isModalOpen1}
                  onOk={handleOk1}
                  cancelText={"Đóng"}
                  okButtonProps={{
                    style: {
                      display: "none",
                    },
                  }}
                  onCancel={handleCancel1}
                >
                  <Tabs
                    defaultActiveKey="1"
                    onChange={onChange}
                    items={[
                      {
                        label: `Sản phẩm`,
                        key: "1",
                        children: (
                          <>
                            <div className="">
                              <div className="">
                                <Form
                                  form={clearForm}
                                  name="nest-messages"
                                  className="me-2 ms-2"
                                  layout="vertical"
                                  autoComplete="off"
                                  onFinish={(values) => {
                                    handleSearchProduct(values);
                                  }}
                                  onFinishFailed={(error) => {
                                    console.log({ error });
                                  }}
                                >
                                  <div className="row">
                                    <div className="col-6 ">
                                      <Form.Item name="name">
                                        <Select
                                          allowClear={true}
                                          style={{
                                            width: "300px",
                                            borderRadius: "5px",
                                          }}
                                          showSearch
                                          placeholder="Nhập tên sản phẩm"
                                          optionFilterProp="children"
                                        >
                                          {dataProducts
                                            ? dataProducts.map((item) => (
                                                <Select.Option
                                                  value={item.name}
                                                  selected
                                                >
                                                  {item.name}
                                                </Select.Option>
                                              ))
                                            : ""}
                                        </Select>
                                      </Form.Item>
                                    </div>
                                    <div className="col-6 ">
                                      <Form.Item name="imei">
                                        <Input placeholder="Mã sản phẩm" />
                                      </Form.Item>
                                    </div>
                                    {/* <div className="col-4">
                                      <Form.Item name="price">
                                        <Select
                                          allowClear={true}
                                          style={{
                                            width: "400px",
                                            borderRadius: "5px",
                                          }}
                                          showSearch
                                          placeholder="Chọn mức giá"
                                          optionFilterProp="children"
                                          filterOption={(input, option) =>
                                            option.children
                                              .toLowerCase()
                                              .includes(input.toLowerCase())
                                          }
                                        >
                                          <Select.Option value="9999999">
                                            Dưới 10 triệu
                                          </Select.Option>
                                          <Select.Option value="10000000">
                                            Từ 10 - 15 triệu
                                          </Select.Option>
                                          <Select.Option value="15000000">
                                            Từ 15 - 20 triệu
                                          </Select.Option>
                                          <Select.Option value="20000000">
                                            Trên 20 triệu
                                          </Select.Option>
                                        </Select>
                                      </Form.Item>
                                    </div> */}
                                  </div>
                                  <Form.Item className="text-center mt-2">
                                    <Button
                                      className=""
                                      type="primary-outline"
                                      shape="round"
                                      onClick={handleClear}
                                    >
                                      Đặt lại
                                    </Button>
                                    <Button
                                      block
                                      className="mx-2"
                                      type="primary"
                                      shape="round"
                                      htmlType="submit"
                                      style={{ width: "120px" }}
                                    >
                                      Tìm kiếm
                                    </Button>
                                  </Form.Item>
                                </Form>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-3">
                                <Card
                                  className="mt-2"
                                  title="Hãng sản xuất"
                                  style={{
                                    width: 200,
                                  }}
                                  type="inner"
                                >
                                  <Col span={10}>
                                    <Checkbox
                                      className="thuonghieuAll"
                                      onChange={onCheckAllChangeThuongHieu}
                                      checked={checkAllTH}
                                    >
                                      Tất cả
                                    </Checkbox>
                                    <Checkbox.Group
                                      className="thuonghieu"
                                      options={thuonghieuOptions}
                                      value={checkedListTH}
                                      onChange={onChangeThuongHieu}
                                    />
                                  </Col>
                                </Card>
                                <Card
                                  className="mt-2"
                                  title="Mức giá"
                                  style={{
                                    width: 200,
                                  }}
                                  type="inner"
                                >
                                  <Col span={12}>
                                    <Checkbox
                                      className="giabanAll"
                                      onChange={onCheckAllChangegiaban}
                                      checked={checkAllGB}
                                    >
                                      Tất cả
                                    </Checkbox>
                                    <Checkbox.Group
                                      className="giaban"
                                      options={giabanOptions}
                                      value={checkedListGB}
                                      onChange={onChangegiaban}
                                    />
                                  </Col>
                                </Card>
                                <Card
                                  className="mt-2"
                                  title="Màn hình"
                                  style={{
                                    width: 200,
                                  }}
                                  type="inner"
                                >
                                  <Col span={12}>
                                    <Checkbox
                                      className="manhinhAll"
                                      onChange={onCheckAllChangemanhinh}
                                      checked={checkAllMH}
                                    >
                                      Tất cả
                                    </Checkbox>
                                    <Checkbox.Group
                                      className="manhinh"
                                      options={manhinhOptions}
                                      value={checkedListMH}
                                      onChange={onChangemanhinh}
                                    />
                                  </Col>
                                </Card>
                                <Card
                                  className="mt-2"
                                  title="CPU"
                                  style={{
                                    width: 200,
                                  }}
                                  type="inner"
                                >
                                  <Col span={12}>
                                    <Checkbox
                                      className="cpuAll"
                                      onChange={onCheckAllChangecpu}
                                      checked={checkAllCPU}
                                    >
                                      Tất cả
                                    </Checkbox>
                                    <Checkbox.Group
                                      className="cpu"
                                      options={cpuOptions}
                                      value={checkedListCPU}
                                      onChange={onChangecpu}
                                    />
                                  </Col>
                                </Card>
                                <Card
                                  className="mt-2"
                                  title="Ram"
                                  style={{
                                    width: 200,
                                  }}
                                  type="inner"
                                >
                                  <Col span={12}>
                                    <Checkbox
                                      className="ramAll"
                                      onChange={onCheckAllChangeram}
                                      checked={checkAllRam}
                                    >
                                      Tất cả
                                    </Checkbox>
                                    <Checkbox.Group
                                      className="ram"
                                      options={ramOptions}
                                      value={checkedListRam}
                                      onChange={onChangeram}
                                    />
                                  </Col>
                                </Card>
                                <Card
                                  className="mt-2"
                                  title="Card đồ họa"
                                  style={{
                                    width: 200,
                                  }}
                                  type="inner"
                                >
                                  <Col span={12}>
                                    <Checkbox
                                      className="cardAll"
                                      onChange={onCheckAllChangecard}
                                      checked={checkAllcard}
                                    >
                                      Tất cả
                                    </Checkbox>
                                    <Checkbox.Group
                                      className="cardDohoa"
                                      options={cardOptions}
                                      value={checkedListcard}
                                      onChange={onChangecard}
                                    />
                                  </Col>
                                </Card>
                                <Card
                                  className="mt-2"
                                  title="Ổ cứng"
                                  style={{
                                    width: 200,
                                  }}
                                  type="inner"
                                >
                                  <Col span={12}>
                                    <Checkbox
                                      className="ocungAll"
                                      onChange={onCheckAllChangeocung}
                                      checked={checkAllocung}
                                    >
                                      Tất cả
                                    </Checkbox>
                                    <Checkbox.Group
                                      className="ocung"
                                      options={ocungOptions}
                                      value={checkedListocung}
                                      onChange={onChangeocung}
                                    />
                                  </Col>
                                </Card>
                                <Card
                                  className="mt-2"
                                  title="Nhu cầu"
                                  style={{
                                    width: 200,
                                  }}
                                  type="inner"
                                >
                                  <Col span={12}>
                                    <Checkbox
                                      className="categoryAll"
                                      onChange={onCheckAllChangecategory}
                                      checked={checkAllcategory}
                                    >
                                      Tất cả
                                    </Checkbox>
                                    <Checkbox.Group
                                      className="category"
                                      options={categoryOptions}
                                      value={checkedListcategory}
                                      onChange={onChangecategory}
                                    />
                                  </Col>
                                </Card>
                              </div>
                              <div className="col-9">
                                <div className="row">
                                  {dataProductsFind?.map((item, index) => (
                                    <div className="col-4 mt-2" key={index}>
                                      <Card
                                        key={index}
                                        style={{ height: "300px" }}
                                        cover={
                                          <img
                                            style={{ height: "150px" }}
                                            alt="example"
                                            src={
                                              item?.images[0]?.name
                                                ? item.images[0].name
                                                : ""
                                            }
                                          />
                                        }
                                        actions={[
                                          <EyeOutlined
                                            key="setting"
                                            style={{
                                              fontSize: "20px",
                                              color: "#009999",
                                            }}
                                            onClick={() => onClickEye(item)}
                                          />,
                                          <ShoppingCartOutlined
                                            key="edit"
                                            style={{
                                              fontSize: "25px",
                                              color: "#08c",
                                            }}
                                            onClick={() => onClickCart(item)}
                                          ></ShoppingCartOutlined>,
                                        ]}
                                      >
                                        <Meta
                                          title={item.name}
                                          description={item.price.toLocaleString(
                                            "it-IT",
                                            {
                                              style: "currency",
                                              currency: "VND",
                                            }
                                          )}
                                        />
                                      </Card>
                                    </div>
                                  ))}
                                </div>
                                <div
                                  style={{ width: "100%" }}
                                  className="d-flex justify-content-evenly"
                                >
                                  <Pagination
                                    className="mt-4"
                                    onChange={handlePagination}
                                    simple
                                    defaultCurrent={
                                      tableParamPro.pagination.current
                                    }
                                    total={12}
                                  />
                                </div>
                              </div>
                            </div>

                            <Drawer
                              title={product?.name}
                              size="large"
                              placement="right"
                              onClose={onClose}
                              open={open1}
                            >
                              <div className="card">
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  Thông tin hàng hóa
                                </div>
                                <div className="card-body row">
                                  <div className="col-6">
                                    <li>Xuất xứ: {product?.origin.name}</li>
                                    <li>
                                      Thương hiệu: {product?.manufacture.name}{" "}
                                    </li>
                                  </div>
                                  <div className="col-6">
                                    <li>Thời điểm ra mắt:{product?.debut} </li>
                                    <li>
                                      Hướng dẫn bảo quản: Để nơi khô ráo, nhẹ
                                      tay
                                    </li>
                                  </div>
                                </div>
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  Thiết kế trọng lượng
                                </div>
                                <div className="card-body">
                                  <li>
                                    Kích thước: {product?.width} x{" "}
                                    {product?.height} x {product?.length}
                                  </li>
                                  <li>
                                    Trọng lượng sản phẩm: {product?.weight}kg
                                  </li>
                                  <li>Chất liệu: {product?.material}</li>
                                </div>
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  Bộ xử lí
                                </div>
                                <div className="card-body row">
                                  <div className="col-6">
                                    <li>
                                      Hãng CPU: {product?.processor?.cpuCompany}
                                    </li>
                                    <li>
                                      Công nghệ CPU:{" "}
                                      {product?.processor?.cpuTechnology}
                                    </li>
                                    <li>
                                      Tốc độ CPU: {product?.processor?.cpuSpeed}
                                    </li>
                                    <li>
                                      Tốc độ tối đa CPU:{" "}
                                      {product?.processor?.maxSpeed}
                                    </li>
                                  </div>
                                  <div className="col-6">
                                    <li>
                                      Loại CPU: {product?.processor?.cpuType}
                                    </li>
                                    <li>
                                      Số nhân: {product?.processor?.multiplier}
                                    </li>
                                    <li>
                                      Số luồng:{" "}
                                      {product?.processor?.numberOfThread}
                                    </li>
                                    <li>
                                      Bộ nhớ đệm: {product?.processor?.caching}
                                    </li>
                                  </div>
                                </div>
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  RAM
                                </div>
                                <div className="card-body row">
                                  <div className="col-6">
                                    <li>
                                      Dung lượng RAM:{" "}
                                      {product?.ram?.ramCapacity}
                                    </li>
                                    <li>Loại RAM: {product?.ram?.typeOfRam}</li>
                                    <li>
                                      Tốc độ RAM: {product?.ram?.ramSpeed}
                                    </li>
                                    <li>
                                      Số khe cắm rời: {product?.ram?.looseSlot}
                                    </li>
                                  </div>
                                  <div className="col-6">
                                    <li>
                                      Số khe RAM còn lại:{" "}
                                      {product?.ram?.remainingSlot}
                                    </li>
                                    <li>
                                      Số RAM onboard: {product?.ram?.onboardRam}
                                    </li>
                                    <li>
                                      Hỗ trợ RAM tối đa:{" "}
                                      {product?.ram?.maxRamSupport}
                                    </li>
                                  </div>
                                </div>
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  Màn Hình
                                </div>
                                <div className="card-body row">
                                  <div className="col-6">
                                    <li>
                                      Kích thước màn hình:{" "}
                                      {product?.screen?.size}
                                    </li>
                                    <li>
                                      Công nghệ màn hình:{" "}
                                      {product?.screen?.screenTechnology}
                                    </li>
                                    <li>
                                      Độ phân giải:{" "}
                                      {product?.screen?.resolution}
                                    </li>
                                    <li>
                                      Tần số quét:{" "}
                                      {product?.screen?.scanFrequency}
                                    </li>
                                    <li>
                                      Tấm nền:{" "}
                                      {product?.screen?.backgroundPanel}
                                    </li>
                                  </div>
                                  <div className="col-6">
                                    <li>
                                      Độ sáng: {product?.screen?.brightness}
                                    </li>
                                    <li>
                                      Độ phủ màu:{" "}
                                      {product?.screen?.colorCoverage}
                                    </li>
                                    <li>
                                      Tỷ lệ màn hình:{" "}
                                      {product?.screen?.resolution}
                                    </li>
                                    <li>
                                      Màn hình cảm ứng:{" "}
                                      {product?.screen?.backgroundPanel}
                                    </li>
                                    <li>
                                      Độ tương phản: {product?.screen?.contrast}
                                    </li>
                                  </div>
                                </div>
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  Đồ họa
                                </div>
                                <div className="card-body row">
                                  <div className="col-6">
                                    <li>
                                      <span
                                        style={{
                                          fontSize: "20px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Card onboard
                                      </span>
                                    </li>
                                    <li>
                                      Hãng: {product?.cardOnboard?.trandemark}
                                    </li>
                                    <li>
                                      Model: {product?.cardOnboard?.model}
                                    </li>
                                    <li>
                                      Bộ nhớ: {product?.cardOnboard?.memory}
                                    </li>
                                  </div>
                                  <div className="col-6">
                                    <li>
                                      <span
                                        style={{
                                          fontSize: "20px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Card rời
                                      </span>
                                    </li>
                                    <li>Hãng: {product?.card?.trandemark}</li>
                                    <li>Model: {product?.card?.model}</li>
                                    <li>Bộ nhớ: {product?.card?.memory}</li>
                                  </div>
                                </div>
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  Lưu trữ
                                </div>
                                <div className="card-body row">
                                  <div className="col-6">
                                    <li>
                                      Kiểu ổ cứng:{" "}
                                      {product?.storage?.storageDetail?.type}
                                    </li>
                                    <li>
                                      Số khe cắm: {product?.storage?.number}
                                    </li>
                                    <li>
                                      Loại SSD:
                                      {
                                        product?.storage?.storageDetail
                                          .storageType.name
                                      }
                                    </li>
                                    <li>
                                      Dung lượng:{" "}
                                      {product?.storage?.storageDetail.capacity}
                                    </li>
                                  </div>
                                </div>
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  Bảo mật
                                </div>
                                <div className="card-body row">
                                  <li>{product?.security}</li>
                                </div>
                                <div
                                  className="card-header"
                                  style={{ textAlign: "left" }}
                                >
                                  Hệ điều hành
                                </div>
                                <div className="card-body row">
                                  <li>OS: {product?.win.name}</li>
                                  <li>Version: {product?.win.version}</li>
                                </div>
                              </div>
                            </Drawer>
                          </>
                        ),
                      },
                      {
                        label: `Sản phẩm đã chọn`,
                        key: "2",
                        children: (
                          <>
                            <div className="offset-8 mb-2 fw-bold fs-6 text-danger">
                              Tổng tiền:{" "}
                              {total.toLocaleString("it-IT", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </div>
                            <Table
                              dataSource={gh}
                              columns={columns}
                              pagination={{ position: ["none", "none"] }}
                            />
                          </>
                        ),
                      },
                    ]}
                  />
                </Modal>
              </div>
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="title">
            <h3 className="text-danger">Thông tin khách hàng</h3>
          </div>
          <Form
            form={formOrder}
            autoComplete="off"
            layout="vertical"
            disabled={(gh?.length == 0) | (gh == undefined)}
            onFinish={(values) => {
              console.log({ values });
              handleSubmitOrder(values);
            }}
            onFinishFailed={(error) => {
              console.log({ error });
            }}
          >
            <div className="row">
              <div className="col-6">
                <Form.Item
                  className=""
                  name="phone"
                  label="Số điện thoại khách"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại khách hàng không được trống",
                    },
                    {
                      pattern: `^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$`,
                      message: "Số điện thoại khách hàng không đúng định dạng",
                    },
                    { whitespace: true },
                    { min: 3, message: "Tài khoản từ 3 ký tự trở lên" },
                  ]}
                >
                  <AutoComplete
                    style={{ width: 240 }}
                    onChange={(event) => onChangeSearchClient(event)}
                    options={dataClient}
                    value={phoneClient}
                    pattern="[0]{10}"
                    onSelect={(event) => onSelectAutoClient(event)}
                    placeholder="Nhập số điện thoại khách hàng"
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
                <label>Thông tin người bán </label>
                <Input
                  readOnly={true}
                  value={userNameLogin}
                  placeholder="Hà Trung Kiên"
                />

                <Form.Item
                  className="mt-4"
                  name="paymentOrder"
                  label="Hình thức nhận hàng"
                  rules={[
                    {
                      required: true,
                      message: "Hình thức nhận hàng không được để trống",
                    },
                  ]}
                >
                  <Select
                    key={1}
                    allowClear
                    value={typeOrder}
                    onChange={handleChangePayment}
                    placeholder="Hình thức nhận hàng"
                  >
                    <Option key={"TẠI CỬA HÀNG"} value="TẠI CỬA HÀNG">
                      Tại cửa hàng
                    </Option>
                    <Option
                      onClick={() => setShow(!show)}
                      key={"TAI_NHA"}
                      value="TAI_NHA"
                    >
                      Giao hàng tại nhà
                    </Option>
                  </Select>
                </Form.Item>

                {show && (
                  <div>
                    <Form.Item
                      className="mt-4"
                      name="province"
                      label="Tỉnh / Thành phố"
                      rules={[
                        {
                          required: true,
                          message: "Tỉnh/thành phố không được trống!",
                        },
                      ]}
                    >
                      <Select
                        key={2}
                        combobox="true"
                        showSearch
                        placeholder="Tỉnh/thành phố"
                        optionFilterProp="children"
                        style={{
                          width: 240,
                        }}
                        defaultValue={resetSelect}
                        onChange={onChange}
                        onClick={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {array.map((item) => (
                          <Option key={item.ProvinceID} value={item.ProvinceID}>
                            {item.ProvinceName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      className="mt-4"
                      name="district"
                      label="Quận / huyện"
                      rules={[
                        {
                          required: true,
                          message: "Quận/huyện không được trống!",
                        },
                      ]}
                    >
                      <Select
                        key={13}
                        combobox="true"
                        showSearch
                        placeholder="Quận/huyện"
                        optionFilterProp="children"
                        style={{
                          width: 240,
                        }}
                        onChange={onChangeDistricts}
                        onClick={onSearchDistricts}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {district?.map((item, index) => (
                          <Option key={index} value={item.DistrictID}>
                            {item.DistrictName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      className="mt-4"
                      name="ward"
                      label="Phường / xã"
                      rules={[
                        {
                          required: true,
                          message: "Phường/xã không được để trống!",
                        },
                      ]}
                    >
                      <Select
                        key={14}
                        combobox="true"
                        showSearch
                        placeholder="Phường/xã"
                        optionFilterProp="children"
                        style={{
                          width: 240,
                        }}
                        onChange={onChangeWards}
                        onClick={onSearchWards}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {Ward.map((item, index) => (
                          <Option key={index} value={item.WardCode}>
                            {item.WardName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                )}
                <label>
                  Tổng tiền <span className="text-danger fs-6">*</span>
                </label>
                <br />
                <Input
                  className="text-danger fw-bold"
                  style={{
                    width: 240,
                  }}
                  readOnly={true}
                  value={total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                  onChange={(e) => setTotal(e.target.value)}
                  defaultValue={0}
                />
              </div>
              <div className="col-6">
                <Button
                  onClick={showModal}
                  className="mt-4"
                  shape="round"
                  danger
                >
                  Tạo khách hàng
                </Button>
                <Form.Item
                  className="mt-4"
                  name="payment"
                  label="Hình thức thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Hình thức thanh toán không được để trống!",
                    },
                  ]}
                >
                  <Select placeholder="Hình thức thanh toán">
                    <Option value="Thanh toán tiền mặt">
                      Bằng tiền mặt
                    </Option>
                    <Option value="Thanh toán tài khoản ngân hàng">
                      Bằng tài khoản ngân hàng
                    </Option>
                    <Option value="Thanh toán tiền mặt và tài khoản ngân hàng">
                      Bằng tiền mặt và tài khoản ngân hàng
                    </Option>
                  </Select>
                </Form.Item>
                <div className="form-group">
                  <label>
                    Tên khách hàng <span className="text-danger fs-6">*</span>
                  </label>
                  <Input
                    required
                    onChange={(event) => onChangeValueUser(event)}
                    value={valueUser}
                    readOnly={checkValueUser == true}
                    placeholder="Tên khách hàng"
                  />
                </div>
                {show && (
                  <div>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Địa chỉ chi tiết không được trống!",
                        },
                        {
                          message: "Địa chỉ chi tiết không đúng định dạng!",
                          pattern: new RegExp("[wa-zA-Z0-9]"),
                        },
                      ]}
                      name="address"
                      className="mt-4"
                      label="Địa chỉ chi tiết"
                    >
                      <TextArea
                        showCount
                        maxLength={255}
                        placeholder={"Địa chỉ chi tiết"}
                        rows={9}
                      />
                    </Form.Item>
                    <label>
                      Phí ship <span className="text-danger fs-6">*</span>
                    </label>
                    <Input
                      style={{
                        width: 240,
                      }}
                      className="text-danger fw-bold"
                      readOnly={true}
                      value={shipping.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                      defaultValue={0}
                    />
                  </div>
                )}
              </div>
              <div className="col-12">
                <Form.Item
                  name="note"
                  className="mt-4"
                  label="Ghi chú đơn hàng"
                >
                  <TextArea
                    showCount
                    maxLength={255}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={"Ghi chú"}
                    rows={6}
                  />
                </Form.Item>
              </div>
            </div>
            <Form.Item className="text-center mt-4">
            <Button
                block
                shape="round"
                danger
                type="primary"
                htmlType="submit"
                style={{ width: "180px" }}
                onClick={() => handleCheckConfirm(true)}
              >
                Đặt hàng và thanh toán 
              </Button>
              <Button
                block
                shape="round"
                danger
               className="ms-2"
                htmlType="submit"
                style={{ width: "120px" }}
                onClick={() => handleCheckConfirm(false)}
              >
                Đặt hàng
              </Button>
              <Button
                block
                shape="round"
                className="ms-2"
                style={{ width: "120px" }}
                onClick={onReset}
              >
                Làm mới
              </Button>
            </Form.Item>
          </Form>
          <Modal
            title="Tạo khách hàng"
            open={open}
            onOk={handleOk}
            width={700}
            footer={null}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Form
              form={form}
              autoComplete="off"
              layout="vertical"
              onFinish={(values) => {
                handleOk(values);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <div className="row">
                <div className="col-6">
                  <Form.Item
                    className=""
                    name="username"
                    label="Tài khoản"
                    rules={[
                      {
                        required: true,
                        message: "Tài khoản khách hàng không được để trống",
                      },
                      { whitespace: true },
                      { min: 3, message: "Tài khoản từ 3 ký tự trở lên" },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Nhập tài khoản khách hàng" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                      {
                        required: true,
                        message: "Mật khẩu khách hàng không được để trống",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Nhập mật khẩu" type="password" />
                  </Form.Item>
                  <Form.Item
                    name="password2"
                    label="Xác nhận mật khẩu"
                    rules={[
                      {
                        required: true,
                        message: "Xác nhận mật khẩu không được để trống",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Xác nhận mật khẩu" type="password" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item
                    name="fullName"
                    label="Nhập họ và tên"
                    rules={[
                      {
                        required: true,
                        message: "Họ tên khách hàng không được để trống",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập họ tên khách hàng" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Email không được để trống",
                      },
                      {
                        type: "email",
                        message: "Email không đúng định dạng",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập email" type="email" />
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Số điện thoại khách hàng không được để trống",
                      },
                      {
                        pattern: `^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$`,
                        message:
                          "Số điện thoại khách hàng không đúng định dạng",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </div>
              </div>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      htmlType="submit"
                      shape="round"
                      danger
                      style={{ width: "100px", marginLeft: "250px" }}
                    >
                      Tạo mới
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button
                      shape="round"
                      onClick={handleCancel}
                      style={{ width: "80px", marginLeft: "-200px" }}
                    >
                      Huỷ
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>
          {/* <div className="row mt-3">
            <div className="col-6">
              <div className="search-container">
                <div className="search-inner">
                  <label>
                    {" "}
                    Số điện thoại khách hàng{" "}
                    <span className="text-danger fs-6">*</span>
                  </label>
                  <br />
                  <AutoComplete
                    style={{ width: 200 }}
                    onChange={(event) => onChangeSearchClient(event)}
                    options={dataClient}
                    value={phoneClient}
                    onSelect={(event) => onSelectAutoClient(event)}
                    placeholder="Nhập số điện thoại khách hàng"
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mt-3">
              <Button
                onClick={showModal}
                style={{ borderRadius: "10px" }}
                danger
              >
                Tạo khách hàng
              </Button>
              
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>
                  Thông tin người bán{" "}
                  <span className="text-danger fs-6">*</span>
                </label>
                <Input
                  readOnly={true}
                  value={userNameLogin}
                  placeholder="Hà Trung Kiên"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Tên khách hàng <span className="text-danger fs-6">*</span>
                </label>
                <Input
                  onChange={(e) => setValueUser(e.target.value)}
                  value={valueUser}
                  placeholder="Tên khách hàng"
                // type="number"
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>
                  Phương thức mua hàng{" "}
                  <span className="text-danger fs-6">*</span>
                </label>
                <br />
                <Select
                  key={1}
                  combobox="true"
                  placeholder="Hình thức mua hàng"
                  style={{
                    width: 240,
                  }}
                  value={typeOrder}
                  onChange={handleChangePayment}
                >
                  <Option key={"TẠI CỬA HÀNG"} value="TẠI CỬA HÀNG">
                    Tại cửa hàng
                  </Option>
                  <Option key={"TAI_NHA"} value="TAI_NHA">
                    Giao hàng tại nhà
                  </Option>
                </Select>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <label>Tỉnh/ Thành Phố</label>
              <Select
                key={2}
                combobox="true"
                disabled={
                  disableCountry === true
                    ? disableCountry
                    : dataCart?.length === 0
                }
                showSearch
                placeholder="Tỉnh/thành phố"
                optionFilterProp="children"
                style={{
                  width: 240,
                }}
                defaultValue={resetSelect}
                onChange={onChange}
                onClick={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {array.map((item) => (
                  <Option key={item.ProvinceID} value={item.ProvinceID}>
                    {item.ProvinceName}
                  </Option>
                ))}
              </Select>
              <div className="search-container mb-2">
                <div className="search-inner">
                  <label>Tên quận huyện</label>
                  <Select
                    key={3}
                    combobox="true"
                    showSearch
                    disabled={disableCountry || dataCart?.length === 0}
                    placeholder="Quận/huyện"
                    optionFilterProp="children"
                    style={{
                      width: 240,
                    }}
                    value={resetSelect}
                    onChange={onChangeDistricts}
                    onClick={onSearchDistricts}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {district?.map((item) => (
                      <Option key={item.DistrictID} value={item.DistrictID}>
                        {item.DistrictName}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="search-container">
                <div className="search-inner">
                  <label>Tên phường xã</label>
                  <Select
                    key={4}
                    combobox="true"
                    showSearch
                    placeholder="Phường/xã"
                    optionFilterProp="children"
                    style={{
                      width: 240,
                    }}
                    value={resetSelect}
                    onChange={onChangeWards}
                    onClick={onSearchWards}
                    disabled={disableCountry || dataCart?.length === 0}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {Ward.map((item) => (
                      <Option key={item.WardCode} value={item.WardCode}>
                        {item.WardName}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <br />
                <TextArea
                  value={addressDetail}
                  disabled={disableCountry || dataCart?.length === 0}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  rows={6}
                  placeholder={"Địa chỉ chi tiết"}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>
                  Tổng tiền <span className="text-danger fs-6">*</span>
                </label>
                <br />
                <Input
                  className="text-danger fw-bold"
                  style={{
                    width: 240,
                  }}
                  readOnly={true}
                  value={total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                  onChange={(e) => setTotal(e.target.value)}
                  defaultValue={0}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Phí ship <span className="text-danger fs-6">*</span>
                </label>
                <Input
                  style={{
                    width: 240,
                  }}
                  className="text-danger fw-bold"
                  readOnly={true}
                  value={shipping.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                  defaultValue={0}
                />
              </div>
            </div>
          </div> */}
          {/* <div className="row mt-3">
            <div className="form-group">
              <br />
              <TextArea
                rows={6}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={"Ghi chú"}
              />
            </div>
          </div> */}
        </div>

        <div className="col-7">
          <div className="title">
            <h3 className="text-danger">Giỏ hàng</h3>
            <Table
              rowKey={(record) => record.id}
              dataSource={gh}
              columns={columns}
              pagination={{ position: ["none", "none"] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderAdmin;
