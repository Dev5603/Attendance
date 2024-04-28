'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import toast, { Toaster } from 'react-hot-toast'
import styles from './login.module.css'

const Login = () => {
  const router = useRouter()

  const [ loginForm, setLoginForm ] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setLoginForm({
        ...loginForm,
        [ name ]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const response = await axios.post(`/api/auth/login`, {
            email: loginForm.email,
            password: loginForm.password,
            role: 'Staff'
        })

        if (response.status === 200) {            
          localStorage.setItem('authToken', response.data.authToken)

          router.push('/staff/dashboard')
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
  }

  return (
    <>
        <div><Toaster /></div>
        <div className={styles.login}>
          <div>
            <h1>Log In</h1>
            <p>Enter your email and the password provided by Shark Fitness below to login to your account</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id='email' placeholder='name@example.com' onChange={handleChange} required autoComplete='off' />
              
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id='password' onChange={handleChange} required autoComplete='off' />

              <button type='submit'>Login</button>
            </form>
            </div>
        </div>
    </>
  )
}

export default Login
