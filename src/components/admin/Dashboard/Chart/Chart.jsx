import { useTheme } from '@mui/material/styles';
import { Label, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Title from '../Title/Title';

// Modify createData to use actual date with rounded hours
function createDataWithDate(date, amount) {
    const roundedHours = Math.round(date.getMinutes() / 60);
    const roundedDate = new Date(date);
    roundedDate.setMinutes(60 * roundedHours, 0, 0);

    // Format the time to HH:00
    const time = `${String(roundedDate.getHours()).padStart(2, '0')}:00`;
    return { time, amount };
}

export default function Chart({ orders }) {
    const theme = useTheme();

    // Filter orders for the latest 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 6 days ago to cover the last 7 days

    const lastSevenDaysOrders = orders.filter((order) => {
        const orderDate = order.orderDate?.toDate();
        return orderDate >= sevenDaysAgo;
    });

    // Generate data for the chart
    const chartData = lastSevenDaysOrders.map((order) =>
        createDataWithDate(order.orderDate.toDate(), order.totalPrice),
    );

    return (
        <>
            <Title>7 ngày qua</Title>
            <ResponsiveContainer>
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
