'use client'
import { logoutUser } from '@/app/lib/actions/session'
import React from 'react'

const Home = () => {
  return (
    <div>
        <button onClick={() => logoutUser()}>Logout</button>
    </div>
  )
}

export default Home