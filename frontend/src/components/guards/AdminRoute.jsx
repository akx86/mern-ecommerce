import { useSelector } from 'react-redux';
import AdminLoading from '../admin/AdminLoading';
import { Outlet, Navigate } from 'react-router-dom';

const AdminRoute = () => {

const {user, isAuthenticated, isLoading} = useSelector((state) => state.auth)

if(isLoading){
    return <AdminLoading />
}
if(!isAuthenticated){
    return <Navigate to="/login" replace />
}
if(user.isAdmin === false){  
    return <Navigate to="/" replace />
}
 return <Outlet />

}
export default AdminRoute;