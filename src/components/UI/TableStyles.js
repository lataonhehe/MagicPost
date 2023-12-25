import {
    Button,
    styled,
  } from "@mui/material";
  import Table from "@mui/material/Table";
  import TableCell from "@mui/material/TableCell";
  import TableContainer from "@mui/material/TableContainer";
  import TableHead from "@mui/material/TableHead";
  import TablePagination from "@mui/material/TablePagination";
  import TableRow from "@mui/material/TableRow";
  import TableSortLabel from "@mui/material/TableSortLabel";
  import IconButton from "@mui/material/IconButton";
  import { blue } from "@mui/material/colors";
  
  export const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: theme.palette.primary,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  }));
  
  export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));
  
  export const StyledTable = styled(Table)({
    minWidth: 750,
  });
  
  export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: "16px",
    padding: "20px",
  }));
  
  export const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontSize: "20px",
    fontWeight: "Bold",
    padding: "24px",
  }));
  
  export const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
    fontSize: "20px",
    fontWeight: "Bold",
  }));
  
  export const EnhancedTableToolbarContainer = styled(TableContainer)({
    padding: "32px",
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
  });
  
  export const EnhancedTableHeadContainer = styled(TableHead)({
    padding: "32px",
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
  });
  
  export const TablePaginationContainer = styled(TablePagination)({
    fontSize: "16px",
    padding: "20px",
  });
  
  export const TooltipButton = styled(Button)({
    fontSize: "14px",
    marginRight: "16px",
  });
  
  export const IconButtonContainer = styled(IconButton)({
    fontSize: "24px",
  });
  