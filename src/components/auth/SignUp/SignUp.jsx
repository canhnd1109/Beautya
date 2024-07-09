import Face4Icon from "@mui/icons-material/Face4";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Loading from "components/common/Loading/Loading";
import Toast from "components/common/Toast/Toast";
import { useAuth } from "contexts/authContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

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
    const confirmPassword = data.get("confirmPassword");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToastMessage("Please enter a valid email address");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    if (!email || !password || !confirmPassword) {
      setToastMessage("Please fill in all fields");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    if (password.length < 8) {
      setToastMessage("Password must be at least 8 characters long");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setToastMessage("Passwords do not match");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      setLoading(false);
      setToastMessage("Sign up successful!");
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error) {
      setLoading(false);
      setToastMessage(error.message);
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  useEffect(() => {
    if (toastOpen && toastSeverity === "success") {
      const timeoutId = setTimeout(() => {
        navigate("/");
      }, 500); // Adjust the delay time as needed
      return () => clearTimeout(timeoutId);
    }
  }, [toastOpen, toastSeverity, navigate]);

  return (
    <>
      {loading && <Loading />}
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            marginBlock: 8,
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "var(--primary, #A10550)" }}>
              <Face4Icon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng ký tài khoản mới
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Mật khẩu"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Nhập lại mật khẩu"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>

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
                Đăng ký
              </Button>
              <Grid container justifyContent="flex-end" mb={4}>
                <Grid item>
                  <Link to="/login">Đã có tài khoản? Đăng nhập ngay</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
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
