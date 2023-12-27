import React, { useEffect, useState } from "react";
import { Box, Paper, Table, TableContainer, TablePagination } from "@mui/material";
import EnhancedTableToolbar from "~/hooks/EnhancedTableToolbar";
import { confirmCells } from "~/components/UI/TableCell";
import { getComparator, stableSort } from "~/hooks/TableUtils";
import EnhancedTableHead from "~/hooks/EnhancedTableHead";
import EnhancedTableBody from "~/hooks/EnhancedTableBody";

function TransStaffAcceptConsolidation() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  //import cell from tableCell in components
  const cells = confirmCells;
  const hasCheckbox = true;
  const tableName = "Xác nhận đơn hàng từ điểm tập kết";
  //table type is create, delete or confirm
  const tableType = "confirm";

  const updateRows = (data) => {
    //Change id to key id
    if (Array.isArray(data)) {
      const updatedData = data.map((point) => {
        return { ...point, id: point.transaction_id };
      });
      
      setRows(updatedData)
    } else {
      console.error("Invalid consolidation points data:", data);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch("http://127.0.0.1:8000/Transaction/employee/get_coming_transaction", {
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
      
      const response = await fetch("http://127.0.0.1:8000/Transaction/transaction_employee/shipment_from_consolidation", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_id: selected }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      fetchData();
      setSelected([]);
    } catch (error) {}
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? rows.map((n) => n.id) : []);
  };
  
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
  
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
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
  
  const isSelected = (id) => selected.includes(id);
  

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    return stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, rows]);

  return (
    <>
      <Box sx={{ width: "94%", margin: "auto" }}>
        <Paper sx={{ width: "100%", mb: 2, marginTop: "20px" }} elevation={3}>
          <EnhancedTableToolbar numSelected={selected.length} handleAccept={handleAccept} tableName={tableName} tableType={tableType} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
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
              <EnhancedTableBody visibleRows={visibleRows} isSelected={isSelected} handleClick={handleClick} emptyRows={emptyRows} hasCheckbox={hasCheckbox} headCells={cells} />
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
export default TransStaffAcceptConsolidation;
