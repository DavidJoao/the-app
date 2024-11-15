'use client'
import { useEffect } from "react"
import { navigate } from "./lib/redirect"

export default function Home() {

	useEffect(() => {
		navigate('/pages/login')
	}, [])
	
	return (
		<div className="App">
		</div>
	)
}
