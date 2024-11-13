'use client'
import React, { useState } from 'react'

const Signup = () => {

  const initialForm = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  }

  const [form, setForm] = useState(initialForm)

  const handleChange = (e) => {
    const { name, value} = e.target;
    setForm({
      ...form,
      [name]:value
    })
  }

  return (
    <div className='App'>
      <form className='form w-[40%] auto rounded-lg shadow-xl bg-white'>
        <label>Email</label>
        <input name='email' value={form.email} className='input' onChange={handleChange}/>
        <label>Name</label>
        <input name='name' value={form.name} className='input' onChange={handleChange}/>
        <label>Password</label>
        <input name='password' value={form.password} type='password' className='input' onChange={handleChange}/>
        <label>Confirm Password</label>
        <input name='confirmPassword' value={form.confirmPassword} type='password' className='input' onChange={handleChange}/>
        <button className='blue-button' disabled={form.password === form.confirmPassword && form.password != '' ? false : true}>Sign Up</button>
        <p className='text-red-500'>{form.password !== form.confirmPassword  ? 'Passwords do not match' : ''}</p>
      </form>
    </div>
  )
}

export default Signup