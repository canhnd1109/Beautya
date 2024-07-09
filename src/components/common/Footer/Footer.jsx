import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { CATEGORY_PATH } from "utils/constants";
import styles from "./Footer.module.css";

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: { xs: "center", md: "space-between" },
  gap: "1.25rem",
};

const titleStyle = {
  color: " var(--white, #fff)",
  fontSize: { xs: "1rem", md: "1.5rem" },
  fontWeight: 700,
  textTransform: "capitalize",
};

const listItemStyle = {
  marginTop: { xs: "0.5rem", md: "1rem" },
  display: "flex",
  flexDirection: "column",
  width: "13.875rem",
  alignItems: "flex-start",
  gap: "0.5rem",
};

const itemStyle = {
  color: " var(--white, #fff)",
  fontSize: { xs: "0.875rem", md: "1rem" },
  textTransform: "capitalize",
};

const propositions = [
  {
    icon: "/assets/svgs/footer/bunny.svg",
    title: "Không thử nghiệm trên động vật",
  },
  {
    icon: "/assets/svgs/footer/water.svg",
    title: "Không chất liệu từ động vật",
  },
  {
    icon: "/assets/svgs/footer/wheat.svg",
    title: "Không chứa gluten hoặc sản phẩm từ gluten",
  },
  { icon: "/assets/svgs/footer/light.svg", title: "Bao bì có thể tái chế" },
];

const leftSection = {
  title: "Trung tâm hỗ trợ?",
  items: ["Liên hệ", "Giới thiệu"],
};

const middleSection = {
  title: "Sản phẩm",
  items: [
    { label: "Makeup", path: CATEGORY_PATH.MAKE_UP },
    { label: "Skincare", path: CATEGORY_PATH.SKINCARE },
    { label: "Gifts & Sets", path: CATEGORY_PATH.GIFTS_AND_SETS },
  ],
};

const rightSection = {
  title: "Đăng ký nhận thông thin",
  items: [
    "Bạn hãy đăng ký email để nhận bản tin sản phẩm và các chương trình khuyến mãi của chúng tôi.",
  ],
};

const Footer = () => {
  return (
    <footer>
      {/* Phần đề xuất giá trị  */}
      <Box
        component="section"
        sx={{
          backgroundColor: "var(--primary-25, #fbeff2)",
          paddingY: { xs: 1, md: 2 },
        }}
      >
        <Container maxWidth="lg" sx={containerStyle}>
          {propositions.map((proposition, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                width: { xs: "45%", md: "20%" },
              }}
            >
              <img
                className={styles["vp-icon"]}
                src={proposition.icon}
                alt="vp-icon"
              />
              <Typography
                variant="p"
                component="p"
                sx={{
                  color: "var(--primary-primary-600, #79043c)",
                  fontSize: { xs: "0.75rem", md: "1rem" },
                  textTransform: "capitalize",
                }}
              >
                {proposition.title}
              </Typography>
            </Box>
          ))}
        </Container>
      </Box>

      {/* Phần tiện ích */}
      <Box
        component="section"
        sx={{
          backgroundColor: "var(--primary-750, #3d021e)",
          paddingY: { xs: 1, md: 2 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            ...containerStyle,
            alignItems: "flex-start",
            marginBlock: "1rem",
          }}
        >
          <Box>
            <Typography sx={titleStyle}>{leftSection.title}</Typography>
            <Box sx={listItemStyle}>
              {leftSection.items.map((item, index) => (
                <Typography key={index} sx={itemStyle}>
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography sx={titleStyle}>{middleSection.title}</Typography>
            <Box sx={listItemStyle}>
              {middleSection.items.map((item, index) => (
                <Link key={index} to={item.path}>
                  <Typography sx={itemStyle}>{item.label}</Typography>
                </Link>
              ))}
            </Box>
          </Box>
          <Box>
            <Box>
              <Typography sx={titleStyle}>{rightSection.title}</Typography>
              <Box sx={listItemStyle}>
                {rightSection.items.map((item, index) => (
                  <Typography key={index} sx={itemStyle}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
            {/* <Box className={styles["subscribe-box"]}>
              <input type="email" placeholder="Địa chỉ Email" />
              <Button>Đăng ký</Button>
            </Box> */}
          </Box>
        </Container>
      </Box>

      {/* Phần liên hệ */}
      <Box
        component="section"
        sx={{
          backgroundColor: "var(--primary-primary-800, #280114)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            ...containerStyle,
            paddingY: 2,
            gap: 1,
            justifyContent: {
              xs: "center",
              md: "space-between",
            },
          }}
        >
          <Box>
            <Button sx={{ paddingInline: 0, mr: "2rem" }}>
              <img src="/assets/svgs/footer/location.svg" alt="location" />
              <address>
                <Typography ml={1} sx={itemStyle}>
                  Ha Noi, Viet Nam
                </Typography>
              </address>
            </Button>
            <Button>
              <img src="/assets/svgs/footer/call.svg" alt="call" />
              <Typography ml={1} sx={itemStyle}>
                <a style={itemStyle} href="tel:0813626248">
                  0813626248
                </a>
              </Typography>
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: {
                xs: "100%",
                md: "30%",
              },
            }}
          >
            <Link
              to="https://www.facebook.com/phamxuanhuy3005/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/svgs/footer/facebook.svg" alt="facebook" />
            </Link>
            <Link
              to="https://www.facebook.com/phamxuanhuy3005/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography ml={1} sx={itemStyle}>
                Beautya's fanpage
              </Typography>
            </Link>
            {/* <Link to="/" target="_blank" rel="noopener noreferrer">
              <img src="/assets/svgs/footer/tiktok.svg" alt="tiktok" />
            </Link> */}
          </Box>
        </Container>
      </Box>

      {/* Phần bản quyền */}
      <Box
        component="section"
        sx={{
          backgroundColor: "var(--primary-900, #14010a)",
          paddingBlock: 1.5,
        }}
      >
        <Container maxWidth="lg" sx={containerStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <img src="/assets/svgs/footer/copyright.svg" alt="copyright" />
            <Typography
              sx={{
                color: "var(--gray-cbcbcb, #cbcbcb)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05rem",
              }}
            >
              {new Date().getFullYear()} Beautya
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1.5rem",
              color: "var(--neutral-gray-cbcbcb, #cbcbcb)",
              fontSize: "0.75rem",
              textTransform: "capitalize",
            }}
          >
            <Typography>Điều khoản & Điều kiện</Typography>
            {/* <Typography>Chính sách Riêng tư</Typography> */}
          </Box>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
