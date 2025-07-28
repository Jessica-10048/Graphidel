import React from 'react'
import { Outlet } from 'react-router'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'



const Layout = () => {
  return (
    <>
      <Header />
      <section>
        <Outlet />
      </section>
      <Footer />
    </>
  )
}

export default Layout