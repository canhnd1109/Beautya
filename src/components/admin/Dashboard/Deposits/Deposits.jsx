import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Title from '../Title/Title';
import { formattedPrice } from 'utils/formattedPrice';

export default function Deposits({ orders }) {
    const sortedOrders = [...orders].sort((a, b) => b?.orderDate?.toDate() - a?.orderDate?.toDate());

    const mostRecentOrder = sortedOrders[0];

    // Calculate total amount for the most recent day
    const totalAmountForDay = sortedOrders.reduce((total, order) => {
        const orderDate = order.orderDate.toDate();
        const isSameDay =
            orderDate &&
            orderDate.getDate() === mostRecentOrder?.orderDate?.toDate().getDate() &&
            orderDate.getMonth() === mostRecentOrder.orderDate.toDate().getMonth() &&
            orderDate.getFullYear() === mostRecentOrder.orderDate.toDate().getFullYear();

        return isSameDay ? total + order.totalPrice : total;
    }, 0);

    return (
        <Box marginBlock="auto" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Title>Ngày gần nhất</Title>
            <Typography component="p" variant="h4">
                {formattedPrice(totalAmountForDay)}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                {mostRecentOrder?.orderDate?.toDate().toLocaleDateString()}
            </Typography>
        </Box>
    );
}
