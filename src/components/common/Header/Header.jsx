import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CircularProgress } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useAuth } from "contexts/authContext";
import { useCart } from "contexts/cartContext";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUser } from "server/firebase/firestore/users";
import { CATEGORY_PATH } from "utils/constants";
import { showErrorToast } from "utils/showToasts";

const pages = [
  { title: "Makeup", path: CATEGORY_PATH.MAKE_UP },
  { title: "Skincare", path: CATEGORY_PATH.SKINCARE },
  { title: "Gifts and sets", path: CATEGORY_PATH.GIFTS_AND_SETS },
  // { title: "Blog", path: "/blog" },
  { title: "Phân tích da", path: "/skin-analyzer" },
  { title: "Giới thiệu", path: "/our-brand" },
];

const settings = [
  { title: "Hồ sơ", path: "/profile" },
  { title: "Đăng xuất", path: "/logout" },
];

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const { cart } = useCart();
  const { user } = useAuth();

  const location = useLocation();
  const isCurrentPath = (path) => location.pathname === path;

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(
    (currentUser && currentUser.avatar) || ""
  );

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (user) {
          const cur = await getUser(user.uid);
          setCurrentUser(cur);
          setAvatarUrl(cur.avatarUrl);
        }
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          marginBlock: 1,
          backgroundColor: "var(--white, #fff)",
          color: "var(--gray-202020, #202020)",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo trên máy tính */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Link to="/">
                <img
                  src="/assets/svgs/header/beautya-logo.svg"
                  alt="beautya-logo"
                />
              </Link>
              <Link to="/">
                <img src="/assets/svgs/header/beautya.svg" alt="beautya" />
              </Link>
            </Box>

            {/* Menu trên điện thoại */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.path} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      <Link to={page.path}>{page.title}</Link>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo trên điện thoại */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "column",
                width: "100%",
                marginInline: "auto",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Link to="/">
                <img src="/assets/svgs/header/mb-logo.svg" alt="logo" />
              </Link>
            </Box>

            {/* Menu trên máy tính */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                gap: "2rem",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    display: "block",

                    "&:hover": {
                      color: "var(--primary-600)",
                    },

                    "&:active": {
                      color: "var(--primary)",
                    },
                  }}
                >
                  <Link to={page.path}>
                    <Typography
                      sx={{
                        color: isCurrentPath(page.path)
                          ? "var(--primary, #A10550)"
                          : "inherit",
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {page.title}
                    </Typography>
                  </Link>
                </Button>
              ))}
            </Box>

            {/* Avatar người dùng */}
            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              {user && (
                <Link to="/cart">
                  <IconButton aria-label="cart" color="inherit" sx={{ mr: 4 }}>
                    <StyledBadge badgeContent={cart.length} color="secondary">
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </IconButton>
                </Link>
              )}

              {user ? (
                // Hiển thị Avatar khi người dùng đã đăng nhập
                <Tooltip title="Mở cài đặt">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Avatar alt={user.email} src={avatarUrl} />
                    )}
                  </IconButton>
                </Tooltip>
              ) : (
                // Hiển thị nút Đăng nhập và Đăng ký khi người dùng chưa đăng nhập
                <>
                  <Link to="/login">
                    <Button color="inherit">Đăng nhập</Button>
                  </Link>
                  <Link to="/signup">
                    <Button color="inherit">Đăng ký</Button>
                  </Link>
                </>
              )}
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.path} onClick={handleCloseUserMenu}>
                    <Link to={setting.path}>
                      <Typography textAlign="center">
                        {setting.title}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
