import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from 'server/firebase/firebaseConfig';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async (category) => {
            try {
                let productsCollectionQuery = collection(db, 'products');

                // If a category is provided, filter by category
                if (category !== undefined) {
                    productsCollectionQuery = query(
                        collection(db, 'products'),
                        where('categories', 'array-contains', category),
                    );
                }

                const data = await getDocs(productsCollectionQuery);
                const productsData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                setProducts(productsData);
                setLoading(false);
            } catch (err) {
                throw err;
            }
        };

        fetchProducts();
    }, []);

    const addProduct = async (productData) => {
        try {
            const newProductRef = await addDoc(collection(db, 'products'), {
                ...productData,
            });

            setProducts((prevProducts) => [...prevProducts, { ...productData, id: newProductRef.id }]);
        } catch (err) {
            throw err;
        }
    };

    const updateProduct = async (updatedProduct) => {
        try {
            const productDocRef = doc(db, 'products', updatedProduct.id);
            await updateDoc(productDocRef, updatedProduct);

            setProducts((prevProducts) =>
                prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
            );
        } catch (err) {
            throw err;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, 'products', productId));

            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        } catch (err) {
            throw err;
        }
    };

    const value = {
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
    };

    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
    return useContext(ProductsContext);
};
