'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

import toast, { Toaster } from "react-hot-toast";
import styles from './login.module.css'

const Login = () => {
  const router = useRouter()

  const [ loginForm, setLoginForm ] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setLoginForm({
        ...loginForm,
        [ name ]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        const response = await axios.post(`/api/auth/login`, {
            email: loginForm.email,
            password: loginForm.password,
            role: 'Admin'
        })

        if (response.status === 200) {            
          localStorage.setItem('authToken', response.data.authToken)

          router.push('/admin/dashboard')
        }
    } catch (error) {
        toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
        <div><Toaster /></div>
        <Link className={styles.login_register} href='/admin/register'>Create Account</Link>

        <div className={styles.login}>

          <div>
            <h1>Log In</h1>
            <p>Enter your email below to login to your account</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id='email' placeholder='name@example.com' onChange={handleChange} required autoComplete='off' />
              
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id='password' onChange={handleChange} required autoComplete='off' />

              <button type='submit' disabled={loading}>
                {loading ? 'Logging In': 'Log In'}
              </button>
            </form>
            </div>
        </div>
    </>
  )
}

export default Login
