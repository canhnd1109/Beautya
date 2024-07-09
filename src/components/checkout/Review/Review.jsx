// Review.js
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { formattedPrice } from "utils/formattedPrice";

export default function Review({ cart, calculateTotal, shippingData }) {
  const paymentMethodLabel =
    shippingData.paymentMethod === "COD"
      ? "Thanh toán khi nhận hàng (COD)."
      : "Thanh toán qua Momo";

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
        Tóm tắt đơn hàng
      </Typography>
      <List disablePadding>
        {cart.map((product) => (
          <ListItem key={product.productId} sx={{ py: 1, px: 0 }}>
            <Avatar
              alt={product.name}
              src={product.imageUrls.length > 0 ? product.imageUrls[0] : ""}
              sx={{ marginRight: 2 }}
            />
            <ListItemText
              primary={product.name}
              secondary={`Số lượng: ${product.quantity}`}
            />
            <Typography variant="body2">{`${formattedPrice(
              product.price
            )}`}</Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Tổng cộng" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {`${formattedPrice(calculateTotal())}`}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Giao hàng
          </Typography>
          <Typography gutterBottom>Tên: {shippingData.fullName}</Typography>
          <Typography gutterBottom>Email: {shippingData.email}</Typography>
          <Typography gutterBottom>Điện thoại: {shippingData.phone}</Typography>
          <Typography gutterBottom>
            Địa chỉ: {shippingData.address} - {shippingData.ward} -
            {shippingData.district} - {shippingData.province}
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Chi tiết thanh toán
          </Typography>
          <Typography variant="body">{paymentMethodLabel}</Typography>
        </Grid>
      </Grid>
    </>
  );
}
