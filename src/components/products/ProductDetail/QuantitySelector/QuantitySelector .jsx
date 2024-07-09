import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const QuantitySelector = ({
  quantity,
  stockCount,
  onQuantityChange,
  onIncrease,
  onDecrease,
}) => {
  const handleInputChange = (event) => {
    const value = event.target.value;
    onQuantityChange(Math.min(Math.max(Number(value), 1), stockCount)); // Step 1: Pass the new quantity to the parent component
  };

  return (
    <Stack direction="row" spacing={4} justifyContent="space-between" my={3}>
      <Button
        variant="contained"
        sx={{ width: "20%", backgroundColor: "var(--primary, #A10550)" }}
        onClick={onDecrease}
      >
        -
      </Button>
      <TextField
        id="outlined-number"
        value={quantity}
        label="số lượng"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: 1,
          style: {
            textAlign: "center",
          },
        }}
        onChange={handleInputChange}
      />
      <Button
        variant="contained"
        sx={{ width: "20%", backgroundColor: "var(--primary, #A10550)" }}
        onClick={onIncrease}
        disabled={quantity >= stockCount}
      >
        +
      </Button>
    </Stack>
  );
};

export default QuantitySelector;
