import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./TransactionTable.module.scss";
import { TableContainer, Table, TableBody, TableRow, TableCell, Paper, TableHead, Button } from "@mui/material";
import { alpha, styled, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const cx = classNames.bind(styles);

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
  const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false };
  const formattedDateTime = new Date(dateTimeString).toLocaleDateString("en-US", options);
  return formattedDateTime;
};

function TransactionTable() {
  const [tableData, setTableData] = useState([]);
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [code, setCode] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(true);

  const fetchTrackingData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/Transaction/search_shipment?code=${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setTableData(data.transaction_list);
      setShipmentStatus(data.shipment_status);
    } catch (error) {
      console.error("Error fetching tracking data:", error.message);
    }
  };

  const handleFindButtonClick = () => {
    // Clear existing data if needed
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
            <SearchIcon fontSize="large" />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Nhập mã bưu gửi..." inputProps={{ "aria-label": "search" }} value={code} onChange={(ev) => setCode(ev.target.value)} />
        </Search>
        <Button variant="contained" color="primary" onClick={handleFindButtonClick}>
          Find
        </Button>
        {isTableOpen ? (
          <Button variant="contained" color="secondary" onClick={handleCloseTable}>
            Close Table
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleOpenTable}>
            Open Table
          </Button>
        )}
      </div>
      {isDataFetched && isTableOpen && (
        <div className={cx("content")}>
          <div>Mã vận đơn: {code}</div>
          <div>Trạng thái: {getStatus(shipmentStatus)}</div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" className={cx("table")}>
              <TableHead className={cx("thead")}>
                <TableCell className={cx("head-cell")}>Ngày</TableCell>
                <TableCell className={cx("head-cell")}>Vị trí</TableCell>
                <TableCell className={cx("head-cell")}>Trạng thái</TableCell>
              </TableHead>
              <TableBody className={cx("tbody")}>
                {tableData.map((row) => (
                  <StyledTableRow className={cx("row")} key={row.date}>
                    <TableCell className={cx("cell")}>{formatDateTime(row.date)}</TableCell>
                    <TableCell className={cx("cell")}>{row.des}</TableCell>
                    <TableCell className={cx("cell")}>{getStatus(row.status)}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;