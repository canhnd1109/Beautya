import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  Pagination,
  TextField,
} from "@mui/material";
import Loading from "components/common/Loading/Loading";
import ProductCard from "components/common/ProductCard/ProductCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "server/firebase/firestore/products";
import { TYPE_OPTIONS } from "utils/constants";
import { showErrorToast } from "utils/showToasts";
import SortSelect from "../SortSelect/SortSelect";

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState({
    priceRange: [],
    types: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts(category);
        setProducts(fetchedProducts);
        setOriginalProducts(fetchedProducts);
      } catch (e) {
        showErrorToast(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [category]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sortedProducts = sortProducts(products);
    const inStockProducts = sortedProducts.filter(
      (product) => product.stockCount > 0
    );
    const outOfStockProducts = sortedProducts.filter(
      (product) => product.stockCount <= 0
    );
    const combinedProducts = [...inStockProducts, ...outOfStockProducts];
    setPaginatedProducts(combinedProducts.slice(startIndex, endIndex));
  }, [products, currentPage, itemsPerPage]);

  const handleApplyFilter = () => {
    if (
      filterValues.priceRange.length === 0 &&
      filterValues.types.length === 0
    ) {
      return;
    }

    const filteredProducts = originalProducts.filter((product) => {
      const price = parseFloat(product.price);
      const isPriceInRange =
        filterValues.priceRange.length === 0 ||
        filterValues.priceRange.some(
          (range) =>
            (range === "dưới 200.000 đ" && price < 200000) ||
            (range === "200.000 - 1.000.000 đ" &&
              price >= 200000 &&
              price <= 1000000) ||
            (range === "từ 1.000.000 đ" && price >= 1000000)
        );
      const selectedTypes = filterValues.types.map((item) => item.value);
      const isProductTypeMatch =
        selectedTypes.length === 0 ||
        selectedTypes.some((typeId) => product.types.includes(typeId));
      return isPriceInRange && isProductTypeMatch;
    });

    setProducts(filteredProducts);
    setCurrentPage(1);
    setPaginatedProducts(filteredProducts.slice(0, itemsPerPage));
  };

  const handleClearFiltersAndSort = () => {
    setFilterValues({
      priceRange: [],
      types: [],
    });
    setSelectedSort("");

    setCurrentPage(1);
    setProducts(originalProducts);
    setPaginatedProducts(originalProducts.slice(0, itemsPerPage));
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSort) => {
    setSelectedSort(newSort);
    const sortedProducts = sortProducts(products, newSort);
    setProducts(sortedProducts);
  };

  const sortProducts = (products, sortOption) => {
    return products.slice().sort((a, b) => {
      if (sortOption === "soldCount") {
        return parseFloat(b.soldCount) - parseFloat(a.soldCount);
      } else if (sortOption === "price") {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortOption === "priceHighToLow") {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      return 0;
    });
  };

  const getPriceRangeLabel = (value) => {
    if (value === "dưới 200.000 đ") return "dưới 200.000 đ";
    if (value === "200.000 - 1.000.000 đ") return "200.000 - 1.000.000 đ";
    if (value === "từ 1.000.000 đ") return "từ 1.000.000 đ";
    return "";
  };

  const getProductTypeLabel = (value) => {
    const typeOption = TYPE_OPTIONS.find((option) =>
      option.types.some((type) => type.value === value)
    )?.types.find((type) => type.value === value);
    return typeOption ? typeOption.label : "";
  };

  const filteredTypeOptions = TYPE_OPTIONS.find(
    (option) => option.categoryId === category
  )?.types;

  return (
    <Box sx={{ padding: 2 }}>
      {loading && <Loading />}

      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 4,
          padding: 2,
          marginBottom: 2,
          backgroundColor: "#f9f9f9",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl fullWidth>
              <Autocomplete
                multiple
                id="price-range"
                options={[
                  "dưới 200.000 đ",
                  "200.000 - 1.000.000 đ",
                  "từ 1.000.000 đ",
                ]}
                value={filterValues.priceRange}
                onChange={(event, newValue) =>
                  handleFilterChange("priceRange", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Khoảng giá"
                    variant="outlined"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={getPriceRangeLabel(option)}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl fullWidth>
              <Autocomplete
                multiple
                id="product-type"
                options={filteredTypeOptions || []}
                value={filterValues.types}
                onChange={(event, newValue) =>
                  handleFilterChange("types", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Loại sản phẩm"
                    variant="outlined"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value
                    .map((item) => item.value)
                    .map((option, index) => (
                      <Chip
                        label={getProductTypeLabel(option)}
                        {...getTagProps({ index })}
                      />
                    ))
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Button
              onClick={handleApplyFilter}
              variant="contained"
              fullWidth
              style={{
                marginTop: 10,
                backgroundColor: "var(--primary, #A10550)",
              }}
            >
              Áp dụng
            </Button>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Button
              onClick={handleClearFiltersAndSort}
              variant="contained"
              fullWidth
              style={{
                marginTop: 10,
                backgroundColor: "var(--primary, #A10550)",
              }}
            >
              Xóa bộ lọc
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ marginY: 2 }}>
        <SortSelect
          onSortChange={handleSortChange}
          selectedSort={selectedSort}
        />
      </Box>

      <Grid container spacing={{ xs: 6, sm: 7, md: 8 }}>
        {paginatedProducts.map((product, index) => (
          <Grid item xs={6} md={4} key={index}>
            <Link to={`/products/${product.id}`}>
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

      <Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
        <Pagination
          count={Math.ceil(products.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default ProductList;
