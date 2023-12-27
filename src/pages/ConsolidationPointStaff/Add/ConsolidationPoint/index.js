// ConsolStaffAddTransaction.js
import React, { useEffect, useState } from "react";
import { Box, Paper, Table, TableContainer, TablePagination } from "@mui/material";
import EnhancedTableToolbar from "../../../../hooks/EnhancedTableToolbar";
import { ColorButton } from "~/components/UI/TableStyles";
import { createCells, viewCells } from "~/components/UI/TableCell";
import { getComparator, stableSort } from "~/hooks/TableUtils";
import EnhancedTableHead from "../../../../hooks/EnhancedTableHead";
import EnhancedTableBody from "../../../../hooks/EnhancedTableBody";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";

export default function ConsolStaffAddTransaction() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [activeButton, setActiveButton] = useState("create");

  const updateRows = (data) => {
    //Change id to key id
    if (Array.isArray(data)) {
      const updatedData = data.map((point) => {
        return { ...point, id: point.shipment_id };
      });
      
      setRows(updatedData)
    } else {
      console.error("Invalid data:", data);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("Token");
      const apiUrl = activeButton === "create" ? "http://127.0.0.1:8000/Transaction/employee/get_shipment_list" : "http://127.0.0.1:8000/Transaction/employee/get_transaction";
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
      updateRows(data.consolidation_point);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeButton]); // Run once when the component mounts

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch("http://127.0.0.1:8000/Transaction/consolidation_employee/shipment_to_consolidation", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipment_id: selected }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      fetchData();
      setSelected([]);
    } catch (error) {
      console.error("Error accepting transaction:", error.message);
    }
  };

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
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    return stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, rows]);

  return (
    <>
      <Box sx={{ width: "94%", margin: "auto" }}>
        <ColorButton
          startIcon={<AddBoxIcon />}
          variant="contained"
          sx={{
            fontSize: "18px",
            margin: "32px",
            backgroundColor: activeButton === "create" ? "#4caf50" : "#2196f3",
          }}
          onClick={() => handleButtonClick("create")}
        >
          Tạo đơn hàng
        </ColorButton>
        <ColorButton
          startIcon={<ListAltIcon />}
          variant="contained"
          sx={{
            fontSize: "18px",
            margin: "32px",
            backgroundColor: activeButton === "view" ? "#4caf50" : "#2196f3",
          }}
          onClick={() => handleButtonClick("view")}
        >
          Đơn đã tạo
        </ColorButton>
        <Paper sx={{ width: "100%", mb: 2, marginTop: "20px" }} elevation={3}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleAccept={handleAccept}
            tableName={activeButton === "create" ? "Tạo đơn hàng tới điểm tập kết" : "Đơn hàng đã tạo"}
            tableType={"create"}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                hasCheckbox={activeButton === "create" ? true : false}
                headCells={activeButton === "create" ? createCells : viewCells}
              />
              <EnhancedTableBody
                visibleRows={visibleRows}
                isSelected={isSelected}
                handleClick={handleClick}
                emptyRows={emptyRows}
                hasCheckbox={activeButton === "create" ? true : false}
                headCells={activeButton === "create" ? createCells : viewCells}
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
