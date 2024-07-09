import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import ConfirmDialog from "components/common/ConfirmDialog/ConfirmDialog";
import Loading from "components/common/Loading/Loading";
import { useCart } from "contexts/cartContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formattedPrice } from "utils/formattedPrice";
import { showErrorToast, showSuccessToast } from "utils/showToasts";

const CartPage = () => {
  const { cart, removeFromCart, updateCartItemQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = async (productId) => {
    setSelectedProductId(productId);
    setShowRemoveDialog(true);
  };

  const handleIncrementQuantity = async (productId) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const updatedCart = cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      await updateCartItemQuantity(updatedCart);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrementQuantity = async (productId) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const updatedCart = cart.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      await updateCartItemQuantity(updatedCart);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConfirm = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      await removeFromCart(selectedProductId);
      showSuccessToast("Removed item from cart");
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
      setSelectedProductId(null);
      setShowRemoveDialog(false);
    }
  };

  return (
    <Container>
      {loading && <Loading />}
      <Typography
        variant="h4"
        mt={3}
        mb={3}
        style={{
          marginBottom: "1rem",
          textAlign: "center",
          color: "var(--primary)",
          fontWeight: 700,
          textTransform: "uppercase",
          paddingBottom: "0.5rem",
        }}
      >
        Giỏ Hàng Của Bạn
      </Typography>

      {cart.length === 0 ? (
        <Typography
          variant="body1"
          style={{
            textAlign: "center",
            marginBlock: "4rem",
            padding: "1rem",
            border: "2px dashed #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          Giỏ hàng của bạn đang trống.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Box
                key={item.productId}
                boxShadow={2}
                borderRadius={2}
                p={2}
                mb={2}
                bgcolor="white"
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        component="img"
                        maxHeight={150}
                        src={item.imageUrls[0]}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography
                      variant="body1"
                      style={{ marginBottom: "1rem", textAlign: "center" }}
                    >
                      <b>{item.name}</b>
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{ marginBottom: "1rem", textAlign: "center" }}
                    >
                      Giá: <b>{formattedPrice(item.price)}</b>
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                    >
                      <Typography variant="body1">Số lượng:</Typography>
                      <Button
                        onClick={() => handleDecrementQuantity(item.productId)}
                        variant="contained"
                        style={{
                          backgroundColor: "var(--primary, #A10550)",
                        }}
                        size="small"
                      >
                        -
                      </Button>
                      <Typography variant="body1">{item.quantity}</Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleIncrementQuantity(item.productId)}
                        style={{
                          backgroundColor: "var(--primary, #A10550)",
                        }}
                        size="small"
                      >
                        +
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                    >
                      <Typography variant="body1">
                        <b>{formattedPrice(item.price * item.quantity)}</b>
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleRemoveItem(item.productId)}
                        style={{
                          backgroundColor: "var(--primary, #A10550)",
                        }}
                        size="small"
                      >
                        Xóa
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} boxShadow={2} borderRadius={2} bgcolor="white">
              <Typography
                variant="h4"
                style={{ marginBottom: "1rem", textAlign: "center" }}
              >
                Tổng Tiền:
              </Typography>
              <Typography
                variant="h3"
                style={{ marginBottom: "1rem", textAlign: "center" }}
              >
                {formattedPrice(calculateTotal())}
              </Typography>
              <Link to="/checkout">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--primary, #A10550)",
                  }}
                  mt={3}
                  fullWidth
                >
                  Thanh Toán
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      )}

      <ConfirmDialog
        open={showRemoveDialog}
        setOpen={setShowRemoveDialog}
        label="Xóa Sản Phẩm"
        content={
          <>
            <Typography variant="body1">
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng của bạn
              không?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Hành động này không thể hoàn tác. Sản phẩm của bạn sẽ bị loại khỏi
              giỏ hàng.
            </Typography>
          </>
        }
        onClickAgree={() => handleRemoveConfirm()}
      />
    </Container>
  );
};

export default CartPage;
