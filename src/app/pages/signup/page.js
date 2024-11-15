'use client'
import React, { useState, useEffect } from 'react'
import { registerUser } from '@/app/lib/actions/auth'
import { navigate } from '@/app/lib/redirect'
import Link from 'next/link'
import { logSession } from '@/app/lib/actions/session'
import { spinner } from '@/app/lib/icons'

const Signup = () => {

  const initialForm = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  }

  const [form, setForm] = useState(initialForm)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [session, setSession] = useState(null)
  const [buttonText, setButtonText] = useState("Sign Up")

  const handleChange = (e) => {
    const { name, value} = e.target;
    setForm({
      ...form,
      [name]:value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("")
    setButtonText(spinner)
    registerUser(form) 
      .then(res => {
        if (res.status === 200) {
          setSuccessMsg("Account Created Successfully, Redirecting to Login...")
          setTimeout(() => {
            navigate('/pages/login')
          }, 2000)
        }
        setButtonText("Sign Up")
        if (res?.msg?.status === 500) setErrorMsg('Email already in use')
      })
      .catch(err => {
        console.log(err)
        setButtonText("Sign Up")
      })
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userSession = await logSession();
        setSession(userSession); 

        if (userSession) {
          navigate('/pages/home');
        }
      } catch (error) {
        console.error("Error fetching session", error);
      }
    };
    checkSession();
  }, []);

  return (
    <div className='App'>
      <Link href={'/'} className="main-title">The App</Link>
      <form className='form w-[95%] md:w-[40%] auto rounded-lg shadow-xl bg-white' onSubmit={handleSubmit}>
      <h1 className="text-[30px] border-b-[1px] w-full text-center mb-3">Signup</h1>
        <label>Email</label>
        <input required name='email' value={form.email} className='input' onChange={handleChange}/>
        <label>Name</label>
        <input required name='name' value={form.name} className='input' onChange={handleChange}/>
        <label>Password</label>
        <input required name='password' value={form.password} type='password' className='input' onChange={handleChange}/>
        <label>Confirm Password</label>
        <input required name='confirmPassword' value={form.confirmPassword} type='password' className='input' onChange={handleChange}/>
        <button type='submit' className='blue-button flex items-center justify-center' disabled={form.password === form.confirmPassword && form.password != '' ? false : true}>{buttonText}</button>
        <p className='text-red-500'>{form.password !== form.confirmPassword  ? 'Passwords do not match' : ''}</p>
        <p className='text-red-500 font-bold'>{errorMsg}</p>
        <p className='text-green-500 font-bold'>{successMsg}</p>
        <Link href={"/pages/login"} className="underline underline-offset-4 mx-auto"> Already have an account? Log In </Link>
      </form>
    </div>
  )
}

export default Signup