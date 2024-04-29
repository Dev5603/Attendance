'use client'

import React, { useRef } from 'react'
import { useUser } from '@/app/(store)/authContext';
import Image from 'next/image';
import Link from 'next/link';

import { MdOutlineSpaceDashboard, MdArrowDropDown } from "react-icons/md";
import { AiOutlineUser, AiOutlineLogout, AiOutlineUserAdd } from "react-icons/ai";
import { HiOutlineDocumentReport } from "react-icons/hi";
import styles from './Sidebar.module.css'

const Sidebar = () => {
  const { userData, logOut } = useUser()

  const navBtn = useRef(false)
  const sideBar = useRef(false)
  
  const handleClick = () => {
    const visible = sideBar.current.getAttribute('data-visible')

    if (visible === 'true') {
      navBtn.current.setAttribute('aria-expanded', 'false')
      sideBar.current.setAttribute('data-visible', 'false')
    } else {
      navBtn.current.setAttribute('aria-expanded', 'true')
      sideBar.current.setAttribute('data-visible', 'true')
    }
  }

  return (
    <>
      <button className={styles.sidebar_btn} aria-controls='sidebar' ref={navBtn} aria-expanded={navBtn.current} onClick={handleClick}>
          <span className='sr-only'>
            Menu
          </span>
      </button>

      <div className={styles.sidebar} id='sidebar' ref={sideBar} data-visible={sideBar.current}>
        <header>
            <Image className={styles.logo} src='/logo.png' width={130} height={130} alt='Logo' priority />
        </header>

        <ul>
          {
            userData?.role && (

              <li>
                <Link className={styles.active} href={`/${userData.role.toLowerCase()}/dashboard`}><i><MdOutlineSpaceDashboard /></i>Dashboard</Link>
              </li>
            )
          }
          {
            userData?.role && userData.role === 'Admin' ? (
              <>
                <li className={styles.dropdown}>
                  <a><i><AiOutlineUser /></i>Staff<i><MdArrowDropDown /></i></a>
                  <ul className={styles.dropdown_menu}>
                    <li>
                      <Link href="/admin/addstaff"><i><AiOutlineUserAdd /></i>Add Staff</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link href="/admin/report"><i><HiOutlineDocumentReport /></i>Report</Link>
                </li>
              </>
            ) : (
              <></>
            )
          }
          <li>
            <button onClick={() => {logOut()}}><i><AiOutlineLogout /></i>Logout</button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Sidebar