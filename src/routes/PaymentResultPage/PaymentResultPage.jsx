import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from 'components/common/Layout/Layout';
import UnauthorizedPage from 'routes/UnauthorizedPage/UnauthorizedPage';
import { getOrder, updatePaymentStatus, deleteOrder } from 'server/firebase/firestore/orders';
import { showSuccessToast } from 'utils/showToasts';
import Loading from 'components/common/Loading/Loading';

const PaymentResultPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const resultCode = queryParams.get('resultCode');
    const orderId = queryParams.get('orderId');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const action = async () => {
            try {
                const order = await getOrder(orderId);
                if (resultCode === '0' && order && order.paymentStatus !== 'Đã thanh toán') {
                    await updatePaymentStatus(orderId, 'Đã thanh toán');
                    showSuccessToast('🎉 Thanh toán thành công! Cảm ơn bạn đã mua sắm tại Beautya.');
                } else if (resultCode !== '0') {
                    await deleteOrder(orderId);
                }
            } catch (err) {
                // Handle errors and show appropriate toasts
            } finally {
                setLoading(false);
            }
        };

        action();
    }, [resultCode, orderId]);

    if (!resultCode || !orderId) {
        return <UnauthorizedPage />;
    }

    return (
        <Layout>
            <Container maxWidth="lg">
                {loading ? (
                    // You can customize the loading spinner or use your Loading component
                    <Loading />
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBlock: '2rem',
                        }}
                    >
                        <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                {resultCode === '0'
                                    ? 'Thanh toán thành công.'
                                    : 'Thanh toán thất bại. Vui lòng thử lại.'}
                            </Typography>
                            {resultCode === '0' && (
                                <>
                                    <Typography variant="subtitle1">
                                        Mã đơn hàng của bạn là #<b>{orderId}</b>. Cám ơn bạn đã lựa chọn và luôn tin
                                        tưởng Beautya.
                                    </Typography>
                                    {/* Add any additional information or styling here */}
                                </>
                            )}
                        </Paper>
                    </Box>
                )}
            </Container>
        </Layout>
    );
};

export default PaymentResultPage;
