import { Container, Typography, useTheme } from "@mui/material";

const Section = ({ children, title }) => {
  const theme = useTheme();

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginY: { xs: "2rem", md: "3.5rem" },
      }}
    >
      <Typography
        gutterBottom
        sx={{
          fontSize: "2rem",
          fontWeight: 700,
          textTransform: "capitalize",
          color: "var(--primary, #A10550)",
          borderBottom: "4px solid var(--primary, #A10550)",
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
          [theme.breakpoints.down("sm")]: {
            fontSize: "1.5rem",
            borderBottom: "2px solid var(--primary, #A10550)",
            paddingBottom: "0.3rem",
            marginBottom: "0.7rem",
          },
        }}
      >
        {title}
      </Typography>
      {children}
    </Container>
  );
};

export default Section;
