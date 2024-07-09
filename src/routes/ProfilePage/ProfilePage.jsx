import { Container } from '@mui/material';
import Layout from 'components/common/Layout/Layout';
import Profile from 'components/profile/Profile/Profile';

const ProfilePage = () => {
    return (
        <Layout>
            <Container maxWidth="lg">
                <Profile />
            </Container>
        </Layout>
    );
};

export default ProfilePage;
