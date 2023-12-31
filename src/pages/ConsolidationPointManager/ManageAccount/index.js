import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TablePagination,
  Button,
  Collapse,
} from "@mui/material";
import EnhancedTableToolbar from "~/hooks/Table/EnhancedTableToolbar";
import { userCells } from "~/components/UI/TableCell";
import { getComparator, stableSort } from "~/hooks/Table/TableUtils";
import NewUserForm from "~/hooks/Form/NewUserForm";
import EnhancedTableHead from "~/hooks/Table/EnhancedTableHead";
import EnhancedTableBody from "~/hooks/Table/EnhancedTableBody";

function TransManagerManageAccounts() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [addUser, setAddUser] = useState(false); // Track whether to display the NewUserForm

  // import cell from tableCell in components
  const cells = userCells;
  const hasCheckbox = true;
  const tableName = "Quản lý tài khoản";
  // table type is create, delete or confirm
  const tableType = "del";

  const updateRows = (data) => {
    // Change id to key id
    if (Array.isArray(data)) {
      const updatedData = data.map((point) => {
        return { ...point, id: point.id };
      });

      setRows(updatedData);
    } else {
      console.error("Invalid data:", data);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        "http://127.0.0.1:8000/Account/employee_list",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      updateRows(data.employee_list);
    } catch (error) {}
  };

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem("Token");

      const deleteResponse = await fetch(
        "http://127.0.0.1:8000/Account/delete_employee",
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selected }),
        }
      );

      if (!deleteResponse.ok) {
        throw new Error("Delete request failed");
      }
      fetchData();
      setSelected([]);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once when the component mounts

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

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

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

  const handleAddUserClick = () => {
    setAddUser(!addUser); // Toggle the addUser state
  };

  return (
    <>
      <Box sx={{ width: "94%", margin: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUserClick}
        >
          Thêm nhân viên
        </Button>

        <Collapse in={addUser} timeout="auto">
          {addUser && <NewUserForm fetchData={fetchData} />}
        </Collapse>

        <Paper sx={{ width: "100%", mb: 2, marginTop: "20px" }} elevation={3}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleAccept={handleAccept}
            tableName={tableName}
            tableType={tableType}
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

export default TransManagerManageAccounts;
