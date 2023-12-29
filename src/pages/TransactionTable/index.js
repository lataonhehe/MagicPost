import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./TransactionTable.module.scss";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  Button,
  Divider,
} from "@mui/material";
import { alpha, styled, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
import { blue } from "@mui/material/colors";

const cx = classNames.bind(styles);

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[500]),
  backgroundColor: theme.palette.primary,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  margin: "64px",
  padding: 0,
  borderRadius: "4px",
  backgroundColor: alpha("#6495ed", 0.15),
  "&:hover": {
    backgroundColor: alpha("#6495ed", 0.25),
  },
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  padding: theme.spacing(0, 2),
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  fontSize: "19px",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function getStatus(status) {
  switch (status) {
    case "Pending":
      return "Đang chờ";
    case "In Progress":
      return "Đang vận chuyển";
    case "Completed":
      return "Thành công";
    case "Failed":
      return "Thất bại";
    default:
      return status;
  }
}

const formatDateTime = (dateTimeString) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  };
  const formattedDateTime = new Date(dateTimeString).toLocaleDateString(
    "vi-VN",
    options
  );
  return formattedDateTime;
};

function TransactionTable() {
  const [tableData, setTableData] = useState([]);
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [shipmentPos, setShipmentPos] = useState("");
  const [shipmentDes, setShipmentDes] = useState("");
  const [weight, setWeight] = useState("");
  const [code, setCode] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(true);

  const fetchTrackingData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/Transaction/search_shipment?code=${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data.transaction_list);
      setTableData(data.transaction_list);
      setShipmentStatus(data.shipment_status);
      setShipmentDes(data.shipment_pos);
      setShipmentPos(data.shipment_des);
      setWeight(data.shipment_weight);
      console.log(data.shipment_status);
    } catch (error) {
      console.error("Error fetching tracking data:", error.message);
    }
  };

  const handleFindButtonClick = () => {
    // Clear existing data if needed
    setWeight("");
    setShipmentPos("");
    setShipmentDes("");
    setTableData([]);
    setShipmentStatus("");

    // Trigger fetching data
    fetchTrackingData();
    setIsDataFetched(true);
  };

  const handleCloseTable = () => {
    setIsTableOpen(false);
  };

  const handleOpenTable = () => {
    setIsTableOpen(true);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("btn-page")}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon fontSize="24px" />
          </SearchIconWrapper>
          <StyledInputBase
            sx={{ marginLeft: "16px", fontSize: "medium" }}
            placeholder="Nhập mã bưu gửi..."
            inputProps={{ "aria-label": "search" }}
            value={code}
            onChange={(ev) => setCode(ev.target.value)}
          />
        </Search>
        <ColorButton
          endIcon={<SearchIcon />}
          variant="contained"
          color="primary"
          onClick={handleFindButtonClick}
          sx={{ fontSize: "22px", margin: "4px", padding: "-16px" }}
        >
          Tìm kiếm
        </ColorButton>
        {isTableOpen ? (
          <ColorButton
            variant="contained"
            onClick={handleCloseTable}
            sx={{ fontSize: "22px", margin: "4px", padding: "-16px" }}
          >
            Đóng Bảng
          </ColorButton>
        ) : (
          <ColorButton
            variant="contained"
            onClick={handleOpenTable}
            sx={{ fontSize: "22px", margin: "4px", padding: "-16px" }}
          >
            Mở Bảng
          </ColorButton>
        )}
      </div>
      <div className={cx("information")}>
        <h2 style={{ color: "#0072BC" }}>Thông tin kiện hàng</h2>
        <Box
          sx={{
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            color: "white",
            display: "flex",
            alignItems: "stretch",
            flexWrap: "wrap",
            padding: "10px 30px",
            backgroundColor: "primary.main",
          }}
        >
          <div className={cx("infor-container")}>
            <div className={cx("header-i-container")}>Mã bưu gửi</div>
            <p className={cx("infor-p")}>{isDataFetched && code}</p>
          </div>
          <div className={cx("infor-container")}>
            <div className={cx("header-i-container")}>Trạng thái</div>
            <p className={cx("infor-p")}>{getStatus(shipmentStatus)}</p>
          </div>
          <div className={cx("infor-container-right")}>
            <div className={cx("header-i-container")}>Khối lượng</div>
            <p className={cx("infor-p")}>
              {weight} <p> gram</p>
            </p>
          </div>
        </Box>
        <Box
          sx={{
            backgroundColor: "rgba(224, 224, 224, 0.25)",
          }}
        >
          <div className={cx("infor-container-inside")}>
            <div className={cx("header-i-inside")}>Trạng thái:</div>
            <p className={cx("infor-p-inside")}>
              {getStatus(shipmentStatus) && getStatus(shipmentStatus)}
            </p>
          </div>
          <div className={cx("infor-container-inside")}>
            <div className={cx("header-i-inside")}>Nơi gửi:</div>
            <p className={cx("infor-p-inside")}>{shipmentPos}</p>
          </div>
          <div className={cx("infor-container-inside")}>
            <div className={cx("header-i-inside")}>Nơi nhận:</div>
            <p className={cx("infor-p-inside")}>{shipmentDes}</p>
          </div>
        </Box>
      </div>
      <div style={{ height: "69px" }}></div>
      {isDataFetched && isTableOpen && (
        <div className={cx("content")}>
          <Divider />
          <TableContainer component={Paper}>
            <Table aria-label="simple table" className={cx("table")}>
              <TableHead className={cx("thead")}>
                <TableCell className={cx("head-cell")}>Ngày</TableCell>
                <TableCell className={cx("head-cell")}>Vị trí gửi</TableCell>
                <TableCell className={cx("head-cell")}>Vị trí nhận</TableCell>
                <TableCell className={cx("head-cell")}>Trạng thái</TableCell>
              </TableHead>
              <TableBody className={cx("tbody")}>
                {tableData.map((row) => (
                  <StyledTableRow className={cx("row")} key={row.date}>
                    <TableCell className={cx("cell")}>
                      {formatDateTime(row.date)}
                    </TableCell>
                    <TableCell className={cx("cell")}>{row.pos}</TableCell>
                    <TableCell className={cx("cell")}>{row.des}</TableCell>
                    <TableCell className={cx("cell")}>
                      {getStatus(row.status)}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <div style={{ height: "138px" }}></div>
    </div>
  );
}

export default TransactionTable;
