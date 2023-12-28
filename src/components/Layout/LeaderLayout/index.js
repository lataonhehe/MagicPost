import styles from "./Leader.module.scss";
import classNames from "classnames/bind";
import Header from "./Header";
import FunctionBar from "./FunctionBar";
import { Button, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const cx = classNames.bind(styles);

function LeaderLayout({ children }) {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <div className={cx("wrapper")}>
        <Header />
        <div
          style={{
            height: "69px",
            width: "1250px",
            backgroundColor: "#001B42",
          }}
        ></div>
        <div class={cx(`container${open ? "Open" : "Closed"}`)}>
          <Button
            onClick={handleToggle}
            style={{
              color: "white",
              position: "fixed",
              top: "12px",
              left: "20px",
              zIndex: "2000",
            }}
          >
            <MenuIcon fontSize="large" />
          </Button>
          <div className={cx(`${open ? "Open" : "Closed"}`)}>
            <Collapse
              orientation="horizontal"
              in={open}
              timeout="auto"
            ></Collapse>
          </div>
          <Collapse
            orientation="horizontal"
            in={open}
            timeout="auto"
            className={cx(`functionBar${open ? "Open" : "Closed"}`)}
          >
            {open && <FunctionBar open={open} />}
          </Collapse>
          <div className={cx(`content${open ? "Open" : "Closed"}`)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderLayout;
