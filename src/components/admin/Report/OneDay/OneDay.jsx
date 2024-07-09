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

export default function OneDay() {
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

    // Set the start time for the last 24 hours
    const lastOneDay = new Date();
    lastOneDay.setDate(lastOneDay.getDate() - 1);

    // Filter orders for the last 24 hours
    const lastOneDayOrders = orders.filter((order) => {
        const orderDate = order.orderDate?.toDate();
        return orderDate >= lastOneDay;
    });

    // Generate data for the chart
    const chartData = lastOneDayOrders.map((order) => createDataWithDate(order.orderDate.toDate(), order.totalPrice));

    return (
        <>
            {loading && <Loading />}
            <Box ml={4} mb={2}>
                <Title>Doanh thu trong 1 ngày qua</Title>
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
