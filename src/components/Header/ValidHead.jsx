// import React, { useEffect, useState } from "react";
// import Header from "./Header";
// import axios from "../../api/axios";

// const ValidHead = () => {
//   const [isValidToken, setIsValidToken] = useState(null);

//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = localStorage.getItem('token');
//       console.log(token);

//       if (!token) {
//         setIsValidToken(false);
//         return;
//       }

//       try {
//         // Verify the token on the server
//         const response = await axios.post('/auth/verify', null, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const { valid } = response.data;

//         if (response.status === 200 && valid) {
//           // Token is valid, allow access to protected routes
//           setIsValidToken(true);
//         } else {
//           localStorage.removeItem('token');
//           setIsValidToken(false);
//         }
//       } catch (error) {
//         console.error('Error verifying token:', error);
//         setIsValidToken(false);
//       }
//     };

//     // Call the verification function
//     verifyToken();
//   }, []);

//   // Render based on the token verification result
//   if (isValidToken === true) {
//     return <Header />;
//   } else {
//     return null;
//   }
// };

// export default ValidHead;
