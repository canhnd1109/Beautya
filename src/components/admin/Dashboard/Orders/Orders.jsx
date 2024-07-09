import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title/Title';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { formattedPrice } from 'utils/formattedPrice';

export default function Orders({ orders }) {
    return (
        <>
            <Title>Đơn hàng gần đây</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Tên khách hàng</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Tình trạng thanh toán</TableCell>
                        <TableCell align="right">Tổng tiền</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders
                        .sort((a, b) => b.orderDate.seconds - a.orderDate.seconds)
                        .slice(0, 5)
                        .map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.orderDate?.toDate().toLocaleString()}</TableCell>
                                <TableCell>{order.email}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{order.paymentStatus}</TableCell>
                                <TableCell align="right">{`${formattedPrice(order.totalPrice)}`}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <Box mt={3}>
                <Link to="/admin/orders">Xem tất cả đơn hàng</Link>
            </Box>
        </>
    );
}
