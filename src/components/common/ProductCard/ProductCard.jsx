import { Box, CardActionArea, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { formattedPrice } from "utils/formattedPrice";

const ProductCard = ({
  name,
  description,
  price,
  imageUrls,
  stockCount,
  soldCount,
}) => {
  return (
    <Card
      sx={{
        height: { xs: "22rem", md: "33rem" },
        position: "relative",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardActionArea>
        {stockCount <= 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <Typography
              variant="h6"
              color="error"
              sx={{
                fontWeight: 700,
                fontSize: "1.5rem",
                marginBottom: 1,
                textAlign: "center",
              }}
            >
              Hết hàng
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: "center",
              }}
            >
              Hãy quay lại sau.
            </Typography>
          </Box>
        )}
        <CardMedia
          component="img"
          image={imageUrls[0]}
          alt="product"
          loading="lazy"
          sx={{
            height: {
              xs: "10rem",
              md: "24rem",
            },
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
          decoding="async"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontWeight: {
                xs: 600,
                md: 700,
              },
              fontSize: {
                xs: "0.875rem",
                md: "1rem",
              },
              color: "var(--primary, #A10550)",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            {name.length > 30 ? name.slice(0, 30) + "..." : name}
          </Typography>
          <Typography
            gutterBottom
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            {description.length > 40
              ? description.slice(0, 40) + "..."
              : description}
          </Typography>
          <Box
            sx={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <Typography
              variant="body2"
              color="var(--primary, #A10550)" // Primary color
              sx={{
                fontWeight: {
                  xs: 600,
                  md: 400,
                },
                fontSize: {
                  xs: "0.875rem",
                  md: "1.125rem",
                },
                textAlign: "center", // Center text horizontally
              }}
            >
              {formattedPrice(price)}
            </Typography>
            <Typography
              variant="body2"
              color="var(--secondary, #00897B)"
              sx={{
                fontWeight: {
                  xs: 600,
                  md: 400,
                },
                fontSize: {
                  xs: "0.875rem",
                  md: "1.125rem",
                },
                textAlign: "center",
              }}
            >
              Đã bán: {soldCount}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
