import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth, db } from 'server/firebase/firebaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []); // No dependencies if auth is constant

    const signup = async (email, password) => {
        try {
            // Create user with email and password
            const res = await createUserWithEmailAndPassword(auth, email, password);

            // Set user data in Firestore
            await setDoc(doc(db, 'users', res.user.uid), {
                id: res.user.uid,
                email: res.user.email,
                password: '',
                avatarUrl: '', // Add your avatar logic here
                date: Date.now(),
                orders: [],
                isAdmin: false,
            });

            // create cart for this user
            await setDoc(doc(db, 'carts', res.user.uid), {
                userId: res.user.uid,
                cartItems: [],
            });

            // Update the local user state
            setUser(res.user);

            return res.user;
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            setUser(res.user);
            return res.user;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
