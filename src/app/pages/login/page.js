'use client'
import React from 'react'
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { navigate } from '@/app/lib/redirect'
import { logSession } from '@/app/lib/actions/session'

const Login = () => {

    const router = useRouter();

	const initialForm = {
		email: '',
		password: ''
	}

	const [form, setForm] = useState(initialForm)
	const [errorMsg, setErrorMsg] = useState("")
    const [session, setSession] = useState(null)

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

		try {
			await signIn("credentials", {
				email: form.email,
				password: form.password,
				redirect: false,
			})
			.then(res => {
                console.log(res)
                if (res.error === null){
                    navigate('/pages/home')
                }
                if (res.error) setErrorMsg('Email or password are incorrect')
            })
			.catch(err => console.log(err))
			router.refresh();
		} catch (error) {
			console.log(error)
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
					<label>Email:</label>
					<input required name="email" value={form.email} className="input" onChange={handleChange}/>
					<label>Password:</label>
					<input required type="password" name="password" value={form.password} className="input" onChange={handleChange}/>
					<button type="submit" className="blue-button">Log In</button>
					<p className="mx-auto">or</p>
					<Link href={"/pages/signup"} className="underline underline-offset-4 mx-auto"> Create an account </Link>
					<p className="text-red-500 font-bold">{errorMsg}</p>
				</form>
			</div>
		</div>
    </div>
  )
}

export default Login