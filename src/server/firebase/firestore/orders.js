import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ordersCollectionRef = collection(db, 'orders');
const usersCollectionRef = collection(db, 'users');
const productsCollectionRef = collection(db, 'products');

// Get all orders
export const getOrders = async () => {
    try {
        const ordersSnapshot = await getDocs(ordersCollectionRef);
        const allOrders = [];

        ordersSnapshot.forEach((doc) => {
            allOrders.push({ ...doc.data(), id: doc.id });
        });

        return allOrders;
    } catch (err) {
        throw err;
    }
};

// Create a new order
export const createOrder = async (userId, fullName, email, phone, items, totalPrice, address) => {
    try {
        const orderRef = await addDoc(ordersCollectionRef, {
            userId: userId, // Update to userId instead of user_id
            fullName: fullName,
            email: email,
            phone: phone,
            items: items,
            totalPrice: totalPrice,
            address: address,
            orderDate: new Date(),
            status: 'Chờ xác nhận',
            paymentStatus: 'Chưa thanh toán',
        });

        // Update stock count and sold count for each item in the order
        for (const item of items) {
            const productRef = doc(productsCollectionRef, item.productId);

            // Get the current stock count and sold count
            const productDoc = await getDoc(productRef);
            const currentStockCount = productDoc.data().stockCount;
            const currentSoldCount = productDoc.data().soldCount || 0;

            // Check if there is enough stock
            if (currentStockCount - item.quantity < 0) {
                throw new Error(`Insufficient stock for ${item.productName}`);
            }

            // Update the stock count and sold count
            await updateDoc(productRef, {
                stockCount: currentStockCount - item.quantity,
                soldCount: currentSoldCount + item.quantity, // Increment the sold count
            });
        }

        // Add the order ID to the user's document
        const userDocRef = doc(usersCollectionRef, userId);
        await updateDoc(userDocRef, {
            orders: arrayUnion(orderRef.id),
        });

        return orderRef.id;
    } catch (err) {
        throw err;
    }
};

// Get details of a specific order
export const getOrder = async (orderId) => {
    try {
        const data = await getDoc(doc(db, 'orders', orderId));
        return { ...data.data(), id: data.id };
    } catch (err) {
        throw err;
    }
};

// Update the status of an order
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const orderDocRef = doc(ordersCollectionRef, orderId);
        await updateDoc(orderDocRef, { status: newStatus });
    } catch (err) {
        throw err;
    }
};

// Update the status of an order
export const updatePaymentStatus = async (orderId, newStatus) => {
    try {
        const orderDocRef = doc(ordersCollectionRef, orderId);
        await updateDoc(orderDocRef, { paymentStatus: newStatus });
    } catch (err) {
        throw err;
    }
};

// Delete an order
export const deleteOrder = async (orderId) => {
    try {
        await deleteDoc(doc(ordersCollectionRef, orderId));
    } catch (err) {
        throw err;
    }
};

// Update the details of an order
export const updateOrder = async (orderId, updatedData) => {
    try {
        const orderDocRef = doc(ordersCollectionRef, orderId);
        await updateDoc(orderDocRef, updatedData);
    } catch (err) {
        throw err;
    }
};
