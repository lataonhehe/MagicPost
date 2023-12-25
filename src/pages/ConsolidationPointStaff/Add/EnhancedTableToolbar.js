// EnhancedTableToolbar.js
import React from "react";
import PropTypes from "prop-types";
import { Toolbar, Typography, Tooltip, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddBoxIcon from "@mui/icons-material/AddBox";

function EnhancedTableToolbar({ numSelected, handleAccept }) {
  return (
    <Toolbar
      sx={{
        padding: "32px",
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} fontWeight={"bold"} color="inherit" variant="h4" component="div">
          {numSelected} được tạo?
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h4" id="tableTitle" component="div" fontWeight="Bold">
          Tạo đơn hàng tới điểm giao dịch
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Tạo đơn hàng">
          <Button sx={{ fontSize: "14px", marginRight: "16px" }} variant="contained" startIcon={<AddBoxIcon sx={{ fontSize: "24px" }} />} onClick={handleAccept}>
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

export default EnhancedTableToolbar;
