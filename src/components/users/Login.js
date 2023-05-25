import React, { useState } from "react";
import '../users/css/log.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


function Login() {
    let navigate = useNavigate();
    let signInPhone = () => {
        //navigate("/loginOrder");
        window.location.href = "/loginOrder";
    }
    let signInButton = () => {
        document.getElementById('container').classList.remove("right-panel-active");
    }
    let signUpButton = () => {
        document.getElementById('container').classList.add("right-panel-active");
    }
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    const [username2, setUsername2] = useState('');
    const [password2, setPassword2] = useState('');
    const [password3, setPassword3] = useState('');

    let acc = {
        'username': username,
        'password': password
    }

    let acc2 = {
        'username': username2,
        'newPassword': password2,
        'status': 1
    }

    const toastSuccess = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
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

    const roles = [];

    let handelSignUp = () => {
        if (username2.length == 0) {
            toastError("Tài khoản không được để trống!")
        } else if (password2.length == 0) {
            toastError("Mật khẩu không được để trống!")
        } else if (password2.length < 6) {
            toastError("Mật khẩu phải lớn hơn hoặc bằng 6 ký tự!")
        } else if (password3 !== password2) {
            toastError("Xác nhận mật khẩu không chính xác!")
        } else {
            fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify(acc2)
            }).then((res) => res.json())
                .then((results) => {
                    console.log(results.data);
                    if (results.data == null) {
                        toastError("Tên tài khoản đã được sử dụng. Hãy thử tên khác.");
                    } else {
                        signInButton();
                        toastSuccess("Đăng ký thành công!");
                    }
                })
        }
    }

    let handelSubmit = () => {
        

        if (username == "") {
            toastError("Tài khoản đang được để trống!")
        } else if (password == "") {
            toastError("Mật khẩu đang để trống!")
        } else {
            fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify(acc)
            }).then(response => {
                console.log("response", response);
                if (response.ok) {
                    return response.json();
                }

                throw Error(response.status);
            }).then(result => {
                localStorage.setItem("id", result.data.id);
                localStorage.setItem("token", result.data.token);
                for (var i = 0; i < result.data.roles.length; i++) {
                    roles.push(result.data.roles[i].role);
                }
                localStorage.setItem("roles", roles);
                localStorage.setItem("username", result.data.username);
                localStorage.setItem("information", JSON.stringify(result.data.information))
                setUsername('');
                setPassword('');
                if (localStorage.getItem("roles").includes("ADMIN") || localStorage.getItem("roles").includes("STAFF")) {
                    window.location.href = '/admin/order';
                } else {
                    window.location.href = '/user';
                }
            }).catch(error => {
                toastError("Tên người dùng hoặc mật khẩu bạn đã nhập không chính xác!");
                console.log("err", error);
            })
        }
    }
    return (
        <>
            <ToastContainer></ToastContainer>
            <div className="log">
                <div className="container1" id="container">
                    <div className="form-container sign-up-container">
                        <form className="form-log" action="#">
                            <h1>Tạo tài khoản</h1>
                            <div className="social-container">
                                <a onClick={signInPhone} className="social"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAx0lEQVR4nM2SIQ7CUAyGH1wCQ1Bc4LULXAEL3ACHRWCHQXCDtQsIJIpLoLnIsnZBwvLIY1kyB3uEhC+p7Jf2b435G2wqM2Q9+QLWXWsBVs2urvYC0sOXAlk3BNpaYFMdIkuJrDlSMTYhAOkZSK8mdt0gAVI+ANYCSTZBAg+wTIHkgaRLE0pEsgCWO7DGxrmOTTTywVYBS4kk27cSm+jEBwosF2DJmif2P/PRJOP01gOW42ulEEHNiLM+sqyAde+bI5J5K8FPeQLKEoweTDHSnAAAAABJRU5ErkJggg=="/></a>
                                <a href="#" className="social"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                </svg></a>
                                <a href="#" className="social"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                </svg></a>
                            </div>
                            <span>hoặc đăng ký tài khoản của riêng bạn</span>
                            <input type="text" className="form-control ip" placeholder="Tài khoản" value={username2} onChange={e => setUsername2(e.target.value)} />
                            <input type="password" className="form-control mt-2 ip" placeholder="Mật khẩu" value={password2} onChange={e => setPassword2(e.target.value)} />
                            <input type="password" className="form-control mt-2 ip" placeholder="Xác nhận mật khẩu" value={password3} onChange={e => setPassword3(e.target.value)} />
                            <button type="button" onClick={handelSignUp} >Đăng ký</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form className="form-log" action="#">
                            <h1>Đăng nhập</h1>
                            <div className="social-container">
                                <a onClick={signInPhone} className="social"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAx0lEQVR4nM2SIQ7CUAyGH1wCQ1Bc4LULXAEL3ACHRWCHQXCDtQsIJIpLoLnIsnZBwvLIY1kyB3uEhC+p7Jf2b435G2wqM2Q9+QLWXWsBVs2urvYC0sOXAlk3BNpaYFMdIkuJrDlSMTYhAOkZSK8mdt0gAVI+ANYCSTZBAg+wTIHkgaRLE0pEsgCWO7DGxrmOTTTywVYBS4kk27cSm+jEBwosF2DJmif2P/PRJOP01gOW42ulEEHNiLM+sqyAde+bI5J5K8FPeQLKEoweTDHSnAAAAABJRU5ErkJggg=="/></a>
                                <a href="#" className="social"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                </svg></a>
                                <a href="#" className="social"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                </svg></a>

                            </div>
                            <span>hoặc sử dụng tài khoản của bạn</span>
                            <input type="text" className="form-control ip" placeholder="Tài khoản"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                name="username"
                                autoComplete="off"
                            />
                            <input type="password" className="form-control mt-2 ip"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                name="password" placeholder="Mật khẩu" autoComplete="off"
                            />
                            <a href="#">Quên mật khẩu?</a>
                            <button type="button" onClick={handelSubmit} >Đăng nhập</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Chào mừng!</h1>
                                <p>Giữ kết nối với chúng tôi vui lòng nhập thông tin của bạn</p>
                                <button className="ghost" id="signIn" onClick={signInButton}>Đăng nhập</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Xin chào!</h1>
                                <p>Hãy đăng ký và bắt đầu mua sắm sản phẩm của chúng tôi</p>
                                <button className="ghost" id="signUp" onClick={signUpButton}>Đăng ký</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Login;