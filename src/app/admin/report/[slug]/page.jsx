'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'

import toast, { Toaster } from 'react-hot-toast'
import styles from './report.module.css'

const Page = () => {
  const pathname = usePathname()
  const slug = pathname.replace('/admin/report/', '')

  const [reports, setReports] = useState([])
  const [staffDetails, setStaffDetails] = useState({})
  const [groupedData, setGroupedData] = useState({})

  useEffect(() => {
    const fetchReport = async () => {
        try {
            const response = await axios.post(`/api/attendance/staffreport`, {
                staffID: slug
            })

            if (response.status === 200) {
                setReports(response.data.report)
            }
        } catch (error) {
            return
        }
    }

    fetchReport()
  }, [slug])

  useEffect(() => {
    const fetchStaffDetails = async (staffID) => {
        try {
            const response = await axios.post(`/api/staff/getstaff`, {
                staffID: staffID
            })

            if (response.status === 200) {
                setStaffDetails((prevDetails) => ({
                    ...prevDetails,
                    [ staffID ]: response.data.staff.name
                  }))
            }
        } catch (error) {
            return
        }
    }

    reports.forEach((entry) => {
      if (!staffDetails[entry.staffID]) {
        fetchStaffDetails(entry.staffID)
      }
    })
  }, [reports, staffDetails])

  useEffect(() => {
    const groupData = () => {
      const grouped = {}
      reports.forEach((entry) => {
        const date = new Date(entry.attendance[0].date)
        const monthYear = `${date.toLocaleString('en-US', { month: 'long' })}, ${date.getFullYear()}`
        if (!grouped[monthYear]) {
          grouped[monthYear] = []
        }
        grouped[monthYear].push(entry)
      })

      const reversedGrouped = Object.fromEntries(Object.entries(grouped).reverse())
      setGroupedData(reversedGrouped)
    }

    groupData()
  }, [reports])

  const splitTimeAndCheck = (timeStr) => {
    const [hourStr, minuteStr, amPm] = timeStr.split(/:| /)
    const hours = parseInt(hourStr)
    const minutes = parseInt(minuteStr)

    return minutes > 10
  }

  return (
    <>
        <div><Toaster /></div>
        <div className={styles.table_container}>
            <h2>{staffDetails[slug]}&apos;s Report</h2>
            {Object.entries(groupedData).map(([monthYear, data]) => (
            <div key={monthYear}>
                <h3>{monthYear}</h3>
                <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Staff Name</th>
                        <th>In Time</th>
                        <th>Out Time</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((entry) => (
                  entry.attendance.map((attendanceEntry, index) => (
                    <tr key={`${entry._id}_${index}`}>
                      <td>{attendanceEntry.date}</td>
                      <td>{staffDetails[entry.staffID]}</td>
                      <td className={splitTimeAndCheck(entry?.attendance[0]?.inTime) ? styles.late : ''}>{attendanceEntry.inTime}</td>
                      <td>{attendanceEntry.outTime}</td>
                    </tr>
                  ))
                ))}
              </tbody>
                </table>
            </div>
            ))}
        </div>
    </>
  )
}

export default Page