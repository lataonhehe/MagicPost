// styles.js
import { Button, Divider, Fade, styled } from "@mui/material";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { orange } from "@mui/material/colors";

export const ColorComingButton = styled(Button)(({ theme }) => ({
  margin: '20px',
  '&:hover': {
    color: 'white',
    backgroundColor: theme.palette.secondary.light,
  },
}));

export const ColorPendingButton = styled(Button)(({ theme }) => ({
  margin: '20px',
  '&:hover': {
    color: theme.palette.getContrastText(orange[800]),
    backgroundColor: orange[800],
  },
}));

export const ColorSuccessButton = styled(Button)(({ theme }) => ({
  margin: '20px',
  '&:hover': {
    color: 'white',
    backgroundColor: theme.palette.success.light,
  },
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 750,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledBox = styled(Box)({
  width: '95%',
  margin: 'auto',
});