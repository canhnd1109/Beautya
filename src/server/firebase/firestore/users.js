import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

import { db } from '../firebaseConfig';

const usersCollectionRef = collection(db, 'users');

export const getUsers = async () => {
    try {
        const data = await getDocs(usersCollectionRef);
        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (err) {
        throw err;
    }
};

export const addUser = async ({ avatarUrl, date, email }) => {
    try {
        await addDoc(usersCollectionRef, {
            avatarUrl: avatarUrl || '', // Default to an empty string if not provided
            date: date || new Date(), // Default to the current date if not provided
            email: email || '',
            isAdmin: false, // Default to false if not provided
            orders: [],
        });
    } catch (err) {
        throw err;
    }
};

export const getUser = async (id) => {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }

        const userDoc = doc(db, 'users', id);
        const data = await getDoc(userDoc);

        if (data.exists()) {
            return { ...data.data(), id: data.id };
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        throw err;
    }
};

export const updateUser = async (user) => {
    try {
        const { id, avatar, date, displayName, email } = user;

        const userDoc = doc(db, 'users', id);

        const newFields = {
            avatar: avatar || '', // Default to an empty string if not provided
            date: date || new Date(), // Default to the current date if not provided
            displayName: displayName || '',
            email: email || '',
        };

        await updateDoc(userDoc, newFields);
    } catch (err) {
        throw err;
    }
};

export const deleteUser = async (id) => {
    try {
        await deleteDoc(doc(db, 'users', id));
    } catch (err) {
        throw err;
    }
};

// Get all orders for a user
export const getOrdersOfUser = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (userDoc.exists()) {
            const orderIds = userDoc.data().orders || [];
            const orders = [];

            for (const orderId of orderIds) {
                const orderDoc = await getDoc(doc(db, 'orders', orderId));
                if (orderDoc.exists()) {
                    orders.push({ ...orderDoc.data(), id: orderDoc.id });
                }
            }
            return orders;
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        throw err;
    }
};

// Add a new function to specifically update the avatar
export const updateUserAvatar = async (userId, newAvatarUrl) => {
    try {
        const userDoc = doc(db, 'users', userId);

        const newFields = {
            avatarUrl: newAvatarUrl || '', // Default to an empty string if not provided
        };

        await updateDoc(userDoc, newFields);
    } catch (err) {
        throw err;
    }
};
