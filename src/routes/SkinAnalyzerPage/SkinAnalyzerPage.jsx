import { Container } from '@mui/material';
import Breadcrumb from 'components/common/Breadcrumb/Breadcrumb';
import Layout from 'components/common/Layout/Layout';
import SkinAnalyzer from './SkinAnalyzer';

const SkinAnalyzerPage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <Breadcrumb current="Skin Analyzer" />
                <SkinAnalyzer />
            </Container>
        </Layout>
    );
};

export default SkinAnalyzerPage;
