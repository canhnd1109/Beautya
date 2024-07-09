import { Box, Grid } from "@mui/material";
import ProductCard from "components/common/ProductCard/ProductCard";
import { useProducts } from "contexts/ProductsContext";
import { Link } from "react-router-dom";
import Section from "../Section/Section";
import { CATEGORY_REVERT } from "utils/constants";

const BestCategorySection = ({ category }) => {
  const { products: allProducts } = useProducts();

  let sortedProducts = [];

  // Sort the products by soldCount in descending order
  category
    ? (sortedProducts = allProducts
        .filter((product) => product.categories.includes(category))
        .sort((a, b) => b.soldCount - a.soldCount))
    : (sortedProducts = allProducts.sort((a, b) => b.soldCount - a.soldCount));

  // Filter products with stockCount > 0
  const filteredProducts = sortedProducts.filter(
    (product) => product.stockCount > 0
  );

  // Take the top 3 products
  const topProducts = filteredProducts.slice(0, 4);

  return (
    <>
      <Section
        title={
          category
            ? `🏵️ Top sản phẩm ${CATEGORY_REVERT[category]} 🏵️`
            : "⭐ Bán chạy nhất ⭐"
        }
      >
        <Box sx={{ flexGrow: 1, marginY: { xs: "1.5rem", md: "2.5rem" } }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {topProducts.map((product, index) => (
              <Grid item xs={6} sm={3} md={3} key={index}>
                <Link to={`products/${product.id}`} key={index}>
                  <ProductCard
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    imageUrls={product.imageUrls}
                    stockCount={product.stockCount}
                    soldCount={product.soldCount}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Section>
    </>
  );
};

export default BestCategorySection;
