import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // بنجيب حالة تسجيل الدخول من الريدكس
    const { isAuthenticated } = useSelector((state) => state.auth);

    // 👇 التعديل هنا: ضفنا علامة التعجب (!) للنفي
    // معناها: لو "مش" مسجل دخول، حوله لصفحة اللوجين
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // 👇 وصلحنا o خليناها to
    }

    // لو مسجل دخول، اعرض الصفحة المطلوبة
    return <Outlet />;
};

export default ProtectedRoute;