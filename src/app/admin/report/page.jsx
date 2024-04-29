'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';
import styles from './report.module.css';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [staffDetails, setStaffDetails] = useState({});
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/api/attendance/report`);
        if (response.status === 200) {
          setReports(response.data.reports);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchReport();
  }, []);

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
  }, [reports])

  useEffect(() => {
    const groupData = () => {
      const grouped = {};
      reports.forEach((entry) => {
        const date = new Date(entry.attendance[0].date);
        const monthYear = `${date.toLocaleString('en-US', { month: 'long' })}, ${date.getFullYear()}`;
        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(entry);
      });
      
      const reversedGrouped = Object.fromEntries(Object.entries(grouped).reverse())
      setGroupedData(reversedGrouped)
    };

    groupData();
  }, [reports]);

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
        {groupedData.length <= 0 && (
          <div>
            No report found
          </div>
        )}
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
                      <td><Link href={`/admin/report/${entry.staffID}`}>{staffDetails[entry.staffID] || "Unknown"}</Link></td>
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
  );
};

export default Report;
