import React from 'react'
import { logout } from '../lib/icons'
import { logoutUser } from '../lib/actions/session'

const Navbar = ( { user } ) => {
  return (
    <div className='p-4 flex flex-row items-center justify-between bg-slate-300 shadow-xl fixed w-full'>
        <p>{user?.name}</p>
        <button className='small-blue-button' onClick={() => logoutUser()}>{logout}</button>
    </div>
  )
}

export default Navbar