import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

import { db } from '../firebaseConfig';

const categoriesCollectionRef = collection(db, 'categories');

export const getCategories = async () => {
    try {
        const data = await getDocs(categoriesCollectionRef);

        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (err) {
        throw err;
    }
};

export const addCategory = async ({ name }) => {
    try {
        const docRef = await addDoc(categoriesCollectionRef, {
            name: name,
            types: [],
        });

        return { id: docRef.id, name: name, types: [] };
    } catch (err) {
        throw err;
    }
};

export const getCategory = async (id) => {
    try {
        const data = await getDoc(doc(db, 'categories', id));
        return { ...data.data(), id: data.id };
    } catch (err) {
        throw err;
    }
};

export const updateCategory = async (category) => {
    try {
        const { id, name, types } = category;

        const categoryDoc = doc(db, 'categories', id);

        const newFields = {
            name: name,
            types: types || [],
        };

        await updateDoc(categoryDoc, newFields);
    } catch (err) {
        throw err;
    }
};

export const deleteCategory = async (id) => {
    try {
        await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
        throw err;
    }
};
