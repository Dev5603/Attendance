'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"

import toast, { Toaster } from "react-hot-toast"
import styles from './dashboard.module.css'

const Dashboard = () => {
  const [ staffs, setStaffs ] = useState([])
  const [loading, setLoading] = useState(false)

  const handleClick = async ( staffEmail ) => {
    setLoading(true)

    try {
      const response = await axios.delete('/api/staff/delete', {
        data: {
          email: staffEmail
        }
      })

      if (response.status === 200) {
        toast.success(response.data.message)

        setStaffs(staffs.filter(staff => staff.email !== staffEmail))
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true)

      try {
        const response = await axios.get(`/api/staff/get`)
        
        if (response.status === 200) {
          setStaffs(response.data.staffs)
        }
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  return (
    <>
        <div><Toaster /></div>
        <div className={styles.dashboard}>
          {staffs.length > 0 ? (
            <div className={styles.staffs}>
              {staffs.map((staff, index) => (
                <div className={styles.staff} key={index}>
                  <h2>{staff.name}</h2>
                  <p>{staff.email}</p>
                  <div>
                    <button className={styles.delete} disabled={loading} onClick={() => handleClick(staff.email)}>
                      {loading ? 'Deleting': 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.exception}>
              <h2>No Staffs Found</h2>
              <Link href='/admin/addstaff'>Add Staff</Link>
            </div>
          )}
        </div>
    </>
  )
}

export default Dashboard
