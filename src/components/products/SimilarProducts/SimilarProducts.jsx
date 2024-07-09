import { Box, Grid } from "@mui/material";
import ProductCard from "components/common/ProductCard/ProductCard";
import Section from "components/homepage/Section/Section";
import { useProducts } from "contexts/ProductsContext";
import { Link } from "react-router-dom";

const SimilarProducts = ({ product }) => {
  const { products: allProducts } = useProducts();

  const category =
    product &&
    product.categories &&
    product.categories.length >= 1 &&
    product.categories[0];

  // Filter products with the same category
  const similarProducts = allProducts.filter((prod) =>
    prod.categories.includes(category)
  );

  // Filter products with stockCount > 0
  const filteredProducts = similarProducts.filter(
    (prod) => prod.stockCount > 0
  );

  // Shuffle the array of similar products
  const shuffledProducts = filteredProducts.sort(() => Math.random() - 0.5);

  // Take the top 4 shuffled products
  const topProducts = shuffledProducts.slice(0, 4);

  return (
    <>
      <Section title="Sản phẩm cùng danh mục">
        <Box sx={{ flexGrow: 1, marginY: { xs: "1.5rem", md: "2.5rem" } }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {topProducts.map((prod, index) => (
              <Grid item xs={6} sm={3} md={3} key={index}>
                <Link to={`/products/${prod.id}`} key={index}>
                  <ProductCard
                    name={prod.name}
                    description={prod.description}
                    price={prod.price}
                    imageUrls={prod.imageUrls}
                    stockCount={prod.stockCount}
                    soldCount={prod.soldCount}
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

export default SimilarProducts;
