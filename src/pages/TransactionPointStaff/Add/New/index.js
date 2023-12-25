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
  const [districtSender, setDistrictSender] = useState([]);
  const [districtReceiver, setDistrictReceiver] = useState([]);
  const [wardSender, setWardSender] = useState([]);
  const [wardReceiver, setWardReceiver] = useState([]);
  const [wardSenderName, setWardSenderName] = useState([]);
  const [wardReceiverName, setWardReceiverName] = useState([]);
  const [service, setService] = useState([]);
  const [provinceIDSender, setProvinceIDSender] = useState([]);
  const [districtIDSender, setDistrictIDSender] = useState([]);
  const [provinceIDReceiver, setProvinceIDReceiver] = useState([]);
  const [districtIDReceiver, setDistrictIDReceiver] = useState([]);
  const [wardIDReceiver, setWardIDReceiver] = useState([]);
  const [serviceID, setServiceID] = useState([]);
  const [total_payment, setTotal_payment] = useState([]);
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
  async function fetchDataDistrict(provinceid, setDistrict) {
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
          province_id: provinceid,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setDistrict((await response.json()).data);
      // Xử lý dữ liệu ở đây

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get District");
    }
  }
  async function fetchDataWard(districtid, setWard) {
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
          district_id: districtid,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setWard((await response.json()).data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get Ward");
    }
  }
  async function fetchDataService(districtid, todistrictid) {
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
          shop_id: 4791893,
          from_district: districtid,
          to_district: todistrictid,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setService((await response.json()).data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get Service");
    }
  }
  async function calculatePayment(
    serviceid,
    districtid,
    toDistrictID,
    wardIDReceiver,
    weight
  ) {
    const url =
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    const token = "ecd6ab5f-a269-11ee-af43-6ead57e9219a";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          token: token,
          shop_id: 4791893,
        },
        body: JSON.stringify({
          service_id: serviceID.service_id,
          insurance_value: 500000,
          coupon: null,
          from_district_id: districtIDSender.DistrictID,
          to_district_id: districtIDReceiver.DistrictID,
          to_ward_code: wardReceiverName.WardCode,
          height: 30,
          length: 30,
          weight: values.weight,
          width: 25,
        }),
      });
      console.log("service:", serviceid);
      console.log("district sender:", districtid);
      console.log("district receiver:", toDistrictID);
      console.log("wardcode:", wardIDReceiver);
      console.log("weight", weight);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setTotal_payment((await response.json()).data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Error to get payment");
    }
  }

  useLayoutEffect(() => {
    fetchDataProvince();
    // if (provinceIDSender != null)
    // fetchDataDistrict(provinceIDSender.ProvinceID, setDistrictSender);
    // if (provinceIDReceiver != null)
    //   fetchDataDistrict(provinceIDReceiver.ProvinceID, setDistrictReceiver);
    // if (districtIDReceiver != null && districtIDReceiver.DistrictID)
    //   fetchDataWard(districtIDReceiver.DistrictID, setWardReceiver);
    // if (districtIDSender != null && districtIDReceiver.DistrictID != null)
    //   fetchDataWard(districtIDReceiver.DistrictID, setWardSender);
    //   fetchDataService();
    //   canculatePayment();
    // console.log(ward);
    if (provinceIDSender)
      fetchDataDistrict(provinceIDSender.ProvinceID, setDistrictSender);
    if (provinceIDReceiver)
      fetchDataDistrict(provinceIDReceiver.ProvinceID, setDistrictReceiver);
    if (districtIDSender && districtIDSender.DistrictID)
      fetchDataWard(districtIDSender.DistrictID, setWardSender);
    if (districtIDReceiver && districtIDReceiver.DistrictID)
      fetchDataWard(districtIDReceiver.DistrictID, setWardReceiver);
    if (
      districtIDSender.DistrictID &&
      districtIDReceiver.DistrictID &&
      wardIDReceiver
    ) {
      fetchDataService(
        districtIDSender.DistrictID,
        districtIDReceiver.DistrictID
      );
    }
    if (
      serviceID.service_id &&
      districtIDSender.DistrictID &&
      districtIDReceiver.DistrictID &&
      wardReceiverName.WardCode &&
      values.weight
    ) {
      calculatePayment(
        serviceID.service_id,
        districtIDSender.DistrictID,
        districtIDReceiver.DistrictID,
        wardReceiverName.WardCode,
        values.weight
      );

      console.log("PAYMENT DAYROI:", total_payment);
    }
  }, [
    provinceIDSender,
    provinceIDReceiver,
    districtIDSender,
    districtIDReceiver,
    serviceID,
    wardReceiverName,
    values.weight,
  ]);

  const handleChange = (field, value) => {
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

              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                disablePortal
                options={
                  province &&
                  province.map &&
                  province.map((value) => value.ProvinceName)
                }
                inputProps={{
                  "aria-label": "sender_address",
                }}
                value={province.ProvinceID}
                getOptionSelected={(option, value) =>
                  option.ProvinceID === value.ProvinceID
                }
                onChange={(e, newValue) => {
                  if (newValue != null) {
                    handleChange("sender_address", newValue);

                    setProvinceIDSender(
                      province.find((item) => item.ProvinceName === newValue)
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Tỉnh, thành phố" />
                )}
              />
              <label className={cx("errorLabel")}>{error.sender_address}</label>
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                disablePortal
                options={
                  province &&
                  province.map &&
                  districtSender &&
                  districtSender.map &&
                  districtSender.map((value) => value.DistrictName)
                }
                inputProps={{
                  "aria-label": "sender_address",
                }}
                value={districtSender.DistrictID}
                getOptionSelected={(option, value) =>
                  option.DistrictID === value.DistrictID
                }
                onChange={(e, newValue) => {
                  if (newValue != null) {
                    setDistrictIDSender(
                      districtSender.find(
                        (item) => item.DistrictName === newValue
                      )
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Quận, huyện" />
                )}
              />
              <label className={cx("errorLabel")}>{error.sender_address}</label>
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                disablePortal
                options={
                  province &&
                  province.map &&
                  districtSender &&
                  districtSender.map &&
                  wardSender &&
                  wardSender.map &&
                  wardSender.map((value) => value.WardName)
                }
                inputProps={{
                  "aria-label": "sender_address",
                }}
                value={wardSender.WardCode}
                getOptionSelected={(option, value) =>
                  option.WardCode === value.WardCode
                }
                onChange={(e, newValue) => {
                  if (newValue != null) {
                    setWardSenderName(
                      wardSender.find((item) => item.WardName === newValue)
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Phường, xã" />
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
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                disablePortal
                options={
                  province &&
                  province.map &&
                  province.map((value) => value.ProvinceName)
                }
                inputProps={{
                  "aria-label": "receiver_address",
                }}
                value={province.ProvinceID}
                getOptionSelected={(option, value) =>
                  option.ProvinceID === value.ProvinceID
                }
                onChange={(e, newValue) => {
                  if (newValue != null) {
                    handleChange("receiver_address", newValue);

                    setProvinceIDReceiver(
                      province.find((item) => item.ProvinceName === newValue)
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Tỉnh, thành phố" />
                )}
              />
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                disablePortal
                options={
                  province &&
                  province.map &&
                  districtReceiver &&
                  districtReceiver.map &&
                  districtReceiver.map((value) => value.DistrictName)
                }
                inputProps={{
                  "aria-label": "receiver_address",
                }}
                value={districtReceiver.DistrictID}
                getOptionSelected={(option, value) =>
                  option.DistrictID === value.DistrictID
                }
                onChange={(e, newValue) => {
                  if (newValue != null) {
                    setDistrictIDReceiver(
                      districtReceiver.find(
                        (item) => item.DistrictName === newValue
                      )
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Quận, huyện" />
                )}
              />
              <label className={cx("errorLabel")}>
                {error.receiver_address}
              </label>
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                disablePortal
                options={
                  province &&
                  province.map &&
                  districtReceiver &&
                  districtReceiver.map &&
                  wardReceiver &&
                  wardReceiver.map &&
                  wardReceiver.map((value) => value.WardName)
                }
                inputProps={{
                  "aria-label": "sender_address",
                }}
                value={wardReceiver.WardCode}
                getOptionSelected={(option, value) =>
                  option.WardCode === value.WardCode
                }
                onChange={(e, newValue) => {
                  if (newValue != null) {
                    setWardReceiverName(
                      wardReceiver.find((item) => item.WardName === newValue)
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Phường, xã" />
                )}
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
                Tên hàng
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                value={values.good_type}
                onChange={(e) => handleChange("good_type", e.target.value)}
                inputProps={{
                  "aria-label": "good_type",
                }}
              />
              {/* <label className={cx("errorLabel")}>{error.good_type}</label> */}
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
                Khối lượng
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                placeholder="500 gram"
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
                Gói dịch vụ
              </label>
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="outlined-adornment-weight"
                fullWidth
                disablePortal
                options={
                  province &&
                  province.map &&
                  districtIDSender &&
                  districtIDSender.DistrictID &&
                  districtIDReceiver &&
                  districtIDReceiver.DistrictID &&
                  wardIDReceiver &&
                  wardIDReceiver.map &&
                  wardReceiver &&
                  wardReceiver.map &&
                  service &&
                  service.map((value) => value.short_name)
                }
                inputProps={{
                  "aria-label": "special_payment",
                }}
                value={service.service_id}
                getOptionSelected={(option, value) =>
                  option.service_id === value.service_id
                }
                onChange={(e, newValue) => {
                  if (newValue != null) {
                    setServiceID(
                      service.find((item) => item.short_name === newValue)
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Các dịch vụ hiện có" />
                )}
              />
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
                Tổng cước
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                value={total_payment}
                placeholder="Tổng cước"
                onChange={(e) => {}}
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
              <div style={{ display: "flex" }}>
                <label
                  style={{
                    fontSize: "18px",
                    paddingLeft: "24px",
                    fontWeight: "bold",
                    flex: "none",
                    lineHeight: "48px",
                  }}
                >
                  Tính cước người gửi:
                </label>
                <TextField
                  fullWidth
                  sx={{ m: 1 }}
                  id="outlined-adornment-weight"
                  onChange={(e) => {
                    handleChange("sender_total_payment", e.target.value);
                  }}
                  inputProps={{
                    "aria-label": "sender_total_payment",
                  }}
                ></TextField>
                <label className={cx("errorLabel")}>
                  {error.sender_total_payment}
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
                  Tính cước người nhận:
                </label>
                <TextField
                  fullWidth
                  sx={{ m: 1 }}
                  id="outlined-adornment-weight"
                  onChange={(e) => {
                    handleChange(
                      "receiver_total_payment",
                      total_payment
                        ? total_payment - e.target.value
                        : e.target.value
                    );
                  }}
                  inputProps={{
                    "aria-label": "receiver_total_payment",
                  }}
                ></TextField>
                <label className={cx("errorLabel")}>
                  {error.receiver_total_payment}
                </label>
              </div>
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
