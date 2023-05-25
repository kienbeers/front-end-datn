import React from "react";
import './css/layout.css';
import { Phone, Mail, MapPin } from 'react-feather';
import { Link } from "react-router-dom";
function Footer() {
    return (<>
        <footer id="footer-user">
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Giới thiệu</h3>
                                <ul className="footer-links">
                                    <li className="nav-item">
                                        <Link to={'/'}>
                                            <MapPin size={12} color="red"></MapPin>
                                            Hai Bà Trưng - Hà Nội
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/'}>
                                            <Phone size={12} color="red"></Phone>
                                            09471069999
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/'}>
                                            <Mail size={12} color="red"></Mail>
                                            laptopKingLap@gmail.com
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Loại sản phẩm</h3>
                                <ul className="footer-links">
                                    <li><a href="#">Mã giảm giá</a></li>
                                    <li><a href="#">Laptop Gaming</a></li>
                                    <li><a href="#">Laptop văn phòng</a></li>
                                    <li><a href="#">Laptop đồ họa</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Thông tin</h3>
                                <ul className="footer-links">
                                    <li><a href="#">Câu hỏi thường gặp mua hàng</a></li>
                                    <li><a href="#">Chính sách bảo mật</a></li>
                                    <li><a href="#">Quy chế hoạt động</a></li>
                                    <li><a href="#">Kiểm tra hóa đơn điện tử</a></li>
                                    <li><a href="#">Tra cứu thông tin bảo hành</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Dịch vụ</h3>
                                <ul className="footer-links">
                                    <li><a href="#">Tài khoản của tôi</a></li>
                                    <li><a href="#">Xem giỏ hàng</a></li>
                                    <li><a href="#">Danh sách yêu thích</a></li>
                                    <li><a href="#">Theo dõi đơn hàng của tôi</a></li>
                                    <li><a href="#">Trợ giúp</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="bottom-footer" className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <span className="copyright">
                                Bản quyền &copy;<script>document.write(new Date().getFullYear());</script> Tất cả các quyền | Mẫu này được thực hiện với <i className="fa fa-heart-o" aria-hidden="true"></i> <a href="https://colorlib.com" target="_blank">Colorlib</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </>)
}

export default Footer;