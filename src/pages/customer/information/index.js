import React, { useContext, useEffect, useState } from "react";
import { Button, Input, message, Modal, Select, Table } from "antd";
import { ToastContainer, toast } from 'react-toastify';

const toastSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
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
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

function Information() {
    const [loading, setLoading] = useState(false);
    const [address, setAddRess] = useState();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [data, setData] = useState();
    const [id, setId] = useState();
    const [username, setUsername] = useState();
    const [status, setStatus] = useState(1);
    const [isEditing, setEditing] = useState(false);
    const [password1, setPassword1] = useState();
    const [password2, setPassword2] = useState();
    const [password3, setPassword3] = useState();


    const information = JSON.parse(localStorage.getItem("information"));

    const user = localStorage.getItem("username");

    const idUser = localStorage.getItem("id");

    const changeAddress = (event) => {
        setAddRess(event.target.value);
    };

    const changeName = (event) => {
        setName(event.target.value);
    };

    const changePhone = (event) => {
        setPhone(event.target.value);
    };

    const changeEmail = (event) => {
        setEmail(event.target.value);
    };

    const loadDataByID = () => {
        console.log(information[0]?.id);
        fetch(`http://localhost:8080/api/information/` + idUser)
            .then((res) => res.json())
            .then((res) => {
                setName(res.data.fullName);
                setEmail(res.data.email)
                setPhone(res.data.phoneNumber)
                setAddRess(res.data.address)
            });
    };

    useEffect(() => {
        loadDataByID();
    }, []);

    const handleSubmitUpdate = (data) => {
        const edit = {
            fullName: name,
            phoneNumber: phone,
            email: email,
            address: address,
        };
        console.log(information[0]?.id);
        fetch("http://localhost:8080/api/auth/information/" + idUser, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(edit),
        })
            .then((response) => response.json())
            .then((results) => {
                if (results.data == null) {
                    toastError(results.message);
                } else {
                    localStorage.removeItem("information");
                    toastSuccess("Cập nhật thông tin thành công!");
                    localStorage.setItem("information", JSON.stringify([results.data]));
                    loadDataByID();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    };

    const onEdit = (status) => {
        setId(idUser);
        setEditing(true);
        setUsername(user);
        setStatus(1);
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

    const changePassword3 = (event) => {
        setPassword3(event.target.value);
    };

    return (
        <div className="row ">
            <ToastContainer></ToastContainer>
            <div className="col-12">
                <h6 className="pt-5 pb-5">
                    <div className="row">
                        <div className="col-6" style={{
                            margin: "auto", border: "1px solid",
                            padding: "15px"
                        }}>
                            <h2><b>Hồ sơ của bạn</b></h2>
                            <h4>Quản lý thông tin hồ sơ để bảo mật tài khoản</h4>
                            <hr></hr>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>Tên đăng nhập: </label>
                                    <input
                                        type={"text"}
                                        className="form-control radio-ip"
                                        defaultValue={user}
                                        disabled
                                    ></input>
                                </div>
                                <br></br>
                                <a onClick={onEdit} style={{ color: "red", float: "right", margin: "unset" }}>Đổi mật khẩu</a>
                            </div>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>Họ và tên: </label>
                                    <input
                                        type={"text"}
                                        className="form-control radio-ip"
                                        placeholder="Họ tên"
                                        onChange={changeName}
                                        defaultValue={name}
                                    ></input>
                                </div>
                            </div>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>Số điện thoại: </label>
                                    <Input
                                        
                                        className="form-control radio-ip"
                                        placeholder="Số điện thoại"
                                        onChange={changePhone}
                                        value={phone}
                                    ></Input>
                                </div>
                            </div>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>Email: </label>
                                    <input
                                        type={"text"}
                                        className="form-control radio-ip"
                                        onChange={changeEmail}
                                        defaultValue={email}
                                    ></input>
                                </div>
                            </div>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>Địa chỉ: </label>
                                    <input
                                        type={"text"}
                                        className="form-control radio-ip"
                                        onChange={changeAddress}
                                        defaultValue={address}
                                    ></input>
                                </div>
                            </div>
                            <div className="row mb-2 mt-4">
                                <div className="btn-submit">
                                    <Button
                                        className="text-center"
                                        type="button"
                                        shape="round"
                                        onClick={handleSubmitUpdate}
                                    >
                                        Cập nhật thông tin
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </h6>
                <Modal
                    title="Cập nhật"
                    open={isEditing}
                    okText={"Cập nhật"}
                    cancelText={"Huỷ"}
                    onCancel={() => {
                        setEditing(false);
                    }}
                    onOk={() => {
                        if (password1 == null || password2 == null || password3 == null) {
                            toastError("Vui lòng nhập đầy đủ thông tin!")
                        } else {
                            if (password2 != password1) {
                                toastError("Nhập lại mật khẩu không chính xác!");
                            } else {
                                setLoading(true);
                                fetch(
                                    `http://localhost:8080/api/users/` + id, { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, password: password3, newPassword: password1, status: status }) }).then((res) => res.json())
                                    .then((results) => {
                                        if (results.data == null) {
                                            toastError(results.message);
                                        } else {
                                            toastSuccess("Đổi mật khẩu thành công!");
                                            setUsername("");
                                            setPassword3("");
                                            setPassword1("");
                                            setPassword2("");
                                            setEditing(false);
                                        }
                                    });
                            }
                        }
                    }}
                >
                    <label>
                        Tài khoản
                    </label>
                    <Input type="text" name="username" value={user} placeholder="Nhập tài khoản" onChange={changeUsername} disabled={true} />
                    <label>
                        Mật khẩu cũ
                        <span className="text-danger"> *</span>
                    </label>
                    <Input type="password" name="password3" value={password3} placeholder="Nhập mật khẩu cũ" onChange={changePassword3} />
                    <label>
                        Mật khẩu mới
                        <span className="text-danger"> *</span>
                    </label>
                    <Input type="password" name="password1" value={password1} placeholder="Nhập mật khẩu mới" onChange={changePassword1} />
                    <label>
                        Xác nhận mật khẩu
                        <span className="text-danger"> *</span>
                    </label>
                    <Input type="password" name="password2" value={password2} placeholder="Nhập lại mật khẩu" onChange={changePassword2} />
                </Modal>
            </div>
        </div>
    );
}

export default Information;
