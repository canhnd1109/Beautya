import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Box, Button, Stack, Typography } from "@mui/material";
import ConfirmDialog from "components/common/ConfirmDialog/ConfirmDialog";
import Loading from "components/common/Loading/Loading";
import { useAuth } from "contexts/authContext";
import { useCart } from "contexts/cartContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "server/firebase/firestore/products";
import { CATEGORY, CATEGORY_REVERT, TYPE_REVERT } from "utils/constants";
import { showErrorToast, showSuccessToast } from "utils/showToasts";
import ProductTab from "./ProductTab/ProductTab";
import QuantitySelector from "./QuantitySelector/QuantitySelector ";
import { formattedPrice } from "utils/formattedPrice";
import SimilarProducts from "../SimilarProducts/SimilarProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const currentProduct = await getProduct(id);
          setProduct(currentProduct);
          setCurrentImage(currentProduct.imageUrls[0]);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          showErrorToast(error.message);
          return;
        }
      })();
    }
  }, [id]);

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(Math.max(quantity - 1, 1));
  };

  const handleAddToCart = async () => {
    try {
      if (product.stockCount > 0) {
        if (user) {
          setLoading(true);
          await addToCart(
            product.id,
            quantity,
            product.name,
            product.price,
            product.imageUrls
          );
          showSuccessToast("Đã thêm sản phẩm vào giỏ hàng");
        } else {
          setShowLoginDialog(true);
        }
      } else {
        showErrorToast("Sản phẩm đã hết hàng");
      }
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginConfirm = () => {
    navigate("/login");
  };

  return (
    <>
      {loading && <Loading />}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        spacing={{ xs: "0.5rem", md: "1.5rem" }}
        my="1.5rem"
      >
        {/* Image Thumbnails */}
        <Stack
          direction={{ xs: "row", md: "column" }}
          spacing={{ xs: "0.5rem", md: "1.5rem" }}
          justifyContent="center"
        >
          {product?.imageUrls?.slice(0, 6)?.map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image}
              sx={{
                width: {
                  xs: "4.25rem",
                  md: "5rem",
                },
                height: {
                  xs: "4.25rem",
                  md: "4.875rem",
                },
                display: "inline-block",
                cursor: "pointer",
                border: currentImage === image ? "2px solid #A10550" : "none",
                borderRadius: "8px",
                marginRight: "0.5rem",
              }}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </Stack>

        {/* Main Product Image */}
        <Box
          component="img"
          src={currentImage}
          sx={{
            width: {
              xs: "20rem",
              md: "44rem",
            },
            height: {
              xs: "20rem",
              md: "37.8125rem",
            },
            display: "inline-block",
            cursor: "pointer",
          }}
        />

        {/* Product Details and Add to Cart */}
        <Stack
          width="20rem"
          spacing="1.5rem"
          sx={{
            backgroundColor: "var(--light-grey, #F5F5F5)",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "var(--primary, #A10550)",
              fontWeight: 700,
              textTransform: "capitalize",
              marginBottom: "0.5rem",
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              textAlign: "center",
            }}
          >
            {product.name}
          </Typography>

          {/* Category and Product Type */}
          <Typography
            variant="subtitle1"
            sx={{
              color: "var(--pink, #FF69B4)",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Danh mục:{" "}
            {product?.categories
              ?.map((category) => (
                <span
                  key={category}
                  style={{ color: "var(--dark-pink, #D6007E)" }}
                >
                  {CATEGORY_REVERT[category]}
                </span>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "var(--purple, #800080)",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Loại sản phẩm:{" "}
            {product?.types
              ?.map((type) => (
                <span
                  key={type}
                  style={{ color: "var(--dark-purple, #4B0082)" }}
                >
                  {TYPE_REVERT[type]}
                </span>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
          </Typography>

          {/* Số lượng đã bán */}
          <Typography
            variant="subtitle1"
            sx={{
              color: "var(--green, #008000)",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Số lượng đã bán:{" "}
            <span style={{ color: "var(--dark-green, #006400)" }}>
              {product.soldCount}
            </span>{" "}
            sản phẩm
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "var(--primary, #A10550)",
              fontWeight: 700,
              marginBottom: "1rem",
              fontSize: "3rem",
              textAlign: "center",
            }}
          >
            {formattedPrice(product.price)}
          </Typography>

          <Typography
            sx={{
              color:
                product.stockCount > 0
                  ? "var(--blue, #2196F3)"
                  : "var(--error, #F44336)",
              fontWeight: 700,
              marginBottom: "1rem",
              fontSize: "1rem",
            }}
          >
            {product.stockCount > 0
              ? `Còn: ${product.stockCount} sản phẩm`
              : "Hết hàng"}
          </Typography>

          <QuantitySelector
            quantity={quantity}
            stockCount={product.stockCount}
            onQuantityChange={handleQuantityChange}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor:
                product.stockCount > 0
                  ? "var(--primary, #A10550)"
                  : "var(--grey, #CCCCCC)",
              height: "4rem",
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              fontSize: "1rem",
            }}
            onClick={handleAddToCart}
            disabled={product.stockCount <= 0}
          >
            <AddShoppingCartIcon /> Thêm vào giỏ hàng
          </Button>

          <ConfirmDialog
            open={showLoginDialog}
            setOpen={setShowLoginDialog}
            label="Yêu cầu đăng nhập"
            content={
              <>
                <Typography variant="body1">
                  Để sử dụng giỏ hàng, bạn cần đăng nhập.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Bạn có muốn đăng nhập ngay bây giờ không?
                </Typography>
              </>
            }
            onClickAgree={() => handleLoginConfirm()}
          />
        </Stack>
      </Stack>
      <ProductTab product={product} />

      <SimilarProducts product={product} />
    </>
  );
};

export default ProductDetail;
