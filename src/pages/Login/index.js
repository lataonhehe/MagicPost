import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.scss'
import classNames from "classnames/bind";
import img from '~/assets/delivery-services-poster-flyer--made-with-postermywall-1@2x.png'
import Grid from '@mui/material/Grid';
import { Paper } from "@mui/material";
import DefaultLayout from "./HeaderOnly";

const cx = classNames.bind(styles);

const Login = (props) => {
    const [Username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [UsernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    
    const navigate = useNavigate();

    // Gọi server API xem ổn Username tồn tại không
    const checkAccountExists = (callback) => {
        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({Username})
        })
        .then(r => r.json())
        .then(r => {
            callback(r?.userExists)
        })
    }

    // Log in 
    const logIn = () => {
        fetch("http://localhost:8000/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({Username, password})
        })
        .then(r => r.json())
        .then(r => {
            if ('success' === r.message) {
                localStorage.setItem("user", JSON.stringify({Username, token: r.token}))
                props.setLoggedIn(true)
                props.setUsername(Username)
                navigate("/")
            } else {
                window.alert("Wrong Username or password")
            }
        })
    }
        
    const onButtonClick = () => {

        
        setUsernameError("")
        setPasswordError("")

        // Kiểm tra validate :v
        if ("" === Username) {
            setUsernameError("Hãy nhập Username")
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(Username)) {
            setUsernameError("Username không hợp lệ!")
            return
        }

        if ("" === password) {
            setPasswordError("Hãy nhập mật khẩu!")
            return
        }

        if (password.length < 5) {
            setPasswordError("Mật khẩu phải dài hơn 5 kí tự!")
            return
        }

        // Authentication từ bên be

        checkAccountExists(accountExists => {
            // If yes, log in 
            if (accountExists)
                logIn()
            else
            // Else, ask user if they want to create a new account and if yes, then log in
                if (window.confirm("Username không tồn tại: " + Username + ". Tạo account mới?")) {
                    logIn()
                }
        })        


    }

    return <DefaultLayout>
         <Grid container spacing={0} direction="row" className={cx('container')}>
            <Paper className={cx('paper')} ><img src= {img} alt = 'thumbnail' className={cx('img')}/>
            </Paper>
            <Paper className= {cx('paper')}>
                <div className={cx("titleContainer")}>
                    <div>Đăng nhập</div>
                </div>
                <br />
                <div className={cx("inputContainer")}>
                    <input
                        value={Username}
                        placeholder="Nhập Username"
                        onChange={ev => setUsername(ev.target.value)}
                        className={cx("inputBox")} />
                    <label className={cx("errorLabel")}>{UsernameError}</label>
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
            </Paper>
        </Grid>
     </DefaultLayout>
}

export default Login