import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "~/assets/logo-1@2x - Copy.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const cx = classNames.bind(styles);

function Header() {
  const username = JSON.parse(localStorage.getItem("username"));
  return (
    <header className={cx("wrapper")} style={{ background: "#001B42" }}>
      <nav className={cx("inner-header")}>
        <ul>
          <li className={cx("logo")}>
            <img src={logo} alt="MagicPost" href="/" />
          </li>
          <li className={cx("canhan")}>
            <p>Xin chào, quản lí {username.username}</p>
            <AccountCircleIcon sx={{ marginLeft: "8px" }} />
          </li>
          <li className={cx("logout")}>
            <a href="/login">
              <input
                className={cx("inputButton")}
                type="button"
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
