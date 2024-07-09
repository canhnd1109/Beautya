import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

const PaymentForm = ({ shippingData, setShippingData }) => {
  const [paymentMethod, setPaymentMethod] = useState(
    shippingData.paymentMethod || "COD"
  );

  const handlePaymentChange = (event) => {
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
    setShippingData((prevData) => ({
      ...prevData,
      paymentMethod: selectedPaymentMethod,
    }));
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
        Phương thức thanh toán
      </Typography>
      <RadioGroup
        row
        aria-label="payment-method"
        name="payment-method"
        value={paymentMethod}
        onChange={handlePaymentChange}
      >
        <Grid container>
          <Grid item xs={12}>
            <FormControlLabel
              value="COD"
              control={<Radio color="secondary" />}
              label="Thanh toán khi nhận hàng (COD)"
            />
          </Grid>
          {/* <Grid item xs={12}>
            <FormControlLabel
              value="MOMO"
              control={<Radio color="secondary" />}
              label="Thanh toán qua Momo"
            />
          </Grid> */}
        </Grid>
      </RadioGroup>

      {paymentMethod === "COD" && (
        <Grid item xs={12} mt={2}>
          <Typography variant="body2" color="textSecondary">
            Vui lòng chuẩn bị tiền mặt khi bạn nhận được sản phẩm. Đội ngũ của
            chúng tôi sẽ liên hệ với bạn để biết thêm chi tiết.
          </Typography>
        </Grid>
      )}

      {paymentMethod === "MOMO" && (
        <Grid item xs={12} mt={2}>
          <Typography variant="body2" color="textSecondary">
            Vui lòng quét mã QR code để chuyển khoản qua Momo. Chi tiết sẽ được
            cung cấp sau khi đặt hàng.
          </Typography>
        </Grid>
      )}
    </>
  );
};

export default PaymentForm;
