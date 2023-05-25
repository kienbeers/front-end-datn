import React from "react";
import { Link } from "react-router-dom";
import './css/layout.css';
import { Filter } from "react-feather";
function Navbar() {
    const handleClick = event => {
        this.addClass('active');
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link " id="home" aria-current="page" to={"/user"} style={{ marginTop: '20%' }}><h4 style={{ fontWeight: '600' }}>Trang chủ</h4></Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link"  id="sp" to={"/user/find"} style={{ marginTop: '20%' }}><h4 style={{ fontWeight: '600' }}>Sản phẩm</h4></Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link className="nav-link" to={""}>Accessories</Link>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>)
}

export default Navbar;