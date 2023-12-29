import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TablePagination,
} from "@mui/material";
import EnhancedTableToolbar from "~/hooks/Table/EnhancedTableToolbar";
import { ColorButton } from "~/components/UI/TableStyles";
import { statisticCells } from "~/components/UI/TableCell";
import { getComparator, stableSort } from "~/hooks/Table/TableUtils";
import EnhancedTableHead from "~/hooks/Table/EnhancedTableHead";
import EnhancedTableBody from "~/hooks/Table/EnhancedTableBody";
import { BarChart, axisClasses } from "@mui/x-charts";
import SendIcon from "@mui/icons-material/Send";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function ConsolManagerStatics() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [activeButton, setActiveButton] = useState("sent");

  //import cell from tableCell in components
  const cells = statisticCells;
  const hasCheckbox = false;
  const tableName = "Thống kê";

  const updateRows = (data) => {
    //Change id to key id
    if (Array.isArray(data)) {
      const updatedData = data.map((point) => {
        return { ...point, id: point.shipment_id };
      });

      setRows(updatedData);
    } else {
      console.error("Invalid data:", data);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("Token");
      const apiUrl = "http://127.0.0.1:8000/Transaction/list_shipment";
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (activeButton === "sent") updateRows(data.outgoing_shipment);
      if (activeButton === "coming") updateRows(data.coming_shipment);
      if (activeButton === "pending") updateRows(data.pending_shipment);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeButton]); // Run once when the component mounts

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    return stableSort(rows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, rows]);

  return (
    <>
      <Box sx={{ width: "94%", margin: "auto" }}>
        <Box sx={{ display: "flex", flex: "row", marginTop: "16px" }}>
          <BarsDataset />
        </Box>
        <ColorButton
          startIcon={<SendIcon />}
          variant="contained"
          sx={{
            fontSize: "18px",
            margin: "32px",
            backgroundColor: activeButton === "sent" ? "#4caf50" : "#2196f3",
          }}
          onClick={() => handleButtonClick("sent")}
        >
          Hàng đã gửi
        </ColorButton>
        <ColorButton
          startIcon={<InventoryIcon />}
          variant="contained"
          sx={{
            fontSize: "18px",
            margin: "32px",
            backgroundColor: activeButton === "pending" ? "#4caf50" : "#2196f3",
          }}
          onClick={() => handleButtonClick("pending")}
        >
          Hàng đã nhận
        </ColorButton>
        <ColorButton
          startIcon={<LocalShippingIcon />}
          variant="contained"
          sx={{
            fontSize: "18px",
            margin: "32px",
            backgroundColor: activeButton === "coming" ? "#4caf50" : "#2196f3",
          }}
          onClick={() => handleButtonClick("coming")}
        >
          Hàng đang vận chuyển
        </ColorButton>
        <Paper sx={{ width: "100%", mb: 2, marginTop: "20px" }} elevation={3}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            tableName={tableName}
            tableType={"view"}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                hasCheckbox={hasCheckbox}
                headCells={cells}
              />
              <EnhancedTableBody
                visibleRows={visibleRows}
                isSelected={isSelected}
                handleClick={handleClick}
                emptyRows={emptyRows}
                hasCheckbox={hasCheckbox}
                headCells={cells}
              />
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ fontSize: "16px", padding: "20px" }}
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Trang "
          />
        </Paper>
      </Box>
    </>
  );
}

const chartSetting = {
  yAxis: [
    {
      label: "Số lượng (đơn)",
    },
  ],
  width: 1150,
  height: 500,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
    padding: "6px",
    marginLeft: "60px",
    alignSelf: "center",
  },
};
const dataset = [
  {
    pending: 15,
    outgoing: 11,
    incoming: 9,
    month: "Dec",
  },
];

const valueFormatter = (value) => `${value} đơn`;

function BarsDataset() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "month" }]}
      series={[
        {
          dataKey: "pending",
          label: "Đang vận chuyển",
          valueFormatter,
          color: "#ff9800",
        },
        {
          dataKey: "outgoing",
          label: "Đã gửi",
          valueFormatter,
          color: "#4caf50",
        },
        {
          dataKey: "incoming",
          label: "Đã nhận",
          valueFormatter,
          color: "#03a9f4",
        },
      ]}
      {...chartSetting}
    />
  );
}
