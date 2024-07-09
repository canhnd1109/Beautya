import { Container } from '@mui/material';
import Login from 'components/auth/Login/LogIn';
import Layout from 'components/common/Layout/Layout';

const LoginPage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <Login />
            </Container>
        </Layout>
    );
};

export default LoginPage;
