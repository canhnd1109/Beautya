import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const OurBrandSection = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        marginY: "2rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng cho phần tăng cấp
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }}>
        <Stack
          direction="column"
          sx={{
            background: "linear-gradient(180deg, #3D021E 0%, #2E0123 100%)", // Nền gradient
            padding: 2,
            borderRadius: "10px", // Góc bo tròn
            color: "var(--white, #fff)",
          }}
          justifyContent="center"
        >
          <Typography
            gutterBottom
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              textTransform: "capitalize",
            }}
          >
            Thương hiệu của chúng tôi
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
            }}
          >
            Chúng tôi tin rằng vẻ đẹp đích thực tỏa sáng khi chúng ta đánh thức
            và khám phá sự đa dạng. Sứ mệnh của chúng tôi là mở rộng cái nhìn về
            vẻ đẹp, làm nổi bật những điểm phi thường và đặc biệt trong từng
            người.
          </Typography>
          <Link to="/our-brand">
            <Button
              variant="outlined"
              sx={{
                marginTop: 2,
                borderColor: "var(--white, #fff)",
                color: "var(--white, #fff)",
                "&:hover": {
                  borderColor: "var(--primary, #A10550)",
                  color: "var(--primary, #A10550)",
                },
                "&:active": {
                  borderColor: "var(--primary, #A10550)",
                  color: "var(--primary, #A10550)",
                },
              }}
            >
              Khám Phá Thêm
            </Button>
          </Link>
        </Stack>
        <Box
          sx={{
            width: "100%",
            borderRadius: "10px", // Góc bo tròn
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng cho ảnh
          }}
        >
          <img
            src="/assets/images/homepage/our-brand.webp"
            alt="Thương hiệu của chúng tôi"
            style={{ width: "100%", borderRadius: "10px" }} // Thêm border-radius
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default OurBrandSection;
