import { Card, Checkbox, Col, Radio, Row, Select, Space, Tooltip } from "antd";
import { useState, useEffect } from "react";
import qs from "qs";
import axios from "axios";
import product1 from "../../asset/images/products/product01.png";
import { elements } from "chart.js";
import { addToCart, viewProduct } from "../../store/Actions";
import { useContext } from "react";
import Context from "../../store/Context";
import { ToastContainer, toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./css/find.css";

const Find = () => {
  // click product
  const handelCLickProduct = (product) => {
    dispatch(viewProduct(product));
    console.log("state", state);
  };

  // add to cart
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
  const [state, dispatch] = useContext(Context);
  const handleAddToCart = (product) => {
    const findCart = (
      JSON.parse(localStorage.getItem("carts"))
        ? JSON.parse(localStorage.getItem("carts"))
        : []
    ).find((value) => {
      return value.id === product.id;
    });
    console.log("findCart", findCart);
    if (findCart != null) {
      let totalQuantity = parseInt(findCart.quantity);
      if (totalQuantity < 4) {
        dispatch(addToCart(product));
        notifySuccess("Thêm vào giỏ hàng thành công!");
      } else {
        notifyError(
          "Đã tồn tại " +
            findCart.quantity +
            " sản phẩm đã chọn trong giỏ hàng! Không được mua quá 4 sản phẩm cùng loại. Liên hệ cửa hàng để đặt mua số lượng lớn"
        );
      }
    } else {
      let totalProductInCart = (
        JSON.parse(localStorage.getItem("carts"))
          ? JSON.parse(localStorage.getItem("carts"))
          : []
      ).length;
      console.log("totalProductInCart", totalProductInCart);
      if (totalProductInCart < 10) {
        dispatch(addToCart(product));
        notifySuccess("Thêm vào giỏ hàng thành công!");
      } else {
        notifyError(
          "Đã tồn tại 10 sản phẩm khác nhau trong giỏ hàng! Liên hệ cửa hàng để đặt mua số lượng lớn"
        );
      }
    }
  };
  const handleClickAddToCart = (product) => {
    handleAddToCart(product);
  };
  var pro = JSON.parse(localStorage.getItem("productFilter"))
    ? JSON.parse(localStorage.getItem("productFilter"))
    : [];
  const [dataProducts, setDataProducts] = useState(pro);
  const [dataProductsFind1, setDataProductsFind1] = useState(dataProducts);
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
  const getDataProducts = () => {
    axios
      .get(
        `http://localhost:8080/api/products/getAllProAccess` +
          `?${qs.stringify(getRandomuserParams(tableParams))}`
      )
      // .then((res) => res.json())
      .then((results) => {
        setDataProducts(results.data.data.data);
        //hienLT();
        setDataProductsFind(results.data.data.data);
        setDataProductsFind1(results.data.data.data);
        // setTableParams({
        //     pagination: {
        //         current: results.data.current_page,
        //         pageSize: 12,
        //         total: results.data.total,
        //     },
        // });
      });
  };

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchStatus: params.pagination?.searchStatus,
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      searchStatus: "ACTIVE",
    },
  });
  const getRandomuserParamsAccessories = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
  });
  const [tableParamsAccessories, setTableParamsAccessories] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
    },
  });
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
  const loadDataWin = () => {
    fetch(`http://localhost:8080/api/wins/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataWin(re);
      });
  };

  const loadDataColor = () => {
    fetch(
      `http://localhost:8080/api/colors?${qs.stringify(
        getRandomuserParamsAccessories(tableParamsAccessories)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataColor(re);
      });
  };

  const loadDataBattery = () => {
    fetch(`http://localhost:8080/api/batteryCharger/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setBattery(re);
      });
  };

  const loadDataAccessor = () => {
    fetch(`http://localhost:8080/api/accessory/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataAccessory(re);
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

  const loadDataOrigin = () => {
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParamsAccessories(tableParamsAccessories)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataOrigin(re);

        setTableParamsAccessories({
          pagination: {
            current: results.data.current_page,
            pageSize: 100,
            total: results.data.total,
          },
        });
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
    var arr1 = document.getElementsByClassName("thuonghieu")[0].children;
    var thuonghieuchon_arr = [];
    for (var i = 0; i < arr1.length; i++) {
      if (thuonghieuAll[0].control.checked == true) {
        arr1[i].control.checked = false;
        console.log("checkallTrue");
      } else {
        console.log("checkallFalse", arr1[i].control);
        if (arr1[i].control.checked == true)
          thuonghieuchon_arr.push(arr1[i].control.value);
      }
    }

    //chon cac khoang gia nao => giaban_arr
    var arr2 = document.getElementsByClassName("giaban")[0].children;
    var giaban_arr = [];
    for (var i = 0; i < arr2.length; i++) {
      if (giabanAll[0].control.checked == true) {
        arr2[i].control.checked = false;
      } else {
        if (arr2[i].control.checked == true)
          giaban_arr.push(arr2[i].control.value);
      }
    }
    //chon cac man hinh nao => manhinh_arr
    var arr3 = document.getElementsByClassName("manhinh")[0].children;
    var manhinh_arr = [];
    for (var i = 0; i < arr3.length; i++) {
      if (manhinhAll[0].control.checked == true) {
        arr3[i].control.checked = false;
      } else {
        if (arr3[i].control.checked == true)
          manhinh_arr.push(arr3[i].control.value);
      }
    }
    //chon cac cpu nao => cpu_arr
    var arr4 = document.getElementsByClassName("cpu")[0].children;
    var cpu_arr = [];
    for (var i = 0; i < arr4.length; i++) {
      if (cpuAll[0].control.checked == true) {
        arr4[i].control.checked = false;
      } else {
        if (arr4[i].control.checked == true)
          cpu_arr.push(arr4[i].control.value);
      }
    }
    //chon cac ram nao => ram_arr
    var arr5 = document.getElementsByClassName("ram")[0].children;
    var ram_arr = [];
    for (var i = 0; i < arr5.length; i++) {
      if (ramAll[0].control.checked == true) {
        arr5[i].control.checked = false;
      } else {
        if (arr5[i].control.checked == true)
          ram_arr.push(arr5[i].control.value);
      }
    }
    //chon cac card nao => card_arr
    var arr6 = document.getElementsByClassName("cardDohoa")[0].children;
    var card_arr = [];
    for (var i = 0; i < arr6.length; i++) {
      if (cardAll[0].control.checked == true) {
        arr6[i].control.checked = false;
      } else {
        if (arr6[i].control.checked == true)
          card_arr.push(arr6[i].control.value);
      }
    }
    //chon cac o cung nao => storage_arr
    var arr7 = document.getElementsByClassName("ocung")[0].children;
    var storage_arr = [];
    for (var i = 0; i < arr7.length; i++) {
      if (ocungAll[0].control.checked == true) {
        arr7[i].control.checked = false;
      } else {
        if (arr7[i].control.checked == true)
          storage_arr.push(arr7[i].control.value);
      }
    }
    //chon cac nhu cau nao => category_arr
    var arr8 = document.getElementsByClassName("category")[0].children;
    var category_arr = [];
    for (var i = 0; i < arr8.length; i++) {
      if (categoryAll[0].control.checked == true) {
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

  useEffect(() => {
    getDataProducts();
  }, []);
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
  return (
    <>
      <div className="container">
        <ToastContainer />
        <div className="row">
          <div className="col-3">
            <Card
              className="mt-2"
              title="Hãng sản xuất"
              style={{
                width: 300,
              }}
              type="inner"
            >
              {/* <Checkbox.Group
                            style={{
                                width: '100%',
                            }}
                            onChange={chonLaptop}
                        >
                            <Row>
                            <Col span={12}>
                              <Checkbox className="thuonghieuAll" value={0}>Tất cả</Checkbox>
                            </Col>
                                {dataManufacture ? dataManufacture.map(item => (
                                    <Col span={12}>
                                        <Checkbox className="thuonghieu" checked="" value={item.id}>{item.name}</Checkbox>
                                    </Col>
                                )) : ""}
                            </Row>
                        </Checkbox.Group> */}
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
                width: 300,
              }}
              type="inner"
            >
              {/* <Checkbox.Group onChange={chonLaptop}>
                        <Row>
                            <Col span={12}>
                              <Checkbox className="giaban" value={0}>Tất cả</Checkbox>
                            </Col>
                            <Col span={12}>
                              <Checkbox className="giaban" value={1}>Dưới 10 triệu</Checkbox>
                            </Col>
                            <Col span={12}>
                              <Checkbox className="giaban" value={2}>Từ 10-15 Triệu</Checkbox>
                            </Col>
                            <Col span={12}>
                              <Checkbox className="giaban" value={3}>Từ 15-20 triệu</Checkbox>
                            </Col>
                            <Col span={12}>
                              <Checkbox className="giaban" value={4}>Trên 20 triệu</Checkbox>
                            </Col>
                          </Row>
                        </Checkbox.Group> */}
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
                width: 300,
              }}
              type="inner"
            >
              {/* <Checkbox.Group onChange={chonLaptop}>
                          <Row>
                              <Col span={12}>
                                <Checkbox className="manhinh" value={0}>Tất cả</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="manhinh" value={1}>Khoảng 13 inch</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="manhinh" value={2}>Khoảng 14 inch</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="manhinh" value={3}>Khoảng trên 15 inch</Checkbox>
                              </Col>
                          </Row>
                        </Checkbox.Group> */}
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
                width: 300,
              }}
              type="inner"
            >
              {/* <Checkbox.Group onChange={chonLaptop}>
                          <Row>
                              <Col span={12}>
                                <Checkbox className="cpu" value={0}>Tất cả</Checkbox>
                              </Col>
                              {processorsFilter ? processorsFilter.map(item => (
                                    <Col span={12}>
                                        <Checkbox className="cpu" value={item.cpuCompany.trim() +" " +item.cpuTechnology.trim()}>{item.cpuCompany.trim() +" " +item.cpuTechnology.trim()}</Checkbox>
                                    </Col>
                                )) : ""}
                          </Row>
                        </Checkbox.Group> */}
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
                width: 300,
              }}
              type="inner"
            >
              {/* <Checkbox.Group onChange={chonLaptop}>
                          <Row>
                              <Col span={12}>
                                <Checkbox className="ram" value={0}>Tất cả</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="ram" value={1}>4 gb</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="ram" value={2}>8 gb</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="ram" value={3}>16 gb</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="ram" value={4}>32 gb</Checkbox>
                              </Col>
                          </Row>
                        </Checkbox.Group> */}
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
                width: 300,
              }}
              type="inner"
            >
              {/* <Checkbox.Group onChange={chonLaptop}>
                          <Row>
                              <Col span={12}>
                                <Checkbox className="cardDohoa" value={0}>Tất cả</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="cardDohoa" value={1}>Nvidia geforce series</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="cardDohoa" value={2}>Amd radeon series</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="cardDohoa" value={3}>Intel series</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="cardDohoa" value={4}>Apple series</Checkbox>
                              </Col>
                          </Row>
                        </Checkbox.Group> */}
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
                width: 300,
              }}
              type="inner"
            >
              {/* <Checkbox.Group onChange={chonLaptop}>
                          <Row>
                              <Col span={12}>
                                <Checkbox className="ocung" value={0}>Tất cả</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="ocung" value={1}>Ssd 1 tb</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="ocung" value={2}>Ssd 512 gb</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="ocung" value={3}>Ssd 256 gb</Checkbox>
                              </Col>
                              <Col span={12}>
                                <Checkbox className="ocung" value={4}>Ssd 128 gb</Checkbox>
                              </Col>
                          </Row>
                        </Checkbox.Group> */}
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
                width: 300,
              }}
              type="inner"
            >
              {/* <Checkbox.Group onChange={chonLaptop}>
                          <Row>
                              <Col span={12}>
                                <Checkbox className="category" value={0}>Tất cả</Checkbox>
                              </Col>
                              {category ? category.map(item => (
                                    <Col span={12}>
                                        <Checkbox className="category" value={item.name.trim()}>{item.name.trim()}</Checkbox>
                                    </Col>
                                )) : ""}
                          </Row>
                        </Checkbox.Group> */}
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
            <div className="row" style={{ marginTop: "20px" }}>
              <h3 style={{ fontWeight: 700 }}>LAPTOP</h3>
              <a className="text-secondary">
                ({dataProductsFind ? dataProductsFind.length : 0} sản phẩm)
              </a>
              <hr></hr>
              <>
                <Swiper
                  slidesPerView={6}
                  spaceBetween={10}
                  freeMode={true}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[FreeMode, Pagination]}
                  className="mySwiper"
                >
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("Macbook")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/1/4/637769104385571970_Macbook-Apple@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("Asus")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/11/22/637732077455069770_Asus@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("HP")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/7/15/637619564183327279_HP@2x.png"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("Lenovo")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340494668267616_Lenovo@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("MSI")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340493755614653_MSI@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a
                      href="#"
                      onClick={() => onClickThuongHieuImg("Gigabyte")}
                    >
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/9/16/637674058450623615_Gigabyte@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("Dell")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340494666861275_Dell@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("Acer")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340494666704995_Acer@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("LG")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/14/637987475787766575_LG.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a
                      href="#"
                      onClick={() => onClickThuongHieuImg("Microsoft")}
                    >
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/1/13/637461259692529909_Microsoft@2x.png"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("Chuwi")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/12/11/637748124762643705_Chuwi@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide className="bg-image hover-zoom">
                    <a href="#" onClick={() => onClickThuongHieuImg("Masstel")}>
                      <img
                        className="w-100"
                        width={150}
                        src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340491898901930_Masstel@2x.jpg"
                      />
                    </a>
                  </SwiperSlide>
                </Swiper>
              </>
            </div>
            <div className="row" style={{ margin: "50px 0px" }}>
              <h3 style={{ fontWeight: 700 }}>LAPTOP THEO YÊU CẦU</h3>
              <div className="d-flex justify-content-between">
                <div className="col-2" style={{ textAlign: "center" }}>
                  <div className="categoryFind">
                    <a href="#" onClick={() => onClickCategoryImg("Gaming")}>
                      <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/19/637991744177742277_img-gaming.png" />
                      <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>
                        Gaming
                      </h6>
                    </a>
                  </div>
                </div>
                <div className="col-2" style={{ textAlign: "center" }}>
                  <div className="categoryFind">
                    <a
                      href="#"
                      onClick={() =>
                        onClickCategoryImg("Sinh viên - Văn phòng")
                      }
                    >
                      <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/6/637980583313032986_SV-Văn phòng.png" />
                      <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>
                        Sinh viên - Văn phòng
                      </h6>
                    </a>
                  </div>
                </div>
                <div className="col-2" style={{ textAlign: "center" }}>
                  <div className="categoryFind">
                    <a
                      href="#"
                      onClick={() => onClickCategoryImg("Thiết kế đồ họa")}
                    >
                      <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/19/637991745714018004_img-thietkedohoa.png" />
                      <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>
                        Thiết kế đồ họa
                      </h6>
                    </a>
                  </div>
                </div>
                <div className="col-2" style={{ textAlign: "center" }}>
                  <div className="categoryFind">
                    <a href="#" onClick={() => onClickCategoryImg("Mỏng nhẹ")}>
                      <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/19/637991744678844250_img-mongnhe.png" />
                      <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>
                        Mỏng nhẹ
                      </h6>
                    </a>
                  </div>
                </div>
                <div className="col-2" style={{ textAlign: "center" }}>
                  <div className="categoryFind">
                    <a
                      href="#"
                      onClick={() => onClickCategoryImg("Doanh nhân")}
                    >
                      <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/19/637991745141508369_img-doanhnhan.png" />
                      <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>
                        Doanh nhân
                      </h6>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {dataProductsFind
                ? dataProductsFind.map((item) => (
                    <div className="col-md-3 col-xs-6" key={item.id}>
                      <div className="product">
                        <div className="product-img">
                          <img
                            src={item.images ? item.images[0]?.name : product1}
                            alt=""
                          />
                          <div className="product-label">
                            {item.discount ? (
                              <span className="sale">
                                {item.discount.ratio}%
                              </span>
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
                          <h3
                            className="product-name"
                            onClick={() => handelCLickProduct(item)}
                          >
                            <a href="/user/product">{item.name}</a>
                          </h3>
                          <h4 className="product-price">
                            {formatCash(item.price + "")} VNĐ{" "}
                            {item.discount ? (
                              <del className="product-old-price">
                                {formatCash(
                                  item.price /
                                    ((100 - item.discount.ratio) / 100) +
                                    ""
                                )}{" "}
                                VNĐ
                              </del>
                            ) : (
                              ""
                            )}
                          </h4>
                          <div className="text-secondary">
                            <div>
                              <Tooltip placement="top" title={"Màn hình"}>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nM3SsQkCURCE4Q9MxcAOtAEDQ4PrxshM8ELrMDJ4mJjcVWAN1mAlsmCggrh3B+LAvGjfvzvL8g9qcOjpJgBlQPPSFbDAEqM+gAo3nLpOUOGMHWaYZgErHLHH5ENNeQdExvWjY43xl+nKMyAWc8E18TEVIaMST4t5T7cBiKxD/KJt4nw3qXA/0x0FTCzDM8S0ngAAAABJRU5ErkJggg==" />
                                {item.screen?.size.trim() + " "}
                              </Tooltip>
                              <Tooltip placement="top" title={"CPU"}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-cpu-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                                  <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z" />
                                </svg>
                                {item.processor?.cpuTechnology.trim()}
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip placement="top" title={"Ram"}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-memory"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M1 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707-.293l.353-.353a.5.5 0 0 1 .708 0l.353.353a1 1 0 0 0 .707.293H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1Zm.5 1h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm5 0h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm4.5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4ZM2 10v2H1v-2h1Zm2 0v2H3v-2h1Zm2 0v2H5v-2h1Zm3 0v2H8v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Z" />
                                </svg>
                                {item.ram?.ramCapacity.trim()}
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip placement="top" title={"Ổ cứng"}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-hdd-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z" />
                                </svg>
                                {item.storage?.storageDetail.storageType.name.trim() +
                                  " " +
                                  item.storage?.storageDetail.capacity.trim()}
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip placement="top" title={"Đồ họa"}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-gpu-card"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                                  <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .5.5V4h13.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2v2.5a.5.5 0 0 1-1 0V2H.5a.5.5 0 0 1-.5-.5Zm5.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
                                  <path d="M3 12.5h3.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-1Zm4 1v-1h4v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5Z" />
                                </svg>
                                {item.card?.trandemark.trim() +
                                  " " +
                                  item.card?.model.trim() +
                                  " " +
                                  item.card?.memory.trim()}
                              </Tooltip>
                            </div>
                            <div>
                              <Tooltip placement="top" title={"Trọng lượng"}>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAp0lEQVR4nI3RzQpBURQF4G/AlAcwkWtAGZkoI8UTKCaS8jPGCJObdyBv5n106qR7L1dW7TqnvdbZa6/DJ6rYYoOKP3BAgjb2v4hNtHCLgiSeW7GXwwApZiWVRs4bR9R/TK8V7YUXAjrolojSb5cxdpjijCv6RUFYbpERPNHAA3NMYi9wAtcyk0IPQ6xjvHeMMikGbt5bBmHaKn5kznqZoHTxC05/1uUF3gwbVU0GVYUAAAAASUVORK5CYII=" />
                                {item.weight + " kg"}
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                        <div className="add-to-cart">
                          {item.quantity > 0 ? (
                            <button
                              className="add-to-cart-btn"
                              onClick={() => handleClickAddToCart(item)}
                            >
                              {" "}
                              Thêm vào giỏ hàng
                            </button>
                          ) : (
                            <h6 className="text-white fw-bold">SẢN PHẨM HẾT HÀNG</h6>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                : "Không có sản phẩm"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Find;
