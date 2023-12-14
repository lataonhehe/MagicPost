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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const logIn = () => {
        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then(r => {
                if (r.ok) return r.json()
                else {
                    return NaN
                }
            })
            .then((r) => {
                if (r.isNaN) window.alert("Wrong username or password");
                else {
                    localStorage.setItem("user", JSON.stringify({ username, token: r.token }));
                    // props.setLoggedIn(true);
                    // props.setUsername(username);
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error("Error logging in:", error);
            });
    };

    const onButtonClick = () => {
        setUsernameError("");
        setPasswordError("");

        if (username.trim() === "") {
            setUsernameError("Hãy nhập username");
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
            setUsernameError("Username không hợp lệ!");
            return;
        }

        if (password.trim() === "") {
            setPasswordError("Hãy nhập mật khẩu!");
            return;
        }

        if (password.length < 5) {
            setPasswordError("Mật khẩu phải dài hơn 5 kí tự!");
            return;
        }

        console.log(username, password)
        // Authenticate user
        logIn();
    };

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
                        value={username}
                        placeholder="Nhập username"
                        onChange={ev => setUsername(ev.target.value)}
                        className={cx("inputBox")} />
                    <label className={cx("errorLabel")}>{usernameError}</label>
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