import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from 'server/firebase/firebaseConfig';
import { useAuth } from './authContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            if (user) {
                const cartDocRef = doc(db, 'carts', user.uid);
                const cartDocSnap = await getDoc(cartDocRef);

                if (cartDocSnap.exists()) {
                    setCart(cartDocSnap.data().cartItems || []);
                }

                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity, name, price, imageUrls) => {
        try {
            const cartDocRef = doc(db, 'carts', user.uid);
            const cartDocSnap = await getDoc(cartDocRef);

            if (cartDocSnap.exists()) {
                const existingCartItem = cartDocSnap.data().cartItems.find((item) => item.productId === productId);

                if (existingCartItem) {
                    // Product already exists in the cart, update the quantity
                    const updatedQuantity = existingCartItem.quantity + quantity;

                    await updateDoc(cartDocRef, {
                        cartItems: cartDocSnap
                            .data()
                            .cartItems.map((item) =>
                                item.productId === productId ? { ...item, quantity: updatedQuantity } : item,
                            ),
                    });

                    setCart((prevCart) =>
                        prevCart.map((item) =>
                            item.productId === productId ? { ...item, quantity: updatedQuantity } : item,
                        ),
                    );
                } else {
                    // Product doesn't exist in the cart, add a new item
                    await updateDoc(cartDocRef, {
                        cartItems: arrayUnion({
                            productId,
                            quantity,
                            name,
                            price,
                            imageUrls,
                        }),
                    });

                    setCart((prevCart) => [...prevCart, { productId, quantity, name, price, imageUrls }]);
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const cartDocRef = doc(db, 'carts', user.uid);

            await updateDoc(cartDocRef, {
                cartItems: arrayRemove(...cart.filter((item) => item.productId === productId)),
            });

            setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
        } catch (error) {
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            const cartDocRef = doc(db, 'carts', user.uid);

            await setDoc(cartDocRef, { userId: user.uid, cartItems: [] });

            setCart([]);
        } catch (error) {
            throw error;
        }
    };

    const updateCartItemQuantity = async (updatedCart) => {
        try {
            const cartDocRef = doc(db, 'carts', user.uid);

            await updateDoc(cartDocRef, {
                cartItems: updatedCart,
            });

            setCart(updatedCart);
        } catch (error) {
            throw error;
        }
    };

    const value = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};
