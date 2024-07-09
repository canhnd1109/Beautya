import Check from "@mui/icons-material/Check";
import ContactsIcon from "@mui/icons-material/Contacts";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReviewsIcon from "@mui/icons-material/Reviews";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ConfirmDialog from "components/common/ConfirmDialog/ConfirmDialog";
import Loading from "components/common/Loading/Loading";
import { useAuth } from "contexts/authContext";
import { useCart } from "contexts/cartContext";
import emailjs from "emailjs-com";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "server/firebase/firestore/orders";
import { showErrorToast, showSuccessToast } from "utils/showToasts";
import AddressForm from "../AddressForm/AddressForm";
import PaymentForm from "../PaymentForm/PaymentForm";
import Review from "../Review/Review";
import axios from "axios";
import CryptoJS from "crypto-js";

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <ContactsIcon />,
    2: <PaymentsIcon />,
    3: <ReviewsIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = ["Địa chỉ giao hàng", "Chi tiết thanh toán", "Xem lại đơn hàng"];

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customerOrderId, setCustomerOrderId] = useState(null);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "COD",
    province: "",
    district: "",
    ward: "",
    address: "",
  });
  const [showConfirmOrderDialog, setShowConfirmOrderDialog] = useState(false);

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo(0, 0);
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleAddressFormSubmit = () => {
    handleNext();
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleClickOrder = () => {
    setShowConfirmOrderDialog(true);
  };

  const handlePlaceOrder = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const currentOrderId = await createOrder(
        user.uid,
        shippingData.fullName,
        shippingData.email,
        shippingData.phone,
        cart,
        calculateTotal(),
        `${shippingData.address} - ${shippingData.ward} -
            ${shippingData.district} - ${shippingData.province}`
      );
      setCustomerOrderId(currentOrderId);
      setShowConfirmOrderDialog(false);

      await clearCart();

      if (shippingData.paymentMethod === "COD") {
        await emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          {
            toEmail: shippingData.email,
            toName: shippingData.fullName,
            orderId: String(currentOrderId),
            orderDate: new Date().toLocaleString(),
            shippingAddress: `${shippingData.address} - ${shippingData.ward} -
            ${shippingData.district} - ${shippingData.province}`,
            totalAmount: String(calculateTotal()),
          },
          process.env.REACT_APP_EMAILJS_USER_ID
        );

        handleNext();

        showSuccessToast(
          "🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm. Bạn sẽ nhận được email xác nhận trong thời gian sớm nhất."
        );
      } else {
        const accessKey = "klm05TvNBzhg7h7j";
        const secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";

        // Parameters
        const partnerCode = "MOMOBKUN20180529";
        const orderId = currentOrderId;
        const requestId = orderId;
        const amount = calculateTotal();
        const orderInfo =
          "Thanh toán đơn hàng. Cám ơn bạn đã luôn đồng hành cùng Beauya.";
        // const redirectUrl = "http://localhost:3000/payment-result";
        // const ipnUrl = "http://localhost:3000/payment-result";
        const redirectUrl = "https://beautya.store/payment-result";
        const ipnUrl = "https://beautya.store/payment-result";
        const requestType = "captureWallet";
        const extraData = "";
        const lang = "vi";

        // Signature
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(
          CryptoJS.enc.Hex
        );

        // Request Body
        const requestBody = {
          partnerCode,
          requestId,
          amount,
          orderId,
          orderInfo,
          redirectUrl,
          ipnUrl,
          requestType,
          extraData,
          lang,
          signature,
        };

        // Tạo 1 order tạm ở đây với trạng thái chưa thanh toán (xử lí sau khi nhận kết quả trả về)

        axios
          .post(
            "https://test-payment.momo.vn/v2/gateway/api/create", // Updated endpoint path
            requestBody
          )
          .then((response) => {
            window.location.href = response.data.payUrl;
          })
          .catch((error) => {
            showErrorToast(error.message);
          });
      }
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            onSubmit={handleAddressFormSubmit}
            shippingData={shippingData}
            setShippingData={setShippingData}
          />
        );
      case 1:
        return (
          <PaymentForm
            shippingData={shippingData}
            setShippingData={setShippingData}
          />
        );
      case 2:
        return (
          <Review
            cart={cart}
            calculateTotal={calculateTotal}
            shippingData={shippingData}
          />
        );
      default:
        throw new Error("Bước không xác định");
    }
  }

  if (cart.length === 0) {
    return (
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography variant="h5" gutterBottom>
            Giỏ hàng của bạn trống
          </Typography>
          <Typography variant="subtitle1">
            Thêm một số sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Link to="/">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--primary, #A10550)",
                }}
              >
                Đi đến Trang chủ
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      {loading && <Loading />}
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: "var(--primary, #A10550)",
            marginBottom: "1.5rem",
          }}
        >
          Đặt hàng
        </Typography>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
          sx={{ marginBottom: 3 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h5" gutterBottom>
              Cảm ơn bạn đã đặt hàng.
            </Typography>
            <Typography variant="subtitle1">
              Mã đơn hàng của bạn là #{customerOrderId}. Chúng tôi đã gửi email
              xác nhận đơn hàng của bạn và sẽ gửi thông báo khi đơn hàng của bạn
              được vận chuyển.
            </Typography>
          </>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {activeStep !== 0 && (
                <Button
                  variant="contained"
                  onClick={handleBack}
                  sx={{ mt: 3, ml: 1 }}
                  style={{
                    backgroundColor: "var(--primary, #A10550)",
                  }}
                >
                  Quay lại
                </Button>
              )}
              {activeStep !== 0 ? (
                <Button
                  variant="contained"
                  onClick={
                    activeStep === steps.length - 1
                      ? handleClickOrder
                      : handleNext
                  }
                  sx={{ mt: 3, ml: 1 }}
                  style={{
                    backgroundColor: "var(--primary, #A10550)",
                  }}
                >
                  {activeStep === steps.length - 1 ? "Đặt hàng" : "Tiếp theo"}
                </Button>
              ) : null}
            </Box>
          </>
        )}
      </Paper>

      <ConfirmDialog
        open={showConfirmOrderDialog}
        setOpen={setShowConfirmOrderDialog}
        label="Xác nhận Đơn Hàng"
        content="Bạn chắc chắn muốn đặt hàng chứ?"
        onClickAgree={() => handlePlaceOrder()}
      />
    </Container>
  );
}
