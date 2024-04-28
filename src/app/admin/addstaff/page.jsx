'use client'

import React, { useState } from 'react'
import { useUser } from '@/app/(store)/authContext'
import axios from 'axios'

import styles from './addstaff.module.css'
import toast, { Toaster } from 'react-hot-toast'

const AddStaff = () => {
  const { userData } = useUser()

  const [ staffData, setStaffData ] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setStaffData({
      ...staffData,
      [ name ]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`/api/staff/add`, {
        name: staffData.name,
        email: staffData.email,
        password: staffData.password,
        employerID: userData.email
      })
      
      if (response.status === 201) {
        setStaffData({
          name: '',
          email: '',
          password: ''
        })

        toast.success(response.data.message)
      }
    } catch (error) {
        toast.error(error.response.data.message)
    }
  }

  return (
    <>
        <div><Toaster /></div>
        <div className={styles.add_staff}>
          <div>
            <h2>Add Staff</h2>
            <p>Enter your staff&apos;s details below</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input type="text" name='name' id='name' onChange={handleChange} value={staffData.name} required autoComplete='off' />

              <label htmlFor="email">Email</label>
              <input type="text" name="email" id='email' placeholder='name@example.com' onChange={handleChange} value={staffData.email} required autoComplete='off' />

              <label htmlFor="password">Password</label>
              <input type="password" name="password" id='password' onChange={handleChange} value={staffData.password} required autoComplete='off' />

              <button type='submit'>Add Staff</button>
            </form>
          </div>
        </div>
    </>
  )
}

export default AddStaff
