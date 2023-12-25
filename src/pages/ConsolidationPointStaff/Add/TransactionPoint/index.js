// ConsolStaffAddTransaction.js
import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox } from "@mui/material";
import EnhancedTableToolbar from "../EnhancedTableToolbar";
import { ColorButton, StyledTableRow } from "../../../../components/UI/TableStyles";
import { descendingComparator, getComparator, stableSort } from "../../../../hooks/TableUtils";
import EnhancedTableHead from "../EnhancedTableHead";
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

  const updateRows = (newRows) => {
    setRows(newRows);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("Token");
      const apiUrl =
      activeButton === "create"
        ? "http://127.0.0.1:8000/Transaction/employee/get_shipment_list"
        : "YOUR_API_URL_FOR_VIEW";
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
      updateRows(data.transaction_point);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once when the component mounts

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem("Token");
      const apiUrl =
      activeButton === "create"
        ? "http://127.0.0.1:8000/Transaction/consolidation_employee/shipment_to_transaction"
        : "http://127.0.0.1:8000/Transaction/transaction_employee/get_transaction_department";
      const response = await fetch(apiUrl, {
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
    setActiveButton(buttonType)
    console.log(activeButton);
    updateRows([]);
    fetchData();
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
          <EnhancedTableToolbar numSelected={selected.length} handleAccept={handleAccept} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
              <EnhancedTableHead numSelected={selected.length} order={order} orderBy={orderBy} onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={rows.length} />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.shipment_id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <StyledTableRow
                      hover
                      onClick={(event) => handleClick(event, row.shipment_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.shipment_id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: "16px", padding: "20px" }} component="th" id={labelId} scope="row" padding="none">
                        {row.shipment_id}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: "16px", padding: "20px" }} component="th" id={labelId} scope="row" padding="none">
                        {row.type}
                      </TableCell>
                      <TableCell align="right" padding="none" sx={{ fontSize: "16px", padding: "20px" }}>
                        {row.current_pos}
                      </TableCell>
                      <TableCell align="right" padding="none" sx={{ fontSize: "16px", padding: "20px" }}>
                        {row.des}
                      </TableCell>
                      <TableCell align="right" padding="none" sx={{ fontSize: "16px", padding: "20px" }}>
                        {row.status}
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 75 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
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
