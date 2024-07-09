import { Container } from '@mui/material';
import Breadcrumb from 'components/common/Breadcrumb/Breadcrumb';
import Layout from 'components/common/Layout/Layout';

const BlogPage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <Breadcrumb current="Blog" />
            </Container>
        </Layout>
    );
};

export default BlogPage;
