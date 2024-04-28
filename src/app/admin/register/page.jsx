'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

import toast, { Toaster } from "react-hot-toast";
import styles from './register.module.css'

const Register = () => {
  const router = useRouter()

  const [ registerForm, setRegisterForm ] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [ location, setLocation ] = useState({
    latitude: null,
    longitude: null
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setRegisterForm({
        ...registerForm,
        [ name ]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        const response = await axios.post(`/api/auth/register`, {
            name: registerForm.name,
            email: registerForm.email,
            password: registerForm.password, 
            location: [ location ]
        })

        if (response.status === 201) {            
            router.push('/admin/login')
        }
    } catch (error) {
        toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        
        setLocation({
          latitude: latitude,
          longitude: longitude
        })
      });
    } else {

      toast.error('Unable to access location')
    }
  }, [])

  return (
    <>
      <div><Toaster /></div>
      <Link className={styles.register_login} href='/admin/login'>Login</Link>

      <div className={styles.register}>

        <div>
          <h1>Create an account</h1>
          <p>Enter your email below to create your account</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Business Name</label>
            <input type="text" name="name" id="name" onChange={handleChange} required autoComplete='off' />

            <label htmlFor="email">Email</label>
            <input type="text" name="email" id='email' placeholder='name@example.com' onChange={handleChange} required autoComplete='off' />
            
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id='password' onChange={handleChange} required autoComplete='off' />

            <button type='submit' disabled={loading}>
              {loading ? 'Creating Account': 'Create Account'}
            </button>
          </form>
          </div>
      </div>
    </>
  )
}

export default Register