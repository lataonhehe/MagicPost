import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  Collapse,
  Divider,
  Fade,
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styles from "./AddNew.module.scss";

import { useLayoutEffect } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

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
    receiving_date: dayjs("2023-12-22"),
    good_type: "",
    special_service: "",
    weight: "",
  });

  const handleResetForm = () => {
    setAlertNew("");
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

  const [department, setDepartment] = useState([]);
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
  const [serviceID, setServiceID] = useState([]);
  const [total_payment, setTotal_payment] = useState([]);
  const [departmentID, setDepartmentID] = useState([]);
  const [alertNew, setAlertNew] = useState();
  const [success, setSuccess] = useState(false);
  const count = useRef(0);
  const navigate = useNavigate();
  const newShipment = async (formattedDate) => {
    try {
      const token = localStorage.getItem("Token");
      const addResponse = await fetch(
        "http://127.0.0.1:8000/Transaction/create_shipment",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            des: values.des,
            shipment_name: values.shipment_name,
            sender_name: values.sender_name,
            sender_address: values.sender_address,
            sender_address_detail: values.sender_address_detail,
            sender_postal_code: values.sender_postal_code,
            sender_total_payment: values.sender_total_payment,
            sender_phone: values.sender_phone,
            receiver_address: values.receiver_address,
            receiver_address_detail: values.receiver_address_detail,
            receiver_postal_code: values.receiver_postal_code,
            receiver_name: values.receiver_name,
            receiver_phone: values.receiver_phone,
            receiver_total_payment: values.receiver_total_payment,
            receiving_date: formattedDate,
            good_type: values.good_type,
            special_service: values.special_service,
            weight: values.weight,
          }),
        }
      );
      if (!addResponse.ok) {
        setSuccess(false);
        window.alert("Thông tin không hợp lệ!");

        throw new Error(addResponse);
      } else {
        console.log("response data:", addResponse.json().DHcode);
        // localStorage.setItem("DHcode", addResponse.json());
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error add new shipment:", error.message);
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `http://127.0.0.1:8000/Transaction/transaction_employee/get_transaction_department`,
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
      setDepartment(data.transaction_department_list);
    } catch (error) {
      console.error("Error get department data:", error.message);
    }
  };

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
    fetchDepartmentData();
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
      wardReceiverName
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

  const onButtonClick = () => {
    setAlertNew("");
    const dateString = values.receiving_date;
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    localStorage.setItem("des", values.des);

    handleChange("receiver_postal_code", districtIDReceiver.DistrictID);
    handleChange("sender_postal_code", districtIDSender.DistrictID);
    handleChange("des", departmentID.id);
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
      parseInt(total_payment.total) - parseInt(values.sender_total_payment)
    );
    console.log("des :", values.des);
    console.log("shipment name:", values.shipment_name);
    console.log("sender name:", values.sender_name);
    console.log("sender address:", values.sender_address);
    console.log("sender_address_detail:", values.sender_address_detail);
    console.log("sender_total_payment:", values.sender_total_payment);
    console.log("sender_postal_code:", values.sender_postal_code);
    console.log("receiver_name:", values.receiver_name);
    console.log("receiver_address :", values.receiver_address);
    console.log("receiver_address_detail :", values.receiver_address_detail);
    console.log("receiver_phone:", values.receiver_phone);
    console.log("receiver_postal_code:", values.receiver_postal_code);
    console.log("receiver_total_payment:", values.receiver_total_payment);
    console.log("receiving_date:", formattedDate);
    console.log("receiving_date: values", values.receiving_date);
    console.log("good_type:", values.good_type);
    console.log("special_service:", values.special_service);
    console.log("weight:", values.weight);
    console.log("total_payment:", total_payment.total);
    if (count.current == 0) {
      count.current = 2;
      return;
    }
    if (values.sender_name === "") {
      setAlertNew("Hãy nhập họ và tên người gửi!");
      return;
    }
    if (values.receiver_name === "") {
      setAlertNew("Hãy nhập họ và tên người nhận!");
      return;
    }

    if (values.sender_address === "" || values.sender_postal_code === "") {
      setAlertNew("Hãy nhập địa chỉ người gửi!");
      return;
    }
    console.log("ward:", wardReceiverName);
    if (
      values.receiver_address === null ||
      values.receiver_postal_code === null ||
      wardReceiverName === null
    ) {
      setAlertNew("Hãy nhập địa chỉ người nhận!");
      return;
    }
    if (values.sender_phone === "") {
      setAlertNew("Hãy nhập số điện thoại người gửi!");
      return;
    }
    if (values.receiver_phone === "") {
      setAlertNew("Hãy nhập số điện thoại người nhận!");
      return;
    }
    if (values.shipment_name === "") {
      setAlertNew("Hãy nhập tên hàng!");
      return;
    }
    if (values.good_type === "") {
      setAlertNew("Hãy nhập loại hàng!");
      return;
    }
    if (values.weight === "") {
      setAlertNew("Hãy nhập khối lượng hàng!");
      return;
    }
    if (values.special_service === "") {
      setAlertNew("Hãy nhập gói dịch vụ!");
      return;
    }
    if (values.sender_total_payment === "") {
      setAlertNew("Hãy nhập số tiền cước người gửi!");
      return;
    }

    localStorage.setItem("des", values.des);
    localStorage.setItem("shipment_name", values.shipment_name);
    localStorage.setItem("sender_name", values.sender_name);
    localStorage.setItem("sender_address", values.sender_address);
    localStorage.setItem("sender_address_detail", values.sender_address_detail);
    localStorage.setItem("sender_postal_code", values.sender_postal_code);
    localStorage.setItem("sender_total_payment", values.sender_total_payment);
    localStorage.setItem("sender_phone", values.sender_phone);
    localStorage.setItem("receiver_address", values.receiver_address);
    localStorage.setItem(
      "receiver_address_detail",
      values.receiver_address_detail
    );
    localStorage.setItem("receiver_postal_code", values.receiver_postal_code);
    localStorage.setItem("receiver_name", values.receiver_name);
    localStorage.setItem("receiver_phone", values.receiver_phone);
    localStorage.setItem(
      "receiver_total_payment",
      values.receiver_total_payment
    );
    localStorage.setItem("receiving_date", formattedDate);
    localStorage.setItem("good_type", values.good_type);
    localStorage.setItem("special_service", values.special_service);
    localStorage.setItem("weight", values.weight);
    localStorage.setItem("total_payment", total_payment.total);

    newShipment(formattedDate);
  };
  useEffect(() => {
    if (success) {
      // console.log('chora true');
      setTimeout(() => {
        // console.log('chora false');
        setSuccess(false);
      }, 1500);
    }
  }, [success]);
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
          <h3
            style={{
              padding: "32px",
              backgroundColor: "#f38600",
              color: "white",
            }}
          >
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
              ></TextField>
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
                id="sender_address"
                disablePortal
                options={
                  province &&
                  province.map &&
                  province.map((value) => value.ProvinceName)
                }
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
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="sender_address_district"
                disablePortal
                options={
                  province &&
                  province.map &&
                  districtSender &&
                  districtSender.map &&
                  districtSender.map((value) => value.DistrictName)
                }
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
                id="sender_address_district"
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
                id="sender_phone"
                placeholder="Số điện thoại"
                value={values.sender_phone}
                onChange={(e) => handleChange("sender_phone", e.target.value)}
              />
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
                id="receiver_name"
                placeholder="Họ và tên"
                value={values.receiver_name}
                onChange={(e) => handleChange("receiver_name", e.target.value)}
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
                Địa chỉ
              </label>
              <Autocomplete
                sx={{ m: 1, width: "25ch" }}
                id="receiver_address"
                disablePortal
                options={
                  province &&
                  province.map &&
                  province.map((value) => value.ProvinceName)
                }
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
                id="receiver_address_district"
                disablePortal
                options={
                  province &&
                  province.map &&
                  districtReceiver &&
                  districtReceiver.map &&
                  districtReceiver.map((value) => value.DistrictName)
                }
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
                id="receiver_address_ward"
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
                id="receiver_phone"
                placeholder="Số điện thoại"
                value={values.receiver_phone}
                onChange={(e) => handleChange("receiver_phone", e.target.value)}
              />
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
                id="shipment_name"
                value={values.shipment_name}
                onChange={(e) => handleChange("shipment_name", e.target.value)}
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
                Loại hàng
              </label>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                id="good_type"
                placeholder="Hàng hóa | Tài liệu"
                select
                value={values.good_type}
                onChange={(e) => handleChange("good_type", e.target.value)}
              >
                <MenuItem key={"hanghoa"} value={"HH"}>
                  Hàng hóa
                </MenuItem>
                <MenuItem key={"tailieu"} value={"TL"}>
                  Tài liệu
                </MenuItem>
              </TextField>

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
              <OutlinedInput
                fullWidth
                sx={{ m: 1 }}
                id="weight"
                placeholder="500 gram"
                value={values.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                endAdornment={
                  <InputAdornment position="end">gram</InputAdornment>
                }
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
                  wardReceiver &&
                  wardReceiver.map &&
                  service &&
                  service.map &&
                  service.map((value) => value.short_name)
                }
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
              <Autocomplete
                fullWidth
                disablePortal
                sx={{ marginLeft: "8px" }}
                readOnly={department.length <= 0}
                options={
                  department &&
                  department.map &&
                  department.map((value) => value.name)
                }
                value={department.id}
                getOptionSelected={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  if (newValue != null) {
                    handleChange("des", newValue);
                    setDepartmentID(
                      department.find((item) => item.name === newValue)
                    );
                    console.log("departmentID:", departmentID);
                    console.log("des:", values.des);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Department" />
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
                Ngày nhận
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ marginLeft: "8px", borderColor: "black" }}
                  value={values.receiving_date}
                  id="receiving_date"
                  onChange={(newValue) =>
                    handleChange("receiving_date", newValue)
                  }
                />
              </LocalizationProvider>
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
                id="total_payment"
                endAdornment={
                  <InputAdornment position="end">VND</InputAdornment>
                }
                value={
                  total_payment !== null && total_payment.total >= 0
                    ? total_payment.total
                    : 0
                }
                placeholder="Tổng cước"
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
                  id="sender_total_payment"
                  onChange={(e) => {
                    handleChange("sender_total_payment", e.target.value);
                  }}
                ></TextField>

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
                  id="receiver_total_payment"
                  value={
                    total_payment !== null && total_payment.total > 0
                      ? total_payment.total - values.sender_total_payment
                      : 0
                  }
                ></TextField>
              </div>
            </div>
          </div>

          <div style={{ alignSelf: "end" }}>
            <ColorButton
              variant="contained"
              onClick={() => {
                navigate("/invoice");
              }}
              sx={{
                fontSize: "16px",
                margin: "32px",
                alignSelf: "start",
              }}
            >
              In giấy biên nhận
            </ColorButton>
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
      <Fade in={alertNew}>
        <Alert
          variant="filled"
          severity="error"
          sx={{
            position: "fixed",
            fontSize: "1.0rem",
            left: "48px",
            bottom: "48px",
            zIndex: 100,
            width: "45%",
          }}
        >
          <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>
            Lỗi
          </AlertTitle>
          {alertNew}
        </Alert>
      </Fade>
      <Fade in={success} timeout={1000}>
        <Alert
          variant="filled"
          severity="success"
          sx={{
            position: "fixed",
            fontSize: "1.0rem",
            left: "48px",
            bottom: "48px",
            zIndex: 100,
            width: "45%",
          }}
        >
          <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>
            Thành công
          </AlertTitle>
          Tạo đơn hàng thành công!
        </Alert>
      </Fade>
    </Box>
  );
}

export default function NewTransaction() {
  return (
    <Box sx={{ width: "1000px", margin: "auto" }}>
      <Paper sx={{ width: "100%", mb: 2, marginTop: "48px" }} elevation={5}>
        {/* <Collapse in={true} timeout="auto"> */}
        <InputAdornments />
        {/* </Collapse> */}
      </Paper>
    </Box>
  );
}
