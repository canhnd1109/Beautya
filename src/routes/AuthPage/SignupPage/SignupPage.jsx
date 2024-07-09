import { Container } from '@mui/material';
import SignUp from 'components/auth/SignUp/SignUp';
import Layout from 'components/common/Layout/Layout';

const SignupPage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <SignUp />
            </Container>
        </Layout>
    );
};

export default SignupPage;
