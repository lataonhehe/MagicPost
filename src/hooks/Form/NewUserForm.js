import {
  FormControl,
  InputAdornment,
  TextField,
  IconButton,
  AlertTitle,
  Alert,
  Fade,
} from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ColorButton } from "~/components/UI/TableStyles";
import classNames from "classnames/bind";
import { useEffect } from "react";

function NewUserForm({ fetchData, onClose }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [usernameError, setUsernameError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [confirmpwError, setConfirmPWError] = React.useState("");

  const cx = classNames.bind({ errorLabel: true });

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (field, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleAddUser = async () => {
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
        setUsernameError("Username không hợp lệ!");
        throw new Error("Add user request failed");
      }

      // If successful, reset the form state and close the form
      setValues({
        username: "",
        password: "",
        confirmPassword: "",
      });
      setUsernameError("");
      setPasswordError("");
      setConfirmPWError("");
      onClose(); // Close the form
    } catch (error) {
      console.error("Error adding user:", error.message);
    }
  };

  const onButtonClick = () => {
    setUsernameError("");
    setPasswordError("");
    setConfirmPWError("");
    if (values.username.trim() === "") {
      setUsernameError("Hãy nhập username");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(values.username.trim())) {
      setUsernameError("Username không hợp lệ!");
      return;
    }

    if (values.password.trim() === "") {
      setPasswordError("Hãy nhập mật khẩu!");
      return;
    }
    if (values.confirmPassword.trim() === "") {
      setConfirmPWError("Hãy nhập lại mật khẩu!");
      return;
    }
    if (values.confirmPassword !== values.password) {
      setConfirmPWError("Mật khẩu không khớp!");
      return;
    }

    if (values.password.length < 5) {
      setPasswordError("Mật khẩu phải từ 5 kí tự trở lên!");
      return;
    }

    handleAddUser();
    setSuccess(true);
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
      <div>
        <FormControl
          sx={{ m: 1, width: "45ch", fontSize: "32px" }}
          variant="outlined"
        >
          <TextField
            sx={{ m: 1, width: "25ch" }}
            id="outlined-adornment-weight"
            placeholder="Nhập username"
            value={values.username}
            onChange={(e) => handleChange("username", e.target.value)}
            inputProps={{
              "aria-label": "weight",
            }}
          />
          <label className={cx("errorLabel")}>{usernameError}</label>
          <TextField
            sx={{ m: 1, width: "25ch" }}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            placeholder="Nhập mật khẩu:"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <label className={cx("errorLabel")}>{passwordError}</label>
          <TextField
            sx={{ m: 1, width: "25ch" }}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            placeholder="Nhập lại mật khẩu:"
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
          <label className={cx("errorLabel")}>{confirmpwError}</label>
          <ColorButton
            variant="contained"
            onClick={onButtonClick}
            sx={{
              fontSize: "16px",
              margin: "32px",
              marginLeft: "132px",
              width: "160px",
            }}
          >
            Xác nhận
          </ColorButton>
        </FormControl>
      </div>
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
          Thêm nhân viên thành công!
        </Alert>
      </Fade>
    </Box>
  );
}

export default NewUserForm;
