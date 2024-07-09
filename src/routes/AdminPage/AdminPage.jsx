import Admin from 'components/admin/Admin';
import Loading from 'components/common/Loading/Loading';
import { useAuth } from 'contexts/authContext';
import { useEffect, useState } from 'react';
import UnauthorizedPage from 'routes/UnauthorizedPage/UnauthorizedPage';
import { getUser } from 'server/firebase/firestore/users';
import { showErrorToast } from 'utils/showToasts';

const AdminPage = () => {
    const { user } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !user.uid) {
            // Handle the case where user or user.uid is undefined

            // showErrorToast("User information not available");
            return;
        }

        (async () => {
            try {
                setLoading(true);
                setCurrentUser(await getUser(user.uid));
            } catch (e) {
                showErrorToast(e.message);
                return;
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    return (
        <>
            {loading && <Loading />}
            {currentUser?.isAdmin === true ? <Admin /> : <UnauthorizedPage />}
        </>
    );
};

export default AdminPage;
