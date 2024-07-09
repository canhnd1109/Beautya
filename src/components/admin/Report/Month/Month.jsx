import { useTheme } from '@mui/material/styles';
import { Label, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
// import Title from "../Title/Title";
import { Box } from '@mui/material';
import Title from 'components/admin/Dashboard/Title/Title';
import Loading from 'components/common/Loading/Loading';
import { useEffect, useState } from 'react';
import { getOrders } from 'server/firebase/firestore/orders';
import { showErrorToast } from 'utils/showToasts';

// Modify createData to use actual date with rounded hours
function createDataWithDate(date, amount) {
    const roundedHours = Math.round(date.getMinutes() / 60);
    const roundedDate = new Date(date);
    roundedDate.setMinutes(60 * roundedHours, 0, 0);

    // Format the time to HH:00
    const time = `${String(roundedDate.getHours()).padStart(2, '0')}:00`;
    return { time, amount };
}

export default function Month() {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setOrders(await getOrders());
            } catch (err) {
                showErrorToast(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Lọc các đơn hàng trong 30 ngày gần nhất
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // 29 days ago to cover the last 30 days

    const lastThirtyDaysOrders = orders.filter((order) => {
        const orderDate = order.orderDate?.toDate();
        return orderDate >= thirtyDaysAgo;
    });

    // Tạo dữ liệu cho biểu đồ
    const chartData = lastThirtyDaysOrders.map((order) =>
        createDataWithDate(order.orderDate.toDate(), order.totalPrice),
    );

    return (
        <>
            {loading && <Loading />}
            <Box ml={4} mb={2}>
                <Title>Doanh thu trong 30 ngày qua</Title>
            </Box>
            <ResponsiveContainer
                width="70%"
                height="70%"
                style={{
                    marginInline: 'auto',
                }}
            >
                <LineChart
                    data={chartData}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="time"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                        domain={['auto', 'auto']}
                    />
                    <YAxis
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                        domain={['auto', 'auto']}
                    >
                        <Label
                            angle={270}
                            position="left"
                            offset={15}
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            Doanh số (đ)
                        </Label>
                    </YAxis>
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}
