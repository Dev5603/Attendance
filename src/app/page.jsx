'use client'

import React from "react";
import Link from "next/link";

import styles from './home.module.css'

export default function Home() {
    return (
      <>
        <div className={styles.home}>
          <Link className={styles.staff} href='/staff/login'>Staff</Link>
          <Link className={styles.admin} href='/admin/login'>Admin</ Link>
        </div>
      </>
    )
}
