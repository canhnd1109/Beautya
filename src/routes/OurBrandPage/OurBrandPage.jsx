import { Container } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Breadcrumb from 'components/common/Breadcrumb/Breadcrumb';
import Layout from 'components/common/Layout/Layout';

const BlurredBackgroundPaper = styled(Paper)(({ theme }) => ({
    py: 5,
    px: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    textAlign: 'center',
    mb: 5,
    position: 'relative',
    backgroundImage: `url('/assets/images/login.webp')`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(0.5px)', // Adjust the blur effect
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black overlay
        zIndex: 1,
    },
    '& *': {
        zIndex: 2, // Ensure text is above the overlay
        color: '#fff', // Text color
    },
}));

const brandInfo = {
    name: 'Beautya',
    slogan: 'Where Beauty Blossoms',
    about: 'Tại Beautya, chúng tôi đang trên một sứ mệnh để giải phóng sức mạnh của vẻ đẹp. Mục tiêu của chúng tôi là định nghĩa lại các tiêu chuẩn vẻ đẹp và truyền cảm hứng cho mọi người để họ có thể yêu thương bản thân mình một cách duyên dáng và đặc biệt.',
    story: 'Ngày xửa ngày xưa, trong một thế giới mê hoặc bởi sức hấp dẫn của vẻ đẹp, câu chuyện của Beautya được hé lộ. Sinh ra từ đam mê về tự biểu hiện và mong muốn tạo ra ảnh hưởng tích cực, Beautya không chỉ là một thương hiệu mỹ phẩm - đó là một hành trình ma thuật tôn vinh sự độc đáo và nghệ thuật yêu thương bản thân',
    brandImages: [
        '/assets/images/homepage/hero-1.webp',
        '/assets/images/homepage/hero-2.webp',
        '/assets/images/homepage/hero-3.webp',
    ],
};

const OurBrandPage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <Breadcrumb current="Giới thiệu" />
                {/* BlurredBackgroundPaper with enhanced typography and animation */}
                <BlurredBackgroundPaper elevation={0}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        {brandInfo.name}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                        {brandInfo.slogan}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        {brandInfo.about}
                    </Typography>
                </BlurredBackgroundPaper>

                {/* Updated Paper components with enhanced styles */}
                <Paper elevation={0} sx={{ backgroundColor: '#f8f8f8', py: 5 }}>
                    <Container>
                        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: '#4caf50' }}>
                            Câu Chuyện Của Chúng Tôi
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: 'center',
                                color: '#777',
                                maxWidth: 800,
                                mx: 'auto',
                            }}
                        >
                            {brandInfo.story}
                        </Typography>
                    </Container>
                </Paper>

                <Paper elevation={0} sx={{ backgroundColor: '#fff', py: 5 }}>
                    <Container>
                        {/* Enhanced heading style for "Brand Images" */}
                        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: '#ff4081' }}>
                            Khám Phá Vẻ Đẹp
                        </Typography>
                        {/* Updated Grid and Card components for a more aesthetic look */}
                        <Grid container spacing={3}>
                            {brandInfo.brandImages.map((image, index) => (
                                <Grid item key={index} xs={12} md={4}>
                                    <Card
                                        sx={{
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={image}
                                            alt={`Brand Image ${index + 1}`}
                                        />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Paper>
            </Container>
        </Layout>
    );
};

export default OurBrandPage;
