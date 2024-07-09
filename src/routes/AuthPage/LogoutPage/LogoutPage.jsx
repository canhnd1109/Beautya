import { Container } from '@mui/material';
import Logout from 'components/auth/Logout/Logout';
import Layout from 'components/common/Layout/Layout';

const LogoutPage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <Logout />
            </Container>
        </Layout>
    );
};

export default LogoutPage;
