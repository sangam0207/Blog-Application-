
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
const AdminPrivateRoute = () => {
    const {currentUser}=useSelector(state=>state.user);

  return (
    <>
    { currentUser && currentUser.isAdmin?<Outlet/>:<Navigate to='/sign-in'/> }
    </>
  )
}

export default AdminPrivateRoute;