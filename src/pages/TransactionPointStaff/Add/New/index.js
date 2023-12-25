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
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import OutlinedInput from "@mui/material/OutlinedInput";

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
  const [values, setValues] = useState({
    des: "",
    shipment_name: "",
    sender_name: "",
    sender_address: "",
    sender_address_detail: "",
    sender_postal_code: "",
    sender_total_payment: "",
    sender_phone: "",
    receiver_address: "",
    receiver_address_detail: "",
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
    des: "",
    shipment_name: "",
    sender_name: "",
    sender_address: "",
    sender_address_detail: "",
    sender_postal_code: "",
    sender_total_payment: "",
    sender_phone: "",
    receiver_address: "",
    receiver_address_detail: "",
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
      des: "",
      shipment_name: "",
      sender_name: "",
      sender_address: "",
      sender_address_detail: "",
      sender_postal_code: "",
      sender_total_payment: "",
      sender_phone: "",
      receiver_address: "",
      receiver_address_detail: "",
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
      des: "",
      shipment_name: "",
      sender_name: "",
      sender_address: "",
      sender_address_detail: "",
      sender_postal_code: "",
      sender_total_payment: "",
      sender_phone: "",
      receiver_address: "",
      receiver_address_detail: "",
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
    const shopId = 4791893;
    const headers = {
      "Content-Type": "application/json",
      token: token,
      shop_id: shopId,
    };

    const data = {
      service_id: parseInt(serviceid),
      insurance_value: 500000,
      coupon: null,
      from_district_id: parseInt(districtid),
      to_district_id: parseInt(toDistrictID),
      to_ward_code: String(wardIDReceiver),
      height: 30,
      length: 30,
      weight: parseInt(weight),
      width: 25,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      setTotal_payment((await response.json()).data);
      // console.log((await response.json()).data);
      // Xử lý phản hồi thành công từ API
    } catch (error) {
      console.error(error);
      // Xử lý lỗi
    }
  }

  useLayoutEffect(() => {
    fetchDataProvince();
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
      serviceID.service_id !== null &&
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
    console.log("des :", values.des);
    console.log("shipment name:", values.shipment_name);
    console.log("sender name:", values.sender_name);
    console.log("sender address:", values.sender_address);
    console.log("sender_address_detail:", values.sender_address_detail);
    console.log("sender_total_payment:", values.sender_total_payment);
    console.log("sender_postal_code:", values.sender_postal_code);
    console.log("receiver_address :", values.receiver_address);
    console.log("receiver_address_detail :", values.receiver_address_detail);
    console.log("receiver_phone:", values.receiver_phone);
    console.log("receiver_postal_code:", values.receiver_postal_code);
    console.log("receiver_total_payment:", values.receiver_total_payment);
    console.log("receiving_date:", values.receiving_date);
    console.log("good_type:", values.good_type);
    console.log("special_service:", values.special_service);
    console.log("weight:", values.weight);
    handleChange("receiver_postal_code", districtIDReceiver.DistrictID);
    handleChange("sender_postal_code", districtIDSender.DistrictID);
    handleChange(
      "sender_address_detail",
      `${wardSenderName.WardName} - ${districtIDSender.DistrictName} - ${provinceIDSender.ProvinceName}`
    );
    handleChange(
      "receiver_address_detail",
      `${wardReceiverName.WardName} - ${districtIDReceiver.DistrictName} - ${provinceIDReceiver.ProvinceName}`
    );
    handleChange(
      "receiver_total_payment",
      total_payment.total - parseInt(values.sender_total_payment)
    );
    const dateString = JSON.stringify(values.receiving_date);
    const dateTime = new Date(dateString);
    handleChange("receiving_date", dateTime);

    console.log("total_payment:", total_payment.total);
    if (values.sender_name === "") {
      handleChangeError("sender_name", "Hãy nhập họ và tên");
      return;
    }
    if (values.receiver_name === "") {
      handleChangeError("receiver_name", "Hãy nhập họ và tên");
      return;
    }

    if (values.sender_address === "" || districtIDSender.DistrictID === "") {
      handleChangeError("sender_address", "Hãy nhập địa chỉ!");
      return;
    }
    if (
      values.receiver_address === "" ||
      (districtIDReceiver.DistrictID === "" && wardReceiverName === "")
    ) {
      handleChangeError("receiver_address", "Hãy nhập địa chỉ!");
      return;
    }
    if (values.sender_phone === "") {
      handleChangeError("sender_phone", "Hãy nhập số điện thoại!");
      return;
    }
    if (values.receiver_phone === "") {
      handleChangeError("receiver_phone", "Hãy nhập số điện thoại!");
      return;
    }
    if (values.shipment_name === "") {
      handleChangeError("shipement_name", "Hãy nhập tên hàng!");
      return;
    }
    if (values.good_type === "") {
      handleChangeError("good_type", "Hãy nhập loại hàng!");
      return;
    }
    if (values.weight === "") {
      handleChangeError("weight", "Hãy nhập khối lượng hàng!");
      return;
    }
    if (values.special_service === "") {
      handleChangeError("special_service", "Hãy nhập gói dịch vụ!");
      return;
    }
    if (values.sender_total_payment === "") {
      handleChangeError("sender_total_payment", "Hãy nhập số tiền!");
      return;
    }

    // handleAddNew();
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
              <h4 style={{ margin: "auto" }}>Thông tin người gửi</h4>
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
            <Grid item style={{ alignSelf: "center", height: "600px" }}>
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
                marginLeft: "60px",
              }}
            >
              <h4 style={{ margin: "auto" }}>Thông tin người nhận</h4>
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
              <h4 style={{ margin: "auto" }}>Thông tin đơn hàng</h4>
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
                value={values.shipment_name}
                onChange={(e) => handleChange("shipment_name", e.target.value)}
                inputProps={{
                  "aria-label": "shipment_name",
                }}
              />
              <label className={cx("errorLabel")}>{error.shipment_name}</label>
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
                fullWidth
                disablePortal
                sx={{ marginLeft: "8px" }}
                readOnly={service.length <= 0}
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
                  service.map &&
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
                  handleChange("special_service", newValue);
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
                Điểm giao dịch đích
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-des"
                placeholder="Department"
                value={values.des}
                onChange={(e) => handleChange("des", e.target.value)}
                inputProps={{
                  "aria-label": "des",
                }}
              />
              <label className={cx("errorLabel")}>{error.receiving_date}</label>
              <label
                style={{
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  flex: "none",
                  lineHeight: "48px",
                }}
              >
                Ngày nhận
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                placeholder="2023-11-20"
                value={values.receiving_date}
                onChange={(e) => handleChange("receiving_date", e.target.value)}
                inputProps={{
                  "aria-label": "datetime",
                }}
              />
              <label className={cx("errorLabel")}>{error.receiving_date}</label>
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
              <OutlinedInput
                fullWidth
                sx={{ m: 1 }}
                id="outlined-adornment-weight"
                endAdornment={
                  <InputAdornment position="end">VND</InputAdornment>
                }
                value={
                  total_payment !== null && total_payment.total >= 0
                    ? total_payment.total
                    : 0
                }
                placeholder="Tổng cước"
                inputProps={{
                  "aria-label": "total_payment",
                }}
              />
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
                  value={
                    total_payment !== null && total_payment.total > 0
                      ? total_payment.total - values.sender_total_payment
                      : 0
                  }
                  inputProps={{
                    "aria-label": "receiver_total_payment",
                  }}
                ></TextField>
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
    <Box sx={{ width: "85%", margin: "auto" }}>
      <Paper sx={{ width: "100%", mb: 2, marginTop: "48px" }} elevation={5}>
        {/* <Collapse in={true} timeout="auto"> */}
        <InputAdornments handleAddNew={handleAddNew} />
        {/* </Collapse> */}
      </Paper>
    </Box>
  );
}
