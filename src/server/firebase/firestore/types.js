import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

import { db } from '../firebaseConfig';

const typesCollectionRef = collection(db, 'types');

export const getTypes = async () => {
    try {
        const data = await getDocs(typesCollectionRef);

        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (err) {
        throw err;
    }
};

export const addType = async ({ name, categoryId }) => {
    try {
        const docRef = await addDoc(typesCollectionRef, {
            name: name,
            categoryId: categoryId,
        });

        const type = { id: docRef.id, name: name, categoryId: categoryId };

        // Update the category to include the new type ID
        const categoryDoc = doc(db, 'categories', categoryId);
        const categoryData = (await getDoc(categoryDoc)).data();

        await updateDoc(categoryDoc, {
            types: [...categoryData.types, type.id],
        });

        return type;
    } catch (err) {
        throw err;
    }
};

export const getType = async (id) => {
    try {
        const data = await getDoc(doc(db, 'types', id));
        return { ...data.data(), id: data.id };
    } catch (err) {
        throw err;
    }
};

export const updateType = async (type) => {
    try {
        const { id, name, categoryId } = type;

        const typeDoc = doc(db, 'types', id);

        const newFields = {
            name: name,
            categoryId: categoryId,
        };

        await updateDoc(typeDoc, newFields);
    } catch (err) {
        throw err;
    }
};

export const deleteType = async (id) => {
    try {
        await deleteDoc(doc(db, 'types', id));
    } catch (err) {
        throw err;
    }
};
