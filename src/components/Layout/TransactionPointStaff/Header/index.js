import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "~/assets/logo-1@2x - Copy.png";
import { Button } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("username"));
  return (
    <header className={cx("wrapper")} style={{ background: "#001B42" }}>
      <nav className={cx("inner-header")}>
        <ul>
          <li className={cx("logo")}>
            <img src={logo} alt="MagicPost" href="/" />
          </li>

          <Button
            component="li"
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            className={cx("gioi-thieu")}
            onClick={() => {
              navigate("/");
            }}
          >
            Giới thiệu
          </Button>
          <Button
            component="li"
            className={cx("tra-cuu")}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={() => {
              navigate("/transactiontable");
            }}
          >
            Tra cứu
          </Button>
          <Button
            component="li"
            className={cx("dich-vu")}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={() => {
              navigate("/dichvu");
            }}
          >
            Dịch vụ
          </Button>
          <Button
            component="li"
            className={cx("tin-tuc")}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={() => {
              navigate("/tintuc");
            }}
          >
            Tin tức
          </Button>
          <li className={cx("canhan")}>
            <p>Xin chào, nhân viên {username.username}</p>
          </li>
          <li className={cx("logout")}>
            <a href="/login">
              <input
                className={cx("inputButton")}
                type="button"
                style={{ position: "fixed", top: "3px", right: "24px" }}
                value={"Đăng xuất"}
                onClick={() => localStorage.clear()}
              />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
