import React, {createContext, useContext, useState} from "react";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState({});
    const [loginPending, setLoginPending] = useState(false);

    return(
        <LoginContext.Provider
        value={{
            isLoggedIn,
            setIsLoggedIn,
            Profile,
            setProfile,
            loginPending,
            setLoginPending,
        }}>

            {children}
        </LoginContext.Provider>

    );


};

export const useLogin = () => useContext(LoginContext);
export default LoginProvider;