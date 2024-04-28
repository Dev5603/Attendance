'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@/app/(store)/authContext'
import axios from 'axios'
import { calculateDistance, parseTimeString, getCurrentTime } from '@/app/utils'

import { FaDoorOpen } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import toast, { Toaster } from 'react-hot-toast'
import styles from './dashboard.module.css'

const Dashboard = () => {
  const currentTime = getCurrentTime()
  const radiusOfEarth = 6731 // In kilometers(kms)

  const { userData } = useUser()

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null
  })
  const [registeredLocation, setRegisteredLocation] = useState({
    latitude: null,
    longitude: null
  })
  const [distance, setDistance] = useState(0)
  const [inButtonVisible, setInButtonVisible] = useState(true);
  const [outButtonVisible, setOutButtonVisible] = useState(false);
  const [buttonStatus, setButtonStatus] = useState('disabled')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          
          setLocation({
            latitude: latitude,
            longitude: longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Unable to access location')
        }
      );
  
      // Clean up the watchPosition when the component unmounts
      return () => {
        navigator.geolocation.clearWatch(watchId)
      }
    } else {
      toast.error('Location permissions are required')
    }
  }, [])

  useEffect(() => {
    const fetchEmployer = async () => {
      if (!userData?.employerID) {
        return
      }

      try {
        const response = await axios.post(`/api/staff/employer`, {
          employerID: userData.employerID
        })

        if (response.status === 200) {
          const adminLocation = response.data.admin.location

          setRegisteredLocation({
            latitude: adminLocation[0].latitude,
            longitude: adminLocation[0].longitude
          })
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
    
    fetchEmployer()
  }, [userData])

  useEffect(() => {
    if (location.latitude && location.longitude && registeredLocation.latitude && registeredLocation.longitude) {
        const staffDistancefromAdmin = calculateDistance(
            registeredLocation.latitude,
            registeredLocation.longitude,
            location.latitude,
            location.longitude,
            radiusOfEarth
        )

        setDistance(staffDistancefromAdmin)

        if (staffDistancefromAdmin <= 50) {
            setButtonStatus('enabled');
        } else {
            setButtonStatus('disabled');
        }
    }
  }, [location, registeredLocation])

  const handleCheckIn = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`/api/attendance/markin`, {
        staffID: userData.email,
        attendance: [{
          date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
          inTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        }]
      })

      if (response.status === 200) {
        setInButtonVisible(false)
        setOutButtonVisible(true)

        toast.success('Checked in successfully')
      }
    } catch (error) {
      toast.error('Failed to check in');
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`/api/attendance/markout`, {
        staffID: userData.email,
        attendance: [{
          date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
          outTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        }]
      })

      if (response.status === 200) {
        setInButtonVisible(true)
        setOutButtonVisible(false)

        toast.success('Checked out successfully')
      }
    } catch (error) {
      toast.error('Failed to check out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
        <div><Toaster /></div>
        <div className={styles.dashboard}>
          {distance > 100 && (
            <div className={styles.next}>
              <h2>You are too far from Shark Fitness</h2>
            </div>
          )}
          <button onClick={handleCheckIn} disabled={buttonStatus !== 'enabled' || !inButtonVisible}>
            <i><FaDoorOpen /></i>
            {loading ? 'Checking In': 'Check In'}
            <span>{currentTime}</span>
          </button>
          <button onClick={handleCheckOut} disabled={!outButtonVisible}>
            <i><CiLogout /></i>
            {loading ? 'Checking Out': 'Check Out'}
            <span>{currentTime}</span>
          </button>
        </div>
    </>
  )
}

export default Dashboard
