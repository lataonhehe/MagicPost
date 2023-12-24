import {
  Autocomplete,
  Button,
  Collapse,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputBase,
  MenuItem,
  TextField,
  styled,
} from "@mui/material";
import classNames from "classnames/bind";
import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import { blue } from "@mui/material/colors";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./AddNew.module.scss";
import { useLayoutEffect } from "react";

const cx = classNames.bind(styles);
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[500]),
  backgroundColor: theme.palette.primary,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

export function InputAdornments({ fetchData }) {
  const [nguoigui, setNguoigui] = useState(true);
  const [values, setValues] = useState({
    sender_name: "",
    des: "",
    sender_address: "",
    sender_postal_code: "",
    sender_total_payment: "",
    sender_phone: "",
    receiver_address: "",
    receiver_postal_code: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_total_payment: "",
    receiving_date: "",
    good_type: "",
    special_service: "",
    weight: "",
  });
  const [error, setError] = useState({
    sender_name: "",
    des: "",
    sender_address: "",
    sender_postal_code: "",
    sender_total_payment: "",
    sender_phone: "",
    receiver_address: "",
    receiver_postal_code: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_total_payment: "",
    receiving_date: "",
    good_type: "",
    special_service: "",
    weight: "",
  });
  const handleResetForm = () => {
    setValues({
      sender_name: "",
      des: "",
      sender_address: "",
      sender_postal_code: "",
      sender_total_payment: "",
      sender_phone: "",
      receiver_address: "",
      receiver_postal_code: "",
      receiver_name: "",
      receiver_phone: "",
      receiver_total_payment: "",
      receiving_date: "",
      good_type: "",
      special_service: "",
      weight: "",
    });
  };

  const handleResetError = () => {
    setError({
      sender_name: "",
      des: "",
      sender_address: "",
      sender_postal_code: "",
      sender_total_payment: "",
      sender_phone: "",
      receiver_address: "",
      receiver_postal_code: "",
      receiver_name: "",
      receiver_phone: "",
      receiver_total_payment: "",
      receiving_date: "",
      good_type: "",
      special_service: "",
      weight: "",
    });
  };

  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [service, setService] = useState([]);
  const [provinceID, setProvinceID] = useState();
  const [districtID, setDistrictID] = useState();
  const [wardID, setWardID] = useState();
  const [serviceID, setServiceID] = useState();
  async function fetchDataProvince() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";

    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        {
          method: "GET",
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      //ProvinceID ProvinceName
      setProvince((await response.json()).data);
      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get Province");
    }
  }
  async function fetchDataDistrict() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //   province_id: provinceid,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setDistrict(data);
          // Xử lý dữ liệu ở đây
        });

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }
  async function fetchDataWard() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //   district_id: districtid,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setWard(data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }
  async function fetchDataService() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //   shop_id: 4791893,
          //   from_district: districtid,
          //   to_district: toDistrictID,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setService(data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }
  async function canculatePayment() {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //   name: "test",
          //   service_id: serviceid,
          //   coupon: null,
          //   from_district_id: districtid,
          //   to_district_id: toDistrictID,
          //   to_ward_code: wardid,
          //   weight: weightt,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setService(data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }

  useLayoutEffect(() => {
    fetchDataProvince();
    //   fetchDataDistrict();
    //   fetchDataWard();
    //   fetchDataService();
    //   canculatePayment();
    // console.log(ward);
  }, []);

  const handleChange = (field, value) => {
    console.log(values.sender_address);
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const handleChangeError = (field, value) => {
    setError((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleAddNew = async () => {
    try {
      const token = localStorage.getItem("Token");
      const addResponse = await fetch(
        "http://127.0.0.1:8000/Account/register",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        }
      );
      fetchData();
      if (!addResponse.ok) {
        window.alert("Thông tin không hợp lệ!");
        throw new Error("Add new shipment request failed");
      }
    } catch (error) {}
  };

  const onButtonClick = () => {
    handleResetError();
    if (values.name.trim() === "") {
      handleChangeError("name", "Hãy nhập họ và tên");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(values.username.trim())) {
      handleChangeError("name", "Họ và tên không hợp lệ!");
      return;
    }

    if (values.password.trim() === "") {
      handleChangeError("sender_address", "Hãy nhập địa chỉ!");
      return;
    }
    if (values.password.trim() === "") {
      handleChangeError("sender_phone", "Hãy nhập số điện thoại!");
      return;
    }

    handleAddNew();
  };

  return (
    <Box sx={{ margin: "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ m: 1, fontSize: "24px" }} variant="outlined">
          <h3 style={{ marginLeft: "16px", marginTop: "16px" }}>
            Ghi nhận đơn hàng mới
          </h3>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                padding: "10px",
                alignContent: "center",
                flexDirection: "column",
                margin: "24px",
              }}
            >
              <h5 style={{ margin: "auto" }}>Thông tin người gửi</h5>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Họ và tên
              </label>
              <TextField
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                placeholder="Họ và tên"
                value={values.sender_name}
                onChange={(e) => handleChange("sender_name", e.target.value)}
                inputProps={{
                  "aria-label": "sender_name",
                }}
              />
              <label className={cx("errorLabel")}>{error.sender_name}</label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Địa chỉ
              </label>
              {console.log(province)}
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                disablePortal
                options={province.map((value) => value.ProvinceName)}
                // value={values.sender_address}
                // onChange={(e) => handleChange("sender_address", e.target.value)}
                inputProps={{
                  "aria-label": "sender_address",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ fontSize: "16px" }}
                    placeholder="Tỉnh, Thành phố"
                  />
                )}
              />
              <label className={cx("errorLabel")}>{error.sender_address}</label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Số điện thoại
              </label>
              <TextField
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                placeholder="Số điện thoại"
                value={values.sender_phone}
                onChange={(e) => handleChange("sender_phone", e.target.value)}
                inputProps={{
                  "aria-label": "sender_phone",
                }}
              />
              <label className={cx("errorLabel")}>{error.sender_phone}</label>
            </div>
            <Grid item style={{ alignSelf: "center", height: "400px" }}>
              <Divider orientation="vertical" variant="middle" />
            </Grid>
            <div
              style={{
                display: "flex",
                flex: 1,
                padding: "10px",
                alignContent: "center",
                flexDirection: "column",
                margin: "24px",
              }}
            >
              <h5 style={{ margin: "auto" }}>Thông tin người nhận</h5>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Họ và tên
              </label>
              <TextField
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                placeholder="Họ và tên"
                value={values.receiver_name}
                onChange={(e) => handleChange("receiver_name", e.target.value)}
                inputProps={{
                  "aria-label": "receiver_name",
                }}
              />
              <label className={cx("errorLabel")}>{error.receiver_name}</label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Địa chỉ
              </label>
              <TextField
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                placeholder="Tỉnh, Thành phố"
                value={values.receiver_address}
                onChange={(e) =>
                  handleChange("receiver_address", e.target.value)
                }
                inputProps={{
                  "aria-label": "receiver_address",
                }}
              />
              <label className={cx("errorLabel")}>
                {error.receiver_address}
              </label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Số điện thoại
              </label>
              <TextField
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                placeholder="Số điện thoại"
                value={values.receiver_phone}
                onChange={(e) => handleChange("receiver_phone", e.target.value)}
                inputProps={{
                  "aria-label": "receiver_phone",
                }}
              />
              <label className={cx("errorLabel")}>{error.receiver_phone}</label>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                padding: "10px",
                alignContent: "center",
                flexDirection: "column",
                margin: "24px",
              }}
            >
              <h5 style={{ margin: "auto" }}>Thông tin đơn hàng</h5>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Loại hàng
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                placeholder="Hàng hóa | Tài liệu"
                value={values.good_type}
                onChange={(e) => handleChange("good_type", e.target.value)}
                inputProps={{
                  "aria-label": "good_type",
                }}
              />
              <label className={cx("errorLabel")}>{error.good_type}</label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Khối lượng
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                placeholder="0.5 kg"
                value={values.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                inputProps={{
                  "aria-label": "weight",
                }}
              />
              <label className={cx("errorLabel")}>{error.weight}</label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Dịch vụ thêm
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                select
                id="special_service"
                defaultValue={"Nhanh"}
                value={values.special_service}
                onChange={(newValue) =>
                  handleChange("special_service", newValue.target.value)
                }
                inputProps={{
                  "aria-label": "special_service",
                }}
              >
                <MenuItem key={"Nhanh"} value={"Nhanh"}>
                  Nhanh
                </MenuItem>
                <MenuItem key={"Hoatoc"} value={"Hoatoc"}>
                  Hỏa tốc
                </MenuItem>
                <MenuItem key={"Tietkiem"} value={"Tietkiem"}>
                  Tiết kiệm
                </MenuItem>
              </TextField>
              <label className={cx("errorLabel")}>
                {error.special_service}
              </label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Loại hàng
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                placeholder="Hàng hóa | Tài liệu"
                select
                value={values.good_type}
                onChange={(e) => handleChange("good_type", e.target.value)}
                inputProps={{
                  "aria-label": "good_type",
                }}
              >
                <MenuItem key={"hanghoa"} value={"hanghoa"}>
                  Hàng hóa
                </MenuItem>
                <MenuItem key={"tailieu"} value={"tailieu"}>
                  Tài liệu
                </MenuItem>
              </TextField>
              <label className={cx("errorLabel")}>{error.good_type}</label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Người thanh toán cước
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                select
                id="outlined-adornment-weight"
                onChange={(e) => {
                  if (e.target.value == "sender")
                    handleChange("sender_total_payment", e.target.value);
                  else handleChange();
                }}
                inputProps={{
                  "aria-label": "weight",
                }}
              >
                <MenuItem key={"sender"} value={"sender"}>
                  Người gửi
                </MenuItem>
                <MenuItem key={"receiver"} value={"receiver"}>
                  Người nhận
                </MenuItem>
              </TextField>
              <label className={cx("errorLabel")}>{error.weight}</label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Tổng cước
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                placeholder="Tổng cước"
                value={
                  values.sender_total_payment == ""
                    ? values.sender_total_payment
                    : values.receiver_total_payment
                }
                onChange={(e) => {
                  if (values.sender_total_payment == "")
                    handleChange("receiver_total_payment", e.target.value);
                  else handleChange("sender_total_payment", e.target.value);
                }}
                // onChange={(e) => {
                //   setTiencuoc(
                //     Math.floor(Math.random() * (400 - 50 + 1)) * 100 + 5000
                //   );
                // }}
                inputProps={{
                  "aria-label": "total_payment",
                }}
              />
              <label className={cx("errorLabel")}>{error.good_type}</label>
            </div>
          </div>

          <div style={{ alignSelf: "end" }}>
            <ColorButton
              variant="contained"
              onClick={onButtonClick}
              sx={{
                fontSize: "16px",
                margin: "32px",
                width: "160px",
                alignSelf: "end",
              }}
            >
              Xác nhận
            </ColorButton>
            <ColorButton
              variant="contained"
              onClick={handleResetForm}
              sx={{
                fontSize: "16px",
                margin: "32px",
                width: "160px",
                alignSelf: "end",
              }}
            >
              Hủy
            </ColorButton>
          </div>
        </FormControl>
      </div>
    </Box>
  );
}

export default function NewTransaction() {
  const [alertNew, setAlertNew] = useState(false);

  function handleAddNew() {
    setAlertNew(true);
  }

  return (
    <Box sx={{ width: "80%", margin: "auto" }}>
      <Paper sx={{ width: "100%", mb: 2, marginTop: "48px" }} elevation={5}>
        {/* <Collapse in={true} timeout="auto"> */}
        <InputAdornments handleAddNew={handleAddNew} />
        {/* </Collapse> */}
      </Paper>
    </Box>
  );
}
