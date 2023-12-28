function NewUserForm({ fetchData }) {
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({
      username: "",
      password: "",
      confirmPassword: "",
    });
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmpwError, setConfirmPWError] = useState("");
  
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
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
      } catch (error) {}
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
    };
  
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
      </Box>
    );
  }

  export default NewUserForm;