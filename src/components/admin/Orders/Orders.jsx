import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import Loading from 'components/common/Loading/Loading';
import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from 'server/firebase/firestore/orders';
import { formattedPrice } from 'utils/formattedPrice';
import { showErrorToast, showSuccessToast } from 'utils/showToasts';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const allOrders = await getOrders();
                setOrders(allOrders);
                setLoading(false);
            } catch (e) {
                setLoading(false);
                showErrorToast(e.message);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = filterStatus === 'All' ? orders : orders.filter((order) => order.status === filterStatus);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredOrders.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusChange = (orderId, status) => {
        setSelectedOrderId(orderId);
        setSelectedStatus(status);
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleSaveStatus = async () => {
        if (loading) {
            return;
        }

        try {
            setLoading(true);
            await updateOrderStatus(selectedOrderId, selectedStatus);
            const updatedOrders = await getOrders();
            setOrders(updatedOrders);
            setLoading(false);
            setEditMode(false);
            showSuccessToast('Cập nhật trạng thái đơn hàng thành công!');
        } catch (err) {
            setLoading(false);
            showErrorToast(err.message);
        }
    };

    const sortOrders = (a, b) => {
        // Define the order of statuses
        const statusOrder = { pending: 0, shipping: 1, completed: 2 };

        // Compare statuses first
        const statusComparison = statusOrder[a.status] - statusOrder[b.status];
        if (statusComparison !== 0) {
            return statusComparison;
        }

        // If statuses are the same, compare order date in reverse order (recent first)
        return b.orderDate.toDate() - a.orderDate.toDate();
    };

    const sortedOrders = filteredOrders.slice().sort(sortOrders);

    return (
        <Grid container spacing={2}>
            {loading && <Loading />}

            <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ marginInline: 3 }}>
                        Lọc theo trạng thái đơn hàng:
                    </Typography>
                    <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <MenuItem value="All">Tất cả</MenuItem>
                        <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                        <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
                        <MenuItem value="Hoàn tất">Hoàn tất</MenuItem>
                    </Select>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500, marginBlock: 4 }} aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Mã đơn hàng
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Tên khách hàng
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    SĐT
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Tổng tiền
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Ngày đặt hàng
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Địa chỉ
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Tình trạng thanh toán
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Trạng thái
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Cập nhật
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : sortedOrders
                            ).map((order) => (
                                <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center">{order.id}</TableCell>
                                    <TableCell align="center">{order.fullName}</TableCell>
                                    <TableCell align="center">{order.phone}</TableCell>
                                    <TableCell align="center">{`${formattedPrice(order.totalPrice)}`}</TableCell>
                                    <TableCell align="center">{order.orderDate.toDate().toLocaleString()}</TableCell>
                                    <TableCell align="center">{order.address}</TableCell>
                                    <TableCell align="center">{order.paymentStatus}</TableCell>
                                    <TableCell align="center">
                                        {editMode && selectedOrderId === order.id ? (
                                            <Select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                            >
                                                <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                                                <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
                                                <MenuItem value="Hoàn tất">Hoàn tất</MenuItem>
                                            </Select>
                                        ) : (
                                            order.status
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editMode && selectedOrderId === order.id ? (
                                            <>
                                                <Button onClick={handleCancelEdit}>Cancel</Button>
                                                <Button onClick={handleSaveStatus}>Save</Button>
                                            </>
                                        ) : (
                                            <Button onClick={() => handleStatusChange(order.id, order.status)}>
                                                Edit Status
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 15, 20, { label: 'Tất cả', value: -1 }]}
                                    colSpan={6}
                                    count={filteredOrders.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
}

export default Orders;
