import { useState } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { UserData } from "./Data";
import { useEffect } from "react";
import { MenuFoldOutlined, SoundTwoTone } from "@ant-design/icons";
import { DatePicker, Space } from "antd";
import moment, { now } from "moment";
import { Doughnut, Pie } from "react-chartjs-2";
import { left } from "@popperjs/core";
import { Chart } from "chart.js";

function Statistical() {
  const [dataStatical, setDataStatical] = useState();
  const [dataStaticalByOrder, setDataStaticalByOrder] = useState();
  const [dataProduct, setDataProduct] = useState();
  const [sumPro, setSumPro] = useState(0);
  const [countO, setCountO] = useState(0);
  const [countCus, setCountCus] = useState(0);
  const [numOfProductsSold, setNumOfProductsSold] = useState();
  var now = moment();
  let today = now.format("YYYY-MM");
  useEffect(() => {
    loadDataStaticalByYear();
    loadDataStaticalByOrder();
    loadDataStaticalByProduct();
    sumProduct();
    countOrder();
    countCustomer();
    numberOfProductsSold();
  }, []);

  const loadDataStaticalByProduct = () => {
    fetch(`http://localhost:8080/api/admin/statistical`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setDataProduct(results);
      });
  };

  const sumProduct = () => {
    fetch(`http://localhost:8080/api/admin/statistical/sum/product`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setSumPro(results.total);
      });
  };

  const countOrder = () => {
    fetch(`http://localhost:8080/api/admin/statistical/count/order`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setCountO(results.total);
      });
  };

  const countCustomer = () => {
    fetch(`http://localhost:8080/api/admin/statistical/count/customer`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setCountCus(results.total);
      });
  };

  const loadDataStaticalByOrder = (month, year) => {
    console.log("month", month);
    console.log("year", year);
    var now = moment();
    let today = now.format("YYYY-MM");
    console.log(today);
    const myArray = today.split("-");
    if (year === undefined && month === undefined) {
      month = myArray[1];
      year = myArray[0];
    }
    fetch(`http://localhost:8080/api/admin/statistical/${month}/${year}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setDataStaticalByOrder(results);
      });
  };

  const numberOfProductsSold = () => {
    fetch(`http://localhost:8080/api/admin/statistical/numberOfProductsSold`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setNumOfProductsSold(results.total);
      });
  }

  const loadDataStaticalByYear = (year) => {
    if (year != undefined) {
      fetch(`http://localhost:8080/api/admin/statistical/${year}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((results) => {
          console.log(results);
          setDataStatical(results);
        });
    } else {
      fetch(`http://localhost:8080/api/admin/statistical/2022`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((results) => {
          console.log(results);
          setDataStatical(results);
        });
    }
  };

  const userData = {
    labels: dataStatical?.map((data) => "Tháng " + data.month),
    datasets: [
      {
        label: "Doanh thu",
        data: dataStatical?.map((data) => data.total),
        backgroundColor: [
          // "rgba(75,192,192,1)",
          // "#ecf",
          // "#50AF95",
          // "#f3ba2f",
          "#2a71d0",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  const dataOrder = {
    labels: dataStaticalByOrder?.map((data) => data.status),
    datasets: [
      {
        label: "Tổng đơn hàng",
        data: dataStaticalByOrder?.map((data) => data.quantity),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        hoverOffset: 4,
        borderAlign: left,
      },
    ],
  };

  const product = {
    labels: dataProduct?.map((data) => data.name),
    datasets: [
      {
        label: "Số lượng",
        data: dataProduct?.map((data) => data.quantity),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
      },
    ],
  };

  const onChangeDatePiker = (date, dateString) => {
    console.log(date, dateString);
    loadDataStaticalByYear(dateString);
  };

  const onChangeMonth = (date, dateString) => {
    console.log(date, dateString);
    const myArray = dateString.split("-");
    console.log("my-array");
    console.log(myArray);
    loadDataStaticalByOrder(myArray[1], myArray[0]);
  };

  const DoughData = {
    labels: ["Red", "Green", "Yellow"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="">
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Thống kê</h4>
        </div>
      </div>
      <div
        className="row mb-3"
        style={{
          borderRadius: "20px",
          height: "100%",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-12 col-sm-3">
          <h5 className="text-center fw-bold mt-3 fw-bold text-danger">SỐ LƯỢNG SẢN PHẨM</h5>
          <h5 className="text-success text-center fw-bold">{sumPro}</h5>
        </div>
        <div className="col-12 col-sm-3">
          <h5 className="text-center fw-bold mt-3 fw-bold text-danger">SỐ LƯỢNG KHÁCH HÀNG</h5>
          <h5 className="text-success text-center fw-bold">{countCus}</h5>
        </div>
        <div className="col-12 col-sm-3">
          <h5 className="text-center fw-bold mt-3 fw-bold text-danger">TỔNG SỐ LƯỢNG HOÁ ĐƠN</h5>
          <h5 className="text-success text-center fw-bold">{countO}</h5>
        </div>
        <div className="col-12 col-sm-3">
          <h5 className="text-center fw-bold mt-3 fw-bold text-danger">TỔNG SỐ LƯỢNG SẢN PHẨM BÁN RA</h5>
          <h5 className="text-success text-center fw-bold">{numOfProductsSold}</h5>
        </div>
      </div>
      <div
        className="row mb-3"
        style={{
          borderRadius: "20px",
          height: "100%",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-12 col-sm-6 text-center">
          <div
            style={{ width: "60%", paddingLeft: "5%" }}
            className="mt-4 text-center"
          >
            <Space className="mb-4 mt-1">
              <DatePicker
                defaultValue={moment(today)}
                onChange={onChangeMonth}
                picker="month"
              />
            </Space>
            <Doughnut data={dataOrder} options={options} />
            <h5 className="mt-2 fw-bold">Tổng đơn hàng theo tháng trong năm</h5>
          </div>
        </div>
        <div
          className="col-12 col-sm-6 text-center "
          style={{ width: "40%", marginTop: "3%" }}
        >
          <Doughnut data={product} options={options} className="mt-5" />
          <h5 className=" fw-bold">Số lượng sản phẩm bán ra</h5>
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
        <div className="col-12 text-center">
          <div
            className="text-center"
            style={{ width: 900, marginLeft: "10%" }}
          >
            <Space className="mt-3">
              <DatePicker
                defaultValue={moment("2022", "YYYY")}
                onChange={onChangeDatePiker}
                picker="year"
              />
            </Space>
            <BarChart chartData={userData} />
            <h5 className="mt-3 fw-bold">Thống kê doanh thu theo năm</h5>
          </div>
        </div>
      </div>

      {/* <div style={{ width: 700 }}>
        <LineChart chartData={dataUserLost} />
      </div>
      <div style={{ width: 700 }}>
        <PieChart chartData={userData} />
      </div> */}
    </div>
  );
}

export default Statistical;
