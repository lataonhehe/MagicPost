import classNames from "classnames/bind";
import styles from "./FunctionBar.module.scss";
import { Box, Collapse, ListItem } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useState } from "react";
import { useEffect } from "react";

const cx = classNames.bind(styles);

function FunctionBar() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  const [open7, setOpen7] = useState(false);

  const handleClick7 = () => {
    setOpen7(!open7);
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
    setOpen5(false);
    setOpen6(false);
  };
  const handleClick1 = () => {
    setOpen1(!open1);
  };
  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const handleClick3 = () => {
    setOpen3(!open3);
    setOpen1(true);
    setOpen2(false);
    setOpen4(false);
    setOpen5(false);
    setOpen6(false);
  };
  const handleClick4 = () => {
    setOpen4(!open4);
    setOpen1(true);
    setOpen2(false);
    setOpen3(false);
    setOpen5(false);
    setOpen6(false);
  };
  const handleClick5 = () => {
    setOpen5(!open5);
    setOpen2(true);
    setOpen1(false);
    setOpen3(false);
    setOpen4(false);
    setOpen6(false);
  };
  const handleClick6 = () => {
    setOpen6(!open6);
    setOpen2(true);
    setOpen1(false);
    setOpen3(false);
    setOpen4(false);
    setOpen5(false);
  };

  const path = window.location.href;
  useEffect(() => {
    if (path.includes("/accepttrans")) {
      handleClick3();
    }
    if (path.includes("/acceptconsol")) {
      handleClick4();
    }
    if (path.includes("/addtrans")) {
      handleClick5();
    }
    if (path.includes("/addconsol")) {
      handleClick6();
    }
    if (path.includes("/statistics")) {
      handleClick7();
    }
  }, [path]);

  return (
    <Box className={cx("wrapper")} sx={{ boxShadow: 1 }} p={2}>
      <h3 style={{ paddingLeft: "16px" }}>Nhân Viên Giao Dịch</h3>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton
            // component="a" href="/consolstaff/accept"
            selected={open1}
            onClick={() => handleClick1()}
          >
            <ListItemIcon>
              <FactCheckIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary="Xác nhận đơn hàng"
              primaryTypographyProps={{ fontSize: "medium" }}
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        <Collapse in={open1}>
          <List>
            <ListItem>
              <ListItemButton
                // component="a" href="/consolstaff/add"
                selected={open3}
                onClick={() => handleClick3()}
              >
                <ListItemIcon>
                  <ArrowRightIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText
                  primary="Điểm Giao Dịch"
                  primaryTypographyProps={{ fontSize: "small" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                // component="a" href="/consolstaff/add"
                selected={open4}
                onClick={() => handleClick4()}
              >
                <ListItemIcon>
                  <ArrowRightIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText
                  primary="Điểm Tập Kết"
                  primaryTypographyProps={{ fontSize: "small" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <List>
          <ListItem>
            <ListItemButton
              // component="a" href="/consolstaff/add"
              selected={open2}
              onClick={() => handleClick2()}
            >
              <ListItemIcon>
                <ReceiptLongIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Tạo đơn hàng"
                primaryTypographyProps={{ fontSize: "medium" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Collapse in={open2}>
          <List>
            <ListItem>
              <ListItemButton
                // component="a" href="/consolstaff/add"
                selected={open5}
                onClick={() => handleClick5()}
              >
                <ListItemIcon>
                  <AddBoxIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary="Điểm Giao Dịch"
                  primaryTypographyProps={{ fontSize: "small" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                // component="a" href="/consolstaff/add"
                selected={open6}
                onClick={() => handleClick6()}
              >
                <ListItemIcon>
                  <AddBoxIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary="Điểm Tập Kết"
                  primaryTypographyProps={{ fontSize: "small" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <List>
          <ListItem>
            <ListItemButton
              // component="a" href="/consolstaff/add"
              selected={open7}
              onClick={() => handleClick7()}
            >
              <ListItemIcon>
                <ListAltIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary="Thống kê"
                primaryTypographyProps={{ fontSize: "medium" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </List>
    </Box>
  );
}

export default FunctionBar;
