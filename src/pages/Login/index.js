import React, { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import img from "~/assets/delivery-services-poster-flyer--made-with-postermywall-1@2x.png";
import Grid from "@mui/material/Grid";
import { Fade, Paper } from "@mui/material";
import DefaultLayout from "./HeaderOnly";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { LayoutContext } from "~/App";
import { useContext } from "react";

const cx = classNames.bind(styles);

const Login = () => {
  const [chora, setChora] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [departmentType, setDepartmentType] = useState();
  const [role, setRole] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const setLogged = useContext(LayoutContext);

  useEffect(() => {
    if (chora) {
      // console.log('chora true');
      setTimeout(() => {
        // console.log('chora false');
        setChora(false);
      }, 1500);
      if (role === "2")
        setTimeout(() => {
          navigate(`/leader/statistic`);
        }, 2000);
      else
        setTimeout(() => {
          navigate(
            `/${departmentType == 0 ? "trans" : "consol"}${
              role == 0 ? "staff" : "manager"
            }`
          );
        }, 2000);
    }
  }, [loggedIn]);

  const logIn = () => {
    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        if (r.ok) return r.json();
        else {
          if (username === "") setLoggedIn(false);
          setLogged(false);
          window.alert("Sai tài khoản hoặc mật khẩu");
          return NaN;
        }
      })
      .then((r) => {
        if (r.username === username) {
          console.log(r);
          console.log(r.user);
          setDepartmentType(r.department);
          setRole(r.role);
          setChora(true);
          setLoggedIn(true);
          setLogged(true);
          localStorage.setItem(
            "username",
            JSON.stringify({ username, token: r.token })
          );
          localStorage.setItem("role", JSON.stringify({ role: r.role }));
          localStorage.setItem(
            "department",
            JSON.stringify({ department: r.department })
          );
          localStorage.setItem("isLogged", JSON.stringify({ login: true }));
          localStorage.setItem("Token", r.Token);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  const onButtonClick = () => {
    setUsernameError("");
    setPasswordError("");
    //setLoggedIn(false);
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
      setPasswordError("Mật khẩu phải từ 5 kí tự trở lên!");
      return;
    }

    logIn();

    // console.log(username, password)
    // Authenticate user
  };

  return (
    <DefaultLayout>
      <Grid container spacing={0} direction="row" className={cx("container")}>
        <Paper className={cx("paper")}>
          <img src={img} alt="thumbnail" className={cx("img")} />
        </Paper>
        <Paper className={cx("paper")}>
          <div className={cx("titleContainer")}>
            <div>Đăng nhập</div>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input
              value={username}
              placeholder="Nhập username"
              onChange={(ev) => setUsername(ev.target.value)}
              className={cx("inputBox")}
            />
            <label className={cx("errorLabel")}>{usernameError}</label>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input
              value={password}
              type="password"
              placeholder="Nhập mật khẩu"
              onChange={(ev) => setPassword(ev.target.value)}
              className={cx("inputBox")}
            />
            <label className={cx("errorLabel")}>{passwordError}</label>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input
              className={cx("inputButton")}
              type="button"
              onClick={onButtonClick}
              value={"Đăng nhập"}
            />
          </div>
        </Paper>
      </Grid>
      {
        <Fade in={chora} timeout={1000}>
          <Alert
            variant="filled"
            severity="success"
            sx={{
              position: "fixed",
              fontSize: "1.0rem",
              left: "48px",
              bottom: "48px",
              zIndex: 100,
              width: "45%",
            }}
          >
            <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>
              Thành công
            </AlertTitle>
            Đăng nhập thành công!
          </Alert>
        </Fade>
      }
    </DefaultLayout>
  );
};

export default Login;
