import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function Breadcrumb({ current }) {
  const navigate = useNavigate();

  function handleClick(event) {
    event.preventDefault();
    navigate("/");
  }

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={handleClick}
    >
      Home
    </Link>,
    <Typography
      key="2"
      sx={{
        color: "var(--black, #0C0C0C)",
        fontSize: "1rem",
        fontWeight: 700,
        textTransform: "capitalize",
      }}
    >
      {current}
    </Typography>,
  ];

  return (
    <Stack spacing={2} marginY={{ xs: "1rem", md: "2rem" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
