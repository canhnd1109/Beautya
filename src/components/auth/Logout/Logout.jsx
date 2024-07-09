import Face4Icon from "@mui/icons-material/Face4";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Loading from "components/common/Loading/Loading";
import Toast from "components/common/Toast/Toast";
import { useAuth } from "contexts/authContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  useEffect(() => {
    if (toastOpen && toastSeverity === "success") {
      const timeoutId = setTimeout(() => {
        navigate("/");
      }, 1500); // Adjust the delay time as needed
      return () => clearTimeout(timeoutId);
    }
  }, [toastOpen, toastSeverity, navigate]);

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const handleLogout = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      await logout();
      setLoading(false);
      setToastMessage("Logout successful!");
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
    handleLogout(); // Automatically trigger logout when component mounts
  }, []); // Empty dependency array to ensure it runs only once on mount

  return (
    <>
      {loading && <Loading />}
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              margin: "auto", // Center the box horizontally
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "40px", // Add some top padding
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <Face4Icon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: "center", color: "text.primary" }}
            >
              Đăng xuất thành công. Bạn sẽ được chuyển về màn hình chính sau ít
              chút.
            </Typography>
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
};

export default Logout;
