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
  Statistic,
  Tag,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import "toastr/build/toastr.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Moment from "react-moment";
import Clock from "./Clock";
const { Option } = Select;
const { RangePicker } = DatePicker;
const url = "http://localhost:8080/api/auth/discount";
const urlStaff = "http://localhost:8080/api/staff/discount";
const urlAdmin = "http://localhost:8080/api/admin/discount";
const url_Pro = "http://localhost:8080/api/products";
const { Countdown } = Statistic;
import CurrencyFormat from "react-currency-format";

export function compareTime(endDate) {
  const now = new Date();
  if (new Date(endDate) > now) {
    return "ACTIVE";
  }
  return "INACTIVE";
}

const Discount = () => {
  const [data, setData] = useState([
    {
      id: "",
      name: "",
      ratio: null,
      startDate: getDateTime(),
      endDate: getDateTime(),
      status: "ACTIVE",
    },
  ]);
  const [formDefault, setValuesDefault] = useState({
    id: "",
    name: "",
    ratio: null,
    startDate: getDateTime(),
    endDate: getDateTime(),
    status: "ACTIVE",
  });
  const [form, setValues] = useState({
    id: "",
    name: "",
    ratio: null,
    startDate: getDateTime(),
    endDate: getDateTime(),
    status: "ACTIVE",
  });
  const [totalSet, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [isViewCancel, setViewCancel] = useState(false);
  const [isAdd, setAdd] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchStartDate, setSearchStartDate] = useState(getDateTime());
  const [searchEndDate, setSearchEndDate] = useState(getDateTime());
  const [dataProduct, setDataProduct] = useState([]);
  const [timerDays, setTimerDays] = useState();
  const [timerHours, setTimerHours] = useState();
  const [timerMinutes, setTimerMinutes] = useState();
  const [timerSeconds, setTimerSeconds] = useState();
  const [dataDiscount, setDataDiscount] = useState();
  const [checked, setChecked] = useState([]);
  const [trueProDiscount, setTrueProDiscount] = useState(false); //dk interval
  const onFinishTime = () => {
    console.log("finished!");
  };

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

  function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    if (second.toString().length == 1) {
      second = "0" + second;
    }
    var dateTime =
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return dateTime;
  }

  function disabledDate(current) {
    return current && current > moment().startOf("day");
  }
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchStartDate: params.pagination?.searchStartDate,
    searchEndDate: params.pagination?.searchEndDate,
  });
  const getRandomProductParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchProductKey: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
    searchPrice: params.pagination?.search3,
    searchPn: params.pagination?.search4,
    searchImei: params.pagination?.search5,
  });
  //phân trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      searchStartDate: "",
      searchEndDate: "",
    },
  });

  const [tableParamsPro, setTableParamsPro] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      searchStartDate: "",
      searchEndDate: "",
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
    },
  });



  const [dateTimer, setDateTimer] = useState([]);
  // Call API product
  const loadProduct = () => {
    fetch(
      `http://localhost:8080/api/products/allProDiscount?${qs.stringify(
        getRandomProductParams(tableParamsPro)
      )}`,
      // {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //   },
      // }
    )
      .then((res) => res.json())
      .then((res) => {
      setDataProduct(res.data.data);
      console.log("res.data.data",res.data.data)
      var listTime=[];
      res.data.data.forEach((pro)=>{
        if(pro.discount!==null){
          if(new Date(pro.discount.endDate).getTime()>=new Date().getTime()){
            var totalTime=(new Date(pro.discount.endDate).getTime()- new Date().getTime())/(1000)
            console.log("totalTime",Math.ceil(totalTime))
            if(listTime.includes(Math.ceil(totalTime))==false){
              listTime.push(Math.ceil(totalTime));
            }
          }
        }
        if(listTime!=[]){
          console.log("giây",listTime);
          setDateTimer(listTime);
          setTrueProDiscount(true);
        }
      })
    });
  }
  if (trueProDiscount) {
    if (dateTimer != []) {
      var listProDiscount = [];
      setTrueProDiscount(false);
      //loadProduct();
      console.log("dataProduct", dataProduct);
      dataProduct?.forEach((pro) => {
        if (pro.discount !== null) {
          console.log("for noDiscount");
          listProDiscount.push(pro);
        }
      });

      dateTimer.forEach((time) => {
        //clearInterval(myTimer);
        var myTimer = setInterval(() => {
          time--;
          if (time == 0) {
            //clearInterval(myTimer);
            console.log("dataProduct3", dataProduct);
            if (dataProduct !== []) {
              if (listProDiscount != []) {
                console.log("api noDiscount", dataProduct);
                //setTrueProDiscount(false);
                //clearInterval(myTimer);
                dataProduct.forEach((pro) => {
                  if (pro.discount != null) {
                    console.log("pro.discount!=null");
                    if (
                      new Date(pro.discount.endDate).getTime() <=
                      new Date().getTime()
                    ) {
                      console.log("trong api noDiscount", pro);
                      axios
                        .put(
                          url_Pro +
                            "/noDiscountProduct/" +
                            pro.discount?.id +
                            "/" +
                            pro.id,
                          {
                            headers: {
                              Authorization:
                                "Bearer " + localStorage.getItem("token"),
                            },
                          }
                        )
                        .then((res) => {
                          console.log("shownoDiscount", res.data.data);
                          listProDiscount = listProDiscount.filter(
                            (p) => p.id !== pro.id
                          );
                          setTrueProDiscount(false);
                          time--;
                          clearInterval(myTimer);
                          var listProductNoDiscount = dataProduct.filter(
                            (p) => p.id !== res.data.data.id
                          );
                          setDataProduct(listProductNoDiscount);
                          getData();
                        });
                    }
                  }
                });
                //setTrueProDiscount(false);
                getData();
              } else {
                getData();
              }
            } else {
              clearInterval(myTimer);
              setTrueProDiscount(false);
              getData();
            }
          }
        }, 1000);
      });
    }
  }

  // Call API product & view
  // const handAPIProduct = () => {
  //   setView(true);
  // }

  // Get product by discount
  const showDataProduct = (id) => {
    console.log(id);
    axios
      .get(urlStaff + "/" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("showDataProduct", res.data.data);
        setDataDiscount(res.data.data);
      });
    // handAPIProduct();
    setView(true);
  };
  const showDataProductCancel = () => {
    setViewCancel(true);
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (name) => `${name}`,
      width: "30%",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      render(startDate) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{startDate}</Moment>;
      },
      width: "20%",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      render(endDate) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{endDate}</Moment>;
      },
      width: "20%",
    },
    {
      title: "Tỉ lệ (%)",
      dataIndex: "ratio",
      sorter: (a, b) => a.ratio - b.ratio,
      render: (ratio) => `${ratio}`,
      width: "10%",
    },
    // {
    //   title: "Time",
    //   dataIndex: "endDate",
    //   render(endDate) {
    //     return (
    //       <Clock
    //         timerDays={timerDays}
    //         timerHours={timerHours}
    //         timerMinutes={timerMinutes}
    //         timerSeconds={timerSeconds}
    //       />
    //     );
    //   },
    //   width: "10%",
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "25%",
      render: (status) => {
        return (
          <>
            {status == "ACTIVE" && (
              <Tag
               
                className="pt-1 pb-1  text-center"
                color="#389e0d"
                style={{ width: "100%" }}
              >
                Hoạt động
              </Tag>
            )}
            {status == "INACTIVE" && (
              <Tag
               
                className="pt-1 pb-1 text-center"
                color="#f50"
                style={{ width: "100%" }}
              >
                Không hoạt động
              </Tag>
            )}
            {status == "DRAFT" && (
              <Tag
               
                className="pt-1 pb-1 text-center"
                color="#2db7f5"
                style={{ width: "100%" }}
              >
                Nháp
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      width: "10%",
      render: (id, data) => {
        if (data.status == "DRAFT") {
          return (
            <>
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalEdit(id);
                }}
              />
              <DeleteOutlined
                onClick={() => onDelete(id)}
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          );
        } else if (data.status == "ACTIVE" || data.status == "INACTIVE") {
          return (
            <>
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalEdit(id);
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
      width: "20%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <Button
                type="danger"
                shape="round"
               
                onClick={() => {
                  showDataProduct(id);
                }}
              >
                Áp dụng
              </Button>
            </>
          );
        }
      },
    },
  ];

  //APILoadList
  const getData = () => {
    setLoading(true);
    axios
      .get(url + `?${qs.stringify(getRandomuserParams(tableParams))}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      // .then((res) => res.json())
      .then((results) => {
        if (results.data.data.data != null) {
          results.data.data.data.forEach((x) => {
            x.status = x.status === "DRAFT" ? x.status : compareTime(x.endDate);
          });
          setData(results.data.data.data);
          setTotal(results.data.data.total);
          setLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: totalSet,
            },
          });
          var listTime = [];
          results.data.data.data.forEach((discount) => {
            if (new Date(discount.endDate).getTime() >= new Date().getTime()) {
              var totalTime =
                (new Date(discount.endDate).getTime() - new Date().getTime()) /
                1000;
              if (listTime.includes(Math.ceil(totalTime)) == false) {
                listTime.push(Math.ceil(totalTime));
              }
            }
          });

          // fetch(
          //   `http://localhost:8080/api/products/allProDiscount?${qs.stringify(
          //     getRandomProductParams(tableParamsPro)
          //   )}`,
          //   {
          //     headers: {
          //       "Content-Type": "application/json",
          //       Authorization: "Bearer " + localStorage.getItem("token"),
          //     },
          //   }
          // )
          //   .then((res) => res.json())
          //   .then((results) => {
          //     if (listTime != []) {
          //       setDataProduct(results.data.data);
          //       setDateTimer(listTime);
          //       setTrueProDiscount(true);
          //       setTableParams({
          //       pagination: {
          //         current: results.data.current_page,
          //         pageSize: 10,
          //         total: results.data.total,
          //       },
          //     });
          //     }
          //     setDataProduct(results.data.data);
          //     setLoading(false);
          //     setTableParams({
          //       pagination: {
          //         current: results.data.current_page,
          //         pageSize: 10,
          //         total: results.data.total,
          //       },
          //     });
          //   });

          axios.get(url_Pro + "/allProDiscount"+`?${qs.stringify(getRandomProductParams(tableParamsPro))}`)
          .then((res) => {
            if (listTime != []) {
              console.log("res.data.data.data",res.data.data.data);
              setDataProduct(res.data.data.data);
              console.log("giây", listTime);
              setDateTimer(listTime);
              setTrueProDiscount(true);
            }
          });
        }
      });
  };

  useEffect(() => {
    // startTimer();
  });

  //LoadList
  useEffect(() => {
    getData();

    // loadProduct();
  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    loadProduct();
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const showModalAdd = () => {
    setAdd(true);
  };
  //loadFormEdit
  const showModalEdit = (id) => {
    var haveDiscount = false;
    dataProduct?.forEach((pro) => {
      if (pro?.discount?.id === id) {
        console.log("have Discount");
        haveDiscount = true;
      }
    });
    if (haveDiscount) {
      notifyError("Mã giảm giá đang được áp dụng, không thể sửa");
    } else {
      axios
        .get(urlStaff + "/" + id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setValues(res.data.data);
        });
      setEditing(true);
    }
  };

  const draft = () => {
    axios
      .post(urlStaff + "/draft", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        notifySuccess("Lưu bản nháp thành công!");
        setAdd(false);
        getData();
        setValues(formDefault);
        console.log(res.data);
      });
  };

  //btn Add
  const handleAdd = (e) => {
    // thời gian giảm giá không quá 3 tháng-Ducnt
    const currency = new Date().getTime();
    const start = new Date(form.startDate).getTime();
    const end = new Date(form.endDate).getTime();
    console.log(start + " - " + end);
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + 90);
    console.log("thời gian sau 3 tháng: ", currentDate);
    //
    if (form.name == null || form.name == "") {
      notifyError("Tiêu đề giảm giá không được để trống!");
    } else if (form.ratio == null) {
      notifyError("Tỉ lệ không được để trống!");
    } else if (form.ratio <= 0 || form.ratio > 60) {
      notifyError("Tỉ lệ phải lớn hơn 0 và nhỏ hơn hoặc bằng 60 %!");
    } else if (form.startDate == null || form.endDate == null) {
      notifyError("Thời gian giảm giá không được để trống!");
    } else if (end <= start) {
      notifyError("Thời gian kết thúc phải lớn hơn thời gian bắt đầu !");
    } else if (start < currency) {
      notifyError("Thời gian bắt đầu phải lớn hơn thời gian hiện tại !");
    } else if (end > currentDate) {
      notifyError("Thời gian giảm giá không vượt quá 3 tháng !");
    } else {
      e.preventDefault();
      axios
        .post(urlStaff, form, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          notifySuccess("Tạo giảm giá sản phẩm thành công");
          setAdd(false);
          getData();
          setValues(formDefault);
          console.log(res.data);
        })
        .catch((error) => {
          notifyError("Tạo giảm giá không thành công!");
          return;
        });
    }
  };

  //btn Edit
  const handleEdit = (e) => {
    const start = new Date(form.startDate).getTime();
    const end = new Date(form.endDate).getTime();
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + 90);
    const currency = new Date().getTime();

    if (form.name == null || form.name == "") {
      notifyError("Tiêu đề giảm giá không được để trống!");
    } else if (form.ratio == null) {
      notifyError("Tỉ lệ không được để trống!");
    } else if (form.ratio <= 0 || form.ratio > 60) {
      notifyError("Tỉ lệ phải lớn hơn 0 và nhỏ hơn hoặc bằng 60 %!");
    } else if (form.startDate == null || form.endDate == null) {
      notifyError("Thời gian giảm giá không được để trống!");
    } else if (end <= start) {
      notifyError("Thời gian kết thúc phải lớn hơn thời gian bắt đầu !");
    } else if (start < currency) {
      notifyError("Thời gian bắt đầu phải lớn hơn thời gian hiện tại !");
    } else if (end > currentDate) {
      notifyError("Thời gian giảm giá không vượt quá 3 tháng !");
    } else {
      e.preventDefault();
      axios
        .put(urlStaff + "/" + form.id, form, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          notifySuccess("Sửa bản ghi thành công");
          getData();
          setEditing(false);
          setValues(formDefault);
          console.log(res.data);
          loadProduct();
        })
        .catch((error) => {
          notifyError("Sửa bản ghi thất bại!");
          return;
        });
    }
  };

  //Delete
  const onDelete = (id) => {
    Modal.confirm({
      title: "Xoá giảm giá",
      content: "Bạn có muốn xoá bản ghi này không?",
      okText: "Có",
      cancelText: "Không",
      onOk() {
        axios
          .delete(urlAdmin + "/" + id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            notifySuccess("Xóa bản ghi thành công!");
            getData();
            console.log(res.data);
          })
          .catch((errorMessage) => {
            notifyError("Chỉ xóa bản nháp!");
            return;
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //OnChange Form
  const handle = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDate = (val, dateStrings) => {
    console.log("dữ liệu update thời gian");
    setValues({
      ...form,
      startDate: dateStrings[0],
      endDate: dateStrings[1] != "" ? dateStrings[1] : dateStrings[0],
    });
  };
  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
  };
  const onchangeSearch = (val, dateStrings) => {
    setSearchStartDate(dateStrings[0]);
    setSearchEndDate(dateStrings[1]);
  };

  //Calendar
  const setDates = (val, dateStrings) => {
    console.log(dateStrings);
    if (dateStrings[0] != null)
      setValues({
        ...form,
        startDate: dateStrings[0],
      });
    if (dateStrings[1] != null && dateStrings[1] != ""){
      console.log('vào set end date');
      setValues({
        ...form,
        endDate: dateStrings[1],
      });
    }
      
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setAdd(false);
    setEditing(false);
    setValues(formDefault);
    setView(false);
    setViewCancel(false);
  };

  //search
  const search = () => {
    tableParams.pagination.searchStartDate = searchStartDate;
    tableParams.pagination.searchEndDate = searchEndDate;
    tableParams.pagination.current = 1;
    tableParams.pagination.pageSize = 10;
    setLoading(true);
    axios
      .get(url + `?${qs.stringify(getRandomuserParams(tableParams))}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      // .then((res) => res.json())
      .then((results) => {
        setData(results.data.data.data);
        setTotal(results.data.data.total);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          },
        });
      });
  };
  //check all
  const [isCheckedAll, setIsCheckedAll] = useState(true);
  function handleCheckAll(check) {
    if (isCheckedAll) {
      console.log("checkedAll");
      const checkboxes = document.querySelectorAll('input[name="ck"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
      setIsCheckedAll(false);
    } else {
      console.log("not checkedAll");
      const checkboxes = document.querySelectorAll('input[name="ck"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      setIsCheckedAll(true);
    }
  }

  //check all cancel discount
  const [isCheckedAllCancel, setIsCheckedAllCancel] = useState(true);
  function handleCheckAllCancel(check) {
    if (isCheckedAllCancel) {
      console.log("checkedAll");
      const checkboxes = document.querySelectorAll('input[name="ck"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
      setIsCheckedAllCancel(false);
    } else {
      console.log("not checkedAll");
      const checkboxes = document.querySelectorAll('input[name="ck"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      setIsCheckedAllCancel(true);
    }
  }

  // Call API NoDiscountProduct
  const [cancelSuccess, setCancelSuccess] = useState(true);
  const handNoDiscountProduct = () => {
    Modal.confirm({
      title: "Hủy áp dụng giảm giá",
      content: "Bạn có muốn huỷ áp dụng giảm giá các bản ghi này không?",
      onOk() {
        const checkbox1 = document.querySelectorAll('input[name="ck"]');
        checkbox1.forEach((checkbox) => {
          if (checkbox.checked == true) {
            dataProduct.forEach((item) =>
              item.id == checkbox.value ? checked.push(item) : ""
            );
          }
          setChecked(checked);
        });
        console.log(checked);
        // huy giam gia san pham
        checked.forEach((pro) => {
          if (pro.discount != null) {
            axios
              .put(
                url_Pro +
                  "/noDiscountProduct/" +
                  pro.discount?.id +
                  "/" +
                  pro.id,
                // {
                //   headers: {
                //     Authorization: "Bearer " + localStorage.getItem("token"),
                //   },
                // }
              )
              .then((res) => {
                console.log("DataNoDiscount", res.data.data);
                res.data?.data
                  ? setCancelSuccess(true)
                  : setCancelSuccess(false);
                const checkboxes =
                  document.querySelectorAll('input[name="ck"]');
                checkboxes.forEach((checkbox) => {
                  checkbox.checked = false;
                });
                handleCancel();
                if (res.data.data) {
                  loadProduct();
                  getData();
                }
              });
          }
        });
        if (checked.length == 0 || checked == []) {
          notifyError("Chọn sản phẩm cần huỷ áp dụng giảm giá!");
        } else {
          if (cancelSuccess == true) {
            notifySuccess("Huỷ áp dụng giảm giá thành công !");
          } else {
            notifyError("Huỷ áp dụng giảm giá thất bại !");
          }
        }
        setChecked([]);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Call API DiscountProduct
  const handDiscountProduct = () => {
    const checkbox1 = document.querySelectorAll('input[name="ck"]');
    checkbox1.forEach((checkbox) => {
      if (checkbox.checked == true) {
        dataProduct.forEach((item) =>
          item.id == checkbox.value ? checked.push(item.id) : ""
        );
      }
      setChecked(checked);
    });
    console.log(checked);
    // giam gia san pham
    axios
      .put(url_Pro + "/discountProduct/" + dataDiscount.id, checked)
      .then((res) => {
        notifySuccess("Áp dụng thành công");
        console.log("DataDiscount", res.data.data);
        const checkboxes = document.querySelectorAll('input[name="ck"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        handleCancel();
        if (res.data.data) {
          loadProduct();
          getData();
          setChecked([]);
        }
      });
  };

  const clearSearchForm = () => {
    setSearchStartDate(getDateTime());
    setSearchEndDate(getDateTime());
    setTableParams({
      ...tableParams,
      pagination: {
        ...(tableParams.pagination.current = 1),
        ...(tableParams.pagination.pageSize = 10),
        ...(tableParams.pagination.searchStartDate = ""),
        ...(tableParams.pagination.searchEndDate = ""),
      },
    });
    getData();
  };
  // const changeStatusItem = (id, data) => {
  //   Modal.confirm({
  //     title: "Chuyển trạng thái",
  //     content: "Bạn có muốn chuyển trạng thái",
  //     onOk() {
  //       handleConfirmChangeStatus(id, data);
  //     },
  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //   });
  // };
  // const handleConfirmChangeStatus = (id, data) => {
  //   if (data.status == "INACTIVE" || data.status == "DRAFT") {
  //     axios
  //       .put(urlAdmin + "/active/" + id, {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //       })
  //       .then((res) => {
  //         notifySuccess("Chuyển trạng thái hoạt động thành công!");
  //         getData();
  //         console.log(res.data);
  //       });
  //   } else if (data.status == "ACTIVE") {
  //     axios
  //       .put(urlAdmin + "/inactive/" + id, {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //       })
  //       .then((res) => {
  //         notifySuccess("Chuyển trạng thái không hoạt động thành công!");
  //         getData();
  //         console.log(res.data);
  //       });
  //   }
  // };

  //xử lý login set Interval-Ducnt
  // let interval;
  // const startTimer = () => {
  //   // const countDownDate = new Date("Jan 2, 2023 00:05:58").getTime();

  //   const countDownDate = new Date("01-02-2023 00:05:58").getTime();
  //   interval = setInterval(() => {
  //     const now = new Date().getTime();
  //     const distance = countDownDate - now;
  //     const days = Math.floor(distance / (24 * 60 * 60 * 1000));
  //     const hours = Math.floor(
  //       (distance % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
  //     );
  //     const minutes = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60));
  //     const seconds = Math.floor((distance % (60 * 1000)) / 1000);

  //     if (distance < 0) {
  //       console.log("nhỏ hơn 0");
  //       clearInterval(interval.current);
  //     } else {
  //       setTimerDays(days);
  //       setTimerHours(hours);
  //       setTimerMinutes(minutes);
  //       setTimerSeconds(seconds);
  //     }
  //   });
  // };

  return (
    <div>
      <ToastContainer />
      {/* <div className="row">
        <div className="col-12">
          <Clock
            timerDays={timerDays}
            timerHours={timerHours}
            timerMinutes={timerMinutes}
            timerSeconds={timerSeconds}
          />
        </div>
      </div> */}
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
          <br />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Giảm giá sản phẩm</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <div
            className="row"
            style={{
              borderRadius: "20px",
              height: "150px",
              border: "1px solid #d9d9d9",
              background: "#fafafa",
            }}
          >
            <div className="col-4 mt-3 ">
              <label>Thời gian</label>
              <Space
                direction="vertical"
                size={12}
                style={{ width: "472px", borderRadius: "5px" }}
              >
                <RangePicker
                  showTime={{ format: "HH:mm:ss" }}
                  format={"yyyy-MM-DD HH:mm:ss"}
                  onChange={onchangeSearch}
                  onCalendarChange={handleChangeDateSearch}
                  value={[
                    moment(searchStartDate, "yyyy-MM-DD HH:mm:ss"),
                    moment(searchEndDate, "yyyy-MM-DD HH:mm:ss"),
                  ]}
                  type="datetime"
                />
              </Space>
            </div>

            <div className="col-12 text-center ">
              <Button
                className="mx-2  mt-2"
                type="primary"
                onClick={search}
                shape="round"
              >
                <SearchOutlined />
                Tìm kiếm
              </Button>
              <Button
                className="mt-2"
                type="primary-outline"
                onClick={clearSearchForm}
                shape="round"
              >
                <ReloadOutlined />
                Đặt lại
              </Button>
            </div>
          </div>

          {/* Modal Áp dụng mã giảm giá */}
          <Modal
            title="Áp dụng mã giảm giá"
            open={isView}
            width={850}
            // onOk={handleAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
              <Button
                key="back"
                onClick={handleCancel}
                style={{ borderRadius: "7px" }}
              >
                Hủy
              </Button>,
              <Button
                type="danger"
                onClick={handDiscountProduct}
                style={{ borderRadius: "7px" }}
              >
                Áp dụng
              </Button>,
            ]}
          >
            {/* console.log(id); */}
            <div className="row">
              <div className="col-12">
                {/* <h1>abc{dataDiscount?.id}</h1> */}
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <input
                          type={"checkbox"}
                          id="checkall"
                          // checked={isCheckedAll[product]}
                          onChange={() => handleCheckAll(checked)}
                        />
                      </th>
                      <th scope="col">Tên sản phẩm</th>
                      <th scope="col">Giá tiền</th>
                      <th scope="col">Số lượng</th>
                      {/* <th scope="col">Giảm giá</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {dataProduct
                      ? dataProduct.map((item) => {
                          // console.log("item", item);
                          return item.discount ? (
                            ""
                          ) : (
                            <tr key={item.id}>
                              <td>
                                <input
                                  type={"checkbox"}
                                  name="ck"
                                  value={item.id}
                                ></input>
                              </td>
                              <td>{item.name}</td>
                              <td>
                                <CurrencyFormat
                                  style={{ fontSize: "14px" }}
                                  value={item.price}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />{" "}
                                VNĐ
                              </td>
                              <td>{item.quantity}</td>
                              {/* <td>
                                {item.discount
                                  ? item.discount.name +
                                    " (" +
                                    item.discount.ratio +
                                    "%)"
                                  : ""}
                              </td> */}
                            </tr>
                          );
                        })
                      : ""}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal>
          {/* Modal Hủy Áp dụng mã giảm giá */}
          <Modal
            title="Hủy áp dụng mã giảm giá"
            open={isViewCancel}
            width={850}
            // onOk={handleAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
              <Button
                key="back"
                onClick={handleCancel}
                style={{ borderRadius: "7px" }}
              >
                Hủy
              </Button>,
              <Button
                type="danger"
                onClick={handNoDiscountProduct}
                style={{ borderRadius: "7px" }}
              >
                Hủy giảm giá
              </Button>,
            ]}
          >
            {/* console.log(id); */}
            <div className="row">
              <div className="col-12">
                {/* <h1>abc{dataDiscount?.id}</h1> */}
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <input
                          type={"checkbox"}
                          id="checkall"
                          // checked={isCheckedAll[product]}
                          onChange={() => handleCheckAllCancel(checked)}
                        />
                      </th>
                      <th scope="col">Tên sản phẩm</th>
                      <th scope="col">Giá tiền</th>
                      <th scope="col">Số lượng</th>
                      <th scope="col">Giảm giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataProduct
                      ? dataProduct.map((item) => {
                          // console.log("item", item);
                          return item.discount ? (
                            <tr key={item.id}>
                              <td>
                                <input
                                  type={"checkbox"}
                                  name="ck"
                                  value={item.id}
                                ></input>
                              </td>
                              <td>{item.name}</td>
                              <td>
                                <CurrencyFormat
                                  style={{ fontSize: "14px" }}
                                  value={item.price}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />{" "}
                                VNĐ
                              </td>
                              <td>{item.quantity}</td>
                              <td>
                                {item.discount
                                  ? item.discount.name +
                                    " (" +
                                    item.discount.ratio +
                                    "%)"
                                  : ""}
                              </td>
                            </tr>
                          ) : (
                            ""
                          );
                        })
                      : ""}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal>

          {/* Add */}
          <div className="row">
            <div className="col-12 mt-4">
              <Button
                className="offset-11 "
                type="primary"
                onClick={showModalAdd}
                shape="round"
              >
                <PlusOutlined />
                Thêm mới
              </Button>
              <Button
                className="offset-11 mt-1"
                type="danger"
                shape="round"
                onClick={() => {
                  showDataProductCancel();
                }}
              >
                Hủy áp dụng
              </Button>
              <Modal
                title="Tạo mới"
                open={isAdd}
                onOk={handleAdd}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    Hủy
                  </Button>,
                  <Button key="link" type="danger" onClick={draft}>
                    Nháp
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleAdd}
                  >
                    Thêm mới
                  </Button>,
                ]}
              >
                <div className="form group">
                  <div className="row">
                    <div className="col-12 mt-1">
                      <label>
                        Tiêu đề<span className="text-danger"> *</span>
                      </label>
                      <Input
                        placeholder="Nhập tiêu đề"
                        onChange={(e) => handle(e)}
                        name="name"
                        value={form.name}
                        type="text"
                      />
                    </div>
                    <div className="col-12 mt-1">
                      <label>
                        Tỉ lệ (%)<span className="text-danger"> *</span>
                      </label>
                      <Input
                        placeholder="Nhập tỉ lệ"
                        onChange={(e) => handle(e)}
                        name="ratio"
                        value={form.ratio}
                        type="number"
                        min="0"
                        max="60"
                      />
                    </div>
                    <div className="col-12 mt-1">
                      <label>
                        Thời gian giảm giá
                        <span className="text-danger"> *</span>
                      </label>
                      <Space
                        direction="vertical"
                        size={12}
                        style={{ width: "472px", borderRadius: "5px" }}
                      >
                        <RangePicker
                          showTime
                          format={"yyyy-MM-DD HH:mm:ss"}
                          onChange={handleChangeDate}
                          onCalendarChange={setDates}
                          value={[
                            moment(form.startDate, "yyyy-MM-DD HH:mm:ss"),
                            moment(form.endDate, "yyyy-MM-DD HH:mm:ss"),
                          ]}
                          type="datetime"
                        />
                      </Space>
                    </div>
                  </div>
                </div>
              </Modal>
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
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />

          {/* Edit */}

          <Modal
            title="Cập nhật"
            open={isEditing}
            okText={"Cập nhật"}
            cancelText={"Huỷ"}
            onOk={handleEdit}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <div className="form group">
              <div className="row">
                <div className="col-12 mt-1">
                  <label>
                    Tiêu đề<span className="text-danger"> *</span>
                  </label>
                  <Input
                    placeholder="Nhập tiêu đề"
                    onChange={(e) => handle(e)}
                    name="name"
                    value={form.name}
                    type="text"
                  />
                </div>
                <div className="col-12 mt-1">
                  <label>
                    Tỉ lệ (%)<span className="text-danger"> *</span>
                  </label>
                  <Input
                    placeholder="Nhập tỉ lệ"
                    onChange={(e) => handle(e)}
                    name="ratio"
                    value={form.ratio}
                    type="number"
                    min="0"
                    max="60"
                  />
                </div>
                <div className="col-12 mt-1">
                  <label>
                    Thời gian giảm giá<span className="text-danger"> *</span>
                  </label>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "472px", borderRadius: "5px" }}
                  >
                    <RangePicker
                      showTime={{ format: "HH:mm:ss" }}
                      format={"yyyy-MM-DD HH:mm:ss"}
                      onChange={handleChangeDate}
                      onCalendarChange={setDates}
                      value={[
                        moment(form.startDate, "yyyy-MM-DD HH:mm:ss"),
                        moment(form.endDate, "yyyy-MM-DD HH:mm:ss"),
                      ]}
                      type="datetime"
                    />
                  </Space>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Discount;
