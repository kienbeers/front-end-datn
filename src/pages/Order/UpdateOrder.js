import { Table, Calendar, Cascader, Select, Input, Button, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { Html5Filled } from "@ant-design/icons";
import '../Order/table.css';

const { Option } = Select;


const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
  });

  function UpdateOrder() {
    const url = 'http://localhost:8080/api/orders';
    const [data, setData] = useState({
      userId: "1",
      total: "0",
      payment: "",
      address: "",
      status: 1,
      orderId: "",
      productId: "",
      quantity: "",
      price: "",
      status: 1
    });
  
  
    const [loading, setLoading] = useState(false);
  
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 10,
        search1: '',
        search2: '',
      },
    });
  
    const [dataSP, setDataSP] = useState([{}]);
  
    const load = () => {
      setLoading(true);
      fetch(
        `http://localhost:8080/api/products?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then((results) => {
          setDataSP(results.data.data);
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
      load();
      setDataSP(
        dataSP.map(d => {
          return {
            select: false,
            id: d.id,
            name: d.name,
            price: d.price,
            quantity: d.quantity
          }
        })
      )
    }, []);
  
    const submit = (e) => {
      e.preventDefault();
      axios.post(url, {
        userId: data.userId,
        total: data.total,
        payment: data.payment,
        address: data.address,
        status: data.status,
        orderDetail: [{
          orderId: data.orderId,
          productId: data.productId,
          quantity: data.quantity,
          price: data.price,
          status: data.status
        }
        ]
      })
        .then(res => {
          submit_orderDetail();
          window.location.reload();
          console.log(res.data);
        })
    }
  
    const submit_orderDetail = (e) => {
      e.preventDefault();
      axios.post(url, {
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        price: data.price,
        status: data.status,
      })
        .then(res => {
          window.location.reload();
          console.log(res.data);
        })
    }
  
    return (
      <div>
        <div className="row">
          <div className="btn-search col-12 mt-3 mb-4 d-flex float-end">
            <div className="timk col-4 ">
              <div className="form-group">
                <Input type="search" placeholder="Tìm kiếm sản phẩm" />
              </div>
            </div>
            {/* <button type="submit">Thêm sản phẩm</button> */}
          </div>
          <div className="col-5">
            <div className="title">
              <h3>Thông tin khách hàng</h3>
            </div>
  
            <div className="row mt-3">
              <div className="col-">
                <div className="form-group">
                  <label>Tên khách hàng</label>
                  <Input placeholder="Tên khách hàng" />
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="form-group">
                <label>Mã hóa đơn</label>
                <Input placeholder="Tìm kiếm theo số điện thoại hoặc email" />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group">
                  <label>Thông tin người bán</label>
                  <Input placeholder="Tên người bán" />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Số điện thoại khách hàng</label>
                  <Input placeholder="Tên khách hàng" />
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <select class="form-select">
                    <option selected>Thành phố/tỉnh...</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  <br></br>
                  <select class="form-select">
                    <option selected>Quận/huyện...</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  <br></br>
                  <select class="form-select">
                    <option selected>Phường/xã...</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <br />
                  <textarea rows="7" cols="39" placeholder="Địa chỉ chi tiết ..." />
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group">
                  <label>Khuyến mãi</label>
                  <div className="input-group">
                    <input type="text" class="form-control" placeholder="0" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Toonge tiền sản phẩm</label>
                  <div className="input-group">
                    <input type="text" class="form-control" placeholder="0" />
                    <span class="input-group-text">VNĐ</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group">
                  <label>Phương thức mua hàng</label>
                  <select class="form-select">
                    <option selected>Chọn hình thức mua hàng</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Phương thức thanh toán</label>
                  <select class="form-select">
                    <option selected>Chọn hình thức thanh toán</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="form-group">
                <br />
                <textarea rows="7" cols="85" placeholder="Ghi chú ..." />
              </div>
            </div>
          </div>
  
          <div className="col-7">
            <div className="title"><h3>Giỏ hàng</h3></div>
            <div className="row">
              <div className="col-12 mt-3">
                <table className="table table-striped">
                  <thead>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Laptop Gaming ...</td>
                      <td>
  
                      </td>
                      <td>300000000</td>
                      <td>300000000</td>
                      <td>1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
  
        <div className="row">
          <div className="btn-submit">
            <Button className="text-center" type="button" onClick={submit} >
              Hoàn tất đặt hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  export default UpdateOrder;
  