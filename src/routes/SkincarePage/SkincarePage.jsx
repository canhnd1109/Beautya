import { Container, Stack, Typography } from '@mui/material';
import Breadcrumb from 'components/common/Breadcrumb/Breadcrumb';
import Layout from 'components/common/Layout/Layout';
import ProductList from 'components/products/ProductList/ProductList';
import { CATEGORY } from 'utils/constants';

const SkincarePage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <Breadcrumb current="Skincare" />

                <Stack direction="row" marginY={{ xs: '0.75rem', md: '1.5rem' }}>
                    <Typography
                        sx={{
                            color: 'var(--black, #0C0C0C)',
                            fontSize: { xs: '1.25rem', md: '2rem' }, // Adjusted font size
                            fontWeight: 700,
                            textTransform: 'capitalize',
                        }}
                    >
                        Skincare
                    </Typography>
                </Stack>

                <ProductList category={CATEGORY.SKINCARE} />
            </Container>
        </Layout>
    );
};

export default SkincarePage;
