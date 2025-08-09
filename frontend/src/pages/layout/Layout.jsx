import './layout.css'
import {Outlet} from 'react-router-dom'
import ResponsiveAppBar from '../../components/ResponsiveAppBar';
const Layout =  () => {
  return (
    <>
     
      <ResponsiveAppBar />
      <main>
        <Outlet />
      </main>
      
    </>
  );
}

export default Layout