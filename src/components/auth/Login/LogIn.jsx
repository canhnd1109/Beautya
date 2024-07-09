import Face4Icon from "@mui/icons-material/Face4";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Loading from "components/common/Loading/Loading";
import Toast from "components/common/Toast/Toast";
import { useAuth } from "contexts/authContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  useEffect(() => {
    if (toastOpen && toastSeverity === "success") {
      const timeoutId = setTimeout(() => {
        navigate("/");
      }, 500); // Adjust the delay time as needed
      return () => clearTimeout(timeoutId);
    }
  }, [toastOpen, toastSeverity, navigate]);

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const handleSubmit = async (event) => {
    if (loading) {
      return;
    }

    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToastMessage("Please enter a valid email address");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    if (!email || !password) {
      setToastMessage("Please fill in all fields");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    // Rest of your code for login
    try {
      setLoading(true);
      await login(email, password);
      setLoading(false);
      setToastMessage("Login successful!");
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error) {
      setLoading(false);
      setToastMessage(error.message);
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" my={4}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(/assets/images/login.webp)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "var(--primary, #A10550)" }}>
                <Face4Icon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Đăng nhập
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "var(--primary, #A10550)",
                  }}
                >
                  Đăng nhập
                </Button>
                <Grid container>
                  <Grid item xs>
                    {/* <Link to="#">Forgot password?</Link> */}
                  </Grid>
                  <Grid item>
                    <Link to="/signup">
                      {"Chưa có tài khoản? Đăng ký ngay"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Toast
          open={toastOpen}
          handleClose={handleToastClose}
          message={toastMessage}
          severity={toastSeverity}
        />
      </ThemeProvider>
    </>
  );
}
