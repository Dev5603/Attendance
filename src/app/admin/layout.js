'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import Sidebar from '../components/Sidebar/Sidebar'

const Layout = ({ children }) => {
  const pathname = usePathname()

  const hideSidebar = (pathname === '/admin/register') || (pathname === '/admin/login')

  return (
    <>
        <div className='relative h-full'>
            {!hideSidebar &&
                <Sidebar />
            }
            <div className={hideSidebar ? '' : 'md:relative md:left-[17.5rem] md:top-0 md:w-[calc(100%-17.5rem)]'}>
                { children }
            </div>
        </div> 
    </>
  );
};

export default Layout;