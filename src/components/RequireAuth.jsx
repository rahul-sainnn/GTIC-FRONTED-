import { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import axios from '../api/axios';
import Header from "./Header/Header";

const RequireAuth = () => {
  const location = useLocation();
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        //Verify the token on the server
        const response = await axios.post('/auth/verify', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { valid } = response.data;

        if (response.status === 200 && valid) {
          // Token is valid, allow access to protected routes
          setIsValidToken(true);
        } else {
          localStorage.removeItem('token');
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsValidToken(false);
      }
    };

    // Call the verification function
    verifyToken();
  }, []);

  // Render based on the token verification result
  if (isValidToken === true) {
    return (
      <>
        <Header />
        <Outlet />
      </>
    )
  } else if (isValidToken === false) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    // In progress, render nothing or a loading spinner
    return null;
  }
};

export default RequireAuth;
