import { createBrowserRouter } from 'react-router-dom';

import {MainLayout,MinimalLayout} from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/guards/ProtectedRoute';

import Home from '@/pages/Home';
import Login from '@/pages/Auth/Login';
import Shop from '@/pages/Products/Shop';
import ProductDetails from '@/pages/Products/ProductDetails';
import Cart from '@/pages/User/Cart';
import CheckoutPage from '@/pages/User/Checkout';
import MyOrders from '@/pages/User/MyOrders';
import OrderDetailsPage from '@/pages/User/OrderDetailsPage';
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess';
import AdminRoute from './components/guards/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import ProductsPage from '@/pages/Admin/ProductsPage';
import EditProductPage from '@/pages/Admin/EditProductPage';
import CreateProductPage from '@/pages/Admin/CreateProductPage';
import OrdersPage from './pages/Admin/OrdersPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import Register from './pages/Auth/Register';
import AdminDashboardPage from '@/pages/Admin/AdminDashboardPage';
import ProfilePage from './pages/User/ProfilePage';
import CategoriesPage from './pages/Admin/CategoriesPage';
import EditCategoryPage from './pages/Admin/EditCategoryPage';
import CreateCategoryPage from './pages/Admin/CreateCategoryPage';
import ShopCategoriesPage from './pages/Products/ShopCategoriesPage';

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/shop', element: <Shop /> },
            { path: '/product/:id', element: <ProductDetails /> },
            { path: '/shop/categories', element: <ShopCategoriesPage /> },
        ]
    },
    {
        element: <MinimalLayout />,
        children: [
            { path: '/cart', element: <Cart /> },
            
            {
                element: <ProtectedRoute />,
                children: [
                    { path: '/checkout', element: <CheckoutPage /> },
                    { path: '/my-orders', element: <MyOrders /> },
                    { path: '/orders/:id', element: <OrderDetailsPage /> },
                    { path: '/success', element: <CheckoutSuccess /> },
                    { path: '/profile', element: <ProfilePage /> },
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
                {
                    path: '/admin/categories',
                    element: <CategoriesPage />
                },
                {
                    path: '/admin/categories/edit/:id',
                    element: <EditCategoryPage />
                },
                {
                    path: '/admin/categories/add',
                    element: <CreateCategoryPage />
                },
                
                ]
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
]);