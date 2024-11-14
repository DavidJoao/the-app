'use client'
import { navigate } from "./lib/redirect"

export default function Home() {

	navigate('/pages/login')

	return (
		<div className="App">
		</div>
	)
}
