'use client'

import React, { useState, useEffect, useCallback, useContext, createContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const router = useRouter()
    const pathname = usePathname()

    const [userData, setUserData] = useState({})

    // // Function to decode admin data
    // const decodeUser = async ( token ) => {
    //     try {
    //         const response = await axios.post(`/api/auth/verify`, {
    //             token: `Bearer ${token}`
    //         })

    //         if (response.status === 200) {
    //             return response.data.user
    //         }
    //     } catch (error) {
    //         router.push('/')
    //     }
    // }

    const decodeUser = useCallback(async (token) => {
        try {
            const response = await axios.post(`/api/auth/verify`, {
                token: `Bearer ${token}`
            })

            if (response.status === 200) {
                return response.data.user
            }
        } catch (error) {
            router.push('/')
        }
    }, [router])

    // Running useEffect to fetch user data and store it in state
    // useEffect(() => {
    //     const authToken = localStorage.getItem('authToken')

    //     const fetchUserData = async () => {
    //     try {
    //         const user = await decodeUser(authToken)
    //         setUserData(user)
    //     } catch (error) {
    //         router.push('/')
    //     }
    //     }

    //     if (authToken) {
    //         fetchUserData()
    //     }
    // }, [pathname])

    useEffect(() => {
        const authToken = localStorage.getItem('authToken')

        const fetchUserData = async () => {
        try {
            const user = await decodeUser(authToken)
            setUserData(user)
        } catch (error) {
            router.push('/')
        }
        }

        if (authToken) {
            fetchUserData()
        }
    }, [pathname, router, decodeUser])


    const logOut = () => {
        localStorage.removeItem('authToken')
    
        router.push(`/${userData.role.toLowerCase()}/login`)
      }

    return (
        <UserContext.Provider value={{ userData, decodeUser, logOut }}>
            { children }
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)