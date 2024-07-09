import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import AdminPage from 'routes/AdminPage/AdminPage';
import LoginPage from 'routes/AuthPage/LoginPage/LoginPage';
import LogoutPage from 'routes/AuthPage/LogoutPage/LogoutPage';
import SignupPage from 'routes/AuthPage/SignupPage/SignupPage';
import BlogPage from 'routes/BlogPage/BlogPage';
import CheckoutPage from 'routes/CheckoutPage/CheckoutPage';
import HomePage from 'routes/HomePage/HomePage';
import MakeupPage from 'routes/MakeupPage/MakeupPage';
import NotFoundPage from 'routes/NotFound/NotFoundPage';
import OurBrandPage from 'routes/OurBrandPage/OurBrandPage';
import ProductDetailPage from 'routes/ProductDetailPage/ProductDetailPage';
import SkincarePage from 'routes/SkincarePage/SkincarePage';

import { ToastContainer } from 'react-toastify';

import Dashboard from 'components/admin/Dashboard/Dashboard';
import Orders from 'components/admin/Orders/Orders';
import Products from 'components/admin/Products/Products';
import 'react-toastify/dist/ReactToastify.css';
import CartPage from 'routes/CartPage/CartPage';
import GiftsAndSetsPage from 'routes/GiftsAndSetsPage/GiftsAndSetsPage';
import ProfilePage from 'routes/ProfilePage/ProfilePage';
import 'styles/App.css';
import OneDay from 'components/admin/Report/OneDay/OneDay';
import Week from 'components/admin/Report/Week/Week';
import Month from 'components/admin/Report/Month/Month';
import Reports from 'components/admin/Report/Reports';
import PaymentResultPage from 'routes/PaymentResultPage/PaymentResultPage';
import SkinAnalyzerPage from 'routes/SkinAnalyzerPage/SkinAnalyzerPage';

function App() {
    const location = useLocation();

    useEffect(() => {
        // Scroll to the top of the page when the route changes
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        // Clear messages when first visit
        localStorage.setItem('chatMessages', JSON.stringify([]));
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/admin" element={<AdminPage />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="reports" element={<Reports />}>
                        <Route index element={<OneDay />} />
                        <Route path="1-day" element={<OneDay />} />
                        <Route path="7-days" element={<Week />} />
                        <Route path="30-days" element={<Month />} />
                    </Route>
                </Route>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/makeup" element={<MakeupPage />} />
                <Route path="/skincare" element={<SkincarePage />} />
                <Route path="/gifts-and-sets" element={<GiftsAndSetsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-result" element={<PaymentResultPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/skin-analyzer" element={<SkinAnalyzerPage />} />
                <Route path="/our-brand" element={<OurBrandPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <ToastContainer autoClose={3000} />
        </>
    );
}

export default App;
