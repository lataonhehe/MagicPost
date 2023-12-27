// EnhancedTableBody.js
import React from "react";
import { TableBody, TableRow, TableCell, Checkbox } from "@mui/material";
import { StyledTableRow } from "../components/UI/TableStyles";

const EnhancedTableBody = ({ visibleRows, isSelected, handleClick, emptyRows, headCells, hasCheckbox }) => {
  return (
    <TableBody>
      {visibleRows.map((row, index) => {
        const isItemSelected = isSelected(row.id);
        const labelId = `enhanced-table-checkbox-${index}`;

        return (
          <StyledTableRow
            hover
            onClick={(event) => handleClick(event, row.id)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
            sx={{ cursor: "pointer" }}
          >
            {hasCheckbox && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isItemSelected}
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </TableCell>
            )}
            {headCells.map((headCell) => (
              <TableCell key={headCell.id} align="center" sx={{ fontSize: "16px", paddingY: "20px" }} component="th" id={labelId} scope="row" padding="none">
                {row[headCell.id]}
              </TableCell>
            ))}
          </StyledTableRow>
        );
      })}
      {emptyRows > 0 && (
        <TableRow
          style={{
            height: 75 * emptyRows,
          }}
        >
          <TableCell colSpan={hasCheckbox ? headCells.length + 1 : headCells.length} />
        </TableRow>
      )}
    </TableBody>
  );
};

export default EnhancedTableBody;
