import { createBrowserRouter } from 'react-router-dom';

// Layouts
import {MainLayout,MinimalLayout} from '@/components/layout/Layouts'
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Shop from '@/pages/Shop';
import ProductDetails from '@/pages/ProductDetails';
import Cart from '@/pages/Cart';
import CheckoutPage from '@/pages/Checkout';
import MyOrders from '@/pages/MyOrders';
import OrderDetailsPage from '@/pages/OrderDetailsPage';
import CheckoutSuccess from '@/components/layout/CheckoutSuccess';
import AdminRoute from './components/layout/AdminRoute';
import Dashboard from '@/pages/AdminDashboardPage';
import AdminLayout from './components/layout/AdminLayout';
import ProductsPage from '@/pages/ProductsPage';
import EditProductPage from '@/pages/EditProductPage';
import CreateProductPage from '@/pages/CreateProductPage';
import OrdersPage from './pages/OrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import Register from './pages/Register';
import AdminDashboardPage from '@/pages/AdminDashboardPage';

export const router = createBrowserRouter([
    {
        // 1. الراوتس الرئيسية (ناف بار + فوتر)
        element: <MainLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/shop', element: <Shop /> },
            { path: '/product/:id', element: <ProductDetails /> },
        ]
    },
    {
        // 2. راوتس بسيطة (ناف بار فقط)
        element: <MinimalLayout />,
        children: [
            { path: '/cart', element: <Cart /> },
            
            // 3. الراوتس المحمية (جواها ProtectedRoute)
            {
                element: <ProtectedRoute />, // أي حاجة في الـ children هنا هتبقى محمية
                children: [
                    { path: '/checkout', element: <CheckoutPage /> },
                    { path: '/my-orders', element: <MyOrders /> },
                    { path: '/orders/:id', element: <OrderDetailsPage /> },
                    { path: '/success', element: <CheckoutSuccess /> },
                ]
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminRoute />,       
        children:[
            {
                element: <AdminLayout />,
                children:[
                    {
                    index: true, 
                    element: <AdminDashboardPage/> 
                },
                {
                    path: 'products',
                    element: <ProductsPage />
                },
                {
                    path: '/admin/products/edit/:id',
                    element: <EditProductPage />
                },
                {
                    path: '/admin/products/add',
                    element: <CreateProductPage />
                },
                {
                    path: '/admin/orders',
                    element: <OrdersPage />
                },
                {
                    path: '/admin/users',
                    element: <AdminUsersPage />
                },
                
                ]
            }
        ]
    },
    {
        // 4. راوتس مستقلة (بدون أي Layout)
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
]);