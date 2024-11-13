'use client'
import Link from "next/link"

export default function Home() {
	return (
		<div className="App">
			<h1 className="main-title">The App</h1>
			<div className="w-full md:w-[40%] h-[400px] rounded-lg shadow-xl bg-white">
				<form className="form">
					<label>Email:</label>
					<input className="input" />
					<label>Password:</label>
					<input className="input" />
					<button className="blue-button">Log In</button>
					<p className="mx-auto">or</p>
					<Link href={"/pages/signup"} className="underline underline-offset-4 mx-auto">
						Create an account
					</Link>
				</form>
			</div>
		</div>
	)
}
