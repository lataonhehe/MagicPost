// EnhancedTableHead.js
import React from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import { EnhancedTableHeadContainer, StyledTableHeadCell, StyledTableSortLabel } from "../../components/UI/TableStyles";

const EnhancedTableHead = ({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, hasCheckbox }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <EnhancedTableHeadContainer>
      <TableRow>
        {hasCheckbox && (
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
        )}
        {headCells.map((headCell) => (
          <StyledTableHeadCell key={headCell.id} align="center" padding="20px" sortDirection={orderBy === headCell.id ? order : false}>
            <StyledTableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </StyledTableSortLabel>
          </StyledTableHeadCell>
        ))}
      </TableRow>
    </EnhancedTableHeadContainer>
  );
};

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
  hasCheckbox: PropTypes.bool.isRequired, // pass the hasCheckbox prop
};

export default EnhancedTableHead;
