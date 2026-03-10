import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()


export default function AuthContextProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') != null)
    const [userData, setUserData] = useState(null)


    function getUserProfile() {
        return axios.get('https://route-posts.routemisr.com/users/profile-data', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            
            setUserData(res.data.data.user)
        }
        )
    }

    useEffect(() => {


        isLoggedIn && getUserProfile()

    }, [isLoggedIn])

    return <AuthContext.Provider value={
        {
            isLoggedIn,
            setIsLoggedIn,
            userData
        }
    }>


        {children}

    </AuthContext.Provider>
}

