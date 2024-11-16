'use client'
import React, { useContext } from 'react'
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { navigate } from '@/app/lib/redirect'
import { logSession } from '@/app/lib/actions/session'
import { updateLastActivity, updateLastLogin } from '@/app/lib/actions/user'
import { spinner } from '@/app/lib/icons'
import { useAppContext } from '@/app/components/context/provider'

const Login = () => {

	const { appNotification, setAppNotification } = useAppContext()
    const router = useRouter();

	const initialForm = {
		email: '',
		password: ''
	}

	const [form, setForm] = useState(initialForm)
	const [errorMsg, setErrorMsg] = useState("")
    const [session, setSession] = useState(null)
	const [buttonText, setButtonText] = useState("Log In")

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value
		})
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		setErrorMsg("")
		setButtonText(spinner)
		setAppNotification("")
		
		try {
			await updateLastActivity(`${form?.email}`)
			await updateLastLogin(`${form?.email}`)
			const res = await signIn ("credentials", {
				email: form.email,
				password: form.password,
				redirect: false,
			})
			if (res.error === null) {
				navigate('/pages/home');
			} 
			setButtonText("Log In")
			router.refresh();
		} catch (error) {
			if (error.status === 500) setErrorMsg('Email or password are incorrect');
			if (error.status === 400) setErrorMsg(error?.response?.data?.error);
			setButtonText("Log In")
		}
	}

    useEffect(() => {
        const checkSession = async () => {
          try {
            const userSession = await logSession();
            setSession(userSession); 
    
            if (userSession) {
              router.push('/pages/home');
            }
          } catch (error) {
            console.error("Error fetching session", error);
          }
        };
        checkSession();
      }, [router]);

  return (
    <div>
        <div className="App">
			<Link href={'/'} className="main-title">The App</Link>
			<div className="w-full md:w-[40%] h-[400px] rounded-lg shadow-xl bg-white">
				<form className="form" onSubmit={handleLogin}>
					<h1 className="text-[30px] border-b-[1px] w-full text-center mb-3">Login</h1>
					<label>Email:</label>
					<input required name="email" value={form.email} className="input" onChange={handleChange}/>
					<label>Password:</label>
					<input required type="password" name="password" value={form.password} className="input" onChange={handleChange}/>
					<button type="submit" className="blue-button flex items-center justify-center text-white">{buttonText}</button>
					<p className="mx-auto">or</p>
					<Link href={"/pages/signup"} className="underline underline-offset-4 mx-auto"> Create an account </Link>
					<p className="text-red-500 font-bold">{ appNotification !== '' ? appNotification : errorMsg}</p>
				</form>
			</div>
		</div>
    </div>
  )
}

export default Login