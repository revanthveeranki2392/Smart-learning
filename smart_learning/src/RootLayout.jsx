import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Footer from "./components/footer/Footer";
import HomeNav from "./components/homenav/HomeNav";
import HomeScreen from "./components/homenav/HomeNav";
import { Outlet } from "react-router-dom";
import { useAuth } from './AuthContext';
import './RootLayout.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function RootLayout() {
  const { isAuthenticated, user } = useAuth(); // Get authentication and user info
  
  return (
    <div className={`root-layout ${isAuthenticated ? 'with-sidebar' : ''}`}>
      {/* If the user is authenticated */}
      {isAuthenticated ? (
        <div>
          {/* Render Header if the user is authenticated and not admin */}
          {user?.role !== 'admin' && <Header />}
          
          <div className="d-flex">
            {/* Render Sidebar */}
            <Sidebar />
            
            {/* Main content area */}
            <div className={`main-content container-fluid ${isAuthenticated ? 'with-sidebar' : ''}`}>
              <Outlet />
            </div>
          </div>

          {/* Footer (for authenticated users) */}
          <footer className="text-center p-3">
            <p>© {new Date().getFullYear()} Skill Forge. All Rights Reserved.</p>
          </footer>
        </div>
      ) : (
        <div>
          {/* If the user is not authenticated */}
          <HomeNav />
          <Outlet />
          {/* Main content area for non-authenticated users */}
          <HomeScreen />

          {/* Render full Footer */}
          <Footer />
        </div>
      )}
    </div>
  );
}

export default RootLayout;
