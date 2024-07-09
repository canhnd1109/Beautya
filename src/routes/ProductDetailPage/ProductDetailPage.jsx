import { Container } from '@mui/material';
import Breadcrumb from 'components/common/Breadcrumb/Breadcrumb';
import Layout from 'components/common/Layout/Layout';
import ProductDetail from 'components/products/ProductDetail/ProductDetail';

const ProductDetailPage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <Breadcrumb current="Beauty" />
                <ProductDetail />
            </Container>
        </Layout>
    );
};

export default ProductDetailPage;
