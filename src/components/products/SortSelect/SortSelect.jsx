import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SortSelect = ({ onSortChange, selectedSort }) => {
  const handleSortChange = (event) => {
    const newSort = event.target.value;
    // Pass the selected sort option to the parent component
    onSortChange(newSort);
  };

  return (
    <FormControl sx={{ width: "100%", height: "3.75rem" }}>
      <InputLabel htmlFor="sort-label">Sắp xếp theo</InputLabel>
      <Select
        labelId="sort-label"
        id="sort-label"
        label="Sắp xếp theo"
        onChange={handleSortChange}
        value={selectedSort || ""}
        sx={{
          borderRadius: 4,
          backgroundColor: "#f9f9f9",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <MenuItem value="soldCount">Bán chạy nhất</MenuItem>
        <MenuItem value="price">Giá tăng dần</MenuItem>
        <MenuItem value="priceHighToLow">Giá giảm dần</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortSelect;
