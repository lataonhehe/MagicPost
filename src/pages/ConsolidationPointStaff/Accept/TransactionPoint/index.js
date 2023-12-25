import {
  Button,
  Divider,
  styled,
} from "@mui/material";
import classNames from "classnames/bind";
import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
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
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import { blue } from "@mui/material/colors";
import { useState } from "react";
import { useEffect } from "react";
import styles from "./AcceptTrans.module.scss";

// const cx = classNames.bind(styles);
// const ColorButton = styled(Button)(({ theme }) => ({
//   color: theme.palette.getContrastText(blue[500]),
//   backgroundColor: theme.palette.primary,
//   "&:hover": {
//     backgroundColor: theme.palette.primary.light,
//   },
// }));

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
    label: "Mã đơn hàng",
  },
  {
    id: "current_pos",
    numeric: false,
    disablePadding: true,
    label: "Nơi gửi",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Trạng thái",
  },
  {
    id: "transaction_id",
    numeric: false,
    disablePadding: true,
    label: "Mã giao dịch",
  },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            sx={{ fontSize: "24px" }}
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all staff",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ fontSize: "20px", fontWeight: "Bold", padding: "24px" }}
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
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, handleAccept } = props;
  return (
    <Toolbar
      sx={{
        padding: "32px",
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          fontWeight={"bold"}
          color="inherit"
          variant="h4"
          component="div"
        >
          {numSelected} được chọn
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h4"
          id="tableTitle"
          component="div"
          fontWeight="Bold"
        >
          Xác nhận đơn hàng
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xác nhận giao dịch">
          <Button
            sx={{ fontSize: "14px", marginRight: "16px" }}
            variant="contained"
            startIcon={<DeleteIcon sx={{ fontSize: "24px" }} />}
            onClick={handleAccept}
          >
            Xác nhận
          </Button>
        </Tooltip>
      ) : (
        <></>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default function ConsolStaffAcceptConsolidation() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  const updateRows = (newRows) => {
    setRows(newRows);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        "http://127.0.0.1:8000/Transaction/employee/get_coming_transaction",
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
      updateRows(data.transaction_point);

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

      const response = await fetch(
        "http://127.0.0.1:8000/Transaction/consolidation_employee/shipment_from_transaction",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transaction_id: selected }),
        }
      );

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message)
      }

      fetchData();
      setSelected([]);
    } catch (error) {}
  }

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
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
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
        <Paper sx={{ width: "100%", mb: 2, marginTop: "48px" }} elevation={3}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleAccept={handleAccept}
          />
          <Divider />
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
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.transaction_id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <StyledTableRow
                      hover
                      onClick={(event) => handleClick(event, row.transaction_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.transaction_id}
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
                        {row.current_pos}
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
                        {row.transaction_id}
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
