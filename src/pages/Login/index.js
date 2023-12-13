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
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    
    const navigate = useNavigate();

    // Call the server API to check if the given email ID already exists
    const checkAccountExists = (callback) => {
        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email})
        })
        .then(r => r.json())
        .then(r => {
            callback(r?.userExists)
        })
    }

    // Log in a user using email and password
    const logIn = () => {
        fetch("http://localhost:8000/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email, password})
        })
        .then(r => r.json())
        .then(r => {
            if ('success' === r.message) {
                localStorage.setItem("user", JSON.stringify({email, token: r.token}))
                props.setLoggedIn(true)
                props.setEmail(email)
                navigate("/")
            } else {
                window.alert("Wrong email or password")
            }
        })
    }
        
    const onButtonClick = () => {

        
        setEmailError("")
        setPasswordError("")

        // Kiểm tra validate :v
        if ("" === email) {
            setEmailError("Hãy nhập Email")
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Email không hợp lệ!")
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
                if (window.confirm("Email không tồn tại: " + email + ". Tạo account mới?")) {
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
            </Paper>
        </Grid>
     </DefaultLayout>
}

export default Login