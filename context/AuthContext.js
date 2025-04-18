// import React, { createContext, useState, useEffect } from "react";
 
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const AuthContext = createContext();
// // const navigate = useNavigate();
// export const AuthProvider = ({ children }) => {
//   const [verified, setVerified] = useState(null);
//   const [userProfile, setUserProfile] = useState("");
 
  

   
//   const loggedIn = () => {
//     const savedToken = AsyncStorage.getItem("status");
   

//     if (savedToken) {
//       setVerified(savedToken);
//     }
//   };

//   useEffect(() => {
//     loggedIn();
//   }, []);

//   const login = async (Status, id, profile) => {
//     try {
//       if (Status) {
//         setVerified(Status)
        
//         AsyncStorage.setItem("status",JSON.stringify(Status));
//         AsyncStorage.setItem("profile", JSON.stringify(profile));
//         AsyncStorage.setItem("adminID",JSON.stringify(id));
//       }
//     } catch (error) {
//       alert(message, "failed to login");
//       console.log(error);
//     }
//   };

//   const register = async (Status, id, profile) => {
//     if (Status) {
//    setVerified(Status)
//     }
    
//     AsyncStorage.setItem("status", JSON.stringify(Status));
//     AsyncStorage.setItem("profile", JSON.stringify(profile));
//     AsyncStorage.setItem("adminID", JSON.stringify(id));
//   };

//   const logout = () => {
// setVerified(null)
//     setAdminProfile("");
//     AsyncStorage.clear();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         login,
//         register,
//         logout,
         
//  verified
        
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };