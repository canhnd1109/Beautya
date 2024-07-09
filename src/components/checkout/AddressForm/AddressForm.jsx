import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function AddressForm({
  onSubmit,
  shippingData,
  setShippingData,
}) {
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });

    // Clear validation errors on change
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/; // Giả sử số điện thoại có 10 chữ số
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra hợp lệ của email
    if (!validateEmail(shippingData.email)) {
      setErrors({
        ...errors,
        email: "Địa chỉ email không hợp lệ",
      });
      return;
    }

    // Kiểm tra hợp lệ của số điện thoại
    if (!validatePhone(shippingData.phone)) {
      setErrors({
        ...errors,
        phone: "Số điện thoại không hợp lệ (yêu cầu 10 chữ số)",
      });
      return;
    }

    // Tiến hành gửi dữ liệu nếu tất cả kiểm tra đều hợp lệ
    onSubmit(shippingData);
  };

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", md: "2rem" },
          fontWeight: 700,
          color: "var(--primary, #A10550)",
          marginBottom: "1rem",
        }}
      >
        Địa chỉ gửi hàng
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="fullName"
              name="fullName"
              label="Họ và Tên"
              fullWidth
              autoComplete="name"
              variant="standard"
              value={shippingData.fullName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              autoComplete="email"
              variant="standard"
              value={shippingData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="phone"
              name="phone"
              label="Số điện thoại"
              fullWidth
              autoComplete="tel"
              variant="standard"
              value={shippingData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="province"
              name="province"
              label="Tỉnh / thành phố"
              fullWidth
              autoComplete="province"
              variant="standard"
              value={shippingData.province}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="district"
              name="district"
              label="Quận / huyện"
              fullWidth
              autoComplete="district"
              variant="standard"
              value={shippingData.district}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="ward"
              name="ward"
              label="Phường / xã"
              fullWidth
              autoComplete="address-line3"
              variant="standard"
              value={shippingData.ward}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="address"
              name="address"
              label="Địa chỉ chi tiết"
              fullWidth
              autoComplete="address-line4"
              variant="standard"
              value={shippingData.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "var(--primary, #A10550)",
              }}
            >
              Tiếp Theo
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
