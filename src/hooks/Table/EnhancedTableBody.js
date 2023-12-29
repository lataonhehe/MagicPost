// EnhancedTableBody.js
import React from "react";
import { TableBody, TableRow, TableCell, Checkbox } from "@mui/material";
import { StyledTableRow } from "../../components/UI/TableStyles";

const EnhancedTableBody = ({ visibleRows, isSelected, handleClick, emptyRows, headCells, hasCheckbox }) => {
  return (
    <TableBody>
      {visibleRows.map((row, index) => {
        const isItemSelected = isSelected(row.id);
        const labelId = `enhanced-table-checkbox-${index}`;

        return (
          <StyledTableRow
            hover={hasCheckbox} // Only enable hover effect if hasCheckbox is true
            onClick={hasCheckbox ? (event) => handleClick(event, row.id) : undefined} // Only handle click if hasCheckbox is true
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={hasCheckbox ? 0 : -1} // Set tabIndex to -1 if hasCheckbox is false
            key={row.id}
            selected={isItemSelected}
            sx={{ cursor: hasCheckbox ? "pointer" : "default" }} // Change cursor style based on hasCheckbox
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
