import { Button, Divider, Fade, styled } from "@mui/material";
import classNames from "classnames/bind";
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { orange } from "@mui/material/colors";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";

const ColorComingButton = styled(Button)(({ theme }) => ({
  margin: "20px",
  "&:hover": {
    color: "white",
    backgroundColor: theme.palette.secondary.light,
  },
}));

const ColorPendingButton = styled(Button)(({ theme }) => ({
  margin: "20px",
  "&:hover": {
    color: theme.palette.getContrastText(orange[800]),
    backgroundColor: orange[800],
  },
}));
const ColorSuccessButton = styled(Button)(({ theme }) => ({
  margin: "20px",
  "&:hover": {
    color: "white",
    backgroundColor: theme.palette.success.light,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "shipment_id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Trạng thái",
  },
  {
    id: "DHCode",
    numeric: false,
    disablePadding: true,
    label: "Mã bưu gửi",
  },
  {
    id: "sender_address",
    numeric: false,
    disablePadding: true,
    label: "Địa chỉ gửi",
  },
  {
    id: "receiver_address",
    numeric: false,
    disablePadding: true,
    label: "Địa chỉ nhận",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: true,
    label: "Phân loại",
  },
  {
    id: "weight",
    numeric: false,
    disablePadding: true,
    label: "Khối lượng",
  },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ fontSize: "18px", fontWeight: "Bold", padding: "24px" }}
            key={headCell.id}
            align={headCell.numeric ? "left" : "right"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar() {
  return (
    <Toolbar
      sx={{
        padding: "32px",
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h4"
        id="tableTitle"
        component="div"
        fontWeight="Bold"
      >
        Thống kê
      </Typography>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default function TransManagerStatics() {
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  function handleStatus() {
    setStatus(!status);
  }

  const updateRows = (index, newValue) => {
    setRows((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = newValue;
      return newValues;
    });
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
      updateRows(data.employee_list.id, data.employee_list);

      // Save the employee list to local storage
      sessionStorage.setItem(
        "employeeList",
        JSON.stringify(data.employee_list)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Retrieve employee list from local storage when component mounts
    const storedEmployeeList = sessionStorage.getItem("employeeList");
    if (storedEmployeeList) {
      setRows(JSON.parse(storedEmployeeList));
    } else {
      fetchData();
    }
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      return;
    }
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <>
      <Box sx={{ width: "95%", margin: "auto" }}>
        <ColorComingButton
          startIcon={<PersonAddIcon />}
          variant="outlined"
          onClick={handleStatus}
          sx={{ fontSize: "20px" }}
        >
          Hàng đã gửi
        </ColorComingButton>
        <ColorSuccessButton
          startIcon={<PersonAddIcon />}
          variant="outlined"
          onClick={handleStatus}
          sx={{ fontSize: "20px" }}
        >
          Hàng đã nhận
        </ColorSuccessButton>
        <ColorPendingButton
          startIcon={<PersonAddIcon />}
          variant="outlined"
          onClick={handleStatus}
          sx={{ fontSize: "20px" }}
        >
          Hàng đang vận chuyển
        </ColorPendingButton>
        <Paper sx={{ width: "100%", mb: 2 }} elevation={3}>
          <EnhancedTableToolbar />
          <Divider />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.shipment_id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        align="right"
                        sx={{ fontSize: "16px", padding: "20px" }}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.shipment_id}
                      </TableCell>
                      <TableCell
                        align="right"
                        padding="none"
                        sx={{ fontSize: "16px", padding: "20px" }}
                      >
                        {row.status}
                      </TableCell>
                      <TableCell
                        align="right"
                        padding="none"
                        sx={{ fontSize: "16px", padding: "20px" }}
                      >
                        {row.DHCode}
                      </TableCell>
                      <TableCell
                        align="right"
                        padding="none"
                        sx={{ fontSize: "16px", padding: "20px" }}
                      >
                        {row.sender_address}
                      </TableCell>
                      <TableCell
                        align="right"
                        padding="none"
                        sx={{ fontSize: "16px", padding: "20px" }}
                      >
                        {row.receiver_address}
                      </TableCell>
                      <TableCell
                        align="right"
                        padding="none"
                        sx={{ fontSize: "16px", padding: "20px" }}
                      >
                        {row.type}
                      </TableCell>
                      <TableCell
                        align="right"
                        padding="none"
                        sx={{ fontSize: "16px", padding: "20px" }}
                      >
                        {row.weight}
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 66 : 120) * emptyRows,
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
