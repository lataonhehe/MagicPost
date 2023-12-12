import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.scss'
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    
    const navigate = useNavigate();
        
    const onButtonClick = () => {
        // You'll update this function later...
    }

    return <div className={cx("mainContainer")}>
        <div className={cx("titleContainer")}>
            <div>Đăng nhập</div>
        </div>
        <br />
        <div className={cx("inputContainer")}>
            <input
                value={email}
                placeholder="Nhập Email"
                onChange={ev => setEmail(ev.target.value)}
                className={cx("inputBox")} />
            <label className={cx("errorLabel")}>{emailError}</label>
        </div>
        <br />
        <div className={cx("inputContainer")}>
            <input
                value={password}
                type="password"
                placeholder="Nhập mật khẩu"
                onChange={ev => setPassword(ev.target.value)}
                className={cx("inputBox")} />
            <label className={cx("errorLabel")}>{passwordError}</label>
        </div>
        <br />
        <div className={cx("inputContainer")}>
            <input
                className={cx("inputButton")}
                type="button"
                onClick={onButtonClick}
                value={"Đăng nhập"} />
        </div>
    </div>
}

export default Login